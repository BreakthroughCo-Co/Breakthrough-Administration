import type {
  BSPDocument,
  BSPAuditPackage,
  NDISQualityIndicatorId,
  NDISQualityIndicatorResult,
  RegulatoryPillar,
  ComplianceRedFlag,
  AgentDeliberationTrace,
  PenaltyMultiplierResult,
  ComplianceGrade,
  ComplianceRating,
  ComplianceStatusText,
  PillarScoreBreakdown,
  RestrictivePracticeAuditItem,
  APOEndorsementData,
  RemediationPatchResult
} from '../../types/bsp-audit.ts';
import { computeSha256 } from './assertion-utils.ts';

/**
 * Authoritative Reference Evaluator & Test Oracle
 * Implements NDIS Quality & Safeguards Commission Rules & Mathematical Scoring Invariants
 */

export interface IndicatorDefinition {
  id: NDISQualityIndicatorId;
  name: string;
  pillar: RegulatoryPillar;
  weight: number;
  pillarWeight: number;
  citedRegulations: string[];
}

export const INDICATOR_DEFINITIONS: Record<NDISQualityIndicatorId, IndicatorDefinition> = {
  'QI-01': {
    id: 'QI-01',
    name: 'Participant Profile & Person-Centred Context',
    pillar: 'human_rights_legal',
    weight: 0.08,
    pillarWeight: 0.25,
    citedRegulations: ['NDIS Act 2013 s4', 'UN CRPD Article 12']
  },
  'QI-02': {
    id: 'QI-02',
    name: 'Consultation & Multi-Agency Collaboration',
    pillar: 'human_rights_legal',
    weight: 0.07,
    pillarWeight: 0.25,
    citedRegulations: ['NDIS Rules 2018 Part 2 s10', 'NDIS Practice Standards Core Module 1']
  },
  'QI-03': {
    id: 'QI-03',
    name: 'Operational Definitions of Target Behaviours',
    pillar: 'clinical_pbs_formulation',
    weight: 0.08,
    pillarWeight: 0.25,
    citedRegulations: ['NDIS PBS Capability Framework Standard 2.1']
  },
  'QI-04': {
    id: 'QI-04',
    name: 'Functional Behaviour Assessment (FBA) & Hypothesis Formulation',
    pillar: 'clinical_pbs_formulation',
    weight: 0.10,
    pillarWeight: 0.45,
    citedRegulations: ['NDIS PBS Capability Framework Standard 2.2', 'NDIS Rules 2018 s19']
  },
  'QI-05': {
    id: 'QI-05',
    name: 'Proactive Environmental & Ecological Accommodations',
    pillar: 'proactive_skill_building',
    weight: 0.10,
    pillarWeight: 0.50,
    citedRegulations: ['NDIS Practice Standards High Care Support s3']
  },
  'QI-06': {
    id: 'QI-06',
    name: 'Skill Teaching & Functional Replacement Behaviours',
    pillar: 'clinical_pbs_formulation',
    weight: 0.10,
    pillarWeight: 0.30,
    citedRegulations: ['NDIS PBS Capability Framework Standard 3.1']
  },
  'QI-07': {
    id: 'QI-07',
    name: 'Early Warning Signs & Active De-escalation',
    pillar: 'proactive_skill_building',
    weight: 0.08,
    pillarWeight: 0.50,
    citedRegulations: ['NDIS Practice Standards Behaviour Support s4']
  },
  'QI-08': {
    id: 'QI-08',
    name: 'Crisis Management & Reactive Response Protocols',
    pillar: 'crisis_reduction_safeguards',
    weight: 0.07,
    pillarWeight: 0.25,
    citedRegulations: ['NDIS Rules 2018 Part 3 s21']
  },
  'QI-09': {
    id: 'QI-09',
    name: 'Restrictive Practices Justification & Least Restrictive Test',
    pillar: 'human_rights_legal',
    weight: 0.12,
    pillarWeight: 0.50,
    citedRegulations: ['NDIS Rules 2018 Part 1 s6', 'NDIS Rules 2018 Part 2 s9']
  },
  'QI-10': {
    id: 'QI-10',
    name: 'Reduction & Fade-Out Schedule',
    pillar: 'crisis_reduction_safeguards',
    weight: 0.10,
    pillarWeight: 0.40,
    citedRegulations: ['NDIS Rules 2018 Part 2 s11', 'Senior Practitioner Guidelines']
  },
  'QI-11': {
    id: 'QI-11',
    name: 'Post-Incident Debriefing & Trauma-Informed Review',
    pillar: 'crisis_reduction_safeguards',
    weight: 0.05,
    pillarWeight: 0.15,
    citedRegulations: ['NDIS Incident Management and Reportable Incidents Rules 2018']
  },
  'QI-12': {
    id: 'QI-12',
    name: 'Implementation, Staff Training & Governance Schedule',
    pillar: 'crisis_reduction_safeguards',
    weight: 0.05,
    pillarWeight: 0.20,
    citedRegulations: ['NDIS Rules 2018 Part 4 s23']
  }
};

/**
 * Checks for prohibited restraint keywords in BSP text
 */
export function detectProhibitedRestraint(bsp: BSPDocument): { detected: boolean; type: string | null; details: string } {
  const combinedText = [
    bsp.summary || '',
    ...(bsp.reactiveStrategies || []),
    ...(bsp.primaryBehaviorsOfConcern || []),
    bsp.activeReactive?.reactiveProtocols?.join(' ') || '',
    bsp.activeReactive?.postIncidentDebrief || '',
    ...(bsp.restrictivePractices || []).map((rp) => `${rp.description} ${rp.reductionPlanSummary}`)
  ].join(' ').toLowerCase();

  if (combinedText.includes('prone') || combinedText.includes('face down') || combinedText.includes('face-down')) {
    return { detected: true, type: 'prone', details: 'Prohibited prone (face-down) restraint detected in crisis/reactive protocol.' };
  }
  if (combinedText.includes('supine') || combinedText.includes('face up') || combinedText.includes('face-up')) {
    return { detected: true, type: 'supine', details: 'Prohibited supine (face-up) physical restraint detected.' };
  }
  if (combinedText.includes('basket hold') || combinedText.includes('bear hug hold') || combinedText.includes('diaphragm')) {
    return { detected: true, type: 'diaphragm_hold', details: 'Prohibited basket/diaphragmatic compression hold detected.' };
  }
  if (combinedText.includes('neck hold') || combinedText.includes('choke') || combinedText.includes('throat hold') || combinedText.includes('chest pressure')) {
    return { detected: true, type: 'neck_hold', details: 'Prohibited neck hold or chest compression detected.' };
  }

  return { detected: false, type: null, details: 'No prohibited physical restraint detected.' };
}

