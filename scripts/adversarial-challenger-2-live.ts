/**
 * Comprehensive Empirical Adversarial Verification Harness for Challenger 2
 * Tests live implementation modules in lib/bsp-auditor/ & tests/helpers/reference-evaluator.ts
 */

import { evaluateBSPDocument as evaluateLive } from '../lib/bsp-auditor/agent-evaluator';
import {
  applyRemediationPatch as applyPatchLive,
  applyAllRemediations as applyAllLive,
  generateRemediationForIndicator as generateRemediationLive
} from '../lib/bsp-auditor/remediation-engine';
import {
  generateAuditJsonPackage as generateJsonLive,
  validateAuditPackageIntegrity as validateIntegrityLive,
  calculateSha256Checksum as calculateSha256Live,
  formatAPOScorecardMarkdown as formatMarkdownLive
} from '../lib/bsp-auditor/apo-exporter';
import {
  evaluateBSPDocument as evaluateOracle,
  applyRemediationPatch as applyPatchOracle,
  formatAPOExportPackage as formatJsonOracle
} from '../tests/helpers/reference-evaluator';
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
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../tests/fixtures/ndis-draft07-schema';
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
} from '../tests/helpers/assertion-utils';
import { BSPDocument, ComplianceRedFlag, NDISQualityIndicatorId } from '../types/bsp-audit';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function recordTest(category: string, name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      throw new Error('Async function called in synchronous recordTest');
    }
    results.push({ category, name, passed: true });
    console.log(`  ✔ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ category, name, passed: false, error: err?.message || String(err) });
    console.error(`  ✖ [FAIL] ${name}: ${err?.message || err}`);
  }
}

async function recordAsyncTest(category: string, name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ category, name, passed: true });
    console.log(`  ✔ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ category, name, passed: false, error: err?.message || String(err) });
    console.error(`  ✖ [FAIL] ${name}: ${err?.message || err}`);
  }
}

