import { evaluateBSPDocument } from '../helpers/reference-evaluator.ts';
import {
  scenario1_CompliantBSP,
  scenario2_ProhibitedPhysicalRestraintBSP,
  scenario3_IncompleteHypothesisBSP,
  unauthorizedRestraintBSP
} from '../fixtures/sample-bsps.ts';
import {
  assert,
  assertEquals,
  assertGreaterThanOrEqual,
  assertArrayContains
} from '../helpers/assertion-utils.ts';

export function runMultiAgentUnitTests(): { suiteName: string; passed: number; failed: number; tests: { name: string; status: 'pass' | 'fail'; error?: string }[] } {
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
  // Agent 1: Human Rights & Legal Safeguards Agent (5+ tests)
  // ==========================================
  test('Agent 1: Human Rights Agent generates specialist analysis trace on compliant BSP', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const hrTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards');
    assert(hrTrace !== undefined, 'Human Rights trace should exist');
    assertEquals(hrTrace.sentiment, 'compliant');
    assertArrayContains(hrTrace.citedRules, (r) => r.includes('NDIS Rules 2018'));
  });

  test('Agent 1: Flags critical breach when prohibited physical restraint is present', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    const hrTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards');
    assert(hrTrace !== undefined);
    assertEquals(hrTrace.sentiment, 'critical_breach');
    assert(hrTrace.message.includes('CRITICAL BREACH'));
    assert(hrTrace.message.includes('Rule 8'));
  });

  test('Agent 1: Flags warning when unauthorized restrictive practice is found', () => {
    const pkg = evaluateBSPDocument(unauthorizedRestraintBSP);
    const hrTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards');
    assert(hrTrace !== undefined);
    assertEquals(hrTrace.sentiment, 'critical_breach');
    assert(hrTrace.message.includes('lack state authorization'));
  });

  test('Agent 1: Cites UN CRPD Article 12 and NDIS Act 2013', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const hrTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards');
    assertArrayContains(hrTrace!.citedRules, (r) => r.includes('UN CRPD'));
  });

  test('Agent 1: Focus indicator targets QI-09 / Restrictive Practices', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const hrTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'human_rights_legal_safeguards');
    assertEquals(hrTrace?.indicatorId, 'QI-09');
  });

  // ==========================================
  // Agent 2: Clinical PBS Specialist Agent (5+ tests)
  // ==========================================
  test('Agent 2: Clinical PBS Agent validates compliant behavioral formulation', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const pbsTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist');
    assert(pbsTrace !== undefined, 'Clinical PBS trace should exist');
    assertEquals(pbsTrace.sentiment, 'compliant');
    assert(pbsTrace.message.includes('Clinical formulation reviewed'));
  });

  test('Agent 2: Flags critical deficit when functional hypothesis is missing', () => {
    const pkg = evaluateBSPDocument(scenario3_IncompleteHypothesisBSP);
    const pbsTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist');
    assert(pbsTrace !== undefined);
    assertEquals(pbsTrace.sentiment, 'critical_breach');
    assert(pbsTrace.message.includes('CRITICAL DEFICIT'));
  });

  test('Agent 2: Cites NDIS PBS Capability Framework Standards 2.1 & 3.1', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const pbsTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist');
    assertArrayContains(pbsTrace!.citedRules, (r) => r.includes('PBS Capability Framework'));
  });

  test('Agent 2: Focus indicator targets QI-04 / FBA Hypothesis', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const pbsTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist');
    assertEquals(pbsTrace?.indicatorId, 'QI-04');
  });

  test('Agent 2: Inspects FCT and differential reinforcement schedule', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const pbsTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'clinical_pbs_specialist');
    assert(pbsTrace!.message.includes('differential reinforcement schedule verified'));
  });

  // ==========================================
  // Agent 3: Quality Panel Lead Synthesizer (5+ tests)
  // ==========================================
  test('Agent 3: Synthesizer reaches consensus on fully compliant plan', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const leadTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'quality_panel_lead_synthesizer');
    assert(leadTrace !== undefined, 'Lead Synthesizer trace should exist');
    assertEquals(leadTrace.sentiment, 'consensus_reached');
    assert(leadTrace.message.includes('Audit Synthesis Complete'));
    assert(leadTrace.message.includes('APO endorsement status: READY'));
  });

  test('Agent 3: Flags warning and blocks APO endorsement when red flags exist', () => {
    const pkg = evaluateBSPDocument(scenario2_ProhibitedPhysicalRestraintBSP);
    const leadTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'quality_panel_lead_synthesizer');
    assert(leadTrace !== undefined);
    assertEquals(leadTrace.sentiment, 'warning');
    assert(leadTrace.message.includes('APO endorsement status: BLOCKED'));
  });

  test('Agent 3: Synthesizes final score and compliance grade', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const leadTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'quality_panel_lead_synthesizer');
    assert(leadTrace!.message.includes(String(pkg.overallScore)));
    assert(leadTrace!.message.includes(pkg.complianceGrade));
  });

  test('Agent 3: Deliberation trace contains all 3 agents in order', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    assertEquals(pkg.deliberationTraces.length, 3);
    assertEquals(pkg.deliberationTraces[0].agentRole, 'human_rights_legal_safeguards');
    assertEquals(pkg.deliberationTraces[1].agentRole, 'clinical_pbs_specialist');
    assertEquals(pkg.deliberationTraces[2].agentRole, 'quality_panel_lead_synthesizer');
  });

  test('Agent 3: Stage progression reaches final_synthesis', () => {
    const pkg = evaluateBSPDocument(scenario1_CompliantBSP);
    const leadTrace = pkg.deliberationTraces.find((t) => t.agentRole === 'quality_panel_lead_synthesizer');
    assertEquals(leadTrace?.stage, 'final_synthesis');
  });

  return { suiteName: 'Multi-Agent Deliberation Pipeline Unit Tests', passed, failed, tests };
}