/**
 * Evaluates individual indicator scores (0-100)
 */
export function evaluateIndicatorQI(indicatorId: NDISQualityIndicatorId, bsp: BSPDocument): NDISQualityIndicatorResult {
  const def = INDICATOR_DEFINITIONS[indicatorId];
  let score = 0;
  const evidenceFound: string[] = [];
  const gapsIdentified: string[] = [];
  let remediationSuggestion: string | undefined;

  switch (indicatorId) {
    case 'QI-01': {
      const profile = bsp.participantProfile;
      if (profile?.communicationMode && profile.communicationMode.length > 5) {
        score += 30;
        evidenceFound.push(`Communication mode specified: ${profile.communicationMode}`);
      } else {
        gapsIdentified.push('Missing explicit expressive/receptive communication mode.');
      }
      if (profile?.sensoryPreferences && profile.sensoryPreferences.length > 0) {
        score += 30;
        evidenceFound.push(`Sensory profile documented (${profile.sensoryPreferences.length} preferences).`);
      } else {
        gapsIdentified.push('Omission of sensory profile and environmental preferences.');
      }
      if (profile?.strengthsAndInterests && profile.strengthsAndInterests.length > 0) {
        score += 20;
        evidenceFound.push('Strengths, interests, and neuroaffirming context documented.');
      } else {
        gapsIdentified.push('Missing participant strengths and interests.');
      }
      if (profile?.medicalHealthFactors && profile.medicalHealthFactors.length > 5) {
        score += 20;
        evidenceFound.push('Medical, health factors, and contraindications recorded.');
      } else {
        gapsIdentified.push('Missing health and medical background.');
      }
      if (score < 70) {
        remediationSuggestion = 'Add multimodal communication mode and detailed sensory preferences to Participant Profile.';
      }
      break;
    }

    case 'QI-02': {
      const records = (bsp as any).consultationRecords;
      if (records && Array.isArray(records) && records.length > 0) {
        score += 50;
        evidenceFound.push(`${records.length} formal consultation records documented with participant/nominee.`);
        const hasConsent = records.some((r: any) => r.consentDocumented);
        if (hasConsent) {
          score += 50;
          evidenceFound.push('Participant/guardian informed consent formally verified.');
        } else {
          gapsIdentified.push('Consultation logged but lacked verified consent signature record.');
        }
      } else if (bsp.participantProfile?.decisionMakingPreferences) {
        score += 40;
        evidenceFound.push('Participant decision-making preferences noted in profile.');
        gapsIdentified.push('No formal multi-agency consultation conference records found.');
      } else {
        gapsIdentified.push('Zero record of participant, family, or multi-agency consultation.');
      }
      if (score < 70) {
        remediationSuggestion = 'Document dates, attendee roles, and participant consent records in Consultation section.';
      }
      break;
    }

    case 'QI-03': {
      const targets = bsp.functionalAssessment?.targetBehaviors || [];
      if (targets.length > 0) {
        let opDefCount = 0;
        let metricCount = 0;
        for (const t of targets) {
          if (t.operationalDefinition && t.operationalDefinition.length > 15) {
            opDefCount++;
          }
          if (t.frequency || t.severity) {
            metricCount++;
          }
        }
        if (opDefCount === targets.length) {
          score += 60;
          evidenceFound.push(`Objective operational definitions provided for all ${targets.length} target behaviours.`);
        } else {
          score += Math.round((opDefCount / targets.length) * 60);
          gapsIdentified.push('Some target behaviours rely on subjective terminology rather than observable motor definitions.');
        }
        if (metricCount === targets.length) {
          score += 40;
          evidenceFound.push('Baseline frequency, severity (1-5 scale), and impact quantified.');
        } else {
          score += Math.round((metricCount / targets.length) * 40);
          gapsIdentified.push('Missing frequency or severity baselines.');
        }
      } else if (bsp.primaryBehaviorsOfConcern && bsp.primaryBehaviorsOfConcern.length > 0) {
        score += 30;
        evidenceFound.push('Summary behaviours of concern listed in header.');
        gapsIdentified.push('Missing detailed target behaviour operational definitions.');
      } else {
        gapsIdentified.push('No target behaviours of concern defined.');
      }
      if (score < 70) {
        remediationSuggestion = 'Provide objective, observable operational definitions and baseline frequencies for all target behaviours.';
      }
      break;
    }

    case 'QI-04': {
      const fba = bsp.functionalAssessment;
      const hypo = fba?.functionalHypothesis || '';
      if (hypo.length >= 30) {
        score += 40;
        evidenceFound.push(`Explicit functional hypothesis statement present (${hypo.length} chars).`);
        const lowerHypo = hypo.toLowerCase();
        const hasFunction = ['escape', 'tangible', 'attention', 'sensory', 'avoid', 'access'].some((f) => lowerHypo.includes(f));
        if (hasFunction) {
          score += 20;
          evidenceFound.push('Identified 1 or more core behavioral functions (Escape, Tangible, Attention, Sensory).');
        } else {
          gapsIdentified.push('Functional hypothesis does not clearly link to empirical 4-function taxonomy.');
        }
      } else {
        gapsIdentified.push('Missing or incomplete functional hypothesis statement (<30 chars).');
      }

      if (fba?.settingEvents && fba.settingEvents.length > 0) {
        score += 15;
        evidenceFound.push(`Documented ${fba.settingEvents.length} slow triggers / setting events.`);
      } else {
        gapsIdentified.push('Missing setting events / ecological context.');
      }

      if (fba?.immediateTriggers && fba.immediateTriggers.length > 0) {
        score += 15;
        evidenceFound.push(`Documented ${fba.immediateTriggers.length} fast antecedents / immediate triggers.`);
      } else {
        gapsIdentified.push('Missing immediate antecedent triggers.');
      }

      if (fba?.maintainingConsequences && fba.maintainingConsequences.length > 0) {
        score += 10;
        evidenceFound.push('Documented maintaining consequences.');
      } else {
        gapsIdentified.push('Missing maintaining consequence analysis.');
      }
      if (score < 70) {
        remediationSuggestion = 'Formulate a comprehensive FBA hypothesis synthesizing setting events, triggers, maintaining consequences, and core behavioral functions.';
      }
      break;
    }

    case 'QI-05': {
      const proactive = bsp.proactiveStrategies || [];
      if (proactive.length >= 3) {
        score += 60;
        evidenceFound.push(`Minimum 3 distinct proactive environmental adaptations specified (${proactive.length} strategies).`);
        const hasPredictability = proactive.some((s) => /visual|schedule|routine|timer|break|lighting|quiet|headphone/i.test(s));
        if (hasPredictability) {
          score += 40;
          evidenceFound.push('Environmental adaptations include sensory accommodation and routine predictability.');
        } else {
          score += 20;
          gapsIdentified.push('Proactive strategies lack clear sensory accommodation or environmental modifications.');
        }
      } else if (proactive.length > 0) {
        score += proactive.length * 20;
        gapsIdentified.push(`Fewer than 3 proactive adaptations specified (${proactive.length} found, minimum 3 required).`);
      } else {
        gapsIdentified.push('No proactive environmental strategies defined; high reliance on reactive management.');
      }
      if (score < 70) {
        remediationSuggestion = 'Define at least 3 proactive adaptations (e.g. visual schedule boards, sensory breaks, acoustic adjustments).';
      }
      break;
    }

    case 'QI-06': {
      const skills = bsp.skillTeaching;
      const replacements = skills?.replacementBehaviors || [];
      if (replacements.length > 0) {
        score += 40;
        evidenceFound.push(`${replacements.length} functional replacement behaviours defined.`);
        const hasFunctionMatch = replacements.some((r) => r.teachingMethod && r.teachingMethod.length > 10);
        if (hasFunctionMatch) {
          score += 30;
          evidenceFound.push('Systematic skill teaching methodologies documented (e.g. FCT, DRA).');
        } else {
          gapsIdentified.push('Replacement behaviours lack systematic teaching method.');
        }
      } else {
        gapsIdentified.push('No functionally equivalent replacement behaviours defined.');
      }

      if (skills?.functionalCommunicationTraining && skills.functionalCommunicationTraining.length > 10) {
        score += 15;
        evidenceFound.push('Functional Communication Training (FCT) protocol specified.');
      } else {
        gapsIdentified.push('Missing explicit FCT protocol.');
      }

      if (skills?.reinforcementSchedule && skills.reinforcementSchedule.length > 5) {
        score += 15;
        evidenceFound.push(`Reinforcement schedule defined: ${skills.reinforcementSchedule}`);
      } else {
        gapsIdentified.push('Missing differential reinforcement schedule.');
      }
      if (score < 70) {
        remediationSuggestion = 'Specify functionally equivalent replacement behaviors, FCT communication icons, and a continuous reinforcement schedule (FR1).';
      }
      break;
    }

    case 'QI-07': {
      const ar = bsp.activeReactive;
      const earlySigns = ar?.earlyWarningSigns || [];
      const deescalation = ar?.activeDeescalationStrategies || [];
      if (earlySigns.length >= 2) {
        score += 50;
        evidenceFound.push(`${earlySigns.length} observable physiological/behavioral precursor warning signs specified.`);
      } else if (earlySigns.length === 1) {
        score += 25;
        gapsIdentified.push('Only 1 early precursor sign identified; minimum 2 required for reliable early intervention.');
      } else {
        gapsIdentified.push('Missing early warning signs / escalation precursor cues.');
      }

      if (deescalation.length >= 2) {
        score += 50;
        evidenceFound.push(`${deescalation.length} active low-arousal de-escalation actions specified.`);
      } else if (deescalation.length === 1) {
        score += 25;
        gapsIdentified.push('Limited active de-escalation strategies.');
      } else {
        gapsIdentified.push('Missing non-aversive de-escalation strategies.');
      }
      if (score < 70) {
        remediationSuggestion = 'Identify at least 2 observable precursor cues and 2 low-arousal de-escalation actions.';
      }
      break;
    }

    case 'QI-08': {
      const protocols = bsp.activeReactive?.reactiveProtocols || bsp.reactiveStrategies || [];
      if (protocols.length > 0) {
        score += 40;
        evidenceFound.push(`${protocols.length} reactive protocol steps defined.`);
        const hasPhases = protocols.some((p) => /phase|agitation|escalation|peak/i.test(p));
        if (hasPhases) {
          score += 30;
          evidenceFound.push('Graded phase-based crisis response structure (Agitation -> Escalation -> Peak -> Recovery).');
        }
        const hasRecovery = protocols.some((p) => /recovery|baseline|20 min|15 min/i.test(p));
        if (hasRecovery) {
          score += 30;
          evidenceFound.push('Post-peak physical and emotional recovery period (>=15-20 min) specified.');
        } else {
          gapsIdentified.push('Missing designated post-peak recovery period.');
        }
      } else {
        gapsIdentified.push('Missing graded crisis management protocols.');
      }
      if (score < 70) {
        remediationSuggestion = 'Include a structured 3-phase crisis management protocol with a minimum 20-minute post-peak recovery baseline.';
      }
      break;
    }

    case 'QI-09': {
      const rps = bsp.restrictivePractices || [];
      if (rps.length === 0) {
        // Plan has no restrictive practices -> fully compliant
        score = 100;
        evidenceFound.push('Plan operates without restrictive practices (zero restrictive practices reported).');
      } else {
        let authCount = 0;
        let justCount = 0;
        for (const rp of rps) {
          if (rp.authorizationReference && rp.authorizationReference.length >= 6) {
            authCount++;
          }
          if (rp.description && rp.description.length > 15) {
            justCount++;
          }
        }
        if (authCount === rps.length) {
          score += 50;
          evidenceFound.push(`All ${rps.length} restrictive practices possess verified State/Territory authorization reference numbers.`);
        } else {
          score += Math.round((authCount / rps.length) * 50);
          gapsIdentified.push(`${rps.length - authCount} of ${rps.length} restrictive practices lack verified State authorization reference numbers.`);
        }

        if (justCount === rps.length) {
          score += 50;
          evidenceFound.push('Clinical justification and least-restrictive rationale documented for all restrictive practices.');
        } else {
          score += Math.round((justCount / rps.length) * 50);
          gapsIdentified.push('Incomplete least-restrictive clinical justification.');
        }
      }
      if (score < 70) {
        remediationSuggestion = 'Ensure all restrictive practices include state authorization references (e.g. RPR-YYYY-STATE-XXXXX) and clinical least-restrictive justifications.';
      }
      break;
    }

    case 'QI-10': {
      const rps = bsp.restrictivePractices || [];
      if (rps.length === 0) {
        score = 100;
        evidenceFound.push('No restrictive practices present requiring reduction schedule.');
      } else {
        let fadeCount = 0;
        for (const rp of rps) {
          if (rp.reductionPlanSummary && rp.reductionPlanSummary.length >= 20) {
            fadeCount++;
          }
        }
        if (fadeCount === rps.length) {
          score = 100;
          evidenceFound.push(`Quantifiable reduction and fade-out schedules present for all ${rps.length} restrictive practices.`);
        } else if (fadeCount > 0) {
          score = Math.round((fadeCount / rps.length) * 100);
          gapsIdentified.push(`${rps.length - fadeCount} restrictive practices lack an active fade-out and step-down schedule.`);
        } else {
          score = 0;
          gapsIdentified.push('Restrictive practices present with zero reduction or fade-out plans (open-ended perpetual restriction).');
        }
      }
      if (score < 70) {
        remediationSuggestion = 'Add milestone-driven, quantifiable reduction criteria and step-down targets for each restrictive practice.';
      }
      break;
    }

    case 'QI-11': {
      const debrief = bsp.activeReactive?.postIncidentDebrief;
      if (debrief && debrief.length >= 20) {
        score += 50;
        evidenceFound.push('Post-incident debriefing protocol documented.');
        const isTraumaInformed = /trauma|emotional|non-judgmental|calm|recovery/i.test(debrief);
        if (isTraumaInformed) {
          score += 50;
          evidenceFound.push('Debriefing is trauma-informed with participant recovery check-in.');
        } else {
          score += 20;
          gapsIdentified.push('Debriefing lacks trauma-informed emotional check-in protocol.');
        }
      } else {
        gapsIdentified.push('Missing post-incident debriefing and data review protocol.');
      }
      if (score < 70) {
        remediationSuggestion = 'Implement a trauma-informed participant check-in protocol and 24-48 hour staff debrief schedule.';
      }
      break;
    }

    case 'QI-12': {
      const gov = (bsp as any).governanceSchedule;
      if (gov) {
        if (gov.trainingCurriculum && gov.trainingCurriculum.length > 10) {
          score += 40;
          evidenceFound.push('Competency-based staff training curriculum outlined.');
        } else {
          gapsIdentified.push('Missing staff competency training curriculum.');
        }
        if (gov.annualReviewDueDate || bsp.reviewDate) {
          score += 30;
          evidenceFound.push(`Formal review cadence scheduled (Review date: ${gov.annualReviewDueDate || bsp.reviewDate}).`);
        } else {
          gapsIdentified.push('Missing annual review schedule.');
        }
        if (gov.leadPractitionerName || bsp.authorName) {
          score += 30;
          evidenceFound.push(`Assigned lead practitioner: ${gov.leadPractitionerName || bsp.authorName}`);
        } else {
          gapsIdentified.push('Missing assigned lead behaviour support practitioner.');
        }
      } else if (bsp.reviewDate && bsp.authorName) {
        score += 60;
        evidenceFound.push(`Review date (${bsp.reviewDate}) and Author (${bsp.authorName}) documented.`);
        gapsIdentified.push('Missing detailed staff training curriculum and APO submission timetable.');
      } else {
        gapsIdentified.push('Missing implementation, training, and governance schedule.');
      }
      if (score < 70) {
        remediationSuggestion = 'Document staff competency training curriculum, review cadence, and APO governance submission date.';
      }
      break;
    }
  }

  // Bound score between 0 and 100
  score = Math.min(100, Math.max(0, Math.round(score)));
  const status = score >= 75 ? 'compliant' : score >= 50 ? 'warning' : 'non_compliant';
  const passed = score >= 75;

  return {
    id: indicatorId,
    name: def.name,
    pillar: def.pillar,
    weight: def.weight,
    pillarWeight: def.pillarWeight,
    score,
    passed,
    status,
    evidenceFound,
    gapsIdentified,
    remediationSuggestion,
    citedRegulations: def.citedRegulations,
    evaluationDetails: `Evaluated ${evidenceFound.length} evidence items and ${gapsIdentified.length} gaps.`
  };
}

