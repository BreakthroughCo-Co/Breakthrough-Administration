import { evaluateBSPDocument, applyRemediationPatch } from '../helpers/reference-evaluator.ts';
import {
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP,
  unauthorizedRestraintBSP
} from '../fixtures/sample-bsps.ts';
import {
  assert,
  assertEquals,
  assertGreaterThan,
  assertArrayContains
} from '../helpers/assertion-utils.ts';

export function runRemediationUnitTests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
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
  // 1-Click Remediation: Functional Hypothesis (5+ tests)
  // ==========================================
  test('Remediation: Identifies missing FBA hypothesis red flag with structured payload', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const fbaFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo');
    assert(fbaFlag !== undefined, 'FBA hypothesis red flag should be present');
    assert(fbaFlag.remediationPayload !== undefined);
    assertEquals(fbaFlag.remediationPayload.section, 'fba');
    assertEquals(fbaFlag.remediationPayload.field, 'functionalHypothesis');
  });

  test('Remediation: Applies FBA hypothesis patch to BSP document safely', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const fbaFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo')!;
    const patchResult = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);
    assertEquals(patchResult.patchApplied, true);
    assertEquals(patchResult.affectedSection, 'fba');
    assert(patchResult.updatedBsp.functionalAssessment.functionalHypothesis.length > 30);
  });

  test('Remediation: Re-evaluating after FBA hypothesis patch resolves red flag and improves score', () => {
    const initialPkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const fbaFlag = initialPkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo')!;
    const patchResult = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);

    const reevaluatedPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertGreaterThan(reevaluatedPkg.overallScore, initialPkg.overallScore);
    const remainingFbaFlag = reevaluatedPkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo');
    assertEquals(remainingFbaFlag, undefined, 'FBA red flag should be resolved');
  });

  test('Remediation: Non-destructive patch preserves existing target behaviours', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const fbaFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo')!;
    const patchResult = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);
    assertEquals(
      patchResult.updatedBsp.functionalAssessment.targetBehaviors.length,
      scenario3_IncompleteHypothesisBSP.functionalAssessment!.targetBehaviors.length
    );
  });

  test('Remediation: Immutable mutation does not alter original BSP object', () => {
    const origHypo = scenario3_IncompleteHypothesisBSP.functionalAssessment?.functionalHypothesis;
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const fbaFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo')!;
    applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);
    assertEquals(scenario3_IncompleteHypothesisBSP.functionalAssessment?.functionalHypothesis, origHypo);
  });

  // ==========================================
  // 1-Click Remediation: Restrictive Practice Fade-Out (5+ tests)
  // ==========================================
  test('Remediation: Identifies missing fade-out schedule red flag with payload', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const fadeFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan');
    assert(fadeFlag !== undefined, 'Fade plan red flag should be present');
    assertEquals(fadeFlag.affectedIndicator, 'QI-10');
    assertEquals(fadeFlag.remediationPayload?.section, 'restrictivePractices');
  });

  test('Remediation: Injects quantifiable step-down criteria into all un-faded practices', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const fadeFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan')!;
    const patchResult = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    assertEquals(patchResult.patchApplied, true);

    for (const rp of patchResult.updatedBsp.restrictivePractices) {
      assert(rp.reductionPlanSummary.length >= 20, 'Each practice should receive a reduction plan');
    }
  });

  test('Remediation: Re-evaluation removes M_nofade penalty multiplier', () => {
    const initialPkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assert(initialPkg.activePenaltyMultipliers.some((m) => m.type === 'M_nofade'));

    const fadeFlag = initialPkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan')!;
    const patchResult = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);

    const reevaluatedPkg = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reevaluatedPkg.activePenaltyMultipliers.some((m) => m.type === 'M_nofade'), false);
    assertGreaterThan(reevaluatedPkg.overallScore, initialPkg.overallScore);
  });

  test('Remediation: Preserves existing authorized reference numbers during fading injection', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const fadeFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan')!;
    const patchResult = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    assertEquals(
      patchResult.updatedBsp.restrictivePractices[0].authorizationReference,
      scenario4_MissingFadeOutScheduleBSP.restrictivePractices[0].authorizationReference
    );
  });

  test('Remediation: Summary text clearly explains applied fading steps', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const fadeFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan')!;
    const patchResult = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    assert(patchResult.summary.includes('fading plan') || patchResult.summary.includes('remediation'));
  });

  // ==========================================
  // 1-Click Remediation: Prohibited Restraint & Unauthorized Practices (5+ tests)
  // ==========================================
  test('Remediation: Replaces prohibited prone hold with non-aversive de-escalation protocol', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(pkg.overallScore, 0);
    const prohibFlag = pkg.redFlags.find((rf) => rf.id === 'rf-prohib-restraint')!;
    const patchResult = applyRemediationPatch(scenario2_ProhibitedPhysicalRestraintBSP, prohibFlag);
    assertEquals(patchResult.patchApplied, true);

    const protocols = patchResult.updatedBsp.activeReactive.reactiveProtocols;
    assert(protocols.some((p: string) => p.includes('2-metre safety buffer')));
    assert(!protocols.some((p: string) => p.includes('prone')));

    const reeval = evaluateBSPDocument(patchResult.updatedBsp);
    assertEquals(reeval.activePenaltyMultipliers.some(m => m.type === 'M_prohib'), false, 'M_prohib penalty must be cleared');
  });

  test('Remediation: Patches missing authorization reference with pending submission code', () => {
    const pkg = evaluateBSPDocument(unauthorizedRestraintBSP);
    const unauthFlag = pkg.redFlags.find((rf) => rf.id === 'rf-unauth-rp')!;
    const patchResult = applyRemediationPatch(unauthorizedRestraintBSP, unauthFlag);
    assertEquals(patchResult.patchApplied, true);
    assert(patchResult.updatedBsp.restrictivePractices[0].authorizationReference.length >= 6);
  });

  test('Remediation: Injects 3 proactive adaptations for insufficient proactive accommodations', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const proactiveFlag = pkg.redFlags.find((rf) => rf.id === 'rf-insufficient-proactive');
    if (proactiveFlag) {
      const patchResult = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, proactiveFlag);
      assertEquals(patchResult.patchApplied, true);
      assertGreaterThan(patchResult.updatedBsp.proactiveStrategies.length, scenario3_IncompleteHypothesisBSP.proactiveStrategies.length);
    }
  });

  test('Remediation: Graceful handling when red flag has no structured payload', () => {
    const mockFlag: any = {
      id: 'rf-custom',
      severity: 'medium',
      title: 'Custom Warning',
      description: 'Custom description'
    };
    const res = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, mockFlag);
    assertEquals(res.patchApplied, false);
    assertEquals(res.summary, 'No structured remediation payload available.');
  });

  test('Remediation: Multiple sequential patches compound score improvements', () => {
    let currentBsp = JSON.parse(JSON.stringify(scenario3_IncompleteHypothesisBSP));
    let pkg = evaluateBSPDocument(currentBsp);
    const score0 = pkg.overallScore;

    for (const flag of pkg.redFlags) {
      const res = applyRemediationPatch(currentBsp, flag);
      currentBsp = res.updatedBsp;
    }

    const finalPkg = evaluateBSPDocument(currentBsp);
    assertGreaterThan(finalPkg.overallScore, score0);
  });

  return { suiteName: '1-Click State Store Remediation Unit Tests', passed, failed, tests };
}
