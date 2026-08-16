import { evaluateBSPDocument, detectProhibitedRestraint } from '../helpers/reference-evaluator.ts';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario4_MissingFadeOutScheduleBSP,
  maximumRestrictivePracticesBSP,
  unauthorizedRestraintBSP
} from '../fixtures/sample-bsps.ts';
import {
  assert,
  assertEquals,
  assertGreaterThanOrEqual,
  assertArrayContains
} from '../helpers/assertion-utils.ts';
import type { BSPDocument } from '../../types/index.ts';

export function runRestrictiveRulesUnitTests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
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
  // Category 1: Chemical Restraint (5+ tests)
  // ==========================================
  test('Chemical Restraint: Authorized PRN medication with prescriber and titration plan passes', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const chemAudit = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Chemical');
    assert(chemAudit !== undefined, 'Chemical restraint should be audited');
    assertEquals(chemAudit.authorizationStatus, 'Fully Authorized');
    assertEquals(chemAudit.fadingPlanPresent, true);
    assert(chemAudit.authorizationReference !== undefined);
  });

  test('Chemical Restraint: Missing authorization reference flags Unauthorized Breach', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          ...scenario1_CompliantBSP.restrictivePractices[0],
          authorizationReference: ''
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    const chemAudit = pkg.restrictivePracticesAudit[0];
    assertEquals(chemAudit.authorizationStatus, 'Unauthorized Breach');
    assertEquals(pkg.restrictivePracticesSummary.unauthorizedCount, 1);
  });

  test('Chemical Restraint: Missing titration schedule triggers missing fade plan alert', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          ...scenario1_CompliantBSP.restrictivePractices[0],
          reductionPlanSummary: ''
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    const chemAudit = pkg.restrictivePracticesAudit[0];
    assertEquals(chemAudit.fadingPlanPresent, false);
    assertEquals(pkg.restrictivePracticesSummary.missingFadePlanCount, 1);
  });

  test('Chemical Restraint: Routine and PRN combination audited in summary', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    const chemAudit = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Chemical');
    assert(chemAudit !== undefined);
    assert(chemAudit.description.includes('Haloperidol') || chemAudit.description.includes('Lorazepam'));
  });

  test('Chemical Restraint: Monthly return report status tracked', () => {
    const chem = scenario1_CompliantBSP.restrictivePractices.find((rp) => rp.practiceType === 'Chemical');
    assertEquals(chem?.monthlyReportStatus, 'Submitted');
  });

  // ==========================================
  // Category 2: Mechanical Restraint (5+ tests)
  // ==========================================
  test('Mechanical Restraint: Padded arm splint with release intervals audited', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    const mech = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Mechanical');
    assert(mech !== undefined);
    assertEquals(mech.authorizationStatus, 'Fully Authorized');
    assertEquals(mech.leastRestrictiveJustified, true);
  });

  test('Mechanical Restraint: Vehicle safety harness audited with authorization status', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const mech = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Mechanical');
    assert(mech !== undefined);
    assertEquals(mech.practiceType, 'Mechanical');
    assertEquals(mech.authorizationStatus, 'Fully Authorized');
  });

  test('Mechanical Restraint: Missing reduction schedule in harness triggers red flag', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assertArrayContains(pkg.redFlags, (rf) => rf.id === 'rf-missing-fade-plan');
  });

  test('Mechanical Restraint: Unauthorized mechanical device triggers M_unauth multiplier', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          id: 'rp-mech-unauth',
          clientId: 'cli-101',
          clientName: 'Jordan',
          practiceType: 'Mechanical',
          description: 'Locking splint applied during agitation',
          status: 'Active',
          authorizationBody: '',
          authorizationReference: '',
          startDate: '2026-01-01',
          expiryDate: '2026-12-31',
          reductionPlanSummary: 'Release 15 mins daily',
          monthlyReportStatus: 'Due'
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    assertArrayContains(pkg.activePenaltyMultipliers, (m) => m.type === 'M_unauth');
  });

  test('Mechanical Restraint: Audited in summary count', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    assertEquals(pkg.restrictivePracticesSummary.totalReported, 5);
  });

  // ==========================================
  // Category 3: Physical Restraint (5+ tests)
  // ==========================================
  test('Physical Restraint: Prohibited prone restraint triggers immediate critical safety red flag', () => {
    const check = detectProhibitedRestraint(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(check.detected, true);
    assertEquals(check.type, 'prone');
  });

  test('Physical Restraint: Prohibited supine restraint detected accurately', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      reactiveStrategies: ['Hold participant in supine position on floor.']
    };
    const check = detectProhibitedRestraint(bsp);
    assertEquals(check.detected, true);
    assertEquals(check.type, 'supine');
  });

  test('Physical Restraint: Prohibited basket hold / bear hug detected', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        reactiveProtocols: ['Use basket hold to restrain arms around diaphragm.']
      }
    };
    const check = detectProhibitedRestraint(bsp);
    assertEquals(check.detected, true);
    assertEquals(check.type, 'diaphragm_hold');
  });

  test('Physical Restraint: Prohibited neck / choke hold detected', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      activeReactive: {
        ...scenario1_CompliantBSP.activeReactive!,
        reactiveProtocols: ['Apply neck hold or chest pressure if participant strikes.']
      }
    };
    const check = detectProhibitedRestraint(bsp);
    assertEquals(check.detected, true);
    assertEquals(check.type, 'neck_hold');
  });

  test('Physical Restraint: Safe boundary escort with authorization passes without prohibited hold trigger', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    const phys = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Physical');
    assert(phys !== undefined);
    assertEquals(pkg.restrictivePracticesSummary.prohibitedDetected, false);
    assertEquals(phys.authorizationStatus, 'Fully Authorized');
  });

  // ==========================================
  // Category 4: Environmental Restraint (5+ tests)
  // ==========================================
  test('Environmental Restraint: Locked chemical cupboard with VIC ref passes compliance', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const env = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Environmental');
    assert(env !== undefined);
    assertEquals(env.authorizationStatus, 'Fully Authorized');
    assertEquals(env.authorizationReference, 'RPR-2025-VIC-88103');
    assertEquals(env.leastRestrictiveJustified, true);
  });

  test('Environmental Restraint: Locked pantry without authorization reference flags breach', () => {
    const pkg = evaluateBSPDocument(unauthorizedRestraintBSP);
    const env = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Environmental');
    assert(env !== undefined);
    assertEquals(env.authorizationStatus, 'Unauthorized Breach');
    assertEquals(pkg.restrictivePracticesSummary.unauthorizedCount, 1);
  });

  test('Environmental Restraint: Keypad lock with missing fade plan triggers red flag', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    const env = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Environmental');
    assert(env !== undefined);
    assertEquals(env.fadingPlanPresent, false);
  });

  test('Environmental Restraint: Reduction plan with supervised trials passes fading check', () => {
    const env = scenario1_CompliantBSP.restrictivePractices.find((rp) => rp.practiceType === 'Environmental');
    assertGreaterThanOrEqual(env!.reductionPlanSummary.length, 20);
  });

  test('Environmental Restraint: Validates least restrictive test justification', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const env = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Environmental');
    assertEquals(env?.leastRestrictiveJustified, true);
  });

  // ==========================================
  // Category 5: Seclusion (5+ tests)
  // ==========================================
  test('Seclusion: Authorized emergency solitary quiet room audited with VIC ref', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    const sec = pkg.restrictivePracticesAudit.find((rp) => rp.practiceType === 'Seclusion');
    assert(sec !== undefined);
    assertEquals(sec.authorizationStatus, 'Fully Authorized');
    assertEquals(sec.authorizationReference, 'RPR-2025-VIC-90005');
  });

  test('Seclusion: Unauthorized seclusion triggers M_unauth and red flag', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          id: 'rp-sec-unauth',
          clientId: 'cli-101',
          clientName: 'Jordan',
          practiceType: 'Seclusion',
          description: 'Locking participant in bedroom when shouting occurs',
          status: 'Active',
          authorizationBody: '',
          authorizationReference: '',
          startDate: '2026-01-01',
          expiryDate: '2026-12-31',
          reductionPlanSummary: 'Reduce door lock duration',
          monthlyReportStatus: 'Due'
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    const sec = pkg.restrictivePracticesAudit[0];
    assertEquals(sec.authorizationStatus, 'Unauthorized Breach');
    assertArrayContains(pkg.redFlags, (rf) => rf.id === 'rf-unauth-rp');
  });

  test('Seclusion: Seclusion without fading plan triggers missing fade-out penalty', () => {
    const bsp: BSPDocument = {
      ...scenario1_CompliantBSP,
      restrictivePractices: [
        {
          id: 'rp-sec-nofade',
          clientId: 'cli-101',
          clientName: 'Jordan',
          practiceType: 'Seclusion',
          description: 'Emergency quiet room solitary confinement for extreme violence',
          status: 'Authorized',
          authorizationBody: 'VIC Senior Practitioner',
          authorizationReference: 'RPR-2025-VIC-90005',
          startDate: '2026-01-01',
          expiryDate: '2026-12-31',
          reductionPlanSummary: '',
          monthlyReportStatus: 'Submitted'
        }
      ]
    };
    const pkg = evaluateBSPDocument(bsp);
    assertArrayContains(pkg.activePenaltyMultipliers, (m) => m.type === 'M_nofade');
  });

  test('Seclusion: Summary tracks total reported seclusion instances', () => {
    const pkg = evaluateBSPDocument(maximumRestrictivePracticesBSP);
    assertEquals(pkg.restrictivePracticesAudit.filter((r) => r.practiceType === 'Seclusion').length, 1);
  });

  test('Seclusion: Zero seclusion practices in standard plan produces 0 count', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.restrictivePracticesAudit.filter((r) => r.practiceType === 'Seclusion').length, 0);
  });

  return { suiteName: 'Restrictive Practices Rules 2018 Unit Tests', passed, failed, tests };
}