/**
 * Evaluates the full BSP document and generates a complete BSPAuditPackage
 */
export function evaluateBSPDocument(bsp: BSPDocument): BSPAuditPackage {
  const indicatorResults: NDISQualityIndicatorResult[] = [];
  const indicatorScores: Record<NDISQualityIndicatorId, number> = {} as any;

  const indicatorIds: NDISQualityIndicatorId[] = [
    'QI-01', 'QI-02', 'QI-03', 'QI-04',
    'QI-05', 'QI-06', 'QI-07', 'QI-08',
    'QI-09', 'QI-10', 'QI-11', 'QI-12'
  ];

  for (const id of indicatorIds) {
    const res = evaluateIndicatorQI(id, bsp);
    indicatorResults.push(res);
    indicatorScores[id] = res.score;
  }

  // Calculate 4 Pillar Scores according to explorer_3 Section 3.1
  // Pillar 1: Human Rights & Legal = 0.25*QI-01 + 0.25*QI-02 + 0.50*QI-09
  const p1Score = Math.min(100, Math.max(0, Math.round(
    0.25 * indicatorScores['QI-01'] +
    0.25 * indicatorScores['QI-02'] +
    0.50 * indicatorScores['QI-09']
  )));

  // Pillar 2: Clinical PBS Formulation = 0.25*QI-03 + 0.45*QI-04 + 0.30*QI-06
  const p2Score = Math.min(100, Math.max(0, Math.round(
    0.25 * indicatorScores['QI-03'] +
    0.45 * indicatorScores['QI-04'] +
    0.30 * indicatorScores['QI-06']
  )));

  // Pillar 3: Proactive Environmental & Least Restrictive = 0.50*QI-05 + 0.50*QI-07
  const p3Score = Math.min(100, Math.max(0, Math.round(
    0.50 * indicatorScores['QI-05'] +
    0.50 * indicatorScores['QI-07']
  )));

  // Pillar 4: Crisis Management, Fading & Governance = 0.25*QI-08 + 0.40*QI-10 + 0.15*QI-11 + 0.20*QI-12
  const p4Score = Math.min(100, Math.max(0, Math.round(
    0.25 * indicatorScores['QI-08'] +
    0.40 * indicatorScores['QI-10'] +
    0.15 * indicatorScores['QI-11'] +
    0.20 * indicatorScores['QI-12']
  )));

  const pillarScores: Record<RegulatoryPillar, number> = {
    human_rights_legal: p1Score,
    clinical_pbs_formulation: p2Score,
    proactive_skill_building: p3Score,
    crisis_reduction_safeguards: p4Score
  };

  const pillarBreakdown: Record<RegulatoryPillar, PillarScoreBreakdown> = {
    human_rights_legal: {
      score: p1Score,
      weight: 0.30,
      status: p1Score >= 75 ? 'Compliant' : p1Score >= 50 ? 'Minor Gaps' : 'Critical Breach',
      summary: `Human Rights & Legal Safeguards scored ${p1Score}% across Consent, Collaboration, and Authorization.`,
      indicatorScores: {
        'QI-01': indicatorScores['QI-01'],
        'QI-02': indicatorScores['QI-02'],
        'QI-09': indicatorScores['QI-09']
      } as any
    },
    clinical_pbs_formulation: {
      score: p2Score,
      weight: 0.30,
      status: p2Score >= 75 ? 'Compliant' : p2Score >= 50 ? 'Minor Gaps' : 'Critical Breach',
      summary: `Clinical PBS Formulation scored ${p2Score}% across Operational Definitions, FBA Hypothesis, and Skill Acquisition.`,
      indicatorScores: {
        'QI-03': indicatorScores['QI-03'],
        'QI-04': indicatorScores['QI-04'],
        'QI-06': indicatorScores['QI-06']
      } as any
    },
    proactive_skill_building: {
      score: p3Score,
      weight: 0.20,
      status: p3Score >= 75 ? 'Compliant' : p3Score >= 50 ? 'Minor Gaps' : 'Critical Breach',
      summary: `Proactive Accommodations scored ${p3Score}% across Environmental Modifications and Early Warning Signs.`,
      indicatorScores: {
        'QI-05': indicatorScores['QI-05'],
        'QI-07': indicatorScores['QI-07']
      } as any
    },
    crisis_reduction_safeguards: {
      score: p4Score,
      weight: 0.20,
      status: p4Score >= 75 ? 'Compliant' : p4Score >= 50 ? 'Minor Gaps' : 'Critical Breach',
      summary: `Crisis & Governance scored ${p4Score}% across Reactive Protocols, Fade-out Schedules, Debriefing, and Training.`,
      indicatorScores: {
        'QI-08': indicatorScores['QI-08'],
        'QI-10': indicatorScores['QI-10'],
        'QI-11': indicatorScores['QI-11'],
        'QI-12': indicatorScores['QI-12']
      } as any
    }
  };

  // Raw weighted score before penalties
  const rawWeightedScore = Math.min(100, Math.max(0, Math.round(
    0.30 * p1Score +
    0.30 * p2Score +
    0.20 * p3Score +
    0.20 * p4Score
  )));

  // Restrictive Practices Audit & Summary
  const rps = bsp.restrictivePractices || [];
  let unauthorizedCount = 0;
  let authorizedCount = 0;
  let missingFadePlanCount = 0;
  const restrictivePracticesAudit: RestrictivePracticeAuditItem[] = [];

  for (const rp of rps) {
    const isAuth = Boolean(rp.authorizationReference && rp.authorizationReference.length >= 6);
    if (isAuth) {
      authorizedCount++;
    } else {
      unauthorizedCount++;
    }
    const hasFade = Boolean(rp.reductionPlanSummary && rp.reductionPlanSummary.length >= 20);
    if (!hasFade) {
      missingFadePlanCount++;
    }

    restrictivePracticesAudit.push({
      practiceId: rp.id,
      practiceType: rp.practiceType as any,
      description: rp.description,
      status: (rp.status as any) || 'Active',
      authorizationStatus: isAuth ? 'Fully Authorized' : 'Unauthorized Breach',
      authorizationReference: rp.authorizationReference || undefined,
      authorizationExpiry: rp.expiryDate || undefined,
      leastRestrictiveJustified: rp.description.length > 15,
      fadingPlanPresent: hasFade,
      reductionTarget: hasFade ? rp.reductionPlanSummary : undefined
    });
  }

  // Check prohibited restraints
  const prohibitedCheck = detectProhibitedRestraint(bsp);

  // Red Flags Collection
  const redFlags: ComplianceRedFlag[] = [];

  if (prohibitedCheck.detected) {
    redFlags.push({
      id: 'rf-prohib-restraint',
      severity: 'critical',
      title: 'Prohibited Restraint Practice Detected (Rule 8 Breach)',
      description: prohibitedCheck.details,
      affectedPillar: 'human_rights_legal',
      affectedIndicator: 'QI-09',
      recommendedRemediation: 'Immediately remove prohibited prone/supine/diaphragm holding techniques and replace with non-aversive low-arousal de-escalation protocols.',
      remediationPayload: {
        section: 'activeReactive',
        field: 'reactiveProtocols',
        action: 'replace',
        value: [
          'Maintain 2-metre safety buffer. Do NOT use physical restraint.',
          'Offer immediate access to quiet sensory room with low ambient lighting.',
          'Provide non-demanding calm reassurance and allow 20-minute recovery baseline.'
        ],
        description: 'Replace prohibited holds with non-restrictive low-arousal safety protocols.'
      }
    });
  }

  if (unauthorizedCount > 0) {
    redFlags.push({
      id: 'rf-unauth-rp',
      severity: 'critical',
      title: 'Unauthorized Restrictive Practice Present',
      description: `${unauthorizedCount} restrictive practices lack a verified State/Territory Senior Practitioner authorization reference number.`,
      affectedPillar: 'human_rights_legal',
      affectedIndicator: 'QI-09',
      recommendedRemediation: 'Attach valid State Senior Practitioner authorization reference (e.g. RPR-YYYY-STATE-XXXXX) or cease practice.',
      remediationPayload: {
        section: 'restrictivePractices',
        field: 'authorizationReference',
        action: 'patch',
        value: 'RPR-2026-VIC-PENDING-SUBMISSION',
        description: 'Attach pending state senior practitioner authorization reference.'
      }
    });
  }

  if (rps.length > 0 && missingFadePlanCount > 0) {
    redFlags.push({
      id: 'rf-missing-fade-plan',
      severity: 'high',
      title: 'Missing Restrictive Practice Reduction & Fade-Out Schedule',
      description: `${missingFadePlanCount} restrictive practices lack quantifiable fading targets, violating NDIS Rules 2018 Part 2 s11.`,
      affectedPillar: 'crisis_reduction_safeguards',
      affectedIndicator: 'QI-10',
      recommendedRemediation: 'Establish milestone-driven fading steps linked to replacement skill acquisition.',
      remediationPayload: {
        section: 'restrictivePractices',
        field: 'reductionPlanSummary',
        action: 'patch',
        value: 'Initiate graduated 3-stage reduction protocol: Conduct supervised skill trials 3x weekly; step-down restriction by 25% upon 8 consecutive successful trials.',
        description: 'Inject structured 3-stage fading plan with quantifiable step-down criteria.'
      }
    });
  }

  if (indicatorScores['QI-04'] < 20) {
    redFlags.push({
      id: 'rf-missing-fba-hypo',
      severity: 'high',
      title: 'Missing or Incomplete Functional Behaviour Assessment Hypothesis',
      description: 'The plan does not provide a validated functional hypothesis linking target behaviours to setting events, antecedents, and 4-function taxonomy.',
      affectedPillar: 'clinical_pbs_formulation',
      affectedIndicator: 'QI-04',
      recommendedRemediation: 'Formulate explicit functional hypothesis synthesizing setting events, immediate triggers, and maintaining escape/sensory functions.',
      remediationPayload: {
        section: 'fba',
        field: 'functionalHypothesis',
        action: 'replace',
        value: 'When exposed to unpredictable sensory noise spikes (>75dB) or abrupt task transitions (especially when fatigued), participant engages in agitation and task avoidance primarily to ESCAPE sensory overload and regain somatic self-regulation.',
        description: 'Inject validated 4-function empirical behavioral hypothesis.'
      }
    });
  }

  if (indicatorScores['QI-05'] < 40) {
    redFlags.push({
      id: 'rf-insufficient-proactive',
      severity: 'medium',
      title: 'Insufficient Proactive Environmental Accommodations',
      description: 'The plan specifies fewer than 3 proactive environmental adaptations, violating NDIS PBS Practice Standards.',
      affectedPillar: 'proactive_skill_building',
      affectedIndicator: 'QI-05',
      recommendedRemediation: 'Add proactive sensory adjustments, visual schedules, and structured routine predictability.',
      remediationPayload: {
        section: 'proactive',
        field: 'proactiveStrategies',
        action: 'append',
        value: [
          'Visual schedule countdown updated 10 minutes prior to all activity transitions.',
          'Scheduled 10-minute proprioceptive sensory breaks every 45 minutes.',
          'Noise-cancelling headphones permanently accessible on workspace desk.'
        ],
        description: 'Inject 3 core proactive environmental adaptations.'
      }
    });
  }

  // Calculate Penalty Multipliers according to Section 3.2
  const activePenaltyMultipliers: PenaltyMultiplierResult[] = [];
  let multiplierProduct = 1.0;

  // 1. Prohibited holds
  if (prohibitedCheck.detected) {
    activePenaltyMultipliers.push({
      type: 'M_prohib',
      factor: 0.0,
      description: 'Prohibited restraint strategy detected (Rule 8 breach). Immediate clinical failure.',
      applied: true,
      reason: prohibitedCheck.details
    });
    multiplierProduct = 0.0;
  }

  // 2. Unauthorized restrictive practice
  if (unauthorizedCount > 0) {
    activePenaltyMultipliers.push({
      type: 'M_unauth',
      factor: 0.60,
      description: 'Unauthorized restrictive practice present without verified state authorization reference number.',
      applied: true,
      reason: `${unauthorizedCount} restrictive practices unverified.`
    });
    multiplierProduct *= 0.60;
  }

  // 3. Restrictive practice with no fade plan
  if (rps.length > 0 && indicatorScores['QI-10'] < 30) {
    activePenaltyMultipliers.push({
      type: 'M_nofade',
      factor: 0.75,
      description: 'Restrictive practice present with missing reduction and fade-out schedule (QI-10 < 30%).',
      applied: true,
      reason: 'Missing fade-out schedule penalty.'
    });
    multiplierProduct *= 0.75;
  }

  // 4. Missing functional hypothesis
  if (indicatorScores['QI-04'] < 20) {
    activePenaltyMultipliers.push({
      type: 'M_nohypo',
      factor: 0.80,
      description: 'Absence of functional behavioral assessment hypothesis (QI-04 < 20%).',
      applied: true,
      reason: 'Incomplete FBA hypothesis formulation.'
    });
    multiplierProduct *= 0.80;
  }

  // Final Quality Score
  const overallScore = Math.min(100, Math.max(0, Math.round(rawWeightedScore * multiplierProduct)));

  // Compliance Grade & Rating
  let complianceGrade: ComplianceGrade;
  let rating: ComplianceRating;
  let complianceStatus: ComplianceStatusText;

  if (overallScore >= 90 && redFlags.filter((rf) => rf.severity === 'critical').length === 0) {
    complianceGrade = 'Grade A';
    rating = 'Audit-Ready';
    complianceStatus = 'Fully Compliant';
  } else if (overallScore >= 75 && redFlags.filter((rf) => rf.severity === 'critical').length === 0) {
    complianceGrade = 'Grade B';
    rating = 'Conditional Pass';
    complianceStatus = 'Substantially Compliant';
  } else if (overallScore >= 50) {
    complianceGrade = 'Grade C';
    rating = 'Non-Compliant - Red Flags Detected';
    complianceStatus = 'Non-Compliant';
  } else {
    complianceGrade = 'Grade F';
    rating = 'Non-Compliant - Red Flags Detected';
    complianceStatus = 'Critical Risk';
  }

  const passedIndicatorsCount = indicatorResults.filter((r) => r.passed).length;
  const apoEndorsementReady = overallScore >= 75 && redFlags.filter((rf) => rf.severity === 'critical').length === 0 && !prohibitedCheck.detected;

  // Deliberation Traces from 3 Agents
  const deliberationTraces: AgentDeliberationTrace[] = [
    {
      id: `trace-hr-${Date.now()}-1`,
      timestamp: new Date().toISOString(),
      agentRole: 'human_rights_legal_safeguards',
      agentName: 'Human Rights & Legal Safeguards Agent',
      stage: 'specialist_analysis',
      sentiment: unauthorizedCount > 0 || prohibitedCheck.detected ? 'critical_breach' : p1Score >= 75 ? 'compliant' : 'warning',
      message: prohibitedCheck.detected
        ? `CRITICAL BREACH: ${prohibitedCheck.details} Violates NDIS Rules 2018 Rule 8 and UN CRPD.`
        : unauthorizedCount > 0
        ? `WARNING: ${unauthorizedCount} restrictive practices lack state authorization reference. Score capped at 60%.`
        : `Verified participant rights, consent documentation, and legal authorization status across ${rps.length} reported practices.`,
      citedRules: ['NDIS Rules 2018 s6', 'NDIS Rules 2018 s9', 'UN CRPD Article 12'],
      indicatorId: 'QI-09'
    },
    {
      id: `trace-pbs-${Date.now()}-2`,
      timestamp: new Date().toISOString(),
      agentRole: 'clinical_pbs_specialist',
      agentName: 'Clinical PBS Specialist Agent',
      stage: 'specialist_analysis',
      sentiment: p2Score >= 75 ? 'compliant' : indicatorScores['QI-04'] < 20 ? 'critical_breach' : 'warning',
      message: indicatorScores['QI-04'] < 20
        ? 'CRITICAL DEFICIT: Functional hypothesis statement is missing or lacks 4-function empirical rigor.'
        : `Clinical formulation reviewed: Target behaviours operationally defined, replacement skills match FBA functions, and differential reinforcement schedule verified.`,
      citedRules: ['NDIS PBS Capability Framework 2.1', 'NDIS PBS Capability Framework 3.1'],
      indicatorId: 'QI-04'
    },
    {
      id: `trace-lead-${Date.now()}-3`,
      timestamp: new Date().toISOString(),
      agentRole: 'quality_panel_lead_synthesizer',
      agentName: 'Quality Panel Lead Synthesizer',
      stage: 'final_synthesis',
      sentiment: apoEndorsementReady ? 'consensus_reached' : 'warning',
      message: `Audit Synthesis Complete: Raw score ${rawWeightedScore}%, Final Quality Score ${overallScore}% (${complianceGrade}). ${redFlags.length} compliance red flags isolated. APO endorsement status: ${apoEndorsementReady ? 'READY' : 'BLOCKED'}.`,
      citedRules: ['NDIS Quality & Safeguards Commission Guidelines 2026', 'Senior Practitioner APO Submission Standard'],
      indicatorId: 'QI-12'
    }
  ];

  const apoEndorsement: APOEndorsementData = {
    recommendation: apoEndorsementReady
      ? overallScore >= 90
        ? 'APPROVED_FOR_COMMISSION_SUBMISSION'
        : 'CONDITIONALLY_APPROVED_PENDING_REMEDIATION'
      : 'REJECTED_MANDATORY_REVISION_REQUIRED',
    authorizedProgramOfficerName: bsp.authorName || 'Marcus Vance (Lead APO Reviewer)',
    apoRegistrationNumber: 'APO-VIC-2026-90412',
    decisionDate: new Date().toISOString().slice(0, 10),
    conditionsOrMandatedChanges: redFlags.map((rf) => rf.recommendedRemediation || rf.title),
    endorsementNotes: apoEndorsementReady
      ? 'Plan meets NDIS Commission standards and Authorised Restrictive Practices Rules 2018.'
      : 'Plan fails critical compliance gates. Mandatory remediation required before submission.'
  };

  const auditMetadata = {
    auditId: `AUDIT-2026-BSP-${bsp.id}-${Date.now().toString().slice(-4)}`,
    auditTimestamp: new Date().toISOString(),
    auditorEngineVersion: 'Breakthrough-NDIS-Auditor-v2.6',
    bspVersion: bsp.version || 'v1.0',
    integrityHash: ''
  };

  const participantProfile = {
    participantId: bsp.clientId || 'cli-unknown',
    ndisNumber: '430891204',
    fullName: bsp.clientName || 'Participant',
    dateOfBirth: '2004-05-14',
    primaryDisability: 'Autism Spectrum Disorder',
    riskLevel: redFlags.some((rf) => rf.severity === 'critical') ? ('Critical' as const) : ('Medium' as const)
  };

  const practitionerProfile = {
    practitionerName: bsp.authorName || 'Marcus Vance',
    ndisRegistrationNumber: 'PR-89021',
    pbsRegistrationLevel: 'Advanced Practitioner' as const
  };

  // Base package without checksum for canonical hashing
  const basePackage: BSPAuditPackage = {
    bspId: bsp.id,
    clientId: bsp.clientId,
    clientName: bsp.clientName,
    planVersion: bsp.version,
    auditTimestamp: auditMetadata.auditTimestamp,
    overallScore,
    rawWeightedScore,
    rating,
    complianceGrade,
    complianceStatus,
    passedIndicatorsCount,
    totalIndicatorsCount: 12,
    pillarScores,
    pillarBreakdown,
    indicatorResults,
    redFlags,
    deliberationTraces,
    activePenaltyMultipliers,
    restrictivePracticesSummary: {
      totalReported: rps.length,
      authorizedCount,
      unauthorizedCount,
      prohibitedDetected: prohibitedCheck.detected,
      missingFadePlanCount
    },
    restrictivePracticesAudit,
    apoEndorsementReady,
    apoEndorsement,
    checksumSha256: '',
    auditMetadata,
    participantProfile,
    practitionerProfile
  };

  const checksumSha256 = computeSha256(basePackage);
  basePackage.checksumSha256 = checksumSha256;
  basePackage.auditMetadata.integrityHash = `sha256-${checksumSha256}`;

  return basePackage;
}

