/**
 * Breakthrough OS - NDIS Behaviour Support Plan 12 Quality Indicators Rubric & Evaluation Engine
 * Authoritative Standards:
 * - NDIS Quality and Safeguards Commission (Australia)
 * - National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018
 * - Positive Behaviour Support Capability Framework (Core & Specialist Modules)
 */

import {
  BSPDocument,
  NDISQualityIndicatorId,
  NDISQualityIndicatorResult,
  RegulatoryPillar,
  RestrictivePractice,
  RestrictivePracticeAuditItem
} from '../../types/bsp-audit';

export interface IndicatorDefinition {
  id: NDISQualityIndicatorId;
  name: string;
  pillar: RegulatoryPillar;
  overallWeight: number; // Sum of all 12 overall weights = 1.0 (100%)
  pillarWeight: number;  // Weight within the pillar
  description: string;
  citedRegulations: string[];
  mandatoryEvidenceItems: string[];
  nonComplianceTriggers: string[];
}

export const NDIS_QUALITY_INDICATOR_DEFINITIONS: Record<NDISQualityIndicatorId, IndicatorDefinition> = {
  'QI-01': {
    id: 'QI-01',
    name: 'Participant Profile & Person-Centred Context',
    pillar: 'human_rights_legal',
    overallWeight: 0.08,
    pillarWeight: 0.25,
    description: 'Neuroaffirming identity, expressive/receptive communication modality, sensory profile, medical/health factors, strengths, and trauma history.',
    citedRegulations: [
      'NDIS Quality and Safeguards Commission PBS Capability Framework (Core 1.1)',
      'UN CRPD Article 12 & Article 21',
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Part 2'
    ],
    mandatoryEvidenceItems: [
      'Expressive/receptive communication mode (spoken, AAC, PECS, visual)',
      'Sensory preferences (hyper/hypo reactivity, lighting, noise, tactile)',
      'Medical contraindications, allergies, and physical health factors',
      'Individual strengths, personal interests, and choice preferences'
    ],
    nonComplianceTriggers: [
      'Generic or missing communication mode',
      'Omission of sensory profile for neurodivergent participant',
      'Absence of documented decision-making preferences'
    ]
  },
  'QI-02': {
    id: 'QI-02',
    name: 'Consultation & Multi-Agency Collaboration',
    pillar: 'human_rights_legal',
    overallWeight: 0.07,
    pillarWeight: 0.25,
    description: 'Participant, family/guardian, support provider, and allied health engagement in plan development with verified consent records.',
    citedRegulations: [
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Section 19',
      'NDIS Practice Standards Core Module (Governance & Rights)',
      'NDIS Act 2013 Section 4 (General Principles)'
    ],
    mandatoryEvidenceItems: [
      'Documented consultation dates and attendee roles',
      'Participant involvement modality / adapted engagement',
      'Nominee or family informed consent records',
      'Allied health (OT, Speech, Psychology) collaboration'
    ],
    nonComplianceTriggers: [
      'Zero record of participant or support team consultation',
      'Lack of documented guardian/nominee engagement',
      'Plan developed in isolation without implementing provider input'
    ]
  },
  'QI-03': {
    id: 'QI-03',
    name: 'Operational Definitions of Target Behaviours',
    pillar: 'clinical_pbs_formulation',
    overallWeight: 0.08,
    pillarWeight: 0.25,
    description: 'Objective, observable, and measurable descriptions of behaviours of concern with baseline metrics and severity ratings.',
    citedRegulations: [
      'NDIS PBS Capability Framework Specialist Domain 2',
      'APA & BACB Standards for Empirical Behavioral Definition',
      'NDIS Rules 2018 Section 21(2)(a)'
    ],
    mandatoryEvidenceItems: [
      'Observable motor topography (physical actions)',
      'Baseline frequency and duration metrics',
      'Standardized intensity/severity scale (1-5)',
      'Clear inclusion and exclusion criteria'
    ],
    nonComplianceTriggers: [
      'Subjective labels ("acting out", "being difficult") without observable topography',
      'Missing baseline frequency or severity categorization',
      'Ambiguous behavioral boundaries'
    ]
  },
  'QI-04': {
    id: 'QI-04',
    name: 'Functional Behaviour Assessment (FBA) & Hypothesis Formulation',
    pillar: 'clinical_pbs_formulation',
    overallWeight: 0.10,
    pillarWeight: 0.45,
    description: 'Evidence-based analysis of behavioral function derived from structured ABC data, identifying 4 functions, setting events, triggers, and maintaining consequences.',
    citedRegulations: [
      'NDIS PBS Capability Framework Specialist Domain 3',
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Section 21(1)',
      'Carr & Durand Functional Hypothesis Principles'
    ],
    mandatoryEvidenceItems: [
      'Explicit functional hypothesis statement',
      'Classification across 4 functions (Escape, Tangible, Attention, Sensory)',
      'Setting events and immediate antecedents/triggers',
      'Maintaining consequences and functional reinforcers'
    ],
    nonComplianceTriggers: [
      'Missing functional hypothesis statement',
      'Disconnect between ABC log triggers and stated hypothesis',
      'Failure to identify primary behavioral function'
    ]
  },
  'QI-05': {
    id: 'QI-05',
    name: 'Proactive Environmental & Ecological Accommodations',
    pillar: 'proactive_skill_building',
    overallWeight: 0.10,
    pillarWeight: 0.50,
    description: 'Pre-emptive adjustments to physical, sensory, social, and routine environments to minimize triggers and enhance quality of life.',
    citedRegulations: [
      'NDIS PBS Capability Framework Specialist Domain 4',
      'NDIS Rules 2018 Section 21(2)(b)',
      'Positive Behaviour Support Quality Evaluation (BSP-QE-II) Standard'
    ],
    mandatoryEvidenceItems: [
      'Minimum 3 distinct environmental adaptations (physical, sensory, routine)',
      'Visual schedules, transition timers, or predictability tools',
      'Sensory accommodations (noise mitigation, lighting, calm spaces)',
      'Proactive modifications occurring before behavioral escalation'
    ],
    nonComplianceTriggers: [
      'Sole reliance on reactive or staff-directed verbal commands',
      'Absence of physical/sensory environmental modifications',
      'Fewer than 2 proactive adaptations specified'
    ]
  },
  'QI-06': {
    id: 'QI-06',
    name: 'Skill Teaching & Functional Replacement Behaviours',
    pillar: 'clinical_pbs_formulation',
    overallWeight: 0.10,
    pillarWeight: 0.30,
    description: 'Systematic acquisition of functionally equivalent replacement behaviours (FERB), Functional Communication Training (FCT), and reinforcement schedules.',
    citedRegulations: [
      'NDIS PBS Capability Framework Specialist Domain 5',
      'NDIS Rules 2018 Section 21(2)(c)',
      'Functional Communication Training (FCT) Practice Standards'
    ],
    mandatoryEvidenceItems: [
      'Functionally equivalent replacement behaviour directly matching FBA function',
      'Functional Communication Training (FCT) protocol (AAC, signs, phrases)',
      'Systematic teaching methodology (DRA, DRI, errorless teaching)',
      'Reinforcement schedule (continuous FR1 -> thinning schedule)'
    ],
    nonComplianceTriggers: [
      'Replacement behaviour does not serve the same function as the target behaviour',
      'Absent teaching methodology or practice protocol',
      'No specified reinforcement schedule'
    ]
  },
  'QI-07': {
    id: 'QI-07',
    name: 'Early Warning Signs & Active De-escalation',
    pillar: 'proactive_skill_building',
    overallWeight: 0.08,
    pillarWeight: 0.50,
    description: 'Recognition of early physiological/behavioral precursors and low-arousal, non-aversive de-escalation actions.',
    citedRegulations: [
      'NDIS PBS Capability Framework Specialist Domain 6',
      'Low Arousal Approach Standards (Studio 3 / McDonnell)',
      'NDIS Practice Standards Core Module (Violence, Abuse & Neglect Prevention)'
    ],
    mandatoryEvidenceItems: [
      'Observable physiological & behavioral precursor signs (breathing, posture, vocal cues)',
      'Low-arousal active de-escalation steps (reduced demands, calm positioning)',
      'Clear differentiation between early agitation and peak crisis',
      'Validation and sensory comfort strategies'
    ],
    nonComplianceTriggers: [
      'Jumping directly from baseline to crisis response without early phase',
      'Punitive, demanding, or confrontational prompts during escalation',
      'Missing physical precursor indicators'
    ]
  },
  'QI-08': {
    id: 'QI-08',
    name: 'Crisis Management & Reactive Response Protocols',
    pillar: 'crisis_reduction_safeguards',
    overallWeight: 0.07,
    pillarWeight: 0.25,
    description: 'Graded, safety-focused, non-punitive steps during acute crisis to ensure physical and psychological safety with mandatory post-crisis recovery time.',
    citedRegulations: [
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Section 21(2)(d)',
      'NDIS Incident Management and Reportable Incidents Rules 2018',
      'Safe Work Australia Guidelines for Workplace Safety in Disability Services'
    ],
    mandatoryEvidenceItems: [
      'Phased protocol (Agitation -> Escalation -> Peak -> Recovery)',
      'Physical distancing, staff positioning, and bystander safety',
      'Non-punitive safety management actions',
      'Post-peak baseline recovery period (>= 15-20 min) before demands'
    ],
    nonComplianceTriggers: [
      'Mandating unauthorized physical intervention or holds',
      'Failure to specify staff safety positioning or bystander protection',
      'Premature re-engagement or punitive post-crisis consequences'
    ]
  },
  'QI-09': {
    id: 'QI-09',
    name: 'Restrictive Practices Justification & Least Restrictive Test',
    pillar: 'human_rights_legal',
    overallWeight: 0.12,
    pillarWeight: 0.50,
    description: 'Identification, categorization (5 types), clinical justification, least restrictive evidence, and State/Territory Senior Practitioner authorization.',
    citedRegulations: [
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Part 1 & Part 3',
      'NDIS Act 2013 Section 73Z',
      'State/Territory Senior Practitioner Restrictive Practices Authorisation Acts'
    ],
    mandatoryEvidenceItems: [
      'Accurate categorization of all restrictive practices (5 categories)',
      'Clinical justification demonstrating acute risk of serious harm',
      'Documentation of exhausted less restrictive alternative interventions',
      'State/Territory authorization reference (e.g. RPR-YYYY-STATE-XXXXX)',
      'Explicit confirmation of zero prohibited restraints (prone/supine/neck)'
    ],
    nonComplianceTriggers: [
      'Undocumented or misclassified restrictive practice',
      'Blanket or routine use without least-restrictive justification',
      'Missing state authorization reference number',
      'Presence of prohibited restraint holds (prone, supine, neck pressure)'
    ]
  },
  'QI-10': {
    id: 'QI-10',
    name: 'Reduction & Fade-Out Schedule',
    pillar: 'crisis_reduction_safeguards',
    overallWeight: 0.10,
    pillarWeight: 0.40,
    description: 'Measurable, time-bound milestones for decreasing and eliminating restrictive practices linked to replacement skill acquisition.',
    citedRegulations: [
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Section 21(2)(e)',
      'NDIS Restrictive Practices Reduction and Elimination Guidelines',
      'Senior Practitioner Fading Strategy Standard'
    ],
    mandatoryEvidenceItems: [
      'Quantitative fading thresholds and duration/dosage milestones',
      'Graduated reduction steps with specific review timetable',
      'Replacement skill acquisition criteria triggering restriction reduction',
      'Clinical monitoring protocols during reduction trials'
    ],
    nonComplianceTriggers: [
      'Restrictive practice present without an active fade-out plan',
      'Open-ended perpetual restriction with zero reduction milestones',
      'Vague fading intent without measurable criteria'
    ]
  },
  'QI-11': {
    id: 'QI-11',
    name: 'Post-Incident Debriefing & Trauma-Informed Review',
    pillar: 'crisis_reduction_safeguards',
    overallWeight: 0.05,
    pillarWeight: 0.15,
    description: 'Structured recovery and debriefing protocols for the participant, support staff, and incident data logging.',
    citedRegulations: [
      'NDIS Incident Management and Reportable Incidents Rules 2018',
      'Trauma-Informed Behaviour Support Practice Standards',
      'NDIS Practice Standards - Core Module (Feedback and Complaints)'
    ],
    mandatoryEvidenceItems: [
      'Participant trauma-informed emotional check-in protocol',
      'Staff debriefing protocol scheduled within 24-48 hours',
      'ABC incident data logging and root cause review',
      'Escalation triggers for NDIS 24-hour and 5-day reportable incidents'
    ],
    nonComplianceTriggers: [
      'Absence of participant recovery check-in protocol',
      'Debriefing conducted prematurely before participant emotional recovery',
      'No formal staff debriefing or incident logging requirement'
    ]
  },
  'QI-12': {
    id: 'QI-12',
    name: 'Implementation, Staff Training & Governance Schedule',
    pillar: 'crisis_reduction_safeguards',
    overallWeight: 0.05,
    pillarWeight: 0.20,
    description: 'Competency-based staff training curriculum, monitoring cadence, and formal 12-month review schedule with APO submission.',
    citedRegulations: [
      'NDIS (Restrictive Practices and Behaviour Support) Rules 2018 Section 20',
      'NDIS Practice Standards Core Module (Human Resources & Governance)',
      'NDIS Behaviour Support Practitioner Registration Rules'
    ],
    mandatoryEvidenceItems: [
      'Staff competency training curriculum (FCT, low-arousal, data logging)',
      'Authorised Program Officer (APO) submission date & tracking',
      'Annual review due date (<= 12 months from plan generation)',
      'Supervising Lead Practitioner / PBS registration oversight'
    ],
    nonComplianceTriggers: [
      'Expired plan review date (> 12 months)',
      'Lack of designated monitoring lead practitioner',
      'No competency training schedule for support team'
    ]
  }
};

