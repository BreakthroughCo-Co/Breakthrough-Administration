/**
 * Master Test Runner Script: NDIS BSP Quality & Safeguards Compliance Auditor
 * Executable via: `node --experimental-strip-types scripts/run-bsp-tests.ts` or `npx tsx scripts/run-bsp-tests.ts`
 */

import { runIndicatorsUnitTests } from '../tests/unit/bsp-indicators.test.ts';
import { runRestrictiveRulesUnitTests } from '../tests/unit/bsp-restrictive-rules.test.ts';
import { runMultiAgentUnitTests } from '../tests/unit/bsp-multi-agent.test.ts';
import { runRemediationUnitTests } from '../tests/unit/bsp-remediation.test.ts';
import { runApoExporterUnitTests } from '../tests/unit/bsp-apo-exporter.test.ts';
import { runUIComponentsUnitTests } from '../tests/unit/bsp-ui-components.test.ts';
import { runE2ETests } from '../tests/e2e/bsp-audit-e2e.test.ts';

interface SuiteResult {
  suiteName: string;
  passed: number;
  failed: number;
  tests: { name: string; status: 'pass' | 'fail'; error?: string }[];
}

function main() {
  const startTime = Date.now();
  console.log('================================================================================');
  console.log('       NDIS BSP QUALITY & SAFEGUARDS COMPLIANCE AUDITOR TEST RUNNER             ');
  console.log('================================================================================');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: Node ${process.version} on ${process.platform}\n`);

  const suites: SuiteResult[] = [
    runIndicatorsUnitTests(),
    runRestrictiveRulesUnitTests(),
    runMultiAgentUnitTests(),
    runRemediationUnitTests(),
    runApoExporterUnitTests(),
    runUIComponentsUnitTests(),
    runE2ETests()
  ];

  let grandTotalPassed = 0;
  let grandTotalFailed = 0;
  let grandTotalTests = 0;

  for (const suite of suites) {
    const suiteTotal = suite.passed + suite.failed;
    grandTotalPassed += suite.passed;
    grandTotalFailed += suite.failed;
    grandTotalTests += suiteTotal;

    const suiteStatusTag = suite.failed === 0 ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`${suiteStatusTag} Suite: ${suite.suiteName} (${suite.passed}/${suiteTotal} passed)`);
    console.log(`--------------------------------------------------------------------------------`);

    for (const t of suite.tests) {
      if (t.status === 'pass') {
        console.log(`  \x1b[32m✔\x1b[0m ${t.name}`);
      } else {
        console.log(`  \x1b[31m✖ ${t.name}\x1b[0m`);
        console.log(`    \x1b[33mError:\x1b[0m ${t.error}`);
      }
    }
  }

  const durationMs = Date.now() - startTime;
  const passRate = grandTotalTests > 0 ? ((grandTotalPassed / grandTotalTests) * 100).toFixed(1) : '0';

  console.log('\n================================================================================');
  console.log('                           FINAL TEST SUITE SUMMARY                             ');
  console.log('================================================================================');
  console.log(`  Total Test Suites  : ${suites.length}`);
  console.log(`  Total Test Cases   : ${grandTotalTests}`);
  console.log(`  Total Passed       : \x1b[32m${grandTotalPassed}\x1b[0m`);
  console.log(`  Total Failed       : ${grandTotalFailed > 0 ? `\x1b[31m${grandTotalFailed}\x1b[0m` : '0'}`);
  console.log(`  Pass Rate          : ${grandTotalFailed === 0 ? `\x1b[32m${passRate}%\x1b[0m` : `\x1b[31m${passRate}%\x1b[0m`}`);
  console.log(`  Duration           : ${durationMs}ms`);
  console.log('================================================================================');

  if (grandTotalFailed > 0) {
    console.error(`\n\x1b[31m✖ TEST SUITE FAILED: ${grandTotalFailed} assertions failed.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`\n\x1b[32m✔ ALL ${grandTotalPassed} TEST CASES PASSED CLEANLY (100% PASS RATE).\x1b[0m\n`);
    process.exit(0);
  }
}

main();
