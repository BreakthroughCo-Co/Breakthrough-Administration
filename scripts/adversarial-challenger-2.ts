/**
 * Adversarial Challenger 2 Verification Harness
 * Focus: State Remediation (1-Click & Batch Remediate All) and APO Export Integrity (Draft-07 & SHA-256)
 */

import {
  evaluateBSPDocument,
  applyRemediationPatch,
  formatAPOExportPackage,
  detectProhibitedRestraint,
  evaluateIndicatorQI
} from '../tests/helpers/reference-evaluator.ts';
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
} from '../tests/fixtures/sample-bsps.ts';
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../tests/fixtures/ndis-draft07-schema.ts';
import {
  assert,
  assertEquals,
  assertNotEquals,
  assertGreaterThan,
  assertGreaterThanOrEqual,
  assertLessThan,
  assertLessThanOrEqual,
  validateDraft07Schema,
  computeSha256
} from '../tests/helpers/assertion-utils.ts';
import type { BSPDocument, ComplianceRedFlag, NDISQualityIndicatorId } from '../types/bsp-audit.ts';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function recordTest(category: string, name: string, fn: () => void) {
  try {
    fn();
    results.push({ category, name, passed: true });
    console.log(`  ✔ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ category, name, passed: false, error: err?.message || String(err) });
    console.error(`  ✖ [FAIL] ${name}: ${err?.message || err}`);
  }
}

/**
 * Applies all red flags in batch to a BSP document
 */
function applyAllRemediationsHelper(
  bsp: BSPDocument,
  redFlags: ComplianceRedFlag[]
): { updatedBsp: BSPDocument; appliedCount: number; summaries: string[] } {
  let currentBsp = JSON.parse(JSON.stringify(bsp)) as BSPDocument;
  const summaries: string[] = [];
  let appliedCount = 0;

  for (const rf of redFlags) {
    const res = applyRemediationPatch(currentBsp, rf);
    if (res.patchApplied) {
      currentBsp = res.updatedBsp;
      summaries.push(`[${rf.affectedIndicator}] ${res.summary}`);
      appliedCount++;
    }
  }

  return {
    updatedBsp: currentBsp,
    appliedCount,
    summaries
  };
}

function runAllAdversarialTests() {
  console.log('\n================================================================================');
  console.log('         CHALLENGER 2: ADVERSARIAL STATE REMEDIATION & APO INTEGRITY HARNESS     ');
  console.log('================================================================================\n');

  // --------------------------------------------------------------------------
  // SECTION 1: 1-Click Remediation & Immutability Adversarial Verification
  // --------------------------------------------------------------------------
  console.log('--- SECTION 1: 1-Click Remediation & Immutability Adversarial Verification ---');

  recordTest('Remediation-Immutability', 'Original BSP object is strictly unmodified during applyRemediationPatch', () => {
    const originalBsp = JSON.parse(JSON.stringify(scenario3_IncompleteHypothesisBSP));
    const snapshotBefore = JSON.stringify(originalBsp);

    const initialPkg = evaluateBSPDocument(originalBsp);
    const fbaFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-04');
    assert(fbaFlag !== undefined, 'QI-04 flag must exist');

    const res = applyRemediationPatch(originalBsp, fbaFlag);
    const snapshotAfter = JSON.stringify(originalBsp);

    assertEquals(snapshotBefore, snapshotAfter, 'Original object must not be mutated in-place');
    assertNotEquals(JSON.stringify(res.updatedBsp), snapshotBefore, 'Updated BSP must have new properties');
  });

  recordTest('Remediation-Immutability', 'Modifying returned updatedBsp does NOT leak back to original BSP', () => {
    const originalBsp = JSON.parse(JSON.stringify(scenario4_MissingFadeOutScheduleBSP));
    const initialPkg = evaluateBSPDocument(originalBsp);
    const flag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-10')!;

    const res = applyRemediationPatch(originalBsp, flag);
    // Mutate patch result aggressively
    res.updatedBsp.restrictivePractices[0].reductionPlanSummary = 'CORRUPTED_VALUE';
    res.updatedBsp.clientName = 'TAMPERED_NAME';

    assertNotEquals(originalBsp.clientName, 'TAMPERED_NAME');
    assertNotEquals(originalBsp.restrictivePractices[0].reductionPlanSummary, 'CORRUPTED_VALUE');
  });

  recordTest('Remediation-ProhibitedHold', '1-Click remediation on prohibited physical restraint clears M_prohib and restores score', () => {
    const initialPkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(initialPkg.overallScore, 0, 'Initial score must be 0% due to prohibited prone hold');
    assertEquals(initialPkg.restrictivePracticesSummary.prohibitedDetected, true);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_prohib'));

    const prohibFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-09' && rf.id.includes('prohib'));
    assert(prohibFlag !== undefined, 'Prohibited red flag must be present');

    const patchResult = applyRemediationPatch(scenario2_ProhibitedPhysicalRestraintBSP, prohibFlag);
    assertEquals(patchResult.patchApplied, true);

    const reevalPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reevalPkg.restrictivePracticesSummary.prohibitedDetected, false, 'Prohibited hold must be resolved');
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_prohib'), false, 'M_prohib multiplier must be removed');
    assertGreaterThan(reevalPkg.overallScore, 0, 'Score must be elevated above 0%');
  });

  recordTest('Remediation-UnauthorizedRP', '1-Click remediation on unauthorized restrictive practice injects State Senior Practitioner ref and elevates score', () => {
    const initialPkg = evaluateBSPDocument(unauthorizedRestraintBSP);
    assertGreaterThan(initialPkg.restrictivePracticesSummary.unauthorizedCount, 0);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_unauth'));
    assertLessThanOrEqual(initialPkg.overallScore, 60, 'Unauthorized RP must cap or penalize score');

    const unauthFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-09' && rf.id.includes('unauth'));
    assert(unauthFlag !== undefined, 'Unauthorized RP red flag must exist');

    const patchResult = applyRemediationPatch(unauthorizedRestraintBSP, unauthFlag);
    assertEquals(patchResult.patchApplied, true);

    const reevalPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reevalPkg.restrictivePracticesSummary.unauthorizedCount, 0, 'Unauthorized count must be 0');
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_unauth'), false, 'M_unauth must be removed');
    assertGreaterThan(reevalPkg.overallScore, initialPkg.overallScore, 'Score must elevate');
  });

  recordTest('Remediation-MissingFade', '1-Click remediation on missing fade-out plan removes M_nofade multiplier', () => {
    const initialPkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_nofade'));

    const fadeFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-10');
    assert(fadeFlag !== undefined, 'Missing fade red flag must exist');

    const patchResult = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    assertEquals(patchResult.patchApplied, true);

    const reevalPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_nofade'), false, 'M_nofade must be gone');
    assertGreaterThan(reevalPkg.overallScore, initialPkg.overallScore, 'Score must be elevated');
  });

  recordTest('Remediation-MissingHypothesis', '1-Click remediation on missing FBA hypothesis resolves QI-04 gap and removes M_nohypo', () => {
    const initialPkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_nohypo'));

    const fbaFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-04');
    assert(fbaFlag !== undefined, 'QI-04 red flag must exist');

    const patchResult = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);
    assertEquals(patchResult.patchApplied, true);

    const reevalPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_nohypo'), false, 'M_nohypo must be removed');
    assertGreaterThan(reevalPkg.overallScore, initialPkg.overallScore, 'Score must be elevated');
  });

  recordTest('Remediation-CornerCases', 'Graceful handling of null or missing remediationPayload', () => {
    const badFlag: any = {
      id: 'rf-unknown',
      severity: 'medium',
      title: 'Unknown flag',
      description: 'Test unknown',
      affectedPillar: 'human_rights_legal',
      affectedIndicator: 'QI-99' as any
    };

    const res = applyRemediationPatch(scenario1_CompliantBSP, badFlag);
    assertEquals(res.patchApplied, false);
    assertEquals(res.summary, 'No structured remediation payload available.');
  });

  // --------------------------------------------------------------------------
  // SECTION 2: Batch "Remediate All" Lifecycle & Score Progression
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 2: Batch "Remediate All" Lifecycle & Score Progression ---');

  recordTest('BatchRemediation-Lifecycle', 'Scenario 2 (Prohibited Restraint) fully transforms into Compliant Audit-Ready Plan', () => {
    const initialPkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(initialPkg.overallScore, 0);
    assertEquals(initialPkg.apoEndorsementReady, false);
    assertEquals(initialPkg.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED');

    const batchResult = applyAllRemediationsHelper(scenario2_ProhibitedPhysicalRestraintBSP, initialPkg.redFlags);
    assertGreaterThan(batchResult.appliedCount, 0);

    const remediatedPkg = evaluateBSPDocument(batchResult.updatedBsp);
    console.log(`    Scenario 2 Score: ${initialPkg.overallScore}% -> ${remediatedPkg.overallScore}% (${remediatedPkg.complianceGrade})`);
    assertGreaterThan(remediatedPkg.overallScore, 0, 'Score must elevate from 0%');
    assertEquals(remediatedPkg.restrictivePracticesSummary.prohibitedDetected, false);
    assertEquals(remediatedPkg.activePenaltyMultipliers.some(m => m.type === 'M_prohib'), false);
  });

  recordTest('BatchRemediation-Lifecycle', 'Scenario 3 (Incomplete Hypothesis) fully transforms and clears red flags', () => {
    const initialPkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assertLessThan(initialPkg.overallScore, 50);

    const batchResult = applyAllRemediationsHelper(scenario3_IncompleteHypothesisBSP, initialPkg.redFlags);
    assertGreaterThan(batchResult.appliedCount, 0);

    const remediatedPkg = evaluateBSPDocument(batchResult.updatedBsp);
    console.log(`    Scenario 3 Score: ${initialPkg.overallScore}% -> ${remediatedPkg.overallScore}% (${remediatedPkg.complianceGrade})`);
    assertGreaterThan(remediatedPkg.overallScore, initialPkg.overallScore);
    assertLessThan(remediatedPkg.redFlags.length, initialPkg.redFlags.length);
  });

  recordTest('BatchRemediation-Lifecycle', 'Scenario 4 (Missing Fade-Out) fully transforms and elevates score', () => {
    const initialPkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assertLessThan(initialPkg.overallScore, 75);

    const batchResult = applyAllRemediationsHelper(scenario4_MissingFadeOutScheduleBSP, initialPkg.redFlags);
    assertGreaterThan(batchResult.appliedCount, 0);

    const remediatedPkg = evaluateBSPDocument(batchResult.updatedBsp);
    console.log(`    Scenario 4 Score: ${initialPkg.overallScore}% -> ${remediatedPkg.overallScore}% (${remediatedPkg.complianceGrade})`);
    assertGreaterThan(remediatedPkg.overallScore, initialPkg.overallScore);
    assertEquals(remediatedPkg.activePenaltyMultipliers.some(m => m.type === 'M_nofade'), false);
  });

  recordTest('BatchRemediation-OrderIndependence', 'Batch remediation outcome is invariant to red flag ordering (permutations)', () => {
    const initialPkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const forwardFlags = [...initialPkg.redFlags];
    const reverseFlags = [...initialPkg.redFlags].reverse();
    const shuffledFlags = [...initialPkg.redFlags].sort(() => Math.random() - 0.5);

    const res1 = applyAllRemediationsHelper(scenario3_IncompleteHypothesisBSP, forwardFlags);
    const res2 = applyAllRemediationsHelper(scenario3_IncompleteHypothesisBSP, reverseFlags);
    const res3 = applyAllRemediationsHelper(scenario3_IncompleteHypothesisBSP, shuffledFlags);

    const pkg1 = evaluateBSPDocument(res1.updatedBsp);
    const pkg2 = evaluateBSPDocument(res2.updatedBsp);
    const pkg3 = evaluateBSPDocument(res3.updatedBsp);

    assertEquals(pkg1.overallScore, pkg2.overallScore, 'Forward and reverse order scores must match');
    assertEquals(pkg1.overallScore, pkg3.overallScore, 'Shuffled order score must match');
    assertEquals(pkg1.complianceGrade, pkg2.complianceGrade);
  });

  recordTest('BatchRemediation-Idempotency', 'Re-running batch remediation on an already remediated plan is safe and idempotent', () => {
    const initialPkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const round1 = applyAllRemediationsHelper(scenario3_IncompleteHypothesisBSP, initialPkg.redFlags);
    const pkg1 = evaluateBSPDocument(round1.updatedBsp);

    // Apply any newly reported flags or re-apply
    const round2 = applyAllRemediationsHelper(round1.updatedBsp, pkg1.redFlags);
    const pkg2 = evaluateBSPDocument(round2.updatedBsp);

    assertEquals(pkg1.overallScore, pkg2.overallScore, 'Score must remain stable upon re-remediation');
  });

  // --------------------------------------------------------------------------
  // SECTION 3: NDIS Draft-07 JSON Schema Compliance & Forensic Integrity
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 3: NDIS Draft-07 JSON Schema Compliance & Forensic Integrity ---');

  recordTest('JSONSchema-Draft07', 'Exports from all fixture scenarios strictly adhere to NDIS Draft-07 Schema', () => {
    const fixtures: [string, BSPDocument][] = [
      ['Scenario 1 (Compliant)', scenario1_CompliantBSP],
      ['Scenario 2 (Prohibited)', scenario2_ProhibitedPhysicalRestraintBSP],
      ['Scenario 3 (Incomplete FBA)', scenario3_IncompleteHypothesisBSP],
      ['Scenario 4 (Missing Fade)', scenario4_MissingFadeOutScheduleBSP],
      ['Scenario 5 (Full APO)', scenario5_FullAPOSubmissionBSP],
      ['Empty BSP', emptyBSP],
      ['Max Restrictive Practices', maximumRestrictivePracticesBSP],
      ['Mismatched FBA', mismatchedReplacementFbaBSP],
      ['Adversarial Malicious BSP', adversarialMaliciousBSP]
    ];

    for (const [label, bsp] of fixtures) {
      const auditPkg = evaluateBSPDocument(bsp);
      const jsonPkg = formatAPOExportPackage(auditPkg);

      const validation = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
      if (!validation.valid) {
        throw new Error(`Draft-07 validation failed for ${label}:\n${validation.errors.join('\n')}`);
      }
      assertEquals(validation.valid, true, `${label} must pass Draft-07 validation`);
      assertEquals(validation.errors.length, 0);
    }
  });

  recordTest('JSONSchema-Draft07', 'Remediated BSP export packages also pass Draft-07 validation with 0 errors', () => {
    const initialPkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    const remRes = applyAllRemediationsHelper(scenario2_ProhibitedPhysicalRestraintBSP, initialPkg.redFlags);
    const remPkg = evaluateBSPDocument(remRes.updatedBsp);
    const jsonPkg = formatAPOExportPackage(remPkg);

    const validation = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    assertEquals(validation.valid, true);
    assertEquals(validation.errors.length, 0);
  });

  recordTest('ForensicIntegrity-Checksum', 'Valid JSON package includes valid 64-char hex SHA-256 integrity checksum', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(typeof pkg.checksumSha256, 'string');
    assertEquals(pkg.checksumSha256.length, 64);
    assert(/^[0-9a-f]{64}$/.test(pkg.checksumSha256), 'Must be valid hex string');
    assertEquals(pkg.auditMetadata.integrityHash, `sha256-${pkg.checksumSha256}`);
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with overallScore invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;

    // Tamper with score in base package
    const tamperedPkg = { ...pkg, overallScore: 99 };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered score must invalidate checksum');
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with complianceGrade invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    const originalHash = pkg.checksumSha256;

    const tamperedPkg = { ...pkg, complianceGrade: 'Grade A' as const };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered grade must invalidate checksum');
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with clientId invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;

    const tamperedPkg = { ...pkg, clientId: 'FORGED_CLIENT_ID' };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered clientId must invalidate checksum');
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with single indicator score in indicatorResults invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;

    const tamperedIndicators = JSON.parse(JSON.stringify(pkg.indicatorResults));
    tamperedIndicators[0].score = 0;
    const tamperedPkg = { ...pkg, indicatorResults: tamperedIndicators };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered indicator score must invalidate checksum');
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with deliberationTraces message invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;

    const tamperedTraces = JSON.parse(JSON.stringify(pkg.deliberationTraces));
    tamperedTraces[0].message = 'TAMPERED DELIBERATION MESSAGE';
    const tamperedPkg = { ...pkg, deliberationTraces: tamperedTraces };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered deliberation trace must invalidate checksum');
  });

  recordTest('ForensicIntegrity-Tampering', 'Tampering with restrictivePracticesSummary counts invalidates SHA-256 integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;

    const tamperedSummary = { ...pkg.restrictivePracticesSummary, unauthorizedCount: 99 };
    const tamperedPkg = { ...pkg, restrictivePracticesSummary: tamperedSummary };
    const tamperedHash = computeSha256(tamperedPkg);

    assertNotEquals(originalHash, tamperedHash, 'Tampered restrictive practice summary must invalidate checksum');
  });

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('                      ADVERSARIAL TEST EXECUTION SUMMARY                        ');
  console.log('================================================================================');

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`  Total Adversarial Cases Tested: ${total}`);
  console.log(`  Total Passed                  : ${passed}`);
  console.log(`  Total Failed                  : ${failed}`);
  console.log(`  Pass Rate                     : ${((passed / total) * 100).toFixed(1)}%`);
  console.log('================================================================================\n');

  if (failed > 0) {
    console.error('❌ ADVERSARIAL CHALLENGER 2 DISCOVERED FAILURES:');
    results.filter(r => !r.passed).forEach(r => {
      console.error(`  - [${r.category}] ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('✔ ALL ADVERSARIAL CHALLENGE TEST CASES PASSED WITH 100% SUCCESS.');
    process.exit(0);
  }
}

runAllAdversarialTests();