/**
 * Validates Restrictive Practices and detects prohibited restraint holds.
 */
export function auditRestrictivePractices(bsp: BSPDocument): {
  items: RestrictivePracticeAuditItem[];
  totalReported: number;
  authorizedCount: number;
  unauthorizedCount: number;
  prohibitedDetected: boolean;
  missingFadePlanCount: number;
  prohibitedHoldDetails?: string;
} {
  const practices = bsp.restrictivePractices || [];
  const rawText = [
    bsp.summary || '',
    ...(bsp.primaryBehaviorsOfConcern || []),
    ...(bsp.proactiveStrategies || []),
    ...(bsp.reactiveStrategies || []),
    ...(bsp.activeReactive?.reactiveProtocols || [])
  ].join(' ').toLowerCase();

  function isProhibitedHoldActive(text: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
      let searchIdx = 0;
      while (searchIdx < text.length) {
        const foundIdx = text.indexOf(pattern, searchIdx);
        if (foundIdx === -1) break;
        const prefix = text.slice(Math.max(0, foundIdx - 40), foundIdx);
        const isNegated =
          prefix.includes('no ') ||
          prefix.includes('zero ') ||
          prefix.includes('never ') ||
          prefix.includes('prohibit') ||
          prefix.includes('avoid') ||
          prefix.includes('without');
        if (!isNegated) {
          return true;
        }
        searchIdx = foundIdx + pattern.length;
      }
    }
    return false;
  }

  // Prohibited holds detection across all BSP text and practices
  const prohibitedProne = isProhibitedHoldActive(rawText, ['prone', 'face down', 'face-down']);
  const prohibitedSupine = isProhibitedHoldActive(rawText, ['supine', 'face up', 'face-up']);
  const prohibitedNeck = isProhibitedHoldActive(rawText, ['neck hold', 'choke', 'throat hold']);
  const prohibitedDiaphragm = isProhibitedHoldActive(rawText, ['basket hold', 'bear hug', 'chest pressure']);

  const globalProhibitedDetected = prohibitedProne || prohibitedSupine || prohibitedNeck || prohibitedDiaphragm;
  let prohibitedHoldDetails: string | undefined;

  if (prohibitedProne) {
    prohibitedHoldDetails = 'CRITICAL: Prone restraint (face-down) detected. Strictly prohibited under NDIS Restrictive Practices Rules 2018 (Rule 8). Fatal positional asphyxiation risk.';
  } else if (prohibitedSupine) {
    prohibitedHoldDetails = 'CRITICAL: Supine restraint (face-up) detected. Prohibited under NDIS Restrictive Practices Rules 2018 (Rule 8). High asphyxiation risk.';
  } else if (prohibitedNeck) {
    prohibitedHoldDetails = 'CRITICAL: Neck/throat hold detected. Strictly prohibited under Australian law and NDIS Rules.';
  } else if (prohibitedDiaphragm) {
    prohibitedHoldDetails = 'CRITICAL: Diaphragmatic restraint / basket hold detected. Prohibited under NDIS Rules.';
  }

  let authorizedCount = 0;
  let unauthorizedCount = 0;
  let missingFadePlanCount = 0;

  const items: RestrictivePracticeAuditItem[] = practices.map((rp, index) => {
    const desc = (rp.description || '').toLowerCase();
    const rationale = (rp.clinicalRationale || '').toLowerCase();
    const reduction = (rp.reductionPlanSummary || '').toLowerCase();
    const ref = (rp.authorizationReference || '').trim();

    // Check authorization
    const hasValidRef = ref.length >= 5 && (ref.startsWith('RPR-') || ref.startsWith('NDIS-') || ref.startsWith('VIC-') || ref.startsWith('NSW-') || ref.startsWith('QLD-') || ref.includes('202'));
    const isAuthorized = (rp.status === 'Authorized' || rp.status === 'Active') && hasValidRef;

    if (isAuthorized) {
      authorizedCount++;
    } else {
      unauthorizedCount++;
    }

    // Check fade-out plan
    const hasFadingPlan = reduction.length >= 25 && !reduction.includes('n/a') && !reduction.includes('none');
    if (!hasFadingPlan) {
      missingFadePlanCount++;
    }

    // Check least restrictive justification
    const leastRestrictiveJustified = (desc.length >= 30 || rationale.length >= 20 || (rp.leastRestrictiveAlternativesTried && rp.leastRestrictiveAlternativesTried.length > 0));

    // Check specific prohibited restraint in this practice
    let rpProhibited: 'prone' | 'supine' | 'neck_hold' | 'diaphragm_hold' | 'unauthorized_mechanical' | null = null;
    if (desc.includes('prone') || desc.includes('face down')) rpProhibited = 'prone';
    else if (desc.includes('supine') || desc.includes('face up')) rpProhibited = 'supine';
    else if (desc.includes('neck') || desc.includes('throat')) rpProhibited = 'neck_hold';
    else if (desc.includes('basket') || desc.includes('bear hug')) rpProhibited = 'diaphragm_hold';

    return {
      practiceId: rp.id || `rp-audit-${index + 1}`,
      practiceType: rp.practiceType,
      description: rp.description || 'Unspecified restrictive practice',
      status: rp.status || 'Proposed',
      authorizationStatus: isAuthorized ? 'Fully Authorized' : ref.length > 0 ? 'Pending Review' : 'Unauthorized Breach',
      authorizationReference: rp.authorizationReference,
      authorizationExpiry: rp.expiryDate,
      leastRestrictiveJustified,
      fadingPlanPresent: hasFadingPlan,
      reductionTarget: rp.reductionPlanSummary,
      prohibitedRestraintDetected: rpProhibited !== null || globalProhibitedDetected,
      prohibitedRestraintType: rpProhibited,
      clinicalNotes: rp.clinicalRationale
    };
  });

  return {
    items,
    totalReported: practices.length,
    authorizedCount,
    unauthorizedCount,
    prohibitedDetected: globalProhibitedDetected || items.some(i => i.prohibitedRestraintDetected),
    missingFadePlanCount,
    prohibitedHoldDetails
  };
}

