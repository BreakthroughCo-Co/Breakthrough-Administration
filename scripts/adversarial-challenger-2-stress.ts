/**
 * Dedicated Empirical Challenger 2 Stress Test: Draft-07 & Prohibited Hold State Remediation
 */

import { evaluateBSPDocument } from '../lib/bsp-auditor/agent-evaluator';
import { applyRemediationPatch, applyAllRemediations, generateRemediationForIndicator } from '../lib/bsp-auditor/remediation-engine';
import { generateAuditJsonPackage, validateAuditPackageIntegrity, formatAPOScorecardMarkdown } from '../lib/bsp-auditor/apo-exporter';
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../tests/fixtures/ndis-draft07-schema';
import { validateDraft07Schema } from '../tests/helpers/assertion-utils';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP,
  scenario5_FullAPOSubmissionBSP,
  emptyBSP,
  unauthorizedRestraintBSP,
  maximumRestrictivePracticesBSP,
  mismatchedReplacementFbaBSP,
  adversarialMaliciousBSP
} from '../tests/fixtures/sample-bsps';
import { BSPDocument, ComplianceRedFlag } from '../types/bsp-audit';

async function runAdversarialStressTests() {
  console.log('================================================================');
  console.log('  CHALLENGER 2: ADVERSARIAL STRESS TEST (DRAFT-07 & REMEDIATION)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assertCheck(cond: boolean, msg: string) {
    if (!cond) {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
      throw new Error(`Assertion failed: ${msg}`);
    } else {
      console.log(`  ✔ PASS: ${msg}`);
      passed++;
    }
  }

  // TEST 1: Deliberation Trace Draft-07 required properties on all sample BSPs
  console.log('--- TEST GROUP 1: Draft-07 Schema Conformance of deliberationTraces ---');
  const allBsps: [string, BSPDocument][] = [
    ['scenario1', scenario1_CompliantBSP],
    ['scenario2', scenario2_ProhibitedPhysicalRestraintBSP],
    ['scenario3', scenario3_IncompleteHypothesisBSP],
    ['scenario4', scenario4_MissingFadeOutScheduleBSP],
    ['scenario5', scenario5_FullAPOSubmissionBSP],
    ['empty', emptyBSP],
    ['unauthorized', unauthorizedRestraintBSP],
    ['maxRestrictive', maximumRestrictivePracticesBSP],
    ['mismatched', mismatchedReplacementFbaBSP],
    ['adversarial', adversarialMaliciousBSP]
  ];

  for (const [name, bsp] of allBsps) {
    const auditPkg = await evaluateBSPDocument(bsp);
    const jsonPkg = generateAuditJsonPackage(auditPkg, bsp);

    // Validate Draft-07 schema
    const validation = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    assertCheck(validation.valid === true, `Draft-07 schema valid for ${name}`);
    assertCheck(validation.errors.length === 0, `0 Draft-07 validation errors for ${name}`);

    // Inspect individual deliberation traces
    assertCheck(Array.isArray(jsonPkg.deliberationTraces), `deliberationTraces is array in ${name}`);
    assertCheck(jsonPkg.deliberationTraces.length >= 3, `at least 3 traces in ${name}`);

    for (let i = 0; i < jsonPkg.deliberationTraces.length; i++) {
      const trace = jsonPkg.deliberationTraces[i];
      assertCheck(typeof trace.id === 'string' && trace.id.length > 0, `trace[${i}].id present in ${name}`);
      assertCheck(typeof trace.agentRole === 'string' && trace.agentRole.length > 0, `trace[${i}].agentRole present in ${name}`);
      assertCheck(typeof trace.agentName === 'string' && trace.agentName.length > 0, `trace[${i}].agentName present in ${name}`);
      assertCheck(typeof trace.timestamp === 'string' && trace.timestamp.length > 0, `trace[${i}].timestamp present in ${name}`);
      assertCheck(typeof trace.sentiment === 'string', `trace[${i}].sentiment present in ${name}`);
      assertCheck(typeof trace.message === 'string' && trace.message.length > 0, `trace[${i}].message present in ${name}`);
      assertCheck(typeof trace.reasoning === 'string' && trace.reasoning.length > 0, `trace[${i}].reasoning present in ${name}`);
    }

    // Inspect redFlagAlerts severity
    for (let j = 0; j < jsonPkg.redFlagAlerts.length; j++) {
      const alert = jsonPkg.redFlagAlerts[j];
      assertCheck(['critical', 'high', 'medium', 'low'].includes(alert.severity), `redFlagAlerts[${j}].severity is valid enum in ${name}: ${alert.severity}`);
    }
  }

  // TEST 2: Multi-term prohibited hold stress testing on custom crafted adversarial BSPs
  console.log('\n--- TEST GROUP 2: Prohibited Hold Sanitization & Re-evaluation ---');

  const prohibitedVariations = [
    { name: 'Prone floor hold', desc: 'Prone restraint on floor during severe aggression' },
    { name: 'Face-down hold', desc: 'Face-down containment on beanbag' },
    { name: 'Supine floor hold', desc: 'Supine restraint with 2 staff holding arms down' },
    { name: 'Face-up hold', desc: 'Face-up containment on mat' },
    { name: 'Basket hold', desc: 'Basket hold around torso to contain flailing' },
    { name: 'Bear hug compression', desc: 'Bear hug hold applied until calm' },
    { name: 'Chest pressure', desc: 'Chest pressure applied to restrain participant' },
    { name: 'Neck hold', desc: 'Neck hold applied in emergency' },
    { name: 'Choke hold', desc: 'Choke hold applied during acute crisis' },
    { name: 'Throat hold', desc: 'Throat hold applied to prevent biting' }
  ];

  for (const variant of prohibitedVariations) {
    const customBsp: BSPDocument = JSON.parse(JSON.stringify(scenario1_CompliantBSP));
    customBsp.id = `bsp-prohib-${variant.name.replace(/\s+/g, '-').toLowerCase()}`;
    customBsp.reactiveStrategies = [variant.desc, 'Call emergency services'];
    customBsp.restrictivePractices = [
      {
        id: 'rp-prohib-1',
        practiceType: 'Physical',
        description: variant.desc,
        status: 'Authorized',
        authorizationBody: 'VIC Senior Practitioner',
        authorizationReference: 'RPR-2026-VIC-998877',
        startDate: '2026-01-01',
        expiryDate: '2027-01-01',
        leastRestrictiveRationale: 'Considered necessary',
        clinicalRationale: 'Safety containment',
        reductionPlanSummary: 'Graduated fading protocol',
        fadingReviewDate: '2026-12-01',
        monthlyReportStatus: 'Submitted'
      }
    ];

    // Initial audit must fail with M_prohib = 0.00
    const audit1 = await evaluateBSPDocument(customBsp);
    assertCheck(audit1.overallScore === 0, `Variant "${variant.name}" scores 0 initially`);
    assertCheck(audit1.activePenaltyMultipliers.some(m => m.type === 'M_prohib'), `M_prohib active for "${variant.name}"`);
    assertCheck(audit1.restrictivePracticesSummary.prohibitedDetected === true, `prohibitedDetected is true for "${variant.name}"`);

    // Find prohibited red flag
    const prohibFlag = audit1.redFlags.find(rf => rf.id.includes('prohib') || rf.title.toLowerCase().includes('prohibited'));
    assertCheck(prohibFlag !== undefined, `Prohibited red flag emitted for "${variant.name}"`);

    // Apply single patch
    const patchResult = applyRemediationPatch(customBsp, prohibFlag!);
    assertCheck(patchResult.patchApplied === true, `Patch successfully applied for "${variant.name}"`);

    // Re-evaluate remediated BSP
    const audit2 = await evaluateBSPDocument(patchResult.updatedBsp);
    assertCheck(audit2.activePenaltyMultipliers.some(m => m.type === 'M_prohib') === false, `M_prohib cleared for "${variant.name}"`);
    assertCheck(audit2.restrictivePracticesSummary.prohibitedDetected === false, `prohibitedDetected is false for "${variant.name}"`);
    assertCheck(audit2.overallScore >= 90, `Remediated BSP for "${variant.name}" achieves Grade A (score: ${audit2.overallScore}%)`);
    assertCheck(audit2.complianceGrade === 'Grade A', `Remediated compliance grade is Grade A for "${variant.name}"`);
  }

  // TEST 3: Deep Immutability and Object Integrity
  console.log('\n--- TEST GROUP 3: Deep Immutability & Determinism ---');
  const freezeBsp: BSPDocument = JSON.parse(JSON.stringify(scenario2_ProhibitedPhysicalRestraintBSP));
  Object.freeze(freezeBsp);
  Object.freeze(freezeBsp.restrictivePractices);
  Object.freeze(freezeBsp.restrictivePractices[0]);

  const auditFreeze = await evaluateBSPDocument(freezeBsp);
  const prohibFlagFreeze = auditFreeze.redFlags.find(rf => rf.id.includes('prohib'))!;
  const patchFreeze = applyRemediationPatch(freezeBsp, prohibFlagFreeze);

  assertCheck(patchFreeze.patchApplied === true, 'Patch succeeded on frozen source object');
  assertCheck(freezeBsp.restrictivePractices[0].description.includes('Prone'), 'Frozen original object was untouched');
  assertCheck(!patchFreeze.updatedBsp.restrictivePractices[0].description.includes('Prone'), 'Updated BSP description was sanitized');

  // TEST 4: Export integrity validation after remediation
  console.log('\n--- TEST GROUP 4: Export Integrity on Remediated BSP ---');
  const remediatedAudit = await evaluateBSPDocument(patchFreeze.updatedBsp);
  const remediatedJson = generateAuditJsonPackage(remediatedAudit, patchFreeze.updatedBsp);
  const jsonStr = JSON.stringify(remediatedJson, null, 2);
  const integrityCheck = validateAuditPackageIntegrity(jsonStr);

  assertCheck(integrityCheck.isValid === true, 'Remediated JSON package integrity is valid');
  assertCheck(integrityCheck.errors.length === 0, 'No integrity errors on remediated package');
  assertCheck(integrityCheck.expectedHash === integrityCheck.calculatedHash, 'SHA-256 integrity hash matches calculated hash');

  console.log('\n================================================================');
  console.log(`  CHALLENGER 2 STRESS TEST COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdversarialStressTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
