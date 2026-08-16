/**
 * CHALLENGER 1: Standalone Adversarial Verification Harness
 * Focus: Multi-Agent Evaluation Engine & Regulatory Rules
 * 
 * Tests:
 * 1. Prohibited Restraint Detection & Score Zeroing (Rule 8)
 * 2. Multiplier Penalties (M_unauth, M_nofade, M_nohypo) & Stacking
 * 3. Regulatory Pillars & Mathematical Formula Invariants
 * 4. Boundary & Grade Threshold Strictness
 * 5. Malformed, Empty, Massive (50k+ chars), XSS, SQLi, and Unicode Payloads
 * 6. 1-Click Remediation State Recovery & Idempotency
 * 7. APO Exporter Draft-07 Schema & SHA-256 Cryptographic Tamper Detection
 */

import { evaluateBSPDocument } from '../lib/bsp-auditor/agent-evaluator.ts';
import { auditRestrictivePractices, evaluateAllIndicators, NDIS_QUALITY_INDICATOR_DEFINITIONS } from '../lib/bsp-auditor/indicators.ts';
import { applyRemediationPatch, applyAllRemediations, generateRemediationForIndicator } from '../lib/bsp-auditor/remediation-engine.ts';
import { generateAuditJsonPackage, validateAuditPackageIntegrity, formatAPOScorecardMarkdown, calculateSha256Checksum } from '../lib/bsp-auditor/apo-exporter.ts';
import { BSPDocument, RestrictivePractice } from '../types/bsp-audit.ts';

interface TestCaseResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
  durationMs: number;
}

const testResults: TestCaseResult[] = [];

function runTest(category: string, name: string, fn: () => void | Promise<void>) {
  const start = performance.now();
  try {
    const res = fn();
    if (res instanceof Promise) {
      throw new Error(`Test ${name} is async, use runTestAsync instead`);
    }
    const durationMs = Math.round(performance.now() - start);
    testResults.push({ category, name, passed: true, durationMs });
    console.log(`  ✔ [PASS] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    testResults.push({ category, name, passed: false, details: err.message, durationMs });
    console.error(`  ✖ [FAIL] ${name}: ${err.message}`);
  }
}

async function runTestAsync(category: string, name: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    testResults.push({ category, name, passed: true, durationMs });
    console.log(`  ✔ [PASS] ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - start);
    testResults.push({ category, name, passed: false, details: err.message, durationMs });
    console.error(`  ✖ [FAIL] ${name}: ${err.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion Failed: ${message} (Expected: ${expected}, Actual: ${actual})`);
  }
}

