/**
 * Reviewer 2 - Independent Adversarial & Integration Verification Script
 */

import { evaluateBSPDocument } from '../../lib/bsp-auditor/agent-evaluator.ts';
import { applyRemediationPatch, applyAllRemediations, generateRemediationForIndicator } from '../../lib/bsp-auditor/remediation-engine.ts';
import { generateAuditJsonPackage, formatAPOScorecardMarkdown, validateAuditPackageIntegrity } from '../../lib/bsp-auditor/apo-exporter.ts';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP,
  scenario5_FullAPOSubmissionBSP,
  emptyBSP,
  adversarialMaliciousBSP
} from '../../tests/fixtures/sample-bsps.ts';

console.log('--- STARTING REVIEWER 2 INDEPENDENT ADVERSARIAL VERIFICATION ---');

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    failed++;
    throw new Error(msg);
  } else {
    console.log(`✔ PASS: ${msg}`);
    passed++;
  }
}

async function runReviewerVerification() {
  // Test 1: Compliant Plan Evaluation
  console.log('\n[1] Testing Scenario 1: Compliant BSP');
  const audit1 = await evaluateBSPDocument(scenario1_CompliantBSP);
  assert(audit1.overallScore >= 90, `Scenario 1 score is ${audit1.overallScore}% (expected >= 90%)`);
  assert(audit1.complianceGrade === 'Grade A', `Scenario 1 grade is ${audit1.complianceGrade}`);
  assert(audit1.apoEndorsementReady === true, 'Scenario 1 is APO endorsement ready');
  assert(audit1.redFlags.length === 0, `Scenario 1 red flags count is ${audit1.redFlags.length}`);
  assert(audit1.deliberationTraces.length >= 3, `Scenario 1 has ${audit1.deliberationTraces.length} deliberation traces`);

  // Test 2: Prohibited Physical Restraint
  console.log('\n[2] Testing Scenario 2: Prohibited Restraint');
  const audit2 = await evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
  assert(audit2.overallScore === 0, `Scenario 2 score is ${audit2.overallScore}% (expected 0%)`);
  assert(audit2.complianceGrade === 'Grade F', `Scenario 2 grade is ${audit2.complianceGrade}`);
  assert(audit2.restrictivePracticesSummary.prohibitedDetected === true, 'Scenario 2 prohibitedDetected is true');
  assert(audit2.apoEndorsementReady === false, 'Scenario 2 blocks APO endorsement');

  // Test 3: 1-Click Remediation on Incomplete Hypothesis
  console.log('\n[3] Testing Scenario 3: 1-Click Remediation on Incomplete Hypothesis');
  const audit3 = await evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
  const fbaFlag = audit3.redFlags.find(r => r.affectedIndicator === 'QI-04');
  assert(!!fbaFlag, 'Found QI-04 red flag in Scenario 3');
  const patch3 = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag!);
  assert(patch3.patchApplied === true, 'Patch applied successfully');
  const reAudit3 = await evaluateBSPDocument(patch3.updatedBsp);
  assert(reAudit3.overallScore > audit3.overallScore, `Score improved from ${audit3.overallScore}% to ${reAudit3.overallScore}%`);

  // Test 4: Batch Remediation on Missing Fade Plan
  console.log('\n[4] Testing Scenario 4: Batch Remediation on Missing Fade Plan');
  const audit4 = await evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
  const batchResult = applyAllRemediations(scenario4_MissingFadeOutScheduleBSP, audit4.redFlags);
  assert(batchResult.appliedCount > 0, `Batch applied ${batchResult.appliedCount} patches`);
  const reAudit4 = await evaluateBSPDocument(batchResult.updatedBsp);
  assert(reAudit4.overallScore > audit4.overallScore, `Score improved from ${audit4.overallScore}% to ${reAudit4.overallScore}%`);

  // Test 5: On-Demand Indicator Remediation on Plans with Restrictive Practices
  console.log('\n[5] Testing On-Demand Indicator Remediation on Plans with Restrictive Practices');
  const testBspWithRp = {
    ...emptyBSP,
    restrictivePractices: [
      {
        id: 'rp-1',
        clientId: 'cli-1',
        practiceType: 'Chemical' as const,
        description: 'PRN calming medication',
        status: 'Proposed' as const,
        monthlyReportStatus: 'Draft' as const
      }
    ]
  };

  const supportedIndicators = ['QI-01', 'QI-02', 'QI-04', 'QI-05', 'QI-06', 'QI-07', 'QI-08', 'QI-09', 'QI-10', 'QI-11', 'QI-12'] as const;
  for (const indId of supportedIndicators) {
    const indPatch = generateRemediationForIndicator(testBspWithRp, indId);
    assert(indPatch.patchApplied === true, `On-demand remediation for ${indId} applied successfully`);
  }

  // Test 6: APO JSON Package & Integrity Checksum
  console.log('\n[6] Testing APO JSON Package & SHA-256 Integrity');
  const jsonPkg = generateAuditJsonPackage(audit1, scenario1_CompliantBSP);
  const jsonStr = JSON.stringify(jsonPkg, null, 2);
  const integrity = validateAuditPackageIntegrity(jsonStr);
  assert(integrity.isValid === true, `Integrity check valid: ${integrity.calculatedHash}`);
  assert(jsonPkg.qualityIndicatorsAudit.length === 12, 'Export contains 12 quality indicators');

  // Test 7: Adversarial Input Handling (XSS / Injection / 50k chars)
  console.log('\n[7] Testing Adversarial Input Handling');
  const auditAdv = await evaluateBSPDocument(adversarialMaliciousBSP);
  assert(typeof auditAdv.overallScore === 'number', 'Adversarial Malicious BSP scored safely without error');
  const mdExport = formatAPOScorecardMarkdown(auditAdv, adversarialMaliciousBSP);
  assert(typeof mdExport === 'string' && mdExport.length > 500, 'APO Markdown generated safely for adversarial input');

  console.log(`\n==================================================`);
  console.log(`REVIEWER 2 INDEPENDENT AUDIT COMPLETE: ${passed} passed, ${failed} failed`);
  console.log(`==================================================`);
}

runReviewerVerification().catch((err) => {
  console.error('Fatal error during reviewer verification:', err);
  process.exit(1);
});
