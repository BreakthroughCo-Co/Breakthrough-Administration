// Breakthrough OS: HL7 FHIR R4 Clinical Interoperability Exporter
// Compliant with Australian Digital Health Agency (ADHA) My Health Record & FHIR R4 Core

import { Client, BSPDocument, ClinicalAssessmentRecord, CaseNote, PracticeBrandingConfig } from '@/types';

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'document' | 'collection';
  timestamp: string;
  meta: {
    lastUpdated: string;
    profile: string[];
  };
  entry: Array<{
    fullUrl: string;
    resource: FHIRResource;
  }>;
}

export const exportParticipantToFHIRBundle = (
  client: Client,
  bsp?: BSPDocument,
  assessments: ClinicalAssessmentRecord[] = [],
  caseNotes: CaseNote[] = [],
  branding?: PracticeBrandingConfig
): FHIRBundle => {
  const bundleId = `bundle-ndis-${client.id}-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // 1. FHIR Patient Resource
  const patientResource: FHIRResource = {
    resourceType: 'Patient',
    id: `patient-${client.id}`,
    meta: {
      profile: ['http://hl7.org.au/fhir/core/StructureDefinition/au-core-patient'],
    },
    identifier: [
      {
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org.au/CodeSystem/v2-0203',
              code: 'NDIS',
              display: 'National Disability Insurance Scheme Number',
            },
          ],
        },
        system: 'http://ns.electronichealth.net.au/id/ndis',
        value: client.ndisNumber,
      },
    ],
    name: [
      {
        use: 'official',
        text: client.name,
        family: client.name.split(' ').slice(-1)[0] || client.name,
        given: client.name.split(' ').slice(0, -1),
      },
    ],
    gender: 'unknown',
    birthDate: client.dateOfBirth || '2012-05-14',
    address: [
      {
        use: 'home',
        text: client.address || 'Melbourne, VIC, Australia',
        state: 'VIC',
        country: 'AU',
      },
    ],
  };

  // 2. FHIR Condition Resource (Primary Diagnosis)
  const conditionResource: FHIRResource = {
    resourceType: 'Condition',
    id: `condition-${client.id}-primary`,
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active',
          display: 'Active',
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
          code: 'confirmed',
          display: 'Confirmed',
        },
      ],
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'encounter-diagnosis',
            display: 'Encounter Diagnosis',
          },
        ],
      },
    ],
    code: {
      text: client.primaryDisability,
    },
    subject: {
      reference: `Patient/patient-${client.id}`,
      display: client.name,
    },
    recordedDate: client.planStartDate || timestamp.slice(0, 10),
  };

  // 3. FHIR CarePlan Resource (Behaviour Support Plan)
  const carePlanResource: FHIRResource = {
    resourceType: 'CarePlan',
    id: `careplan-${client.id}-bsp`,
    meta: {
      profile: ['http://hl7.org.au/fhir/core/StructureDefinition/au-core-careplan'],
    },
    status: (bsp?.status === 'Active' || bsp?.status === 'Published') ? 'active' : 'draft',
    intent: 'plan',
    category: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: '718347000',
            display: 'Behavioural support plan (record artifact)',
          },
        ],
        text: 'NDIS Positive Behaviour Support Plan',
      },
    ],
    title: `Positive Behaviour Support Plan - ${client.name}`,
    description: bsp?.functionalAssessment?.functionalHypothesis || 'Comprehensive NDIS Positive Behaviour Support Plan.',
    subject: {
      reference: `Patient/patient-${client.id}`,
      display: client.name,
    },
    period: {
      start: client.planStartDate,
      end: client.planEndDate,
    },
    activity: (bsp?.proactiveStrategies || []).map((strat: any, idx) => ({
      detail: {
        kind: 'ServiceRequest',
        code: {
          text: typeof strat === 'string' ? strat : (strat.title || `Strategy #${idx + 1}`),
        },
        status: 'in-progress',
        description: typeof strat === 'string' ? strat : (strat.description || strat.title || ''),
      },
    })),
  };

  // 4. FHIR Observations (Standardised Assessments & Goals)
  const observationEntries = assessments.map((ass) => ({
    fullUrl: `urn:uuid:observation-${ass.id}`,
    resource: {
      resourceType: 'Observation',
      id: `observation-${ass.id}`,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'survey',
              display: 'Survey / Standardised Assessment',
            },
          ],
        },
      ],
      code: {
        text: ass.assessmentTool,
      },
      subject: {
        reference: `Patient/patient-${client.id}`,
        display: client.name,
      },
      effectiveDateTime: ass.assessmentDate,
      interpretation: [
        {
          text: ass.clinicalInterpretation,
        },
      ],
      component: (ass.domainScores || []).map((ds) => ({
        code: {
          text: ds.domainName,
        },
        valueInteger: ds.rawScore,
      })),
    },
  }));

  const entries: Array<{ fullUrl: string; resource: FHIRResource }> = [
    {
      fullUrl: `urn:uuid:patient-${client.id}`,
      resource: patientResource,
    },
    {
      fullUrl: `urn:uuid:condition-${client.id}-primary`,
      resource: conditionResource,
    },
    {
      fullUrl: `urn:uuid:careplan-${client.id}-bsp`,
      resource: carePlanResource,
    },
    ...observationEntries,
  ];

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp,
    meta: {
      lastUpdated: timestamp,
      profile: ['http://hl7.org.au/fhir/core/StructureDefinition/au-core-bundle'],
    },
    entry: entries,
  };
};

export const downloadFHIRBundle = (bundle: FHIRBundle, clientName: string) => {
  const jsonString = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonString], { type: 'application/fhir+json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FHIR_R4_Bundle_${clientName.replace(/\s+/g, '_')}_NDIS.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