function createBaseCompliantBSP(): BSPDocument {
  return {
    id: 'adv-base-001',
    clientId: 'cli-adv-001',
    clientName: 'Jordan Taylor',
    version: 'v2.1',
    status: 'Approved',
    authorName: 'Dr. Sarah Jenkins (Senior PBS Practitioner)',
    createdDate: '2026-01-15',
    lastUpdated: '2026-06-01',
    reviewDate: '2027-01-15',
    summary: 'Comprehensive Positive Behaviour Support Plan for Jordan Taylor with proactive environmental supports and least-restrictive practices.',
    participantProfile: {
      communicationMode: 'Multimodal: Uses spoken phrases and AAC tablet application with visual symbols.',
      sensoryPreferences: ['Deep pressure input', 'Noise-cancelling headphones', 'Low-light quiet room'],
      strengthsAndInterests: ['Digital art', 'Puzzles', 'Swimming'],
      medicalHealthFactors: 'Asthma (managed with inhaler); no seizure history; lactose intolerance.',
      decisionMakingPreferences: 'Visual 2-option choice boards with processing time.'
    },
    consultationRecords: [
      {
        date: '2026-01-10',
        attendeeRoles: ['Participant', 'Nominee (Mother)', 'Lead Practitioner', 'Occupational Therapist'],
        participantInvolvementModality: 'Supported engagement using AAC communication board and visual choices.',
        nomineeConsentVerified: true,
        notes: 'Full agreement on proactive adaptations and fading schedule.'
      }
    ],
    primaryBehaviorsOfConcern: [
      'Physical agitation and task avoidance during high-noise sensory overload (>75dB)'
    ],
    functionalAssessment: {
      targetBehaviors: [
        {
          name: 'Physical agitation',
          operationalDefinition: 'Forceful pushing of chairs or desks accompanied by loud vocal protests when overstimulated.',
          severity: 3,
          frequency: '2-3 times per week during noisy transitions'
        }
      ],
      functionalHypothesis: 'When exposed to loud unpredictable noise spikes (>75dB) in crowded environments, Jordan engages in physical agitation primarily to ESCAPE auditory overstimulation, maintained by removal from the noisy room.',
      immediateTriggers: ['Sudden alarms', 'Loud school cafeteria noise'],
      settingEvents: ['Poor sleep (<6 hours)', 'Sensory fatigue'],
      maintainingConsequences: ['Temporary removal from classroom to quiet space'],
      hypothesizedFunctions: ['Escape/Avoidance', 'Sensory/Automatic']
    },
    proactiveStrategies: [
      'Visual schedule countdown board updated 10 minutes before transitions.',
      'Scheduled 10-minute quiet sensory decompression breaks every 45 minutes.',
      'Noise-cancelling over-ear headphones readily accessible in all public spaces.',
      'Predictable 2-choice forced option boards to foster personal autonomy.'
    ],
    skillTeaching: {
      replacementBehaviors: [
        {
          target: 'Physical agitation during noise spikes',
          replacement: 'Independently accessing noise-cancelling headphones or tapping "Need Quiet" AAC symbol.',
          teachingMethod: 'Functional Communication Training (FCT) with errorless roleplay twice weekly.',
          functionalEquivalence: 'Escape/Sensory regulation'
        }
      ],
      functionalCommunicationTraining: 'Teach AAC requests for "Break" and "Too Loud" with 100% immediate reinforcement.',
      reinforcementSchedule: 'Continuous reinforcement (FR1) for independent break requests.'
    },
    activeReactive: {
      earlyWarningSigns: ['Fidgeting with clothing', 'Elevated breathing rate (>22/min)', 'Soft vocal humming', 'Gazing at lights'],
      activeDeescalationStrategies: [
        'Validate sensory state calmly in low whisper',
        'Offer weighted lap pad without verbal demands',
        'Dim ambient lighting by 50%',
        'Present visual break card'
      ],
      reactiveProtocols: [
        'Phase 1 (Agitation): Ensure 2-metre physical buffer. No verbal demands.',
        'Phase 2 (Escalation): Calmly guide bystanders to adjacent area. Clear exit routes.',
        'Phase 3 (Peak): Adopt open side-stance; redirect with soft boundary if impact imminent. Max 3-min cap.',
        'Phase 4 (Recovery): Offer water. Do NOT debrief or place demands for minimum 20 minutes post-baseline.'
      ],
      postIncidentDebrief: 'Conduct 2-stage debriefing: 1) Participant emotional check-in after return to calm baseline (>20 mins). 2) Staff debriefing and ABC data review within 24-48 hours.'
    },
    restrictivePractices: [
      {
        id: 'rp-chem-01',
        practiceType: 'Chemical',
        description: 'PRN Risperidone 0.5mg prescribed strictly for severe acute behavioral agitation with imminent risk of physical harm.',
        clinicalRationale: 'Prescribed as exceptional last-resort safety measure after exhaustion of proactive sensory accommodations.',
        authorizationBody: 'VIC Senior Practitioner',
        authorizationReference: 'RPR-2026-VIC-48921',
        status: 'Authorized',
        startDate: '2026-01-15',
        expiryDate: '2027-01-15',
        reductionPlanSummary: 'Stage 1: Track baseline PRN administrations. Stage 2: Introduce FCT break card to reduce PRN usage by 50% over 6 months. Stage 3: Complete cessation trial with psychiatrist review at 12 months.',
        monthlyReportStatus: 'Submitted'
      }
    ],
    staffTrainingAndGovernance: {
      curriculumSummary: 'Comprehensive staff training on FCT protocols, low-arousal de-escalation, sensory adjustments, and ABC incident logging.',
      apoSubmissionDate: '2026-01-20',
      annualReviewDueDate: '2027-01-15',
      leadPractitionerName: 'Dr. Sarah Jenkins (Senior PBS Practitioner)',
      monitoringFrequency: 'Monthly clinical supervision and quarterly restrictive practice audit.'
    }
  };
}

