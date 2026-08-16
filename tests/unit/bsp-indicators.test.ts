import { evaluateIndicatorQI } from '../helpers/reference-evaluator.ts';
import {
  scenario1_CompliantBSP,
  emptyBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP
} from '../fixtures/sample-bsps.ts';
import {
  assert,
  assertEquals,
  assertGreaterThanOrEqual,
  assertLessThan,
  assertArrayContains,
  assertMatch
} from '../helpers/assertion-utils.ts';
import type { BSPDocument } from '../../types/index.ts';

export function runIndicatorsUnitTests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
  const tests: { name: string; status: 'pass' | 'fail'; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      passed++;
      tests.push({ name, status: 'pass' });
    } catch (err: any) {
      failed++;
      tests.push({ name, status: 'fail', error: err?.message || String(err) });
    }
  }

  // ==========================================
  // QI-01: Participant Profile & Person-Centred Context (5+ tests)
  // ==========================================
  test('QI-01: Happy path - fully documented profile awards high score', () => {
    const res = evaluateIndicatorQI('QI-01', scenario1_CompliantBSP);
    assertGreaterThanOrEqual(res.score, 90, 'QI-01 should score >=90 for complete profile');
    assertEquals(res.status, 'compliant');
    assertEquals(res.passed, true);
    assertGreaterThanOrEqual(res.evidenceFound.length, 3);
  });

  test('QI-01: Missing communication modality triggers gap and lowers score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      participantProfile: {
        ...scenario1_CompliantBSP.participantProfile!,
        communicationMode: ''
      }
    };
    const res = evaluateIndicatorQI('QI-01', bsp);
    assertLessThan(res.score, 80, 'Score should drop when communication modality is missing');
    assertArrayContains(res.gapsIdentified, (g) => g.toLowerCase().includes('communication'));
  });

  test('QI-01: Missing sensory preferences triggers sensory gap alert', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      participantProfile: {
        ...scenario1_CompliantBSP.participantProfile!,
        sensoryPreferences: []
      }
    };
    const res = evaluateIndicatorQI('QI-01', bsp);
    assertLessThan(res.score, 80);
    assertArrayContains(res.gapsIdentified, (g) => g.toLowerCase().includes('sensory'));
  });

  test('QI-01: Empty profile returns zero score and non-compliant status', () => {
    const res = evaluateIndicatorQI('QI-01', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
    assertEquals(res.passed, false);
    assert(res.remediationSuggestion !== undefined);
  });

  test('QI-01: Regulatory citations include NDIS Act 2013 and UN CRPD', () => {
    const res = evaluateIndicatorQI('QI-01', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Act 2013'));
    assertArrayContains(res.citedRegulations, (c) => c.includes('UN CRPD'));
  });

  // ==========================================
  // QI-02: Consultation & Multi-Agency Collaboration (5+ tests)
  // ==========================================
  test('QI-02: Documented consultation records with consent award 100%', () => {
    const res = evaluateIndicatorQI('QI-02', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertArrayContains(res.evidenceFound, (e) => e.includes('consent formally verified'));
  });

  test('QI-02: Consultation logged without consent reduces score', () => {
    const bsp = {
      ...scenario1_CompliantBSP,
      consultationRecords: [
        {
          consultationDate: '2026-07-20',
          stakeholderRole: 'Support Coordinator',
          modality: 'Email',
          consentDocumented: false,
          notes: 'Discussed plan'
        }
      ]
    };
    const res = evaluateIndicatorQI('QI-02', bsp as any);
    assertEquals(res.score, 50);
    assertEquals(res.status, 'warning');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('consent'));
  });

  test('QI-02: Profile decision preferences without formal records gives partial score', () => {
    const bsp = {
      ...scenario1_CompliantBSP,
      consultationRecords: undefined
    };
    const res = evaluateIndicatorQI('QI-02', bsp as any);
    assertEquals(res.score, 40);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-02: Empty plan gives zero score and non-compliant status', () => {
    const res = evaluateIndicatorQI('QI-02', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Zero record of participant'));
  });

  test('QI-02: Cites NDIS Rules 2018 Part 2 s10', () => {
    const res = evaluateIndicatorQI('QI-02', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Rules 2018 Part 2 s10'));
  });

  // ==========================================
  // QI-03: Operational Definitions of Target Behaviours (5+ tests)
  // ==========================================
  test('QI-03: Objective motor definitions with metrics achieve 100%', () => {
    const res = evaluateIndicatorQI('QI-03', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertArrayContains(res.evidenceFound, (e) => e.includes('Objective operational definitions'));
  });

  test('QI-03: Subjective definitions without observable criteria drop score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        ...scenario1_CompliantBSP.functionalAssessment!,
        targetBehaviors: [
          {
            behavior: 'Acting up',
            operationalDefinition: 'Being difficult',
            severity: 3,
            frequency: 'often'
          }
        ]
      }
    };
    const res = evaluateIndicatorQI('QI-03', bsp);
    assertLessThan(res.score, 60);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('subjective terminology'));
  });

  test('QI-03: Missing baseline frequency/severity reduces score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        ...scenario1_CompliantBSP.functionalAssessment!,
        targetBehaviors: [
          {
            behavior: 'Acoustic overload',
            operationalDefinition: 'Participant places hands over both ears and paces rapidly (>1.5 m/s).',
            severity: 0 as any,
            frequency: ''
          }
        ]
      }
    };
    const res = evaluateIndicatorQI('QI-03', bsp);
    assertEquals(res.score, 60);
  });

  test('QI-03: Empty target behaviours fall back to summary with lower score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        ...scenario1_CompliantBSP.functionalAssessment!,
        targetBehaviors: []
      }
    };
    const res = evaluateIndicatorQI('QI-03', bsp);
    assertEquals(res.score, 30);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-03: Cites NDIS PBS Capability Framework Standard 2.1', () => {
    const res = evaluateIndicatorQI('QI-03', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('PBS Capability Framework Standard 2.1'));
  });

  // ==========================================
  // QI-04: Functional Behaviour Assessment (FBA) & Hypothesis (5+ tests)
  // ==========================================
  test('QI-04: Robust 4-function hypothesis with setting events awards 100%', () => {
    const res = evaluateIndicatorQI('QI-04', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertArrayContains(res.evidenceFound, (e) => e.includes('Explicit functional hypothesis'));
  });

  test('QI-04: Empty hypothesis (<30 chars) triggers major penalty', () => {
    const res = evaluateIndicatorQI('QI-04', scenario3_IncompleteHypothesisBSP);
    assertLessThan(res.score, 30);
    assertEquals(res.status, 'non_compliant');
    assertArrayContains(res.gapsIdentified, (g) => g.toLowerCase().includes('hypothesis'));
  });

  test('QI-04: Hypothesis without functional taxonomy (Escape/Tangible/Sensory/Attention) loses points', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        ...scenario1_CompliantBSP.functionalAssessment!,
        functionalHypothesis: 'Jordan gets frustrated during busy days because of many things happening.'
      }
    };
    const res = evaluateIndicatorQI('QI-04', bsp);
    assertLessThan(res.score, 90);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('4-function taxonomy'));
  });

  test('QI-04: Missing setting events and triggers lowers score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        targetBehaviors: scenario1_CompliantBSP.functionalAssessment!.targetBehaviors,
        settingEvents: [],
        immediateTriggers: [],
        maintainingConsequences: [],
        functionalHypothesis: 'Jordan engages in agitation to ESCAPE loud sensory overload.'
      }
    };
    const res = evaluateIndicatorQI('QI-04', bsp);
    assertEquals(res.score, 60);
    assertEquals(res.status, 'warning');
  });

  test('QI-04: Weight is 10% and pillarWeight is 0.45', () => {
    const res = evaluateIndicatorQI('QI-04', scenario1_CompliantBSP);
    assertEquals(res.weight, 0.10);
    assertEquals(res.pillarWeight, 0.45);
    assertEquals(res.pillar, 'clinical_pbs_formulation');
  });

  // ==========================================
  // QI-05: Proactive Environmental & Ecological Accommodations (5+ tests)
  // ==========================================
  test('QI-05: 4 proactive adaptations with sensory adjustments scores 100%', () => {
    const res = evaluateIndicatorQI('QI-05', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertGreaterThanOrEqual(res.evidenceFound.length, 2);
  });

  test('QI-05: Exactly 3 proactive adaptations scores 100% when sensory/predictability present', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      proactiveStrategies: [
        'Visual schedule countdown board',
        'Noise-cancelling headphones',
        'Scheduled quiet breaks'
      ]
    };
    const res = evaluateIndicatorQI('QI-05', bsp);
    assertEquals(res.score, 100);
  });

  test('QI-05: Fewer than 3 proactive adaptations gives partial score', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      proactiveStrategies: ['Staff reminders']
    };
    const res = evaluateIndicatorQI('QI-05', bsp);
    assertEquals(res.score, 20);
    assertEquals(res.status, 'non_compliant');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Fewer than 3 proactive adaptations'));
  });

  test('QI-05: Zero proactive strategies scores 0% with reactive reliance gap', () => {
    const res = evaluateIndicatorQI('QI-05', emptyBSP);
    assertEquals(res.score, 0);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('high reliance on reactive management'));
  });

  test('QI-05: Proactive without sensory or predictability words gets partial deduction', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      proactiveStrategies: [
        'Ensure staff know rules',
        'Review handbook daily',
        'Keep clipboard ready'
      ]
    };
    const res = evaluateIndicatorQI('QI-05', bsp);
    assertEquals(res.score, 80);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('sensory accommodation'));
  });

  // ==========================================
  // QI-06: Skill Teaching & Functional Replacement Behaviours (5+ tests)
  // ==========================================
  test('QI-06: FCT protocol, replacement behaviours, and FR1 schedule awards 100%', () => {
    const res = evaluateIndicatorQI('QI-06', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertGreaterThanOrEqual(res.evidenceFound.length, 3);
  });

  test('QI-06: Missing FCT protocol deducts 15 points', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      skillTeaching: {
        ...scenario1_CompliantBSP.skillTeaching!,
        functionalCommunicationTraining: ''
      }
    };
    const res = evaluateIndicatorQI('QI-06', bsp);
    assertEquals(res.score, 85);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Missing explicit FCT protocol'));
  });

  test('QI-06: Missing reinforcement schedule deducts 15 points', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      skillTeaching: {
        ...scenario1_CompliantBSP.skillTeaching!,
        reinforcementSchedule: ''
      }
    };
    const res = evaluateIndicatorQI('QI-06', bsp);
    assertEquals(res.score, 85);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Missing differential reinforcement schedule'));
  });

  test('QI-06: Zero replacement behaviours returns non-compliant score', () => {
    const res = evaluateIndicatorQI('QI-06', scenario3_IncompleteHypothesisBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
    assert(res.remediationSuggestion !== undefined);
  });

  test('QI-06: Replacement behaviours without teaching methodology loses points', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      skillTeaching: {
        ...scenario1_CompliantBSP.skillTeaching!,
        replacementBehaviors: [
          {
            target: 'Agitation',
            replacement: 'Ask for break',
            teachingMethod: ''
          }
        ]
      }
    };
    const res = evaluateIndicatorQI('QI-06', bsp);
    assertEquals(res.score, 70);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('lack systematic teaching method'));
  });

  // ==========================================
  // QI-07: Early Warning Signs & Active De-escalation (5+ tests)
  // ==========================================
  test('QI-07: 4 early precursor signs and 4 de-escalation actions scores 100%', () => {
    const res = evaluateIndicatorQI('QI-07', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
  });

  test('QI-07: Only 1 early warning sign scores 75%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        earlyWarningSigns: ['Fidgeting']
      }
    };
    const res = evaluateIndicatorQI('QI-07', bsp);
    assertEquals(res.score, 75);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Only 1 early precursor sign'));
  });

  test('QI-07: Zero early warning signs drops score to 50%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        earlyWarningSigns: []
      }
    };
    const res = evaluateIndicatorQI('QI-07', bsp);
    assertEquals(res.score, 50);
    assertEquals(res.status, 'warning');
  });

  test('QI-07: Empty activeReactive returns 0%', () => {
    const res = evaluateIndicatorQI('QI-07', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-07: Mapped to proactive_skill_building pillar with 0.50 pillarWeight', () => {
    const res = evaluateIndicatorQI('QI-07', scenario1_CompliantBSP);
    assertEquals(res.pillar, 'proactive_skill_building');
    assertEquals(res.pillarWeight, 0.50);
  });

  // ==========================================
  // QI-08: Crisis Management & Reactive Response Protocols (5+ tests)
  // ==========================================
  test('QI-08: Graded 3-phase protocol with >=20min recovery scores 100%', () => {
    const res = evaluateIndicatorQI('QI-08', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
  });

  test('QI-08: Reactive protocol without post-peak recovery period scores 70%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        reactiveProtocols: [
          'Phase 1: Step back',
          'Phase 2: Remove bystanders'
        ]
      }
    };
    const res = evaluateIndicatorQI('QI-08', bsp);
    assertEquals(res.score, 70);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('recovery period'));
  });

  test('QI-08: Reactive protocol without phases scores 70%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        reactiveProtocols: [
          'Give water and wait 20 minutes for recovery.'
        ]
      }
    };
    const res = evaluateIndicatorQI('QI-08', bsp);
    assertEquals(res.score, 70);
  });

  test('QI-08: Empty reactive protocols scores 0%', () => {
    const res = evaluateIndicatorQI('QI-08', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-08: Cites NDIS Rules 2018 Part 3 s21', () => {
    const res = evaluateIndicatorQI('QI-08', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Rules 2018 Part 3 s21'));
  });

  // ==========================================
  // QI-09: Restrictive Practices Justification & Least Restrictive Test (5+ tests)
  // ==========================================
  test('QI-09: All restrictive practices authorized with justifications score 100%', () => {
    const res = evaluateIndicatorQI('QI-09', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
  });

  test('QI-09: Plan with zero restrictive practices automatically scores 100%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: []
    };
    const res = evaluateIndicatorQI('QI-09', bsp);
    assertEquals(res.score, 100);
    assertArrayContains(res.evidenceFound, (e) => e.includes('zero restrictive practices reported'));
  });

  test('QI-09: 1 of 2 practices lacking state authorization drops score to 75%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        scenario1_CompliantBSP.restrictivePractices[0],
        {
          ...scenario1_CompliantBSP.restrictivePractices[1],
          authorizationReference: '' // Unverified
        }
      ]
    };
    const res = evaluateIndicatorQI('QI-09', bsp);
    assertEquals(res.score, 75);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('lack verified State authorization'));
  });

  test('QI-09: All practices lacking authorization and justification score 0%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          id: 'rp-unauth-01',
          clientId: 'cli-101',
          clientName: 'Jordan',
          practiceType: 'Chemical',
          description: '',
          status: 'Active',
          authorizationBody: '',
          authorizationReference: '',
          startDate: '',
          expiryDate: '',
          reductionPlanSummary: '',
          monthlyReportStatus: 'Due'
        }
      ]
    };
    const res = evaluateIndicatorQI('QI-09', bsp);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-09: Weight is 12% with pillarWeight 0.50 under human_rights_legal', () => {
    const res = evaluateIndicatorQI('QI-09', scenario1_CompliantBSP);
    assertEquals(res.weight, 0.12);
    assertEquals(res.pillarWeight, 0.50);
    assertEquals(res.pillar, 'human_rights_legal');
  });

  // ==========================================
  // QI-10: Reduction & Fade-Out Schedule (5+ tests)
  // ==========================================
  test('QI-10: All restrictive practices having reduction plans scores 100%', () => {
    const res = evaluateIndicatorQI('QI-10', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
  });

  test('QI-10: Zero restrictive practices in plan awards 100%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: []
    };
    const res = evaluateIndicatorQI('QI-10', bsp);
    assertEquals(res.score, 100);
  });

  test('QI-10: 2 practices with zero fade plans scores 0%', () => {
    const res = evaluateIndicatorQI('QI-10', scenario4_MissingFadeOutScheduleBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('open-ended perpetual restriction'));
  });

  test('QI-10: 1 of 2 practices with fade plan scores 50%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        scenario1_CompliantBSP.restrictivePractices[0],
        {
          ...scenario1_CompliantBSP.restrictivePractices[1],
          reductionPlanSummary: ''
        }
      ]
    };
    const res = evaluateIndicatorQI('QI-10', bsp);
    assertEquals(res.score, 50);
    assertEquals(res.status, 'warning');
  });

  test('QI-10: Cites NDIS Rules 2018 Part 2 s11', () => {
    const res = evaluateIndicatorQI('QI-10', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Rules 2018 Part 2 s11'));
  });

  // ==========================================
  // QI-11: Post-Incident Debriefing & Trauma-Informed Review (5+ tests)
  // ==========================================
  test('QI-11: Trauma-informed debriefing protocol scores 100%', () => {
    const res = evaluateIndicatorQI('QI-11', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertArrayContains(res.evidenceFound, (e) => e.includes('trauma-informed'));
  });

  test('QI-11: Debriefing without trauma-informed language scores 70%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        postIncidentDebrief: 'Staff fill incident report within 24 hours.'
      }
    };
    const res = evaluateIndicatorQI('QI-11', bsp);
    assertEquals(res.score, 70);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('lacks trauma-informed'));
  });

  test('QI-11: Empty postIncidentDebrief scores 0%', () => {
    const res = evaluateIndicatorQI('QI-11', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Missing post-incident debriefing'));
  });

  test('QI-11: Short summary (<20 chars) triggers gap and scores 0%', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        postIncidentDebrief: 'Fill form'
      }
    };
    const res = evaluateIndicatorQI('QI-11', bsp);
    assertEquals(res.score, 0);
  });

  test('QI-11: Cites NDIS Incident Management Rules 2018', () => {
    const res = evaluateIndicatorQI('QI-11', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Incident Management'));
  });

  // ==========================================
  // QI-12: Implementation, Staff Training & Governance Schedule (5+ tests)
  // ==========================================
  test('QI-12: Complete governance schedule with training curriculum scores 100%', () => {
    const res = evaluateIndicatorQI('QI-12', scenario1_CompliantBSP);
    assertEquals(res.score, 100);
    assertEquals(res.status, 'compliant');
    assertArrayContains(res.evidenceFound, (e) => e.includes('Competency-based staff training'));
  });

  test('QI-12: Review date and author present without formal curriculum scores 60%', () => {
    const bsp = {
      ...scenario1_CompliantBSP,
      governanceSchedule: undefined
    };
    const res = evaluateIndicatorQI('QI-12', bsp as any);
    assertEquals(res.score, 60);
    assertEquals(res.status, 'warning');
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Missing detailed staff training curriculum'));
  });

  test('QI-12: Governance schedule missing training curriculum scores 60%', () => {
    const bsp = {
      ...scenario1_CompliantBSP,
      governanceSchedule: {
        trainingCurriculum: '',
        annualReviewDueDate: '2027-08-01',
        leadPractitionerName: 'Marcus Vance'
      }
    };
    const res = evaluateIndicatorQI('QI-12', bsp as any);
    assertEquals(res.score, 60);
    assertArrayContains(res.gapsIdentified, (g) => g.includes('Missing staff competency training curriculum'));
  });

  test('QI-12: Empty plan returns 0%', () => {
    const res = evaluateIndicatorQI('QI-12', emptyBSP);
    assertEquals(res.score, 0);
    assertEquals(res.status, 'non_compliant');
  });

  test('QI-12: Cites NDIS Rules 2018 Part 4 s23', () => {
    const res = evaluateIndicatorQI('QI-12', scenario1_CompliantBSP);
    assertArrayContains(res.citedRegulations, (c) => c.includes('NDIS Rules 2018 Part 4 s23'));
  });

  return { suiteName: 'NDIS 12 Quality Indicators Unit Tests', passed, failed, tests };
}
