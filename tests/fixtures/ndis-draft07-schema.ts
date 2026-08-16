/**
 * Official JSON Schema Draft-07 specification for NDIS APO BSP Compliance Audit Package
 * Derived from NDIS Quality & Safeguards Commission Compliance Standards and Section 5.2 of analysis.md
 */

export const NDIS_APO_AUDIT_PACKAGE_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NDIS_APO_BSP_Compliance_Audit_Package',
  type: 'object',
  required: [
    'auditMetadata',
    'participantProfile',
    'practitionerProfile',
    'overallScorecard',
    'regulatoryPillars',
    'qualityIndicatorsAudit',
    'restrictivePracticesAudit',
    'redFlagAlerts',
    'deliberationTraces',
    'apoEndorsement'
  ],
  properties: {
    auditMetadata: {
      type: 'object',
      required: ['auditId', 'auditTimestamp', 'auditorEngineVersion', 'bspVersion', 'integrityHash'],
      properties: {
        auditId: { type: 'string' },
        auditTimestamp: { type: 'string' },
        auditorEngineVersion: { type: 'string' },
        bspVersion: { type: 'string' },
        integrityHash: { type: 'string' }
      }
    },
    participantProfile: {
      type: 'object',
      required: ['participantId', 'ndisNumber', 'fullName', 'primaryDisability', 'riskLevel'],
      properties: {
        participantId: { type: 'string' },
        ndisNumber: { type: 'string' },
        fullName: { type: 'string' },
        dateOfBirth: { type: 'string' },
        primaryDisability: { type: 'string' },
        riskLevel: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'] }
      }
    },
    practitionerProfile: {
      type: 'object',
      required: ['practitionerName', 'ndisRegistrationNumber', 'pbsRegistrationLevel'],
      properties: {
        practitionerName: { type: 'string' },
        ndisRegistrationNumber: { type: 'string' },
        pbsRegistrationLevel: {
          type: 'string',
          enum: ['Core Practitioner', 'Proficient Practitioner', 'Advanced Practitioner', 'Specialist Practitioner']
        }
      }
    },
    overallScorecard: {
      type: 'object',
      required: [
        'finalQualityScore',
        'rawWeightedScore',
        'complianceGrade',
        'complianceStatus',
        'passedIndicatorsCount',
        'totalIndicatorsCount'
      ],
      properties: {
        finalQualityScore: { type: 'number', minimum: 0, maximum: 100 },
        rawWeightedScore: { type: 'number', minimum: 0, maximum: 100 },
        complianceGrade: { type: 'string', enum: ['Grade A', 'Grade B', 'Grade C', 'Grade F'] },
        complianceStatus: {
          type: 'string',
          enum: ['Fully Compliant', 'Substantially Compliant', 'Non-Compliant', 'Critical Risk']
        },
        passedIndicatorsCount: { type: 'integer', minimum: 0, maximum: 12 },
        totalIndicatorsCount: { type: 'integer', default: 12 },
        activePenaltyMultipliers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              factor: { type: 'number' },
              description: { type: 'string' }
            }
          }
        }
      }
    },
    regulatoryPillars: {
      type: 'object',
      required: ['humanRightsAndLegal', 'clinicalPbs', 'proactiveEnvironmental', 'crisisAndFading'],
      properties: {
        humanRightsAndLegal: {
          type: 'object',
          required: ['score', 'weight', 'status'],
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            weight: { type: 'number', default: 0.30 },
            status: { type: 'string', enum: ['Compliant', 'Minor Gaps', 'Critical Breach'] },
            summary: { type: 'string' }
          }
        },
        clinicalPbs: {
          type: 'object',
          required: ['score', 'weight', 'status'],
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            weight: { type: 'number', default: 0.30 },
            status: { type: 'string', enum: ['Compliant', 'Minor Gaps', 'Critical Breach'] },
            summary: { type: 'string' }
          }
        },
        proactiveEnvironmental: {
          type: 'object',
          required: ['score', 'weight', 'status'],
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            weight: { type: 'number', default: 0.20 },
            status: { type: 'string', enum: ['Compliant', 'Minor Gaps', 'Critical Breach'] },
            summary: { type: 'string' }
          }
        },
        crisisAndFading: {
          type: 'object',
          required: ['score', 'weight', 'status'],
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            weight: { type: 'number', default: 0.20 },
            status: { type: 'string', enum: ['Compliant', 'Minor Gaps', 'Critical Breach'] },
            summary: { type: 'string' }
          }
        }
      }
    },
    qualityIndicatorsAudit: {
      type: 'array',
      minItems: 12,
      maxItems: 12,
      items: {
        type: 'object',
        required: ['indicatorId', 'title', 'pillar', 'score', 'passed', 'evaluationDetails', 'identifiedGaps'],
        properties: {
          indicatorId: { type: 'string' },
          title: { type: 'string' },
          pillar: { type: 'string' },
          score: { type: 'number', minimum: 0, maximum: 100 },
          passed: { type: 'boolean' },
          evaluationDetails: { type: 'string' },
          identifiedGaps: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    },
    restrictivePracticesAudit: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'practiceType',
          'description',
          'status',
          'authorizationStatus',
          'leastRestrictiveJustified',
          'fadingPlanPresent'
        ],
        properties: {
          practiceId: { type: 'string' },
          practiceType: {
            type: 'string',
            enum: ['Chemical', 'Mechanical', 'Physical', 'Environmental', 'Seclusion']
          },
          description: { type: 'string' },
          status: { type: 'string', enum: ['Proposed', 'Authorized', 'Active', 'Superseded', 'Expired'] },
          authorizationStatus: {
            type: 'string',
            enum: ['Fully Authorized', 'Pending Review', 'Unauthorized Breach']
          },
          authorizationReference: { type: 'string' },
          authorizationExpiry: { type: 'string' },
          leastRestrictiveJustified: { type: 'boolean' },
          fadingPlanPresent: { type: 'boolean' },
          reductionTarget: { type: 'string' }
        }
      }
    },
    redFlagAlerts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['alertId', 'severity', 'indicatorId', 'title', 'description', 'recommendedRemediation'],
        properties: {
          alertId: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'CRITICAL', 'HIGH', 'MODERATE', 'MEDIUM', 'LOW'] },
          indicatorId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          recommendedRemediation: { type: 'string' }
        }
      }
    },
    deliberationTraces: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'agentRole', 'agentName', 'timestamp', 'sentiment', 'message'],
        properties: {
          id: { type: 'string' },
          agentRole: {
            type: 'string',
            enum: [
              'human_rights_safeguards',
              'clinical_pbs',
              'quality_panel_lead',
              'human_rights_legal_safeguards',
              'clinical_pbs_specialist',
              'quality_panel_lead_synthesizer'
            ]
          },
          agentName: { type: 'string' },
          timestamp: { type: 'string' },
          sentiment: { type: 'string' },
          message: { type: 'string' }
        }
      }
    },
    apoEndorsement: {
      type: 'object',
      required: ['recommendation', 'authorizedProgramOfficerName', 'decisionDate', 'endorsementNotes'],
      properties: {
        recommendation: {
          type: 'string',
          enum: [
            'APPROVED_FOR_COMMISSION_SUBMISSION',
            'CONDITIONALLY_APPROVED_PENDING_REMEDIATION',
            'REJECTED_MANDATORY_REVISION_REQUIRED'
          ]
        },
        authorizedProgramOfficerName: { type: 'string' },
        apoRegistrationNumber: { type: 'string' },
        decisionDate: { type: 'string' },
        conditionsOrMandatedChanges: {
          type: 'array',
          items: { type: 'string' }
        },
        endorsementNotes: { type: 'string' }
      }
    }
  }
};
