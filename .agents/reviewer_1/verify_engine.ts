import { evaluateBSPDocument } from '../../lib/bsp-auditor/agent-evaluator.ts';
import { auditRestrictivePractices, evaluateAllIndicators } from '../../lib/bsp-auditor/indicators.ts';
import { applyRemediationPatch, applyAllRemediations } from '../../lib/bsp-auditor/remediation-engine.ts';
import { generateAuditJsonPackage, validateAuditPackageIntegrity, formatAPOScorecardMarkdown } from '../../lib/bsp-auditor/apo-exporter.ts';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP,
  scenario5_FullAPOSubmissionBSP,
  emptyBSP,
  unauthorizedRestraintBSP,
  maximumRestrictivePracticesBSP,
  adversarialMaliciousBSP
} from '../../tests/fixtures/sample-bsps.ts';

async function runDirectVerification() {
  console.log('================================================================================');
  console.log('   REVIEWER 1 INDEPENDENT VERIFICATION OF PRODUCTION ENGINE (lib/bsp-auditor)  ');
  console.log('================================================================================\n');

  // Test 1: Scenario 1 - Compliant BSP
  console.log('[TEST 1] Scenario 1 - Compliant BSP');
  const res1 = await evaluateBSPDocument(scenario1_CompliantBSP);
  console.log(`  - Overall Score: ${res1.overallScore}%`);
  console.log(`  - Raw Weighted Score: ${res1.rawWeightedScore}%`);
  console.log(`  - Compliance Grade: ${res1.complianceGrade}`);
  console.log(`  - Rating: ${res1.rating}`);
  console.log(`  - APO Endorsement Ready: ${res1.apoEndorsementReady}`);
  console.log(`  - Indicators Passed: ${res1.passedIndicatorsCount}/12`);
  if (res1.overallScore < 90) throw new Error(`Scenario 1 score ${res1.overallScore}% < 90%`);
  if (res1.complianceGrade !== 'Grade A') throw new Error(`Scenario 1 grade ${res1.complianceGrade} !== Grade A`);
  if (!res1.apoEndorsementReady) throw new Error('Scenario 1 APO endorsement should be ready');
  console.log('  -> PASS\n');

  // Test 2: Scenario 2 - Prohibited Restraint (Prone Hold)
  console.log('[TEST 2] Scenario 2 - Prohibited Physical Restraint (Prone/Pinning)');
  const res2 = await evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
  console.log(`  - Overall Score: ${res2.overallScore}% (Expected 0%)`);
  console.log(`  - Prohibited Detected: ${res2.restrictivePracticesSummary.prohibitedDetected}`);
  console.log(`  - Active Multipliers:`, res2.activePenaltyMultipliers.map(m => `${m.type}=${m.factor}`).join(', '));
  console.log(`  - APO Endorsement Ready: ${res2.apoEndorsementReady}`);
  if (res2.overallScore !== 0) throw new Error(`Scenario 2 score ${res2.overallScore}% !== 0%`);
  if (!res2.restrictivePracticesSummary.prohibitedDetected) throw new Error('Scenario 2 should detect prohibited hold');
  if (res2.apoEndorsementReady) throw new Error('Scenario 2 APO endorsement must be false');
  console.log('  -> PASS\n');

  // Test 3: Scenario 3 - Incomplete Functional Hypothesis & Remediation
  console.log('[TEST 3] Scenario 3 - Incomplete Hypothesis & 1-Click Remediation');
  const res3 = await evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
  console.log(`  - Pre-Remediation Score: ${res3.overallScore}%`);
  console.log(`  - QI-04 Score: ${res3.indicatorResults.find(i => i.id === 'QI-04')?.score}%`);
  const qi04Flag = res3.redFlags.find(r => r.affectedIndicator === 'QI-04');
  if (!qi04Flag) throw new Error('Expected QI-04 red flag');
  const patch3 = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, qi04Flag);
  const res3Post = await evaluateBSPDocument(patch3.updatedBsp);
  console.log(`  - Post-Remediation Score: ${res3Post.overallScore}%`);
  console.log(`  - QI-04 Post Score: ${res3Post.indicatorResults.find(i => i.id === 'QI-04')?.score}%`);
  if (res3Post.overallScore <= res3.overallScore) throw new Error('Score did not improve after QI-04 patch');
  console.log('  -> PASS\n');

  // Test 4: Scenario 4 - Missing Fade-Out Schedule & Remediation
  console.log('[TEST 4] Scenario 4 - Missing Fade-Out Schedule');
  const res4 = await evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
  console.log(`  - Pre-Remediation Score: ${res4.overallScore}%`);
  console.log(`  - Missing Fade Count: ${res4.restrictivePracticesSummary.missingFadePlanCount}`);
  const qi10Flag = res4.redFlags.find(r => r.affectedIndicator === 'QI-10');
  if (!qi10Flag) throw new Error('Expected QI-10 red flag');
  const patch4 = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, qi10Flag);
  const res4Post = await evaluateBSPDocument(patch4.updatedBsp);
  console.log(`  - Post-Remediation Score: ${res4Post.overallScore}%`);
  console.log(`  - QI-10 Post Score: ${res4Post.indicatorResults.find(i => i.id === 'QI-10')?.score}%`);
  if (res4Post.overallScore <= res4.overallScore) throw new Error('Score did not improve after QI-10 patch');
  console.log('  -> PASS\n');

  // Test 5: Scenario 5 - Full APO Submission & Schema Integrity
  console.log('[TEST 5] Scenario 5 - Full APO Submission & SHA-256 Checksum');
  const res5 = await evaluateBSPDocument(scenario5_FullAPOSubmissionBSP);
  const jsonPkg = generateAuditJsonPackage(res5, scenario5_FullAPOSubmissionBSP);
  const jsonStr = JSON.stringify(jsonPkg, null, 2);
  const integrity = validateAuditPackageIntegrity(jsonStr);
  console.log(`  - Integrity Valid: ${integrity.isValid}`);
  console.log(`  - Expected Hash: ${integrity.expectedHash}`);
  console.log(`  - Calculated Hash: ${integrity.calculatedHash}`);
  if (!integrity.isValid) throw new Error(`Integrity validation failed: ${integrity.errors.join(', ')}`);
  
  // Test Tampering Detection
  const tamperedPkg = JSON.parse(jsonStr);
  tamperedPkg.overallScorecard.finalQualityScore = 99; // Tamper with score
  const tamperedValidation = validateAuditPackageIntegrity(JSON.stringify(tamperedPkg));
  console.log(`  - Tampered Package Valid: ${tamperedValidation.isValid} (Expected false)`);
  if (tamperedValidation.isValid) throw new Error('Tampered package should fail validation');
  console.log('  -> PASS\n');

  // Test 6: Empty BSP & Adversarial Malicious Inputs
  console.log('[TEST 6] Empty BSP & Adversarial Inputs');
  const resEmpty = await evaluateBSPDocument(emptyBSP);
  console.log(`  - Empty BSP Score: ${resEmpty.overallScore}% (${resEmpty.complianceGrade})`);
  if (resEmpty.overallScore > 30) throw new Error(`Empty BSP score ${resEmpty.overallScore}% > 30%`);

  const resAdv = await evaluateBSPDocument(adversarialMaliciousBSP);
  console.log(`  - Adversarial BSP Evaluated Safely, Score: ${resAdv.overallScore}%`);
  if (typeof resAdv.overallScore !== 'number' || isNaN(resAdv.overallScore)) throw new Error('Adversarial BSP resulted in NaN');
  console.log('  -> PASS\n');

  // Test 7: Deliberation Trace Verification
  console.log('[TEST 7] Tri-Agent Deliberation Traces');
  console.log(`  - Trace Count: ${res1.deliberationTraces.length}`);
  res1.deliberationTraces.forEach((t, i) => {
    console.log(`    [Trace ${i+1}] ${t.agentRole} | ${t.stage} | sentiment: ${t.sentiment} | focus: ${t.focusIndicator || 'N/A'}`);
  });
  if (res1.deliberationTraces.length < 3) throw new Error('Fewer than 3 deliberation traces');
  console.log('  -> PASS\n');

  console.log('================================================================================');
  console.log('        ALL PRODUCTION ENGINE DIRECT VERIFICATIONS PASSED 100%!                 ');
  console.log('================================================================================');
}

runDirectVerification().catch(err => {
  console.error('VERIFICATION FAILURE:', err);
  process.exit(1);
});
