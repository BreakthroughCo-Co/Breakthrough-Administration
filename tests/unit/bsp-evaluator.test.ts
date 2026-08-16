/**
 * Breakthrough OS - Unit Verification Test Suite for NDIS BSP Quality & Safeguards Auditor
 * Tests:
 * 1. 12 NDIS Quality Indicators Rubric (QI-01 to QI-12)
 * 2. Restrictive Practices Rules 2018 Validation (5 Categories)
 * 3. Tri-Agent Deliberation Pipeline & 4 Regulatory Pillars Scoring
 * 4. Critical Penalty Multipliers (M_unauth, M_nofade, M_nohypo, M_prohib)
 * 5. 1-Click Remediation State Patches & Re-evaluation
 * 6. Official APO Scorecard & SHA-256 Checksum Validation
 */

import {
  BSPDocument,
  RestrictivePractice,
  PenaltyMultiplierResult,
  ComplianceRedFlag,
  NDISQualityIndicatorResult
} from '../../types/bsp-audit';
import { evaluateAllIndicators, auditRestrictivePractices } from '../../lib/bsp-auditor/indicators';
import { evaluateBSPDocument } from '../../lib/bsp-auditor/agent-evaluator';
import { applyRemediationPatch, applyAllRemediations } from '../../lib/bsp-auditor/remediation-engine';
import { generateAuditJsonPackage, validateAuditPackageIntegrity, formatAPOScorecardMarkdown } from '../../lib/bsp-auditor/apo-exporter';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('STARTING NDIS BSP AUDITOR UNIT VERIFICATION TEST SUITE');
  console.log('======================================================\n');

  // ---------------------------------------------------------
  // Test Case 1: Fully Compliant Benchmark BSP (Jordan Miller)
  // ---------------------------------------------------------
  console.log('--- TEST SUITE 1: Fully Compliant Benchmark BSP ---');

  const compliantBsp: BSPDocument = {
    id: 'bsp-test-101',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    version: 'v2.1',
    status: 'Published',
    summary: 'Comprehensive Positive Behaviour Support Plan focused on sensory self-regulation, environmental predictability, and neuroaffirming proactive adaptations.',
    primaryBehaviorsOfConcern: [
      'Acoustic Overload Escalation (Covering ears, pacing rapidly >1.5 m/s, high-pitched vocalisations)',
      'Demand Transition Resistance (Firmly pushing chair back against wall when demands are introduced without notice)'
    ],
    proactiveStrategies: [
      'Visual schedule board with physical velcro token countdowns updated 10 mins prior to any transition',
      'Scheduled 10-minute sensory breaks every 45 minutes incorporating weighted lap pad & proprioceptive input',
      'Pre-briefing Jordan before entering crowded environments with First-In/First-Seated transport pass',
      'Noise-cancelling over-ear headphones permanently positioned on desk'
    ],
    reactiveStrategies: [
      'Immediate low-arousal positioning: Step back 2 metres, maintain neutral body language, avoid sustained eye contact',
      'Deliver 2-word calm verbal prompts alongside pictorial cue card',
      'Grant immediate access to designated quiet sensory break space without requiring verbal negotiation',
      'Allow minimum 15-minute recovery baseline period before re-introducing environmental demands'
    ],
    restrictivePractices: [
      {
        id: 'rp-101',
        clientId: 'cli-101',
        clientName: 'Jordan Miller',
        practiceType: 'Environmental',
        description: 'Locked kitchen cupboard containing cleaning agents and sharp utensils to prevent severe pica / self-harm during high-arousal episodes.',
        status: 'Authorized',
        authorizationBody: 'VIC Senior Practitioner & NDIS Quality Commission',
        authorizationReference: 'RPR-2025-VIC-88102',
        startDate: '2025-10-01',
        expiryDate: '2026-09-30',
        reductionPlanSummary: 'Gradual introduction of supervised cooking trials with visual safety cues to fade lock requirement by 50% in 6 months.',
        monthlyReportStatus: 'Submitted',
        leastRestrictiveAlternativesTried: ['Visual hazard stickers', '1-on-1 staff shadow during cooking']
      }
    ],
    reviewDate: '2026-12-01',
    authorName: 'Marcus Vance (Senior BSP)',
    lastUpdated: '2026-08-01',
    participantProfile: {
      communicationMode: 'Multimodal: Combines spoken 2-3 word phrases with AAC tablet (Proloquo2Go) and picture exchange cards.',
      sensoryPreferences: [
        'Proprioceptive deep pressure (weighted vest / lap pad)',
        'Noise-cancelling headphones in public venues',
        'Low-lumen amber warm lighting preferred over fluorescent overheads'
      ],
      strengthsAndInterests: [
        'Exceptional digital technology and tablet navigational skills',
        'Passion for train networks and Lego engineering models',
        'Gentle and affectionate with familiar therapy dogs'
      ],
      medicalHealthFactors: 'Allergy to dairy products; occasional sleep disturbance; no seizure history.',
      decisionMakingPreferences: 'Prefers visual 2-option forced choice boards over open-ended verbal inquiries.'
    },
    functionalAssessment: {
      targetBehaviors: [
        {
          behavior: 'Acoustic Overload Escalation',
          operationalDefinition: 'Participant places hands over both ears, paces rapidly (>1.5 m/s), and produces high-pitched vocalisations when sudden noise exceeds 75dB.',
          severity: 4,
          frequency: '2-3 times per week during transport or hall transitions'
        },
        {
          behavior: 'Demand Transition Resistance',
          operationalDefinition: 'Participant pushes chair back firmly against wall or sits on floor refusing forward movement when a new task is introduced without visual warning.',
          severity: 3,
          frequency: '3-4 times per week at 10:30 AM and 14:30 PM'
        }
      ],
      settingEvents: [
        'Fatigue following disrupted nighttime sleep (<6 hours)',
        'Late morning arrival or unexpected traffic delays during community transit'
      ],
      immediateTriggers: [
        'Sudden loud noises (alarms, construction, lawnmowers, megaphone announcements)',
        'Abrupt demand transitions without a 5-minute visual timer notice'
      ],
      maintainingConsequences: [
        'Temporary escape from high-demand sensory-rich environments',
        'Immediate reduction in auditory sensory input when removed to quiet zone'
      ],
      functionalHypothesis: 'When exposed to unpredictable sensory noise spikes or abrupt demand changes (especially when fatigued), Jordan engages in physical agitation and task avoidance primarily to ESCAPE sensory overload and regain somatic self-regulation.'
    },
    skillTeaching: {
      replacementBehaviors: [
        {
          target: 'Physical agitation during noise spikes',
          replacement: 'Independently reaching for noise-cancelling headphones or presenting "Quiet Space" AAC icon',
          teachingMethod: 'Functional Communication Training (FCT) paired with errorless roleplay in calm conditions twice weekly.'
        }
      ],
      functionalCommunicationTraining: 'Teach 3 core AAC symbols: "I Need Break", "Too Loud", and "Change Seat" with immediate 100% reinforcement schedule during acquisition phase.',
      reinforcementSchedule: 'Continuous reinforcement (FR1) for independent break/headphone requests; intermittent praise for calm transition completions.'
    },
    activeReactive: {
      earlyWarningSigns: [
        'Fidgeting with shirt hem and rapid knuckle tapping on tabletop',
        'Looking upwards towards ceiling lights repeatedly',
        'Breathing rate increases to >24 breaths per minute',
        'Vocal volume drops to soft repetitive hum'
      ],
      activeDeescalationStrategies: [
        'Immediately validate sensory state with calm whisper',
        'Offer weighted lap pad without demanding verbal acknowledgement',
        'Dim ambient room lights by 50% and turn off extraneous media',
        'Provide single-card visual choice: "Stay here with headphones" OR "Walk to quiet room"'
      ],
      reactiveProtocols: [
        'Phase 1 (Agitation): Ensure 2-metre physical buffer. No demands placed.',
        'Phase 2 (Escalation): Guide peers to adjacent room calmly. Keep exit pathways clear.',
        'Phase 3 (Recovery): Offer glass of cool water. Do NOT debrief or question for at least 20 minutes post-baseline.'
      ],
      postIncidentDebrief: 'Conduct trauma-informed non-judgmental staff debrief within 24 hours. Log ABC observation and review trigger patterns.'
    },
    consultationRecords: [
      {
        date: '2026-07-15',
        attendeeRoles: ['Participant', 'Karen Miller (Mother/Nominee)', 'Marcus Vance (Senior BSP)', 'Chloe Taylor (Speech Pathologist)'],
        participantInvolvementModality: 'Supported engagement using AAC device and visual choice boards with 10-minute quiet breaks.',
        nomineeConsentVerified: true,
        notes: 'Nominee and participant confirmed full agreement with proactive strategies and fading schedule.'
      }
    ],
    staffTrainingAndGovernance: {
      curriculumSummary: 'Comprehensive staff competency training on FCT protocols, low-arousal de-escalation, sensory regulation, and ABC data logging.',
      apoSubmissionDate: '2026-08-01',
      annualReviewDueDate: '2027-07-31',
      leadPractitionerName: 'Marcus Vance (Senior BSP)',
      monitoringFrequency: 'Monthly clinical supervision and quarterly restrictive practice usage audit.'
    }
  };

  const audit1 = await evaluateBSPDocument(compliantBsp);

  assert(audit1.overallScore >= 90, `Compliant BSP scored ${audit1.overallScore}% (expected >= 90%)`);
  assert(audit1.complianceGrade === 'Grade A', `Compliance grade is ${audit1.complianceGrade} (expected Grade A)`);
  assert(audit1.rating === 'Audit-Ready', `Rating is ${audit1.rating} (expected Audit-Ready)`);
  assert(audit1.passedIndicatorsCount === 12, `All 12 indicators passed (${audit1.passedIndicatorsCount}/12)`);
  assert(audit1.apoEndorsementReady === true, 'APO Endorsement is ready');
  assert(audit1.activePenaltyMultipliers.length === 0, 'No penalty multipliers applied to benchmark compliant plan');
  assert(audit1.deliberationTraces.length >= 5, `Generated ${audit1.deliberationTraces.length} deliberation traces from 3 agents`);
  assert(Boolean(audit1.checksumSha256 && audit1.checksumSha256.length === 64), 'Valid 64-character SHA-256 integrity hash generated');

  // ---------------------------------------------------------
  // Test Case 2: Unauthorized Restrictive Practice (M_unauth = 0.60)
  // ---------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Unauthorized Restrictive Practice Penalty ---');

  const unauthBsp: BSPDocument = JSON.parse(JSON.stringify(compliantBsp));
  unauthBsp.restrictivePractices = [
    {
      id: 'rp-unauth-1',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Environmental',
      description: 'Pantry lock on food storage.',
      status: 'Proposed',
      authorizationReference: '', // Missing authorization reference
      reductionPlanSummary: 'Fade out over 6 months.'
    }
  ];

  const audit2 = await evaluateBSPDocument(unauthBsp);

  assert(audit2.restrictivePracticesSummary.unauthorizedCount === 1, 'Detected 1 unauthorized restrictive practice');
  assert(audit2.activePenaltyMultipliers.some((m: PenaltyMultiplierResult) => m.type === 'M_unauth' && m.factor === 0.60), 'Applied M_unauth multiplier (0.60)');
  assert(audit2.overallScore <= 60, `Overall score capped at ${audit2.overallScore}% (expected <= 60%)`);
  assert(audit2.redFlags.some((rf: ComplianceRedFlag) => rf.affectedIndicator === 'QI-09' && rf.severity === 'critical'), 'Generated critical red flag for unauthorized practice');

  // ---------------------------------------------------------
  // Test Case 3: Prohibited Prone Restraint Hold (M_prohib = 0.00)
  // ---------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Prohibited Restraint Hold Immediate Zero ---');

  const prohibBsp: BSPDocument = JSON.parse(JSON.stringify(compliantBsp));
  prohibBsp.reactiveStrategies = [
    'Staff are instructed to place participant in prone restraint (face down on floor) until agitation ceases.'
  ];

  const audit3 = await evaluateBSPDocument(prohibBsp);

  assert(audit3.restrictivePracticesSummary.prohibitedDetected === true, 'Detected prohibited prone restraint hold');
  assert(audit3.overallScore === 0, `Overall score is ${audit3.overallScore}% (expected 0% immediate fail)`);
  assert(audit3.complianceGrade === 'Grade F', 'Compliance grade is Grade F');
  assert(audit3.apoEndorsementReady === false, 'APO Endorsement blocked for prohibited restraint');
  assert(audit3.activePenaltyMultipliers.some((m: PenaltyMultiplierResult) => m.type === 'M_prohib' && m.factor === 0.0), 'Applied M_prohib multiplier (0.00)');

  // ---------------------------------------------------------
  // Test Case 4: Missing Fade-Out Schedule (M_nofade = 0.75)
  // ---------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Missing Fade-Out Schedule Penalty ---');

  const noFadeBsp: BSPDocument = JSON.parse(JSON.stringify(compliantBsp));
  noFadeBsp.restrictivePractices[0].reductionPlanSummary = ''; // Missing fade plan

  const audit4 = await evaluateBSPDocument(noFadeBsp);

  assert(audit4.restrictivePracticesSummary.missingFadePlanCount === 1, 'Detected missing fade plan');
  const qi10Result = audit4.indicatorResults.find((i: NDISQualityIndicatorResult) => i.id === 'QI-10');
  assert((qi10Result?.score ?? 0) < 30, `QI-10 scored ${qi10Result?.score}% (expected < 30%)`);
  assert(audit4.activePenaltyMultipliers.some((m: PenaltyMultiplierResult) => m.type === 'M_nofade' && m.factor === 0.75), 'Applied M_nofade multiplier (0.75)');

  // ---------------------------------------------------------
  // Test Case 5: 1-Click Remediation State Patching
  // ---------------------------------------------------------
  console.log('\n--- TEST SUITE 5: 1-Click Remediation State Patching ---');

  // Start with a severely non-compliant BSP
  const nonCompliantBsp: BSPDocument = {
    id: 'bsp-broken-1',
    clientId: 'cli-999',
    clientName: 'Alex Mercer',
    version: 'v1.0',
    status: 'Draft',
    summary: 'Brief draft.',
    primaryBehaviorsOfConcern: ['Agitation'],
    proactiveStrategies: [],
    reactiveStrategies: ['Hold participant face down on ground until calm'], // Prohibited hold
    restrictivePractices: [
      {
        id: 'rp-bad-1',
        clientId: 'cli-999',
        clientName: 'Alex Mercer',
        practiceType: 'Chemical',
        description: 'PRN Sedative medication',
        status: 'Proposed',
        authorizationReference: '', // Unauthorized
        reductionPlanSummary: ''    // No fade plan
      }
    ],
    reviewDate: '2024-01-01', // Expired
    authorName: 'Unassigned',
    lastUpdated: '2024-01-01'
  };

  const initialAudit = await evaluateBSPDocument(nonCompliantBsp);
  console.log(`  Initial Broken BSP Score: ${initialAudit.overallScore}% (${initialAudit.complianceGrade})`);
  assert(initialAudit.overallScore === 0, 'Broken BSP scored 0% due to prohibited hold');
  assert(initialAudit.redFlags.length >= 3, `Identified ${initialAudit.redFlags.length} red flags`);

  // Apply all remediations via remediation engine
  const remediationResult = applyAllRemediations(nonCompliantBsp, initialAudit.redFlags);
  console.log(`  Applied ${remediationResult.appliedCount} automated compliance patches`);

  // Re-evaluate remediated BSP
  const remediatedAudit = await evaluateBSPDocument(remediationResult.updatedBsp);
  console.log(`  Remediated BSP Score: ${remediatedAudit.overallScore}% (${remediatedAudit.complianceGrade})`);

  assert(remediatedAudit.overallScore >= 75, `Remediated BSP achieved ${remediatedAudit.overallScore}% (expected >= 75%)`);
  assert(remediatedAudit.restrictivePracticesSummary.prohibitedDetected === false, 'Prohibited hold was successfully removed');
  assert(remediatedAudit.restrictivePracticesSummary.unauthorizedCount === 0, 'Unauthorized practices were authorized with State reference');
  assert(remediatedAudit.restrictivePracticesSummary.missingFadePlanCount === 0, 'Fade plan was injected into all restrictive practices');

  // ---------------------------------------------------------
  // Test Case 6: APO Exporter & SHA-256 Checksum Validation
  // ---------------------------------------------------------
  console.log('\n--- TEST SUITE 6: Official APO Exporter & JSON Validation ---');

  const jsonPackage = generateAuditJsonPackage(audit1, compliantBsp);
  assert(jsonPackage.$schema === 'http://json-schema.org/draft-07/schema#', 'Package contains JSON Schema Draft-07 schema reference');
  assert(jsonPackage.overallScorecard.finalQualityScore === audit1.overallScore, 'Scorecard matches audit score');
  assert(jsonPackage.qualityIndicatorsAudit.length === 12, 'Includes all 12 indicators in JSON output');

  const jsonString = JSON.stringify(jsonPackage, null, 2);
  const integrityCheck = validateAuditPackageIntegrity(jsonString);
  assert(integrityCheck.isValid === true, 'JSON package passes cryptographic integrity and schema structure validation');

  const markdownScorecard = formatAPOScorecardMarkdown(audit1, compliantBsp);
  assert(markdownScorecard.includes('OFFICIAL NDIS AUTHORISED PROGRAM OFFICER (APO) SUBMISSION SCORECARD'), 'Scorecard contains official header');
  assert(markdownScorecard.includes('Pillar 1: Human Rights & Legal Safeguards'), 'Scorecard contains Pillar 1 breakdown');
  assert(markdownScorecard.includes('AUTHORISED PROGRAM OFFICER (APO) ENDORSEMENT BLOCK'), 'Scorecard contains APO endorsement block');

  console.log('\n======================================================');
  console.log('ALL NDIS BSP AUDITOR UNIT VERIFICATION TESTS PASSED! ✓');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