async function main() {
  console.log('================================================================================');
  console.log('   CHALLENGER 2: EMPIRICAL VERIFICATION (LIVE IMPLEMENTATION & DRAFT-07 & SHA)  ');
  console.log('================================================================================\n');

  // ==========================================================================
  // SUITE 1: 1-Click Remediation & Immutability (Live Engine)
  // ==========================================================================
  console.log('--- SUITE 1: 1-Click Remediation & Deep Immutability ---');

  recordTest('Immutability', 'applyRemediationPatch never mutates original BSP object (Live Engine)', () => {
    const orig = JSON.parse(JSON.stringify(scenario3_IncompleteHypothesisBSP));
    const snapshot = JSON.stringify(orig);
    const flag: ComplianceRedFlag = {
      id: 'rf-fba-01',
      severity: 'high',
      title: 'Incomplete FBA',
      description: 'Missing hypothesis',
      affectedPillar: 'clinical_pbs_formulation',
      affectedIndicator: 'QI-04'
    };

    const res = applyPatchLive(orig, flag);
    assertEquals(JSON.stringify(orig), snapshot, 'Original BSP must be strictly unchanged');
    assertNotEquals(JSON.stringify(res.updatedBsp), snapshot, 'Updated BSP must have new properties');
  });

  recordTest('Immutability', 'Mutating patch result properties does not pollute original object', () => {
    const orig = JSON.parse(JSON.stringify(scenario4_MissingFadeOutScheduleBSP));
    const flag: ComplianceRedFlag = {
      id: 'rf-nofade-01',
      severity: 'high',
      title: 'Missing Fade',
      description: 'No fade plan',
      affectedPillar: 'crisis_reduction_safeguards',
      affectedIndicator: 'QI-10'
    };

    const res = applyPatchLive(orig, flag);
    res.updatedBsp.restrictivePractices[0].reductionPlanSummary = 'POLLUTED';
    res.updatedBsp.clientName = 'POLLUTED';

    assertNotEquals(orig.clientName, 'POLLUTED');
    assertNotEquals(orig.restrictivePractices[0].reductionPlanSummary, 'POLLUTED');
  });

  await recordAsyncTest('Live-Remediation', '1-Click remediation on missing FBA hypothesis resolves QI-04 and elevates score', async () => {
    const initialPkg = await evaluateLive(scenario3_IncompleteHypothesisBSP);
    const initialScore = initialPkg.overallScore;
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_nohypo'));

    const fbaFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-04')!;
    assert(fbaFlag !== undefined);

    const patchRes = applyPatchLive(scenario3_IncompleteHypothesisBSP, fbaFlag);
    assertEquals(patchRes.patchApplied, true);

    const reevalPkg = await evaluateLive(patchRes.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_nohypo'), false, 'M_nohypo multiplier must be cleared');
    assertGreaterThan(reevalPkg.overallScore, initialScore, 'Score must elevate');
    assertEquals(reevalPkg.redFlags.some(rf => rf.affectedIndicator === 'QI-04'), false, 'QI-04 red flag must be gone');
  });

  await recordAsyncTest('Live-Remediation', '1-Click remediation on missing fade-out schedule removes M_nofade penalty', async () => {
    const initialPkg = await evaluateLive(scenario4_MissingFadeOutScheduleBSP);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_nofade'));

    const fadeFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-10')!;
    const patchRes = applyPatchLive(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    assertEquals(patchRes.patchApplied, true);

    const reevalPkg = await evaluateLive(patchRes.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_nofade'), false, 'M_nofade multiplier must be cleared');
    assertGreaterThan(reevalPkg.overallScore, initialPkg.overallScore);
    assertEquals(reevalPkg.redFlags.some(rf => rf.affectedIndicator === 'QI-10'), false);
  });

  await recordAsyncTest('Live-Remediation', '1-Click remediation on unauthorized restrictive practice injects State Senior Practitioner ref and removes M_unauth', async () => {
    const initialPkg = await evaluateLive(unauthorizedRestraintBSP);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_unauth'));
    assertLessThanOrEqual(initialPkg.overallScore, 60);

    const unauthFlag = initialPkg.redFlags.find(rf => rf.affectedIndicator === 'QI-09' && rf.id.includes('unauth'))!;
    const patchRes = applyPatchLive(unauthorizedRestraintBSP, unauthFlag);
    assertEquals(patchRes.patchApplied, true);

    const reevalPkg = await evaluateLive(patchRes.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_unauth'), false);
    assertEquals(reevalPkg.restrictivePracticesSummary.unauthorizedCount, 0);
    assertGreaterThan(reevalPkg.overallScore, initialPkg.overallScore);
  });

  await recordAsyncTest('Live-Remediation', '1-Click remediation on prohibited restraint clears M_prohib penalty and sanitizes practice descriptions', async () => {
    const initialPkg = await evaluateLive(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(initialPkg.overallScore, 0);
    assert(initialPkg.activePenaltyMultipliers.some(m => m.type === 'M_prohib'));
    assertEquals(initialPkg.restrictivePracticesSummary.prohibitedDetected, true);

    const prohibFlag = initialPkg.redFlags.find(rf => rf.id.includes('prohib') || rf.title.toLowerCase().includes('prohibited'))!;
    assert(prohibFlag !== undefined);

    const patchRes = applyPatchLive(scenario2_ProhibitedPhysicalRestraintBSP, prohibFlag);
    assertEquals(patchRes.patchApplied, true);

    const reevalPkg = await evaluateLive(patchRes.updatedBsp);
    assertEquals(reevalPkg.activePenaltyMultipliers.some(m => m.type === 'M_prohib'), false, 'M_prohib must be cleared');
    assertEquals(reevalPkg.restrictivePracticesSummary.prohibitedDetected, false, 'prohibitedDetected must be false');
    assertGreaterThan(reevalPkg.overallScore, 0, 'Score must be restored above 0');
  });

  // ==========================================================================
  // SUITE 2: Batch "Remediate All" Progression & Edge Case Resilience
  // ==========================================================================
  console.log('\n--- SUITE 2: Batch "Remediate All" & Indicator Generation ---');

  await recordAsyncTest('Live-Batch', 'Batch Remediate All elevates Scenario 2 (Prohibited Restraint) from 0% Grade F to Audit-Ready Grade A', async () => {
    const initialPkg = await evaluateLive(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(initialPkg.overallScore, 0);
    assertEquals(initialPkg.complianceGrade, 'Grade F');

    const batchRes = applyAllLive(scenario2_ProhibitedPhysicalRestraintBSP, initialPkg.redFlags);
    assertGreaterThan(batchRes.appliedCount, 0);

    const reevalPkg = await evaluateLive(batchRes.updatedBsp);
    console.log(`    Scenario 2 Batch: ${initialPkg.overallScore}% -> ${reevalPkg.overallScore}% (${reevalPkg.complianceGrade})`);
    assertGreaterThanOrEqual(reevalPkg.overallScore, 85, 'Remediated Scenario 2 must reach Grade A');
    assertEquals(reevalPkg.complianceGrade, 'Grade A');
    assertEquals(reevalPkg.apoEndorsementReady, true);
    assertEquals(reevalPkg.restrictivePracticesSummary.prohibitedDetected, false);
  });

  await recordAsyncTest('Live-Batch', 'Batch Remediate All elevates Scenario 3 from non-compliant to Audit-Ready Grade A', async () => {
    const initialPkg = await evaluateLive(scenario3_IncompleteHypothesisBSP);
    assertLessThan(initialPkg.overallScore, 50);

    const batchRes = applyAllLive(scenario3_IncompleteHypothesisBSP, initialPkg.redFlags);
    assertGreaterThan(batchRes.appliedCount, 0);

    const reevalPkg = await evaluateLive(batchRes.updatedBsp);
    console.log(`    Scenario 3 Batch: ${initialPkg.overallScore}% -> ${reevalPkg.overallScore}% (${reevalPkg.complianceGrade})`);
    assertGreaterThanOrEqual(reevalPkg.overallScore, 85, 'Batch remediated score must reach Grade A');
    assertEquals(reevalPkg.complianceGrade, 'Grade A');
    assertEquals(reevalPkg.apoEndorsementReady, true);
    assertEquals(reevalPkg.apoEndorsement?.recommendation, 'APPROVED_FOR_COMMISSION_SUBMISSION');
  });

  await recordAsyncTest('Live-Batch', 'Batch Remediate All elevates Scenario 4 from conditional to Audit-Ready Grade A', async () => {
    const initialPkg = await evaluateLive(scenario4_MissingFadeOutScheduleBSP);
    assertLessThan(initialPkg.overallScore, 75);

    const batchRes = applyAllLive(scenario4_MissingFadeOutScheduleBSP, initialPkg.redFlags);
    assertGreaterThan(batchRes.appliedCount, 0);

    const reevalPkg = await evaluateLive(batchRes.updatedBsp);
    console.log(`    Scenario 4 Batch: ${initialPkg.overallScore}% -> ${remediatedScore(reevalPkg.overallScore)}% (${reevalPkg.complianceGrade})`);
    assertGreaterThanOrEqual(reevalPkg.overallScore, 90, 'Batch remediated score must reach Grade A');
    assertEquals(reevalPkg.complianceGrade, 'Grade A');
    assertEquals(reevalPkg.apoEndorsementReady, true);
  });

  function remediatedScore(score: number) { return score; }

  await recordAsyncTest('Live-Batch', 'All 12 indicator remediation patches applied sequentially elevates empty BSP to >=90% Grade A', async () => {
    let currentBsp = JSON.parse(JSON.stringify(emptyBSP));
    const allIndicators: NDISQualityIndicatorId[] = [
      'QI-01', 'QI-02', 'QI-03', 'QI-04', 'QI-05', 'QI-06',
      'QI-07', 'QI-08', 'QI-09', 'QI-10', 'QI-11', 'QI-12'
    ];

    for (const ind of allIndicators) {
      const res = generateRemediationLive(currentBsp, ind);
      if (res.patchApplied) currentBsp = res.updatedBsp;
    }

    const pkg = await evaluateLive(currentBsp);
    console.log(`    Empty BSP Full Remediation: ${pkg.overallScore}% (${pkg.complianceGrade})`);
    assertGreaterThanOrEqual(pkg.overallScore, 90);
    assertEquals(pkg.complianceGrade, 'Grade A');
    assertEquals(pkg.rating, 'Audit-Ready');
  });

  // ==========================================================================
  // SUITE 3: Draft-07 Schema & Cryptographic Integrity Checksum (Live Engine)
  // ==========================================================================
  console.log('\n--- SUITE 3: Draft-07 JSON Schema & SHA-256 Tampering Detection ---');

  await recordAsyncTest('Draft07-Validation', 'All standard clinical and adversarial BSP audit packages pass Draft-07 validation', async () => {
    const testCases: [string, BSPDocument][] = [
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

    for (const [name, bsp] of testCases) {
      const auditPkg = await evaluateLive(bsp);
      const jsonPkg = generateJsonLive(auditPkg, bsp);

      const val = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
      if (!val.valid) {
        throw new Error(`Draft-07 schema validation failed on ${name}:\n${val.errors.join('\n')}`);
      }
      assertEquals(val.valid, true);
      assertEquals(val.errors.length, 0);
    }
  });

  await recordAsyncTest('Integrity-Valid', 'Generated JSON package passes validateAuditPackageIntegrity with isValid: true', async () => {
    const auditPkg = await evaluateLive(scenario1_CompliantBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario1_CompliantBSP);
    const jsonString = JSON.stringify(jsonPkg, null, 2);

    const integrity = validateIntegrityLive(jsonString);
    assertEquals(integrity.isValid, true);
    assertEquals(integrity.errors.length, 0);
    assertEquals(integrity.expectedHash, integrity.calculatedHash);
  });

  await recordAsyncTest('Integrity-Tampering', 'Tampering with overallScorecard.finalQualityScore invalidates SHA-256 integrity hash', async () => {
    const auditPkg = await evaluateLive(scenario2_ProhibitedPhysicalRestraintBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario2_ProhibitedPhysicalRestraintBSP);

    // Tamper with score
    jsonPkg.overallScorecard.finalQualityScore = 95;
    const tamperedStr = JSON.stringify(jsonPkg);

    const integrity = validateIntegrityLive(tamperedStr);
    assertEquals(integrity.isValid, false, 'Tampered score must fail validation');
    assertNotEquals(integrity.expectedHash, integrity.calculatedHash);
  });

  await recordAsyncTest('Integrity-Tampering', 'Tampering with overallScorecard.complianceGrade invalidates SHA-256 integrity hash', async () => {
    const auditPkg = await evaluateLive(scenario2_ProhibitedPhysicalRestraintBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario2_ProhibitedPhysicalRestraintBSP);

    // Tamper with grade
    jsonPkg.overallScorecard.complianceGrade = 'Grade A';
    const tamperedStr = JSON.stringify(jsonPkg);

    const integrity = validateIntegrityLive(tamperedStr);
    assertEquals(integrity.isValid, false, 'Tampered grade must fail validation');
  });

  await recordAsyncTest('Integrity-Tampering', 'Tampering with participantProfile.participantId invalidates SHA-256 integrity hash', async () => {
    const auditPkg = await evaluateLive(scenario1_CompliantBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario1_CompliantBSP);

    // Tamper with ID
    jsonPkg.participantProfile.participantId = 'CLI-ATTACKER-FORGED';
    const tamperedStr = JSON.stringify(jsonPkg);

    const integrity = validateIntegrityLive(tamperedStr);
    assertEquals(integrity.isValid, false, 'Tampered participant ID must fail validation');
  });

  await recordAsyncTest('Integrity-Tampering', 'Tampering with auditMetadata.auditTimestamp invalidates SHA-256 integrity hash', async () => {
    const auditPkg = await evaluateLive(scenario1_CompliantBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario1_CompliantBSP);

    // Tamper with timestamp
    jsonPkg.auditMetadata.auditTimestamp = '2020-01-01T00:00:00.000Z';
    const tamperedStr = JSON.stringify(jsonPkg);

    const integrity = validateIntegrityLive(tamperedStr);
    assertEquals(integrity.isValid, false, 'Tampered timestamp must fail validation');
  });

  await recordAsyncTest('Integrity-Tampering', 'Tampering with qualityIndicatorsAudit array count is rejected by integrity validator', async () => {
    const auditPkg = await evaluateLive(scenario1_CompliantBSP);
    const jsonPkg = generateJsonLive(auditPkg, scenario1_CompliantBSP);

    // Delete one indicator
    jsonPkg.qualityIndicatorsAudit.pop();
    const tamperedStr = JSON.stringify(jsonPkg);

    const integrity = validateIntegrityLive(tamperedStr);
    assertEquals(integrity.isValid, false);
    assert(integrity.errors.some(e => e.includes('Expected 12 quality indicators')));
  });

  await recordAsyncTest('APO-MarkdownExport', 'formatAPOScorecardMarkdown formats complete publication-ready APO scorecard', async () => {
    const auditPkg = await evaluateLive(scenario1_CompliantBSP);
    const md = formatMarkdownLive(auditPkg, scenario1_CompliantBSP);

    assert(md.includes('# OFFICIAL NDIS AUTHORISED PROGRAM OFFICER (APO) SUBMISSION SCORECARD'));
    assert(md.includes('Jordan Miller'));
    assert(md.includes('Pillar 1: Human Rights & Legal Safeguards'));
    assert(md.includes('Pillar 2: Evidence-Based Clinical PBS'));
    assert(md.includes('Pillar 3: Proactive Environmental & Least Restrictive Supports'));
    assert(md.includes('Pillar 4: Crisis Management, Fading & Governance'));
    assert(md.includes('QI-01'));
    assert(md.includes('QI-12'));
    assert(md.includes('DIGITALLY SIGNED VIA BREAKTHROUGH OS'));
  });

  // ==========================================================================
  // FINAL SUMMARY
  // ==========================================================================
  console.log('\n================================================================================');
  console.log('                 FINAL ADVERSARIAL CHALLENGER 2 SUMMARY                         ');
  console.log('================================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`  Total Test Cases Executed: ${total}`);
  console.log(`  Total Passed             : ${passed}`);
  console.log(`  Total Failed             : ${failed}`);
  console.log(`  Pass Rate                : ${((passed / total) * 100).toFixed(1)}%`);
  console.log('================================================================================\n');

  if (failed > 0) {
    console.error('❌ FAILURES DETECTED IN CHALLENGER 2 VERIFICATION:');
    results.filter(r => !r.passed).forEach(r => console.error(`  - [${r.category}] ${r.name}: ${r.error}`));
    process.exit(1);
  } else {
    console.log('✔ ALL CHALLENGER 2 VERIFICATION TESTS PASSED WITH 100% SUCCESS.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