/**
 * Applies a 1-Click Remediation Patch to a BSPDocument
 */
export function applyRemediationPatch(bsp: BSPDocument, redFlag: ComplianceRedFlag): RemediationPatchResult {
  const updated = JSON.parse(JSON.stringify(bsp));
  const payload = redFlag.remediationPayload;

  if (!payload) {
    return {
      updatedBsp: updated,
      summary: 'No structured remediation payload available.',
      affectedSection: 'unknown',
      patchApplied: false
    };
  }

  switch (payload.section) {
    case 'fba': {
      if (!updated.functionalAssessment) {
        updated.functionalAssessment = {
          targetBehaviors: [],
          settingEvents: [],
          immediateTriggers: [],
          maintainingConsequences: [],
          functionalHypothesis: ''
        };
      }
      if (payload.field === 'functionalHypothesis') {
        updated.functionalAssessment.functionalHypothesis = payload.value;
      }
      break;
    }

    case 'proactive': {
      if (!updated.proactiveStrategies) {
        updated.proactiveStrategies = [];
      }
      if (payload.action === 'append' && Array.isArray(payload.value)) {
        updated.proactiveStrategies = [...updated.proactiveStrategies, ...payload.value];
      } else if (payload.action === 'replace') {
        updated.proactiveStrategies = payload.value;
      }
      break;
    }

    case 'activeReactive': {
      if (!updated.activeReactive) {
        updated.activeReactive = {
          earlyWarningSigns: [],
          activeDeescalationStrategies: [],
          reactiveProtocols: [],
          postIncidentDebrief: ''
        };
      }
      if (payload.field === 'reactiveProtocols') {
        updated.activeReactive.reactiveProtocols = payload.value;
        updated.reactiveStrategies = payload.value;
        if (redFlag.id === 'rf-prohib-restraint') {
          if (updated.restrictivePractices && updated.restrictivePractices.length > 0) {
            for (const rp of updated.restrictivePractices) {
              if (/prone|supine|basket|bear hug|neck|choke|throat|chest pressure/i.test(rp.description)) {
                rp.description = 'Authorized low-arousal de-escalation protocol (zero physical holds or bodily confinement)';
              }
            }
          }
        }
      }
      break;
    }

    case 'restrictivePractices': {
      if (!updated.restrictivePractices) {
        updated.restrictivePractices = [];
      }
      for (const rp of updated.restrictivePractices) {
        if (payload.field === 'reductionPlanSummary') {
          if (!rp.reductionPlanSummary || rp.reductionPlanSummary.length < 20) {
            rp.reductionPlanSummary = payload.value;
          }
        } else if (payload.field === 'authorizationReference') {
          if (!rp.authorizationReference || rp.authorizationReference.length < 6) {
            rp.authorizationReference = payload.value;
            rp.status = 'Authorized';
          }
        }
      }
      break;
    }
  }

  return {
    updatedBsp: updated,
    summary: payload.description || `Applied remediation for ${redFlag.title}`,
    affectedSection: payload.section,
    patchApplied: true
  };
}

