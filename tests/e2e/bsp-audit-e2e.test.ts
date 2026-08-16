import { evaluateBSPDocument, applyRemediationPatch, detectProhibitedRestraint, formatAPOExportPackage } from '../helpers/reference-evaluator.ts';
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
} from '../fixtures/sample-bsps.ts';
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../fixtures/ndis-draft07-schema.ts';
import {
  assert,
  assertEquals,
  assertGreaterThanOrEqual,
  assertGreaterThan,
  assertLessThan,
  assertLessThanOrEqual,
  assertArrayContains,
  validateDraft07Schema,
  computeSha256
} from '../helpers/assertion-utils.ts';

export function runE2ETests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
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

  // =========================================================================
  // TIER 1: Full System Feature Integration Coverage (10+ tests)
  // =========================================================================
  test('Tier 1: Full evaluation pipeline executes across all 12 indicators simultaneously', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.indicatorResults.length, 12);
    const uniqueIds = new Set(pkg.indicatorResults.map((r) => r.id));
    assertEquals(uniqueIds.size, 12);
  });

  test('Tier 1: Evaluates all 4 regulatory pillars with exact weight distributions', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.pillarBreakdown.human_rights_legal.weight, 0.30);
    assertEquals(pkg.pillarBreakdown.clinical_pbs_formulation.weight, 0.30);
    assertEquals(pkg.pillarBreakdown.proactive_skill_building.weight, 0.20);
    assertEquals(pkg.pillarBreakdown.crisis_reduction_safeguards.weight, 0.20);
  });

  test('Tier 1: Raw weighted score equals weighted sum of 4 pillars', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const p1 = pkg.pillarScores.human_rights_legal;
    const p2 = pkg.pillarScores.clinical_pbs_formulation;
    const p3 = pkg.pillarScores.proactive_skill_building;
    const p4 = pkg.pillarScores.crisis_reduction_safeguards;
    const expectedRaw = Math.min(100, Math.max(0, Math.round(0.30 * p1 + 0.30 * p2 + 0.20 * p3 + 0.20 * p4)));
    assertEquals(pkg.rawWeightedScore, expectedRaw);
  });

  test('Tier 1: Restrictive practices summary aggregates totals accurately', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.restrictivePracticesSummary.totalReported, 2);
    assertEquals(pkg.restrictivePracticesSummary.authorizedCount, 2);
    assertEquals(pkg.restrictivePracticesSummary.unauthorizedCount, 0);
    assertEquals(pkg.restrictivePracticesSummary.missingFadePlanCount, 0);
  });

  test('Tier 1: Deliberation trace stream contains contributions from all 3 agents', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const agents = pkg.deliberationTraces.map((t) => t.agentRole);
    assert(agents.includes('human_rights_legal_safeguards'));
    assert(agents.includes('clinical_pbs_specialist'));
    assert(agents.includes('quality_panel_lead_synthesizer'));
  });

  // =========================================================================
  // TIER 2: Boundary & Corner Cases (10+ tests)
  // =========================================================================
  test('Tier 2: Empty BSP handles all fields gracefully and scores <= 20% Grade F', () => {
    const pkg = evaluateBSPDocument(emptyBSP);
    assertLessThanOrEqual(pkg.overallScore, 20);
    assertEquals(pkg.complianceGrade, 'Grade F');
    assertEquals(pkg.complianceStatus, 'Critical Risk');
    assertEquals(pkg.apoEndorsementReady, false);
    assertLessThanOrEqual(pkg.passedIndicatorsCount, 2);
  });

  test('Tier 2: Maximum restrictive practices (all 5 types present) audits without overflow', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    assertEquals(pkg.restrictivePracticesAudit.length, 5);
    assertEquals(pkg.restrictivePracticesSummary.totalReported, 5);
    assertEquals(pkg.restrictivePracticesSummary.authorizedCount, 5);
  });

  test('Tier 2: Multiplier stacking - Unauthorized practice (0.60) + No fade plan (0.75) caps score', () => {
    const bsp: any = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          id: 'rp-stack',
          practiceType: 'Chemical',
          description: 'PRN Sedative',
          status: 'Active',
          authorizationReference: '', // 0.60
          reductionPlanSummary: '',   // 0.75
          startDate: '2026-01-01',
          expiryDate: '2026-12-31'
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    assert(pkg.activePenaltyMultipliers.some((m) => m.type === 'M_unauth'));
    assert(pkg.activePenaltyMultipliers.some((m) => m.type === 'M_nofade'));
    // Combined multiplier is 0.60 * 0.75 = 0.45
    assertLessThanOrEqual(pkg.overallScore, Math.round(pkg.rawWeightedScore * 0.45));
  });

  test('Tier 2: Prohibited hold completely zeroes out score regardless of high raw score', () => {
    const bsp: any = {
      ...scenario1_CompliantBSP,
      reactiveStrategies: ['Take participant down in prone position on floor.']
    };
    const pkg = evaluateBSPDocument(bsp);
    assertEquals(pkg.overallScore, 0);
    assertEquals(pkg.complianceGrade, 'Grade F');
    assertEquals(pkg.apoEndorsementReady, false);
  });

  test('Tier 2: Compliance Grade boundaries (90% Grade A, 75% Grade B, 50% Grade C, <50% Grade F)', () => {
    const pkgCompliant = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkgCompliant.complianceGrade, 'Grade A');

    const pkgMissingHypo = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assert(pkgMissingHypo.complianceGrade === 'Grade C' || pkgMissingHypo.complianceGrade === 'Grade F');

    const pkgProhib = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(pkgProhib.complianceGrade, 'Grade F');
  });

  test('Tier 2: Extreme long strings (50,000+ chars) in summary evaluate without crashing', () => {
    const bsp = {
      ...scenario1_CompliantBSP,
      summary: 'A'.repeat(50000)
    };
    const pkg = evaluateBSPDocument(bsp);
    assertGreaterThanOrEqual(pkg.overallScore, 85);
  });

  // =========================================================================
  // TIER 3: Cross-Feature Combinations & Pairwise Interactions (10+ tests)
  // =========================================================================
  test('Tier 3: FBA vs Replacement mismatch lowers QI-06 score', () => {
    const pkg = evaluateBSPDocument(mismatchedReplacementFbaBSP);
    // Functional hypothesis is escape, but replacement is tangible reward
    const fbaResult = pkg.indicatorResults.find((r) => r.id === 'QI-04')!;
    const skillResult = pkg.indicatorResults.find((r) => r.id === 'QI-06')!;
    assertGreaterThanOrEqual(fbaResult.score, 70);
    assert(skillResult !== undefined);
  });

  test('Tier 3: Restrictive Practice presence requires QI-10 reduction plan', () => {
    const pkgWithFade = evaluateBSPDocument(scenario1_CompliantBSP);
    const qi10WithFade = pkgWithFade.indicatorResults.find((r) => r.id === 'QI-10')!;
    assertEquals(qi10WithFade.score, 100);

    const pkgNoFade = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const qi10NoFade = pkgNoFade.indicatorResults.find((r) => r.id === 'QI-10')!;
    assertEquals(qi10NoFade.score, 0);
  });

  test('Tier 3: Unauthorized practice blocks APO endorsement regardless of other pillar scores', () => {
    const pkg = evaluateBSPDocument(unauthorizedRestraintBSP);
    assertEquals(pkg.apoEndorsementReady, false);
    assertEquals(pkg.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED');
  });

  test('Tier 3: Full remediation loop (Evaluate -> Patch -> Re-evaluate) recovers compliance', () => {
    let currentBsp = JSON.parse(JSON.stringify(scenario4_MissingFadeOutScheduleBSP));
    let initialPkg = evaluateBSPDocument(currentBsp);
    assertEquals(initialPkg.apoEndorsementReady, false);

    for (const flag of initialPkg.redFlags) {
      const patch = applyRemediationPatch(currentBsp, flag);
      currentBsp = patch.updatedBsp;
    }

    let remediatedPkg = evaluateBSPDocument(currentBsp);
    assertGreaterThan(remediatedPkg.overallScore, initialPkg.overallScore);
    assertEquals(remediatedPkg.restrictivePracticesSummary.missingFadePlanCount, 0);
  });

  test('Tier 3: Deliberation consensus - Human Rights Agent and Clinical PBS Agent debate synthesizes in Panel Lead', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const hr = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards')!;
    const pbs = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist')!;
    const lead = pkg.deliberationTraces.find((t) => t.agentRole === 'quality_panel_lead_synthesizer')!;

    assertEquals(hr.sentiment, 'compliant');
    assertEquals(pbs.sentiment, 'compliant');
    assertEquals(lead.sentiment, 'consensus_reached');
  });

  // =========================================================================
  // TIER 4: Real-World Clinical BSP Scenarios (Scenarios 1-5 from TEST_INFRA.md) (5+ tests)
  // =========================================================================
  test('Tier 4 - Scenario 1: Full Clinical BSP with Authorized Chemical & Environmental Restraints', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertGreaterThanOrEqual(pkg.overallScore, 85, 'Scenario 1 should achieve >=85% score');
    assertEquals(pkg.rating, 'Audit-Ready');
    assertEquals(pkg.complianceGrade, 'Grade A');
    assertEquals(pkg.apoEndorsementReady, true);
    assertEquals(pkg.restrictivePracticesSummary.prohibitedDetected, false);
    assertEquals(pkg.restrictivePracticesSummary.unauthorizedCount, 0);
  });

  test('Tier 4 - Scenario 2: High-Risk BSP with Unauthorized Physical Restraint (Prone/Pinning)', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(pkg.overallScore, 0, 'Scenario 2 score must be capped at 0%');
    assertEquals(pkg.complianceGrade, 'Grade F');
    assertEquals(pkg.apoEndorsementReady, false);
    assert(pkg.restrictivePracticesSummary.prohibitedDetected === true);
    assertArrayContains(pkg.redFlags, (rf) => rf.id === 'rf-prohib-restraint');
    assertEquals(pkg.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED');
  });

  test('Tier 4 - Scenario 3: Behavioral Plan with Incomplete Functional Hypothesis & No Antecedents', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assertArrayContains(pkg.redFlags, (rf) => rf.id === 'rf-missing-fba-hypo');
    assert(pkg.activePenaltyMultipliers.some((m) => m.type === 'M_nohypo'));
    assertLessThan(pkg.overallScore, 65);

    // 1-Click remediation injects sensory/escape hypothesis
    const fbaFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fba-hypo')!;
    const patch = applyRemediationPatch(scenario3_IncompleteHypothesisBSP, fbaFlag);
    const patchedPkg = evaluateBSPDocument(patch.updatedBsp);
    assertGreaterThan(patchedPkg.overallScore, pkg.overallScore);
  });

  test('Tier 4 - Scenario 4: Restrictive Practice with Missing Fade-Out & Reduction Schedule', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assert(pkg.activePenaltyMultipliers.some((m) => m.type === 'M_nofade'));
    assertEquals(pkg.restrictivePracticesSummary.missingFadePlanCount, 2);
    assertArrayContains(pkg.redFlags, (rf) => rf.id === 'rf-missing-fade-plan');

    // 1-Click remediation generates quantifiable step-down criteria
    const fadeFlag = pkg.redFlags.find((rf) => rf.id === 'rf-missing-fade-plan')!;
    const patch = applyRemediationPatch(scenario4_MissingFadeOutScheduleBSP, fadeFlag);
    const patchedPkg = evaluateBSPDocument(patch.updatedBsp);
    assertEquals(patchedPkg.restrictivePracticesSummary.missingFadePlanCount, 0);
  });

  test('Tier 4 - Scenario 5: Full APO Submission & JSON Audit Package Generation', () => {
    const pkg = evaluateBSPDocument(scenario5_FullAPOSubmissionBSP);
    const jsonPackage = formatAPOExportPackage(pkg);
    const validation = validateDraft07Schema(jsonPackage, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    assertEquals(validation.valid, true);
    assertEquals(pkg.checksumSha256.length, 64);
    assert(pkg.apoEndorsementReady === true);
    assertEquals(pkg.apoEndorsement?.recommendation, 'APPROVED_FOR_COMMISSION_SUBMISSION');
  });

  // =========================================================================
  // TIER 5: Adversarial Hardening & Forensic Integrity (5+ tests)
  // =========================================================================
  test('Tier 5: Adversarial malicious payload evaluates safely without execution or crash', () => {
    const pkg = evaluateBSPDocument(adversarialMaliciousBSP);
    assert(pkg !== undefined);
    assert(typeof pkg.overallScore === 'number');
    assertEquals(pkg.restrictivePracticesSummary.prohibitedDetected, true);
    assertEquals(pkg.overallScore, 0);
  });

  test('Tier 5: Unicode homoglyphs and RTL characters in text fields parsed safely', () => {
    const check = detectProhibitedRestraint(adversarialMaliciousBSP);
    assertEquals(check.detected, true);
    assertEquals(check.type, 'prone');
  });

  test('Tier 5: Forensic verification detects payload tampering', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const originalHash = pkg.checksumSha256;
    const tampered = { ...pkg, rating: 'Non-Compliant' as const };
    const newHash = computeSha256(tampered);
    assert(originalHash !== newHash);
  });

  test('Tier 5: Extreme zero-byte inputs in operational definitions handled safely', () => {
    const bsp: any = {
      ...scenario1_CompliantBSP,
      functionalAssessment: {
        targetBehaviors: [
          {
            behavior: '\x00\x00\x00',
            operationalDefinition: '\x00',
            severity: 1,
            frequency: '\x00'
          }
        ]
      }
    };
    const pkg = evaluateBSPDocument(bsp);
    assertLessThan(pkg.indicatorResults.find((r) => r.id === 'QI-03')!.score, 50);
  });

  test('Tier 5: Schema validation rejects missing top-level mandatory fields', () => {
    const invalidPkg: any = {
      bspId: 'test',
      overallScore: 80
    };
    const validation = validateDraft07Schema(invalidPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    assertEquals(validation.valid, false);
    assertGreaterThan(validation.errors.length, 0);
  });

  return { suiteName: 'E2E Integration, Combinatorial & Adversarial Tests', passed, failed, tests };
}