async function main() {
  console.log('================================================================================');
  console.log('         CHALLENGER 1: ADVERSARIAL VERIFICATION & STRESS TEST HARNESS           ');
  console.log('================================================================================\n');

  // ---------------------------------------------------------------------------
  // SUITE 1: PROHIBITED RESTRAINT DETECTION & HARD ZEROING (NDIS RULE 8)
  // ---------------------------------------------------------------------------
  console.log('--- SUITE 1: PROHIBITED RESTRAINT DETECTION & HARD ZEROING ---');

  const prohibitedPhrases = [
    { type: 'prone', phrase: 'Staff apply prone restraint on floor until calm' },
    { type: 'prone', phrase: 'Participant placed face down on carpet with physical hold' },
    { type: 'prone', phrase: 'Immediate face-down physical hold executed by two carers' },
    { type: 'supine', phrase: 'Participant placed in supine hold on floor mat' },
    { type: 'supine', phrase: 'Staff hold participant face up on bed to prevent escape' },
    { type: 'supine', phrase: 'Face-up pinning of limbs during peak agitation' },
    { type: 'neck', phrase: 'Staff apply neck hold to secure participant head' },
    { type: 'neck', phrase: 'Carer uses choke hold to stop aggressive biting' },
    { type: 'neck', phrase: 'Throat hold utilized as emergency defensive measure' },
    { type: 'diaphragm', phrase: 'Staff execute basket hold wrapping arms around chest' },
    { type: 'diaphragm', phrase: 'Bear hug physical containment with continuous chest pressure' },
    { type: 'diaphragm', phrase: 'Direct chest pressure applied to restrain participant on sofa' }
  ];

  for (const item of prohibitedPhrases) {
    await runTestAsync('Prohibited Holds', `Prohibited hold detection: "${item.phrase}" drops score to 0%`, async () => {
      const bsp = createBaseCompliantBSP();
      bsp.reactiveStrategies = [item.phrase];
      if (bsp.activeReactive) {
        bsp.activeReactive.reactiveProtocols = [item.phrase];
      }

      const audit = await evaluateBSPDocument(bsp);
      assertEqual(audit.overallScore, 0, 'Overall score must be hard-zeroed (0%)');
      assertEqual(audit.complianceGrade, 'Grade F', 'Compliance grade must be Grade F');
      assertEqual(audit.rating, 'Non-Compliant - Red Flags Detected', 'Rating must be Non-Compliant');
      assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, true, 'Prohibited detected must be true');
      assertEqual(audit.apoEndorsementReady, false, 'APO endorsement must be blocked');
      assertEqual(audit.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED', 'APO recommendation must be REJECTED');

      const mProhib = audit.activePenaltyMultipliers.find(m => m.type === 'M_prohib');
      assert(Boolean(mProhib), 'M_prohib penalty multiplier must be present');
      assertEqual(mProhib?.factor, 0.0, 'M_prohib factor must be 0.0');

      const redFlag = audit.redFlags.find(rf => rf.id === 'rf-prohib-01');
      assert(Boolean(redFlag), 'rf-prohib-01 critical red flag must be present');
      assertEqual(redFlag?.severity, 'critical', 'Red flag severity must be critical');
    });
  }

  // Test prohibited holds in different fields (summary, restrictive practice description, primaryBehaviors)
  await runTestAsync('Prohibited Holds', 'Prohibited hold in BSP Summary field zeroes score', async () => {
    const bsp = createBaseCompliantBSP();
    bsp.summary = 'Emergency protocol allows prone hold when physical danger is imminent.';
    const audit = await evaluateBSPDocument(bsp);
    assertEqual(audit.overallScore, 0, 'Summary prone hold must zero overall score');
    assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, true, 'prohibitedDetected must be true');
  });

  await runTestAsync('Prohibited Holds', 'Prohibited hold in RestrictivePractice description zeroes score', async () => {
    const bsp = createBaseCompliantBSP();
    bsp.restrictivePractices = [
      {
        id: 'rp-phys-01',
        practiceType: 'Physical',
        description: 'Supine floor hold for 5 minutes during meltdown',
        clinicalRationale: 'Emergency safety',
        authorizationReference: 'RPR-2026-VIC-11111',
        status: 'Authorized',
        reductionPlanSummary: 'Fading to zero in 6 months'
      }
    ];
    const audit = await evaluateBSPDocument(bsp);
    assertEqual(audit.overallScore, 0, 'RP description supine hold must zero overall score');
    assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, true, 'prohibitedDetected must be true');
  });

  // Negation & False-Positive Immunity
  const negationPhrases = [
    'Staff must NEVER use prone hold or floor restraint under any circumstances.',
    'Strictly avoid supine hold and any floor pinning.',
    'Zero tolerance for neck hold or physical choking.',
    'Prohibit any basket hold or chest pressure.',
    'All crisis responses conducted without prone restraint or aversive touch.',
    'No choke hold or throat contact permitted.'
  ];

  for (const phrase of negationPhrases) {
    await runTestAsync('Prohibited Holds Negation', `Negation resistance: "${phrase.slice(0, 40)}..." does not false-positive`, async () => {
      const bsp = createBaseCompliantBSP();
      bsp.reactiveStrategies = [phrase];
      if (bsp.activeReactive) {
        bsp.activeReactive.reactiveProtocols = [phrase];
      }

      const audit = await evaluateBSPDocument(bsp);
      assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, false, 'Negated prohibited hold must NOT trigger prohibitedDetected');
      assert(audit.overallScore >= 80, `Compliant plan with negation must score >= 80% (Actual: ${audit.overallScore}%)`);
    });
  }

  // ---------------------------------------------------------------------------
  // SUITE 2: MULTIPLIER PENALTIES, CAPS & STACKING
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 2: MULTIPLIER PENALTIES & STACKING ---');

  await runTestAsync('Multipliers', 'M_unauth (0.60): Unauthorized restrictive practice caps score at <= 60%', async () => {
    const bsp = createBaseCompliantBSP();
    bsp.restrictivePractices = [
      {
        id: 'rp-unauth-01',
        practiceType: 'Environmental',
        description: 'Locked kitchen pantry to restrict food access',
        clinicalRationale: 'Prevents binge eating',
        authorizationReference: '', // Missing authorization reference
        status: 'Draft',
        reductionPlanSummary: 'Graduated unlock schedule over 6 months'
      }
    ];

    const audit = await evaluateBSPDocument(bsp);
    assert(audit.overallScore <= 60, `Unauthorized practice must cap score at <= 60% (Actual: ${audit.overallScore}%)`);
    assertEqual(audit.apoEndorsementReady, false, 'Unauthorized practice must block APO endorsement');
    assertEqual(audit.rating, 'Non-Compliant - Red Flags Detected', 'Rating must be Non-Compliant');
    const mUnauth = audit.activePenaltyMultipliers.find(m => m.type === 'M_unauth');
    assert(Boolean(mUnauth), 'M_unauth penalty multiplier must be present');
    assertEqual(mUnauth?.factor, 0.60, 'M_unauth factor must be 0.60');
    const rf = audit.redFlags.find(r => r.id === 'rf-unauth-01');
    assert(Boolean(rf), 'rf-unauth-01 red flag must be present');
  });

  await runTestAsync('Multipliers', 'M_nofade (0.75): Missing fade-out schedule penalizes score and creates red flag', async () => {
    const bsp = createBaseCompliantBSP();
    bsp.restrictivePractices = [
      {
        id: 'rp-nofade-01',
        practiceType: 'Chemical',
        description: 'Routine Haloperidol 2mg daily',
        clinicalRationale: 'Controls severe aggression',
        authorizationReference: 'RPR-2026-NSW-99120',
        status: 'Authorized',
        reductionPlanSummary: 'None' // Missing fading schedule (<25 chars, 'None')
      }
    ];

    const audit = await evaluateBSPDocument(bsp);
    const mNofade = audit.activePenaltyMultipliers.find(m => m.type === 'M_nofade');
    assert(Boolean(mNofade), 'M_nofade penalty multiplier must be present');
    assertEqual(mNofade?.factor, 0.75, 'M_nofade factor must be 0.75');
    const rf = audit.redFlags.find(r => r.id === 'rf-nofade-01');
    assert(Boolean(rf), 'rf-nofade-01 red flag must be present');
    assertEqual(rf?.severity, 'high', 'Severity must be high');
  });

  await runTestAsync('Multipliers', 'M_nohypo (0.80): Incomplete FBA hypothesis penalizes score and creates red flag', async () => {
    const bsp = createBaseCompliantBSP();
    bsp.functionalAssessment = {
      targetBehaviors: [],
      functionalHypothesis: 'Aggression happens randomly.', // <35 chars, no function
      immediateTriggers: [],
      settingEvents: [],
      maintainingConsequences: []
    };

    const audit = await evaluateBSPDocument(bsp);
    const mNohypo = audit.activePenaltyMultipliers.find(m => m.type === 'M_nohypo');
    assert(Boolean(mNohypo), 'M_nohypo penalty multiplier must be present');
    assertEqual(mNohypo?.factor, 0.80, 'M_nohypo factor must be 0.80');
    const rf = audit.redFlags.find(r => r.id === 'rf-fba-01');
    assert(Boolean(rf), 'rf-fba-01 red flag must be present');
  });

  await runTestAsync('Multipliers', 'Compound Multipliers: M_unauth (0.60) * M_nofade (0.75) * M_nohypo (0.80) = 0.36', async () => {
    const bsp = createBaseCompliantBSP();
    // 1. Unauthorized RP + Missing fade-out
    bsp.restrictivePractices = [
      {
        id: 'rp-bad-01',
        practiceType: 'Mechanical',
        description: 'Seatbelt buckle guard in transport vehicle',
        clinicalRationale: 'Prevents unbuckling while driving',
        authorizationReference: '', // Unauthorized
        status: 'Draft',
        reductionPlanSummary: 'N/A' // No fading
      }
    ];
    // 2. Missing FBA hypothesis
    bsp.functionalAssessment = {
      targetBehaviors: [],
      functionalHypothesis: '',
      immediateTriggers: [],
      settingEvents: [],
      maintainingConsequences: []
    };

    const audit = await evaluateBSPDocument(bsp);
    assertEqual(audit.activePenaltyMultipliers.length, 3, 'Must have exactly 3 penalty multipliers');
    assert(audit.activePenaltyMultipliers.some(m => m.type === 'M_unauth'), 'Must include M_unauth');
    assert(audit.activePenaltyMultipliers.some(m => m.type === 'M_nofade'), 'Must include M_nofade');
    assert(audit.activePenaltyMultipliers.some(m => m.type === 'M_nohypo'), 'Must include M_nohypo');

    // Expected multiplier: 0.60 * 0.75 * 0.80 = 0.36
    const expectedScore = Math.min(60, Math.round(audit.rawWeightedScore * 0.36));
    assertEqual(audit.overallScore, expectedScore, `Overall score must match compound multiplier calculation (Expected: ${expectedScore}, Actual: ${audit.overallScore})`);
    assert(audit.overallScore <= 40, `Compound penalties must drive score down (Actual: ${audit.overallScore}%)`);
  });

  // ---------------------------------------------------------------------------
  // SUITE 3: REGULATORY PILLARS & MATHEMATICAL INVARIANTS
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 3: REGULATORY PILLARS & MATHEMATICAL INVARIANTS ---');

  await runTestAsync('Pillars', 'Mathematical Invariant: 4 Pillar calculations match exact weights', async () => {
    const bsp = createBaseCompliantBSP();
    const audit = await evaluateBSPDocument(bsp);

    const indicatorMap = new Map(audit.indicatorResults.map(i => [i.id, i.score]));
    const getScore = (id: any) => indicatorMap.get(id) || 0;

    const expectedP1 = Math.round(0.25 * getScore('QI-01') + 0.25 * getScore('QI-02') + 0.50 * getScore('QI-09'));
    const expectedP2 = Math.round(0.25 * getScore('QI-03') + 0.45 * getScore('QI-04') + 0.30 * getScore('QI-06'));
    const expectedP3 = Math.round(0.50 * getScore('QI-05') + 0.50 * getScore('QI-07'));
    const expectedP4 = Math.round(0.25 * getScore('QI-08') + 0.40 * getScore('QI-10') + 0.15 * getScore('QI-11') + 0.20 * getScore('QI-12'));

    assertEqual(audit.pillarScores.human_rights_legal, expectedP1, 'Pillar 1 calculation must match formula');
    assertEqual(audit.pillarScores.clinical_pbs_formulation, expectedP2, 'Pillar 2 calculation must match formula');
    assertEqual(audit.pillarScores.proactive_skill_building, expectedP3, 'Pillar 3 calculation must match formula');
    assertEqual(audit.pillarScores.crisis_reduction_safeguards, expectedP4, 'Pillar 4 calculation must match formula');

    const expectedRaw = Math.round(0.30 * expectedP1 + 0.30 * expectedP2 + 0.20 * expectedP3 + 0.20 * expectedP4);
    assertEqual(audit.rawWeightedScore, expectedRaw, 'Raw weighted score must match weighted sum of 4 pillars');
  });

  await runTestAsync('Pillars', 'Mathematical Invariant: Clamping in range [0, 100]', async () => {
    const bsp = createBaseCompliantBSP();
    const audit = await evaluateBSPDocument(bsp);

    assert(audit.overallScore >= 0 && audit.overallScore <= 100, 'overallScore must be in [0, 100]');
    assert(audit.rawWeightedScore >= 0 && audit.rawWeightedScore <= 100, 'rawWeightedScore must be in [0, 100]');
    Object.values(audit.pillarScores).forEach(score => {
      assert(score >= 0 && score <= 100, `Pillar score ${score} must be in [0, 100]`);
    });
    audit.indicatorResults.forEach(r => {
      assert(r.score >= 0 && r.score <= 100, `Indicator ${r.id} score ${r.score} must be in [0, 100]`);
    });
  });

  // ---------------------------------------------------------------------------
  // SUITE 4: MALFORMED, EMPTY, HUGE, XSS, SQLi PAYLOADS
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 4: ADVERSARIAL PAYLOADS & ROBUSTNESS ---');

  await runTestAsync('Adversarial Payloads', 'Empty BSP does not crash and assigns <= 25% Grade F', async () => {
    const emptyBsp: BSPDocument = {
      id: '',
      clientId: '',
      clientName: '',
      version: '',
      status: 'Draft'
    };

    const audit = await evaluateBSPDocument(emptyBsp);
    assert(audit.overallScore <= 25, `Empty BSP must score <= 25% (Actual: ${audit.overallScore}%)`);
    assertEqual(audit.complianceGrade, 'Grade F', 'Empty BSP must receive Grade F');
    assertEqual(audit.rating, 'Non-Compliant - Red Flags Detected', 'Empty BSP must receive Non-Compliant rating');
    assertEqual(audit.apoEndorsementReady, false, 'APO endorsement must be false');
    assertEqual(audit.indicatorResults.length, 12, 'Must evaluate all 12 indicators');
  });

  await runTestAsync('Adversarial Payloads', 'Extreme 50,000+ character strings evaluate cleanly without timeout/OOM', async () => {
    const hugeBsp = createBaseCompliantBSP();
    const giantString = 'NDIS Positive Behaviour Support and clinical antecedent adaptations. '.repeat(1000); // ~70k chars
    hugeBsp.summary = giantString;
    hugeBsp.proactiveStrategies = [giantString, giantString];

    const audit = await evaluateBSPDocument(hugeBsp);
    assert(audit.overallScore >= 80, 'Huge string BSP must evaluate accurately');
    assertEqual(audit.indicatorResults.length, 12, 'Must produce 12 indicator results');
  });

  await runTestAsync('Adversarial Payloads', 'XSS Injection vectors evaluate safely and preserve data integrity', async () => {
    const xssBsp = createBaseCompliantBSP();
    xssBsp.clientName = '<script>alert("XSS-CLIENT")</script>';
    xssBsp.summary = '<img src=x onerror=alert(document.cookie)><svg onload=eval(atob("YWxlcnQoMSk="));>';
    xssBsp.reactiveStrategies = ['<iframe src="javascript:alert(1)"></iframe>'];

    const audit = await evaluateBSPDocument(xssBsp);
    assert(audit.clientName.includes('<script>'), 'Client name preserved as raw string');
    const jsonPkg = generateAuditJsonPackage(audit, xssBsp);
    const jsonStr = JSON.stringify(jsonPkg);
    assert(jsonStr.includes('XSS-CLIENT'), 'JSON serialization handles XSS safely');
    const integrity = validateAuditPackageIntegrity(jsonStr);
    assert(integrity.isValid, 'Exported package with XSS payload passes schema and integrity validation');
  });

  await runTestAsync('Adversarial Payloads', 'SQL Injection and Command Injection strings evaluate safely', async () => {
    const sqliBsp = createBaseCompliantBSP();
    sqliBsp.id = "bsp-001'; DROP TABLE participants; SELECT * FROM users WHERE '1'='1";
    sqliBsp.authorName = "Robert'); DROP TABLE practitioners;--";
    if (sqliBsp.restrictivePractices?.[0]) {
      sqliBsp.restrictivePractices[0].authorizationReference = "RPR-2026-VIC-12345' UNION SELECT username, password FROM auth_users;--";
    }

    const audit = await evaluateBSPDocument(sqliBsp);
    assert(audit.overallScore >= 80, 'SQL injection strings evaluated without error');
    const jsonPkg = generateAuditJsonPackage(audit, sqliBsp);
    const jsonStr = JSON.stringify(jsonPkg);
    const integrity = validateAuditPackageIntegrity(jsonStr);
    assert(integrity.isValid, 'SQLi payload audit package valid');
  });

  await runTestAsync('Adversarial Payloads', 'Unicode Homoglyphs, Zero-Width Characters & RTL Overrides handled safely', async () => {
    const unicodeBsp = createBaseCompliantBSP();
    // Zero-width spaces in text
    unicodeBsp.summary = 'Participant\u200B \u200C\u200Drequires\uFEFF sensory adaptations.';
    // RTL override
    unicodeBsp.primaryBehaviorsOfConcern = ['\u202EnoitagitA lacisyhP\u202C'];
    // Unicode homoglyphs (Cyrillic a, e, o)
    unicodeBsp.authorName = 'Dr. Sаrаh Jеnkins (PBS)';

    const audit = await evaluateBSPDocument(unicodeBsp);
    assert(audit.overallScore >= 80, 'Unicode payload evaluated safely');
    const jsonPkg = generateAuditJsonPackage(audit, unicodeBsp);
    const integrity = validateAuditPackageIntegrity(JSON.stringify(jsonPkg));
    assert(integrity.isValid, 'Unicode audit package passes integrity verification');
  });

  await runTestAsync('Adversarial Payloads', 'All 5 Restrictive Practice categories evaluated simultaneously without crash', async () => {
    const multiRpBsp = createBaseCompliantBSP();
    multiRpBsp.restrictivePractices = [
      {
        id: 'rp-1',
        practiceType: 'Chemical',
        description: 'PRN Risperidone 0.5mg',
        clinicalRationale: 'Last resort for severe self-injury',
        authorizationReference: 'RPR-2026-VIC-001',
        status: 'Authorized',
        reductionPlanSummary: 'Fading by 25% quarterly over 12 months'
      },
      {
        id: 'rp-2',
        practiceType: 'Mechanical',
        description: 'Splint gloves to prevent chronic finger gouging',
        clinicalRationale: 'Prevents severe skin breakdown',
        authorizationReference: 'RPR-2026-VIC-002',
        status: 'Authorized',
        reductionPlanSummary: 'Graduated removal 15 mins/day every 2 weeks'
      },
      {
        id: 'rp-3',
        practiceType: 'Physical',
        description: 'Two-person safe open-palm escort to calm room',
        clinicalRationale: 'Prevents elopement into highway traffic',
        authorizationReference: 'RPR-2026-VIC-003',
        status: 'Authorized',
        reductionPlanSummary: 'Fading to single-carer verbal guiding within 6 months'
      },
      {
        id: 'rp-4',
        practiceType: 'Environmental',
        description: 'Keypad lock on chemical storage laundry cabinet',
        clinicalRationale: 'Prevents ingestion of cleaning agents',
        authorizationReference: 'RPR-2026-VIC-004',
        status: 'Authorized',
        reductionPlanSummary: 'Life-skills safety training with monthly assessment'
      },
      {
        id: 'rp-5',
        practiceType: 'Seclusion',
        description: 'Supervised emergency time-out room with continuous 1-on-1 observation',
        clinicalRationale: 'Emergency containment for extreme weaponised aggression (max 5 mins)',
        authorizationReference: 'RPR-2026-VIC-005',
        status: 'Authorized',
        reductionPlanSummary: 'Target 0 episodes within 6 months via FCT training'
      }
    ];

    const audit = await evaluateBSPDocument(multiRpBsp);
    assertEqual(audit.restrictivePracticesSummary.totalReported, 5, 'Must report 5 restrictive practices');
    assertEqual(audit.restrictivePracticesSummary.authorizedCount, 5, 'All 5 must be authorized');
    assertEqual(audit.restrictivePracticesSummary.unauthorizedCount, 0, '0 unauthorized');
    assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, false, '0 prohibited detected');
    assertEqual(audit.apoEndorsementReady, true, 'All 5 authorized with fading -> APO endorsement ready');
  });

  // ---------------------------------------------------------------------------
  // SUITE 5: 1-CLICK REMEDIATION STATE RECOVERY & IDEMPOTENCY
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 5: 1-CLICK REMEDIATION STATE RECOVERY & IDEMPOTENCY ---');

  await runTestAsync('Remediation', 'Non-destructive: Original BSP object is not mutated by remediation', async () => {
    const originalBsp = createBaseCompliantBSP();
    delete originalBsp.functionalAssessment?.functionalHypothesis;
    const frozenCopy = JSON.parse(JSON.stringify(originalBsp));

    const audit = await evaluateBSPDocument(originalBsp);
    const fbaRedFlag = audit.redFlags.find(r => r.id === 'rf-fba-01');
    assert(Boolean(fbaRedFlag), 'rf-fba-01 red flag must be found');

    const remediation = applyRemediationPatch(originalBsp, fbaRedFlag!);
    assertEqual(JSON.stringify(originalBsp), JSON.stringify(frozenCopy), 'Original BSP must remain completely unmodified');
    assert(Boolean(remediation.updatedBsp.functionalAssessment?.functionalHypothesis), 'Remediated BSP must have hypothesis');
  });

  await runTestAsync('Remediation', 'End-to-End Remediation Loop: Non-compliant BSP with multiple gaps recovers to Audit-Ready', async () => {
    // Construct a severely deficient BSP
    const deficientBsp: BSPDocument = {
      id: 'bsp-deficient-001',
      clientId: 'cli-def-001',
      clientName: 'Alex Morgan',
      version: 'v1.0',
      status: 'Draft',
      summary: 'Draft plan.',
      primaryBehaviorsOfConcern: ['Agitation'],
      proactiveStrategies: ['Speak softly'],
      reactiveStrategies: ['Hold arms down'], // Non-prohibited physical redirection
      restrictivePractices: [
        {
          id: 'rp-bad-1',
          practiceType: 'Chemical',
          description: 'PRN medication',
          clinicalRationale: 'Calms down',
          authorizationReference: '', // Missing
          status: 'Draft',
          reductionPlanSummary: 'None' // Missing
        }
      ]
    };

    // 1. Initial Evaluation -> Low score, multiple red flags
    const initialAudit = await evaluateBSPDocument(deficientBsp);
    assert(initialAudit.overallScore < 50, `Initial score must be < 50% (Actual: ${initialAudit.overallScore}%)`);
    assert(initialAudit.redFlags.length >= 4, `Must detect >= 4 red flags (Actual: ${initialAudit.redFlags.length})`);
    assertEqual(initialAudit.apoEndorsementReady, false, 'Initial APO endorsement must be blocked');

    // 2. Apply batch remediation
    const remediationResult = applyAllRemediations(deficientBsp, initialAudit.redFlags);
    assert(remediationResult.appliedCount >= 4, `Must apply >= 4 remediation patches (Actual: ${remediationResult.appliedCount})`);

    // 3. Re-evaluate remediated BSP
    const remediatedAudit = await evaluateBSPDocument(remediationResult.updatedBsp);
    assert(remediatedAudit.overallScore >= 75, `Remediated score must be >= 75% (Actual: ${remediatedAudit.overallScore}%)`);
    assert(remediatedAudit.activePenaltyMultipliers.length === 0, 'Remediated plan must have 0 active penalty multipliers');
    assertEqual(remediatedAudit.restrictivePracticesSummary.unauthorizedCount, 0, '0 unauthorized practices remaining');
    assertEqual(remediatedAudit.restrictivePracticesSummary.missingFadePlanCount, 0, '0 missing fade plans remaining');
    assertEqual(remediatedAudit.apoEndorsementReady, true, 'Remediated plan must be APO endorsement ready');
  });

  await runTestAsync('Remediation', 'Idempotency: Applying same remediation patch twice produces stable state', async () => {
    const bsp = createBaseCompliantBSP();
    delete bsp.functionalAssessment?.functionalHypothesis;

    const audit1 = await evaluateBSPDocument(bsp);
    const rf = audit1.redFlags.find(r => r.id === 'rf-fba-01')!;

    const patch1 = applyRemediationPatch(bsp, rf);
    const patch2 = applyRemediationPatch(patch1.updatedBsp as BSPDocument, rf);

    assertEqual(
      patch1.updatedBsp.functionalAssessment?.functionalHypothesis,
      patch2.updatedBsp.functionalAssessment?.functionalHypothesis,
      'Double application must yield identical functionalHypothesis'
    );
  });

  // ---------------------------------------------------------------------------
  // SUITE 6: APO EXPORTER & CRYPTOGRAPHIC TAMPER DETECTION
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 6: APO EXPORTER & TAMPER DETECTION ---');

  await runTestAsync('APO Exporter', 'Exported JSON Package passes integrity validation', async () => {
    const bsp = createBaseCompliantBSP();
    const audit = await evaluateBSPDocument(bsp);
    const jsonPkg = generateAuditJsonPackage(audit, bsp);
    const jsonString = JSON.stringify(jsonPkg);

    const validation = validateAuditPackageIntegrity(jsonString);
    assertEqual(validation.isValid, true, 'Audit package must be valid');
    assertEqual(validation.errors.length, 0, 'Errors list must be empty');
    assertEqual(validation.expectedHash, validation.calculatedHash, 'Integrity hash must match calculated hash');
  });

  await runTestAsync('APO Exporter', 'Cryptographic Tampering Detection: Altering score invalidates integrity check', async () => {
    const bsp = createBaseCompliantBSP();
    const audit = await evaluateBSPDocument(bsp);
    const jsonPkg = generateAuditJsonPackage(audit, bsp);

    // Tamper with overall score (from genuine 100% to fraudulent 42%)
    jsonPkg.overallScorecard.finalQualityScore = 42;
    jsonPkg.overallScorecard.complianceGrade = 'Grade F';

    const tamperedJson = JSON.stringify(jsonPkg);
    const validation = validateAuditPackageIntegrity(tamperedJson);

    assertEqual(validation.isValid, false, 'Tampered package must fail validation');
    assert(validation.expectedHash !== validation.calculatedHash, 'Tampered hash must not match calculated hash');
  });

  // ---------------------------------------------------------------------------
  // SUITE 7: NULL / UNDEFINED / MALFORMED NESTED OBJECT RESILIENCY
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 7: NULL / UNDEFINED / MALFORMED RESILIENCY ---');

  await runTestAsync('Robustness', 'BSP with completely undefined sub-objects evaluates safely', async () => {
    const strippedBsp: BSPDocument = {
      id: 'stripped-001',
      clientId: 'cli-001',
      clientName: 'Test Participant',
      version: 'v1.0',
      status: 'Draft',
      summary: undefined,
      authorName: undefined,
      createdDate: undefined,
      lastUpdated: undefined,
      reviewDate: undefined,
      primaryBehaviorsOfConcern: undefined,
      proactiveStrategies: undefined,
      reactiveStrategies: undefined,
      functionalAssessment: undefined,
      skillTeaching: undefined,
      activeReactive: undefined,
      restrictivePractices: undefined,
      participantProfile: undefined,
      consultationRecords: undefined,
      staffTrainingAndGovernance: undefined
    };

    const audit = await evaluateBSPDocument(strippedBsp);
    assertEqual(audit.indicatorResults.length, 12, 'Must evaluate 12 indicators without crash');
    assertEqual(audit.deliberationTraces.length >= 3, true, 'Must produce deliberation traces');
    assert(audit.overallScore <= 30, 'Stripped BSP must score <= 30%');
  });

  await runTestAsync('Robustness', 'Restrictive practices with undefined internal fields evaluate safely', async () => {
    const malformedRpBsp = createBaseCompliantBSP();
    malformedRpBsp.restrictivePractices = [
      {
        id: 'rp-malformed-1',
        practiceType: 'Chemical',
        description: undefined as any,
        clinicalRationale: undefined as any,
        authorizationReference: undefined as any,
        status: undefined as any,
        reductionPlanSummary: undefined as any
      }
    ];

    const audit = await evaluateBSPDocument(malformedRpBsp);
    assertEqual(audit.restrictivePracticesSummary.totalReported, 1, '1 RP reported');
    assertEqual(audit.restrictivePracticesSummary.unauthorizedCount, 1, '1 unauthorized detected due to missing ref');
    assertEqual(audit.restrictivePracticesSummary.missingFadePlanCount, 1, '1 missing fade plan detected');
  });

  // ---------------------------------------------------------------------------
  // SUITE 8: DELIBERATION TRACE STRUCTURE & TRI-AGENT INTEGRITY
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 8: DELIBERATION TRACE STRUCTURE & TRI-AGENT INTEGRITY ---');

  await runTestAsync('Deliberation', 'Deliberation traces contain all 3 specialized agents in correct sequence', async () => {
    const bsp = createBaseCompliantBSP();
    const audit = await evaluateBSPDocument(bsp);

    assert(audit.deliberationTraces.length >= 4, `Must have >= 4 deliberation traces (Actual: ${audit.deliberationTraces.length})`);

    const roles = audit.deliberationTraces.map(t => t.agentRole);
    assert(roles.includes('human_rights_legal_safeguards'), 'Human Rights Agent present');
    assert(roles.includes('clinical_pbs_specialist'), 'Clinical PBS Agent present');
    assert(roles.includes('quality_panel_lead_synthesizer'), 'Quality Panel Lead present');

    // Verify first trace is Human Rights, last trace is Lead Synthesizer
    assertEqual(audit.deliberationTraces[0].agentRole, 'human_rights_legal_safeguards', 'First trace is Human Rights screening');
    assertEqual(audit.deliberationTraces[audit.deliberationTraces.length - 1].agentRole, 'quality_panel_lead_synthesizer', 'Last trace is Lead Synthesizer');

    // Verify citedRules on each trace
    for (const trace of audit.deliberationTraces) {
      assert(trace.citedRules.length > 0, `Trace ${trace.id} must cite at least 1 rule`);
      assert(trace.message.length > 20, `Trace ${trace.id} message must be descriptive`);
    }
  });

  // ---------------------------------------------------------------------------
  // SUITE 9: SUBTLE RESTRAINT & CHEST PRESSURE VARIATIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- SUITE 9: SUBTLE RESTRAINT PHRASING VARIATIONS ---');

  const subtleRestraints = [
    'Carers apply chest pressure when participant is disruptive',
    'Restraint involving basket hold to contain upper torso',
    'Floor containment with prone positioning',
    'Restrained face up on hospital gurney',
    'Choke hold applied during dangerous self-harm attempt'
  ];

  for (const text of subtleRestraints) {
    await runTestAsync('Subtle Restraints', `Detected prohibited restraint: "${text.slice(0, 35)}..."`, async () => {
      const bsp = createBaseCompliantBSP();
      bsp.reactiveStrategies = [text];
      const audit = await evaluateBSPDocument(bsp);
      assertEqual(audit.overallScore, 0, 'Must drop score to 0%');
      assertEqual(audit.restrictivePracticesSummary.prohibitedDetected, true, 'Must detect prohibited hold');
    });
  }

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('                   CHALLENGER 1 ADVERSARIAL TEST SUMMARY                        ');
  console.log('================================================================================');

  const total = testResults.length;
  const passed = testResults.filter(r => r.passed).length;
  const failed = testResults.filter(r => !r.passed).length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`  Total Adversarial Test Cases : ${total}`);
  console.log(`  Passed                       : ${passed}`);
  console.log(`  Failed                       : ${failed}`);
  console.log(`  Pass Rate                    : ${passRate}%`);
  console.log('================================================================================\n');

  if (failed > 0) {
    console.error(`✖ ADVERSARIAL STRESS TEST DETECTED ${failed} FAILURES.`);
    process.exit(1);
  } else {
    console.log(`✔ ALL ${total} ADVERSARIAL TEST CASES PASSED WITH 100% SUCCESS RATE.`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error in test runner:', err);
  process.exit(1);
});