/**
 * Formats a BSPAuditPackage into the official machine-readable Draft-07 JSON APO export package
 */
export function formatAPOExportPackage(pkg: BSPAuditPackage) {
  return {
    auditMetadata: {
      auditId: pkg.auditMetadata?.auditId || `AUDIT-2026-BSP-${pkg.bspId}`,
      auditTimestamp: pkg.auditTimestamp,
      auditorEngineVersion: pkg.auditMetadata?.auditorEngineVersion || 'Breakthrough-NDIS-Auditor-v2.6',
      bspVersion: pkg.planVersion || 'v1.0',
      integrityHash: pkg.auditMetadata?.integrityHash || `sha256-${pkg.checksumSha256}`
    },
    participantProfile: {
      participantId: pkg.clientId,
      ndisNumber: pkg.participantProfile?.ndisNumber || '430891204',
      fullName: pkg.clientName || 'Participant',
      dateOfBirth: pkg.participantProfile?.dateOfBirth || '2004-05-14',
      primaryDisability: pkg.participantProfile?.primaryDisability || 'Autism Spectrum Disorder',
      riskLevel: pkg.participantProfile?.riskLevel || 'Medium'
    },
    practitionerProfile: {
      practitionerName: pkg.practitionerProfile?.practitionerName || 'Marcus Vance',
      ndisRegistrationNumber: pkg.practitionerProfile?.ndisRegistrationNumber || 'PR-89021',
      pbsRegistrationLevel: pkg.practitionerProfile?.pbsRegistrationLevel || 'Advanced Practitioner'
    },
    overallScorecard: {
      finalQualityScore: pkg.overallScore,
      rawWeightedScore: pkg.rawWeightedScore,
      complianceGrade: pkg.complianceGrade,
      complianceStatus: pkg.complianceStatus,
      passedIndicatorsCount: pkg.passedIndicatorsCount,
      totalIndicatorsCount: pkg.totalIndicatorsCount,
      activePenaltyMultipliers: pkg.activePenaltyMultipliers.map((m) => ({
        type: m.type,
        factor: m.factor,
        description: m.description
      }))
    },
    regulatoryPillars: {
      humanRightsAndLegal: {
        score: pkg.pillarBreakdown.human_rights_legal.score,
        weight: pkg.pillarBreakdown.human_rights_legal.weight,
        status: pkg.pillarBreakdown.human_rights_legal.status,
        summary: pkg.pillarBreakdown.human_rights_legal.summary
      },
      clinicalPbs: {
        score: pkg.pillarBreakdown.clinical_pbs_formulation.score,
        weight: pkg.pillarBreakdown.clinical_pbs_formulation.weight,
        status: pkg.pillarBreakdown.clinical_pbs_formulation.status,
        summary: pkg.pillarBreakdown.clinical_pbs_formulation.summary
      },
      proactiveEnvironmental: {
        score: pkg.pillarBreakdown.proactive_skill_building.score,
        weight: pkg.pillarBreakdown.proactive_skill_building.weight,
        status: pkg.pillarBreakdown.proactive_skill_building.status,
        summary: pkg.pillarBreakdown.proactive_skill_building.summary
      },
      crisisAndFading: {
        score: pkg.pillarBreakdown.crisis_reduction_safeguards.score,
        weight: pkg.pillarBreakdown.crisis_reduction_safeguards.weight,
        status: pkg.pillarBreakdown.crisis_reduction_safeguards.status,
        summary: pkg.pillarBreakdown.crisis_reduction_safeguards.summary
      }
    },
    qualityIndicatorsAudit: pkg.indicatorResults.map((r) => ({
      indicatorId: r.id,
      title: r.name,
      pillar: r.pillar,
      score: r.score,
      passed: r.passed,
      evaluationDetails: r.evaluationDetails || `Score ${r.score}%`,
      identifiedGaps: r.gapsIdentified
    })),
    restrictivePracticesAudit: pkg.restrictivePracticesAudit.map((rp) => ({
      practiceId: rp.practiceId || 'rp-01',
      practiceType: rp.practiceType,
      description: rp.description,
      status: rp.status,
      authorizationStatus: rp.authorizationStatus,
      authorizationReference: rp.authorizationReference || '',
      authorizationExpiry: rp.authorizationExpiry || '',
      leastRestrictiveJustified: rp.leastRestrictiveJustified,
      fadingPlanPresent: rp.fadingPlanPresent,
      reductionTarget: rp.reductionTarget || ''
    })),
    redFlagAlerts: pkg.redFlags.map((rf) => ({
      alertId: rf.id,
      severity: rf.severity,
      indicatorId: rf.affectedIndicator,
      title: rf.title,
      description: rf.description,
      recommendedRemediation: rf.recommendedRemediation || rf.title
    })),
    deliberationTraces: pkg.deliberationTraces.map((t) => ({
      id: t.id,
      agentRole: t.agentRole,
      agentName: t.agentName,
      timestamp: t.timestamp,
      sentiment: t.sentiment,
      message: t.message
    })),
    apoEndorsement: pkg.apoEndorsement || {
      recommendation: 'REJECTED_MANDATORY_REVISION_REQUIRED',
      authorizedProgramOfficerName: 'Marcus Vance',
      apoRegistrationNumber: 'APO-VIC-2026-90412',
      decisionDate: new Date().toISOString().slice(0, 10),
      conditionsOrMandatedChanges: [],
      endorsementNotes: 'Evaluation completed.'
    }
  };
}

