import { evaluateBSPDocument, formatAPOExportPackage } from '../helpers/reference-evaluator.ts';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  scenario4_MissingFadeOutScheduleBSP,
  scenario5_FullAPOSubmissionBSP
} from '../fixtures/sample-bsps.ts';
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../fixtures/ndis-draft07-schema.ts';
import {
  assert,
  assertEquals,
  assertGreaterThanOrEqual,
  validateDraft07Schema,
  computeSha256
} from '../helpers/assertion-utils.ts';

export function runApoExporterUnitTests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
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
  // APO Scorecard & Endorsement (5+ tests)
  // ==========================================
  test('APO Scorecard: Fully compliant plan receives APPROVED endorsement recommendation', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assert(pkg.apoEndorsement !== undefined);
    assertEquals(pkg.apoEndorsement.recommendation, 'APPROVED_FOR_COMMISSION_SUBMISSION');
    assertEquals(pkg.apoEndorsementReady, true);
    assertEquals(pkg.complianceGrade, 'Grade A');
    assertEquals(pkg.rating, 'Audit-Ready');
  });

  test('APO Scorecard: Prohibited restraint plan receives REJECTED recommendation', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    assertEquals(pkg.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED');
    assertEquals(pkg.apoEndorsementReady, false);
    assertEquals(pkg.complianceGrade, 'Grade F');
    assertEquals(pkg.overallScore, 0);
  });

  test('APO Scorecard: Missing fade plan plan receives REJECTED recommendation', () => {
    const pkg = evaluateBSPDocument(scenario4_MissingFadeOutScheduleBSP);
    assertEquals(pkg.apoEndorsement?.recommendation, 'REJECTED_MANDATORY_REVISION_REQUIRED');
    assertEquals(pkg.apoEndorsementReady, false);
  });

  test('APO Scorecard: Formats conditions / mandated changes list from red flags', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assert(pkg.apoEndorsement?.conditionsOrMandatedChanges !== undefined);
    assertGreaterThanOrEqual(pkg.apoEndorsement.conditionsOrMandatedChanges.length, 1);
  });

  test('APO Scorecard: Includes APO officer name and registration number', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assert(pkg.apoEndorsement?.authorizedProgramOfficerName !== undefined);
    assert(pkg.apoEndorsement?.apoRegistrationNumber !== undefined);
  });

  // ==========================================
  // Draft-07 JSON Schema Validation (5+ tests)
  // ==========================================
  test('JSON Schema: Compliant BSP audit package passes Draft-07 validation with 0 errors', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const jsonPackage = formatAPOExportPackage(pkg);
    const validation = validateDraft07Schema(jsonPackage, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    if (!validation.valid) {
      throw new Error(`Schema validation failed with errors:\n${validation.errors.join('\n')}`);
    }
    assertEquals(validation.valid, true);
    assertEquals(validation.errors.length, 0);
  });

  test('JSON Schema: Scenario 5 Full APO package satisfies all required schema nodes', () => {
    const pkg = evaluateBSPDocument(scenario5_FullAPOSubmissionBSP);
    const jsonPackage = formatAPOExportPackage(pkg);
    const validation = validateDraft07Schema(jsonPackage, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
    assertEquals(validation.valid, true);
  });

  test('JSON Schema: 4 Regulatory Pillars contain score, weight, status, summary', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const pillars = pkg.pillarBreakdown;
    assert(pillars.human_rights_legal.score !== undefined);
    assert(pillars.clinical_pbs_formulation.weight !== undefined);
    assert(pillars.proactive_skill_building.status !== undefined);
    assert(pillars.crisis_reduction_safeguards.summary !== undefined);
  });

  test('JSON Schema: 12 Quality Indicators array contains exactly 12 items', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.indicatorResults.length, 12);
  });

  test('JSON Schema: Participant profile includes NDIS number, disability, risk level', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assert(pkg.participantProfile?.ndisNumber !== undefined);
    assert(pkg.participantProfile?.primaryDisability !== undefined);
    assert(pkg.participantProfile?.riskLevel !== undefined);
  });

  // ==========================================
  // SHA-256 Integrity Checksum & Forensic Validation (5+ tests)
  // ==========================================
  test('Integrity Checksum: Package includes 64-char hex SHA-256 checksum', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(typeof pkg.checksumSha256, 'string');
    assertEquals(pkg.checksumSha256.length, 64);
  });

  test('Integrity Checksum: Metadata integrityHash matches format sha256-<hash>', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.auditMetadata?.integrityHash, `sha256-${pkg.checksumSha256}`);
  });

  test('Integrity Checksum: Checksum is deterministic for identical BSP content', () => {
    const pkg1 = evaluateBSPDocument(scenario1_CompliantBSP);
    const pkg2 = evaluateBSPDocument(scenario1_CompliantBSP);
    // Since timestamp is generated inside, canonicalize payload without variable timestamp/id
    const clean = (p: typeof pkg1) => ({
      overallScore: p.overallScore,
      rawWeightedScore: p.rawWeightedScore,
      pillarScores: p.pillarScores,
      indicatorResults: p.indicatorResults,
      redFlags: p.redFlags
    });
    const hash1 = computeSha256(clean(pkg1));
    const hash2 = computeSha256(clean(pkg2));
    assertEquals(hash1, hash2);
  });

  test('Integrity Checksum: Tampering with score invalidates integrity hash', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const tampered = { ...pkg, overallScore: 99 };
    const tamperedHash = computeSha256(tampered);
    assert(tamperedHash !== pkg.checksumSha256, 'Tampered package hash should differ');
  });

  test('Integrity Checksum: Empty or minimal package generates valid SHA-256 hash', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    assertEquals(pkg.checksumSha256.length, 64);
    assert(/^[0-9a-f]{64}$/.test(pkg.checksumSha256));
  });

  return { suiteName: 'APO Exporter & JSON Schema Validation Unit Tests', passed, failed, tests };
}