/**
 * Comprehensive Evaluation of the 12 NDIS Quality Indicators.
 */
export function evaluateAllIndicators(bsp: BSPDocument): NDISQualityIndicatorResult[] {
  const rpAudit = auditRestrictivePractices(bsp);

  return Object.keys(NDIS_QUALITY_INDICATOR_DEFINITIONS).map((key) => {
    const indicatorId = key as NDISQualityIndicatorId;
    const def = NDIS_QUALITY_INDICATOR_DEFINITIONS[indicatorId];
    return evaluateSingleIndicator(indicatorId, def, bsp, rpAudit);
  });
}

function evaluateSingleIndicator(
  id: NDISQualityIndicatorId,
  def: IndicatorDefinition,
  bsp: BSPDocument,
  rpAudit: ReturnType<typeof auditRestrictivePractices>
): NDISQualityIndicatorResult {
  const evidenceFound: string[] = [];
  const gapsIdentified: string[] = [];
  let score = 0;
  let remediationSuggestion: string | undefined;

  switch (id) {
    case 'QI-01': {
      // Participant Profile & Person-Centred Context
      const profile = bsp.participantProfile;
      const summary = bsp.summary || '';

      const hasCommMode = Boolean(profile?.communicationMode && profile.communicationMode.length >= 10);
      const hasSensory = Boolean(profile?.sensoryPreferences && profile.sensoryPreferences.length > 0);
      const hasStrengths = Boolean(profile?.strengthsAndInterests && profile.strengthsAndInterests.length > 0);
      const hasMedical = Boolean(profile?.medicalHealthFactors && profile.medicalHealthFactors.length >= 10);
      const hasDecision = Boolean(profile?.decisionMakingPreferences && profile.decisionMakingPreferences.length >= 10);

      if (hasCommMode) {
        evidenceFound.push(`Documented communication modality: "${profile?.communicationMode}"`);
        score += 30;
      } else {
        gapsIdentified.push('Missing explicit expressive and receptive communication profile.');
      }

      if (hasSensory) {
        evidenceFound.push(`Sensory preferences identified: ${profile?.sensoryPreferences?.join(', ')}`);
        score += 25;
      } else {
        gapsIdentified.push('Missing sensory processing preferences and environmental sensitivities.');
      }

      if (hasStrengths) {
        evidenceFound.push(`Strengths & personal interests documented (${profile?.strengthsAndInterests?.length} items).`);
        score += 20;
      } else {
        gapsIdentified.push('Omission of participant strengths, interests, and reinforcers.');
      }

      if (hasMedical) {
        evidenceFound.push(`Medical and health contraindications specified: "${profile?.medicalHealthFactors}"`);
        score += 15;
      } else {
        gapsIdentified.push('Medical, physical health, or medication contraindications not documented.');
      }

      if (hasDecision) {
        evidenceFound.push(`Decision-making and choice preferences recorded.`);
        score += 10;
      } else {
        gapsIdentified.push('Participant choice and decision-making preferences omitted.');
      }

      // Check fallback in summary
      if (score < 50 && summary.length >= 100) {
        evidenceFound.push('Clinical summary provides broad person-centred context.');
        score = Math.max(score, 55);
      }

      if (gapsIdentified.length > 0) {
        remediationSuggestion = 'Enrich Participant Profile with multimodal communication details, sensory sensitivities, and person-centred strengths.';
      }
      break;
    }

    case 'QI-02': {
      // Consultation & Multi-Agency Collaboration
      const consultations = bsp.consultationRecords || [];
      const hasConsultations = consultations.length > 0;
      const author = bsp.authorName || '';

      if (hasConsultations) {
        evidenceFound.push(`Documented ${consultations.length} multi-agency consultation record(s) with participant and support team.`);
        const participantEngaged = consultations.some(c => c.participantInvolvementModality && c.participantInvolvementModality.length >= 5);
        const nomineeConsent = consultations.some(c => c.nomineeConsentVerified);

        if (participantEngaged) {
          evidenceFound.push('Participant engagement modality explicitly recorded in consultation.');
          score += 45;
        } else {
          gapsIdentified.push('Participant involvement modality not clearly defined in consultation logs.');
          score += 25;
        }

        if (nomineeConsent) {
          evidenceFound.push('Nominee / guardian informed consent verified.');
          score += 35;
        } else {
          gapsIdentified.push('Nominee / guardian consent verification record missing.');
          score += 20;
        }

        score += 20; // Multi-agency collaboration base
      } else {
        // Fallback checks
        if (author.length >= 5) {
          evidenceFound.push(`Lead practitioner identified: ${author}`);
          score = 45;
          gapsIdentified.push('Formal multi-agency and participant consultation records missing explicit timestamps and attendee roles.');
        } else {
          gapsIdentified.push('Zero documentation of participant, family, or multi-agency consultation.');
          score = 15;
        }
      }

      if (gapsIdentified.length > 0) {
        remediationSuggestion = 'Record formal consultation meetings with participant, guardian nominee, and implementing care team with dates and consent checkboxes.';
      }
      break;
    }

    case 'QI-03': {
      // Operational Definitions of Target Behaviours
      const behaviors = bsp.primaryBehaviorsOfConcern || [];
      const fbaBehaviors = bsp.functionalAssessment?.targetBehaviors || bsp.fba?.targetBehaviors || [];

      if (fbaBehaviors.length > 0) {
        const hasTopography = fbaBehaviors.every(b => b.operationalDefinition && b.operationalDefinition.length >= 25);
        const hasSeverity = fbaBehaviors.every(b => typeof b.severity === 'number' && b.severity >= 1);
        const hasFrequency = fbaBehaviors.some(b => Boolean(b.frequency));

        if (hasTopography) {
          evidenceFound.push(`Observable motor definitions provided for ${fbaBehaviors.length} target behaviour(s).`);
          score += 45;
        } else {
          gapsIdentified.push('Target behaviours lack precise observable motor definitions.');
          score += 20;
        }

        if (hasSeverity) {
          evidenceFound.push(`Standardized severity/intensity ratings (1-5 scale) assigned to all target behaviours.`);
          score += 30;
        } else {
          gapsIdentified.push('Missing severity or intensity ratings for target behaviours.');
        }

        if (hasFrequency) {
          evidenceFound.push('Baseline frequency / duration metrics recorded.');
          score += 25;
        } else {
          gapsIdentified.push('Baseline frequency or occurrence patterns omitted.');
        }
      } else if (behaviors.length > 0) {
        const detailedBehaviors = behaviors.filter(b => b.length >= 30);
        if (detailedBehaviors.length > 0) {
          evidenceFound.push(`Listed ${behaviors.length} primary behaviour(s) with contextual descriptions.`);
          score = 65;
          gapsIdentified.push('Separate operational definition table with baseline frequency and severity scale (1-5) recommended.');
        } else {
          evidenceFound.push(`Listed ${behaviors.length} behaviour(s) of concern.`);
          score = 45;
          gapsIdentified.push('Behaviors are described with brief labels rather than empirical operational definitions.');
        }
      } else {
        gapsIdentified.push('Zero target behaviours of concern defined in plan.');
        score = 0;
      }

      if (gapsIdentified.length > 0) {
        remediationSuggestion = 'Provide objective, observable motor definitions with baseline frequency, duration, and 1-5 severity ratings for each target behaviour.';
      }
      break;
    }

    case 'QI-04': {
      // Functional Behaviour Assessment & Hypothesis Formulation
      const fba = bsp.functionalAssessment || bsp.fba;
      const hypothesis = fba?.functionalHypothesis || '';
      const triggers = fba?.immediateTriggers || [];
      const settingEvents = fba?.settingEvents || [];
      const consequences = fba?.maintainingConsequences || [];

      if (hypothesis.length >= 35) {
        evidenceFound.push(`Explicit functional hypothesis statement formulated: "${hypothesis}"`);
        score += 45;

        // Check 4 functions mention
        const hypoLower = hypothesis.toLowerCase();
        const mentionsFunction =
          hypoLower.includes('escape') ||
          hypoLower.includes('avoid') ||
          hypoLower.includes('tangible') ||
          hypoLower.includes('access') ||
          hypoLower.includes('attention') ||
          hypoLower.includes('sensory') ||
          hypoLower.includes('automatic');

        if (mentionsFunction) {
          evidenceFound.push('Hypothesis classifies behavior within recognized behavioral functions (Escape, Tangible, Attention, Sensory).');
          score += 20;
        } else {
          gapsIdentified.push('Hypothesis does not explicitly name the functional reinforcer (Escape/Avoidance, Tangible/Access, Attention, Sensory).');
        }
      } else {
        gapsIdentified.push('Missing explicit functional hypothesis statement linking triggers, behavior, and maintaining reinforcers.');
      }

      if (triggers.length > 0) {
        evidenceFound.push(`Documented ${triggers.length} immediate antecedent trigger(s).`);
        score += 15;
      } else {
        gapsIdentified.push('Immediate antecedent triggers not systematically documented.');
      }

      if (settingEvents.length > 0) {
        evidenceFound.push(`Identified ${settingEvents.length} setting event / establishing operation factor(s).`);
        score += 10;
      } else {
        gapsIdentified.push('Setting events (e.g. fatigue, environmental overcrowding, health state) omitted.');
      }

      if (consequences.length > 0) {
        evidenceFound.push(`Maintaining consequences analyzed (${consequences.length} item(s)).`);
        score += 10;
      } else {
        gapsIdentified.push('Maintaining environmental consequences not specified.');
      }

      if (score < 20) {
        score = 15;
        remediationSuggestion = 'Formulate an evidence-based functional hypothesis: "When [setting event/trigger occurs], the participant engages in [target behaviour] to [escape/gain attention/access tangible/sensory reinforcer], maintained by [consequence]."';
      }
      break;
    }

    case 'QI-05': {
      // Proactive Environmental & Ecological Accommodations
      const proactive = bsp.proactiveStrategies || [];
      const detailedStrategies = proactive.filter(s => s.length >= 25);

      if (proactive.length >= 4) {
        evidenceFound.push(`Documented ${proactive.length} proactive environmental and ecological strategies.`);
        score += 60;
      } else if (proactive.length >= 2) {
        evidenceFound.push(`Documented ${proactive.length} proactive strategies.`);
        score += 40;
        gapsIdentified.push('Fewer than 4 distinct proactive strategies specified; NDIS best practice requires diverse adaptations.');
      } else if (proactive.length === 1) {
        evidenceFound.push('Single proactive strategy documented.');
        score += 25;
        gapsIdentified.push('Insufficient proactive environmental adaptations.');
      } else {
        gapsIdentified.push('Zero proactive environmental modifications specified.');
      }

      // Check quality: sensory, visual schedules, predictability
      const combinedText = proactive.join(' ').toLowerCase();
      const hasSensory = combinedText.includes('sensory') || combinedText.includes('noise') || combinedText.includes('light') || combinedText.includes('quiet');
      const hasVisual = combinedText.includes('visual') || combinedText.includes('schedule') || combinedText.includes('timer') || combinedText.includes('countdown');
      const hasRoutine = combinedText.includes('routine') || combinedText.includes('choice') || combinedText.includes('predict') || combinedText.includes('transition');

      if (hasSensory) {
        evidenceFound.push('Sensory environmental modifications included (acoustic, illumination, or quiet zones).');
        score += 15;
      }
      if (hasVisual) {
        evidenceFound.push('Visual support / predictability tools integrated (schedules, timers, choice boards).');
        score += 15;
      }
      if (hasRoutine) {
        evidenceFound.push('Routine structuring and transition predictability accommodations included.');
        score += 10;
      }

      score = Math.min(100, score);
      if (score < 70) {
        remediationSuggestion = 'Add at least 3 distinct proactive adaptations spanning visual schedules, sensory modulation, and environmental predictability.';
      }
      break;
    }

    case 'QI-06': {
      // Skill Teaching & Functional Replacement Behaviours
      const skillTeaching = bsp.skillTeaching;
      const replacements = skillTeaching?.replacementBehaviors || [];
      const fct = skillTeaching?.functionalCommunicationTraining || '';
      const reinforcement = skillTeaching?.reinforcementSchedule || '';

      if (replacements.length > 0) {
        evidenceFound.push(`Defined ${replacements.length} functionally equivalent replacement behaviour(s).`);
        score += 40;

        const hasMethod = replacements.some(r => r.teachingMethod && r.teachingMethod.length >= 15);
        if (hasMethod) {
          evidenceFound.push('Instructional teaching methodologies (e.g. DRA, FCT, modeling) specified.');
          score += 20;
        } else {
          gapsIdentified.push('Teaching method for replacement behaviours is vague or missing.');
        }
      } else {
        gapsIdentified.push('No functionally equivalent replacement behaviours specified.');
      }

      if (fct.length >= 20) {
        evidenceFound.push(`Functional Communication Training (FCT) protocol established: "${fct}"`);
        score += 25;
      } else {
        gapsIdentified.push('Missing explicit Functional Communication Training (FCT) protocol.');
      }

      if (reinforcement.length >= 15) {
        evidenceFound.push(`Differential reinforcement schedule defined: "${reinforcement}"`);
        score += 15;
      } else {
        gapsIdentified.push('Differential reinforcement schedule (e.g. FR1 to thinning schedule) omitted.');
      }

      score = Math.min(100, score);
      if (score < 70) {
        remediationSuggestion = 'Define a Functionally Equivalent Replacement Behaviour (FERB) matching the FBA function, with an explicit FCT protocol and DRA reinforcement schedule.';
      }
      break;
    }

    case 'QI-07': {
      // Early Warning Signs & Active De-escalation
      const earlySigns = bsp.activeReactive?.earlyWarningSigns || [];
      const deescalation = bsp.activeReactive?.activeDeescalationStrategies || [];

      if (earlySigns.length >= 3) {
        evidenceFound.push(`Identified ${earlySigns.length} observable precursor / early warning signs.`);
        score += 45;
      } else if (earlySigns.length > 0) {
        evidenceFound.push(`Identified ${earlySigns.length} early warning sign(s).`);
        score += 25;
        gapsIdentified.push('Expand early warning signs to include subtle physiological and postural cues.');
      } else {
        gapsIdentified.push('Missing observable early warning signs / behavioral escalation precursors.');
      }

      if (deescalation.length >= 3) {
        evidenceFound.push(`Detailed ${deescalation.length} low-arousal active de-escalation strategies.`);
        score += 45;
      } else if (deescalation.length > 0) {
        evidenceFound.push(`Detailed ${deescalation.length} de-escalation strategy.`);
        score += 25;
        gapsIdentified.push('De-escalation strategies require greater specificity on low-arousal verbal/environmental actions.');
      } else {
        gapsIdentified.push('Missing non-aversive, low-arousal active de-escalation strategies.');
      }

      score += 10; // Baseline points for compliance check
      score = Math.min(100, score);

      if (score < 70) {
        remediationSuggestion = 'Enumerate observable physiological escalation precursors (breathing, posture, vocalisations) and pair each with a low-arousal non-demanding de-escalation action.';
      }
      break;
    }

    case 'QI-08': {
      // Crisis Management & Reactive Response Protocols
      const reactive = bsp.reactiveStrategies || [];
      const reactiveProtocols = bsp.activeReactive?.reactiveProtocols || [];
      const combined = [...reactive, ...reactiveProtocols];

      if (combined.length >= 3) {
        evidenceFound.push(`Documented ${combined.length} reactive crisis management protocol step(s).`);
        score += 50;
      } else if (combined.length > 0) {
        evidenceFound.push(`Documented ${combined.length} reactive strategy.`);
        score += 30;
        gapsIdentified.push('Crisis response requires multi-phase safety structure.');
      } else {
        gapsIdentified.push('Missing structured crisis management protocol.');
      }

      const allText = combined.join(' ').toLowerCase();
      const hasPhases = allText.includes('phase') || (allText.includes('agitation') && allText.includes('peak')) || allText.includes('recovery');
      const hasDistancing = allText.includes('distance') || allText.includes('space') || allText.includes('step back') || allText.includes('buffer');
      const hasRecoveryTime = allText.includes('minute') || allText.includes('recovery') || allText.includes('cool');

      if (hasPhases) {
        evidenceFound.push('Phased safety protocol structured across escalation stages.');
        score += 20;
      } else {
        gapsIdentified.push('Crisis protocol lacks distinct phase-based guidance (Agitation -> Escalation -> Peak -> Recovery).');
      }

      if (hasDistancing) {
        evidenceFound.push('Safe physical distancing and staff positioning specified.');
        score += 15;
      } else {
        gapsIdentified.push('Staff safety positioning and physical buffer zones not specified.');
      }

      if (hasRecoveryTime) {
        evidenceFound.push('Post-crisis recovery period specified before demands re-introduced.');
        score += 15;
      } else {
        gapsIdentified.push('Minimum post-crisis recovery time (>= 15-20 min) not explicitly mandated.');
      }

      // Check for prohibited hold
      if (rpAudit.prohibitedDetected) {
        score = 0;
        gapsIdentified.push('CRITICAL REGULATORY VIOLATION: Prohibited restraint hold detected in reactive protocol.');
      }

      score = Math.min(100, Math.max(0, score));
      if (score < 70 && !rpAudit.prohibitedDetected) {
        remediationSuggestion = 'Structure reactive protocol into 3 phases: Agitation (physical buffer), Peak (bystander safety), and Recovery (minimum 15-minute quiet period before demands).';
      }
      break;
    }

    case 'QI-09': {
      // Restrictive Practices Justification & Least Restrictive Test
      if (rpAudit.prohibitedDetected) {
        score = 0;
        gapsIdentified.push(`PROHIBITED PRACTICE DETECTED: ${rpAudit.prohibitedHoldDetails || 'Restraint hold violating NDIS Rules 2018 (Rule 8)'}`);
        remediationSuggestion = 'Immediately eliminate all prohibited restraint holds (prone/supine/neck/diaphragm) and replace with non-injurious low-arousal de-escalation.';
        break;
      }

      if (rpAudit.totalReported === 0) {
        // Zero restrictive practices plan
        evidenceFound.push('Zero regulated restrictive practices reported. Plan operates on 100% positive and least-restrictive foundations.');
        score = 100;
        break;
      }

      evidenceFound.push(`Evaluated ${rpAudit.totalReported} reported restrictive practice(s) across NDIS categories.`);

      let practiceScore = 0;
      const totalPractices = rpAudit.totalReported;

      rpAudit.items.forEach((item) => {
        if (item.authorizationStatus === 'Fully Authorized') {
          evidenceFound.push(`Practice "${item.practiceType}" is fully authorized (${item.authorizationReference}).`);
          practiceScore += 50 / totalPractices;
        } else if (item.authorizationStatus === 'Pending Review') {
          evidenceFound.push(`Practice "${item.practiceType}" authorization pending (${item.authorizationReference}).`);
          practiceScore += 35 / totalPractices;
          gapsIdentified.push(`Practice "${item.practiceType}" authorization pending Senior Practitioner approval.`);
        } else {
          gapsIdentified.push(`UNAUTHORIZED PRACTICE: Practice "${item.practiceType}" (${item.description}) has no valid State Authorization Reference Number.`);
        }

        if (item.leastRestrictiveJustified) {
          evidenceFound.push(`Least restrictive alternatives documented for "${item.practiceType}".`);
          practiceScore += 30 / totalPractices;
        } else {
          gapsIdentified.push(`Least restrictive justification missing or insufficient for "${item.practiceType}".`);
        }

        if (item.fadingPlanPresent) {
          practiceScore += 20 / totalPractices;
        }
      });

      score = Math.round(practiceScore);

      if (rpAudit.unauthorizedCount > 0) {
        score = Math.min(score, 50);
        remediationSuggestion = 'Submit Restrictive Practice Authorisation application to State Senior Practitioner and insert official Reference Number (e.g. RPR-YYYY-STATE-XXXXX).';
      }
      break;
    }

    case 'QI-10': {
      // Reduction & Fade-Out Schedule
      if (rpAudit.totalReported === 0) {
        evidenceFound.push('No restrictive practices reported; plan satisfies reduction and zero-restraint mandate.');
        score = 100;
        break;
      }

      const totalWithFade = rpAudit.items.filter(i => i.fadingPlanPresent).length;

      if (totalWithFade === rpAudit.totalReported) {
        evidenceFound.push(`All ${rpAudit.totalReported} restrictive practice(s) have active, milestone-driven reduction and fade-out schedules.`);
        score = 95;

        // Check quantitative metrics
        const allFadeSummaries = rpAudit.items.map(i => i.reductionTarget || '').join(' ');
        if (allFadeSummaries.includes('%') || allFadeSummaries.includes('month') || allFadeSummaries.includes('trial') || allFadeSummaries.includes('step')) {
          evidenceFound.push('Quantitative fading thresholds and review intervals specified.');
          score = 100;
        }
      } else if (totalWithFade > 0) {
        evidenceFound.push(`${totalWithFade} of ${rpAudit.totalReported} practice(s) have documented fading protocols.`);
        score = Math.round((totalWithFade / rpAudit.totalReported) * 70);
        gapsIdentified.push(`${rpAudit.totalReported - totalWithFade} restrictive practice(s) lack an active reduction or fade-out plan.`);
      } else {
        gapsIdentified.push('CRITICAL GAP: Restrictive practices are active with NO reduction or fade-out schedule.');
        score = 15;
      }

      if (score < 70) {
        remediationSuggestion = 'Attach quantitative fading milestones (e.g. 50% duration reduction at 3 months, supervised trial intervals) linked to replacement skill acquisition.';
      }
      break;
    }

    case 'QI-11': {
      // Post-Incident Debriefing & Trauma-Informed Review
      const debrief = bsp.activeReactive?.postIncidentDebrief || '';

      if (debrief.length >= 35) {
        evidenceFound.push(`Structured post-incident debriefing protocol: "${debrief}"`);
        score += 60;

        const dLower = debrief.toLowerCase();
        if (dLower.includes('staff') && (dLower.includes('24') || dLower.includes('48') || dLower.includes('hour'))) {
          evidenceFound.push('Staff debriefing timeline established (within 24-48 hours).');
          score += 20;
        } else {
          gapsIdentified.push('Staff debriefing timeline (within 24-48 hours) not specified.');
        }

        if (dLower.includes('participant') || dLower.includes('emotional') || dLower.includes('trauma') || dLower.includes('check-in')) {
          evidenceFound.push('Trauma-informed participant recovery check-in included.');
          score += 20;
        } else {
          gapsIdentified.push('Participant trauma-informed check-in protocol omitted.');
        }
      } else {
        gapsIdentified.push('Post-incident debriefing and trauma-informed review protocols missing.');
        score = 20;
      }

      score = Math.min(100, score);
      if (score < 70) {
        remediationSuggestion = 'Establish a 2-stage post-incident review: 1) Participant emotional check-in post-baseline recovery, 2) Staff incident analysis and ABC data review within 24-48 hours.';
      }
      break;
    }

    case 'QI-12': {
      // Implementation, Staff Training & Governance Schedule
      const gov = bsp.staffTrainingAndGovernance;
      const reviewDate = bsp.reviewDate || '';
      const author = bsp.authorName || '';

      if (reviewDate.length >= 8) {
        // Calculate review date validity
        const reviewTime = new Date(reviewDate).getTime();
        const now = Date.now();
        const twelveMonthsMs = 366 * 24 * 60 * 60 * 1000;

        if (reviewTime > now - (30 * 24 * 60 * 60 * 1000)) {
          evidenceFound.push(`Active review date scheduled: ${reviewDate}`);
          score += 40;
        } else {
          gapsIdentified.push(`Plan review date is overdue or expired: ${reviewDate}`);
          score += 15;
        }
      } else {
        gapsIdentified.push('Mandatory 12-month annual review due date not specified.');
      }

      if (author.length >= 5) {
        evidenceFound.push(`Lead Behaviour Support Practitioner identified: ${author}`);
        score += 30;
      } else {
        gapsIdentified.push('Lead supervising practitioner name and registration number missing.');
      }

      if (gov?.curriculumSummary || (bsp.proactiveStrategies && bsp.proactiveStrategies.length > 0)) {
        evidenceFound.push('Staff competency training focus areas outlined.');
        score += 30;
      } else {
        gapsIdentified.push('Staff competency training curriculum not outlined.');
      }

      score = Math.min(100, score);
      if (score < 70) {
        remediationSuggestion = 'Specify staff competency training curriculum and confirm annual plan review cadence (<= 12 months) with APO submission date.';
      }
      break;
    }
  }

  const passed = score >= 70;
  const status = score >= 85 ? 'compliant' : score >= 60 ? 'warning' : 'non_compliant';

  return {
    id,
    name: def.name,
    pillar: def.pillar,
    weight: def.overallWeight,
    pillarWeight: def.pillarWeight,
    score,
    passed,
    status,
    evidenceFound,
    gapsIdentified,
    remediationSuggestion,
    citedRegulations: def.citedRegulations,
    evaluationDetails: `Score: ${score}% (${status.toUpperCase()}). Evaluated against ${def.citedRegulations[0]}.`
  };
}
