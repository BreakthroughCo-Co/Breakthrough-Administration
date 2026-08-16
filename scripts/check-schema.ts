import { evaluateBSPDocument } from '../lib/bsp-auditor/agent-evaluator';
import { generateAuditJsonPackage } from '../lib/bsp-auditor/apo-exporter';
import { scenario1_CompliantBSP } from '../tests/fixtures/sample-bsps';
import { NDIS_APO_AUDIT_PACKAGE_SCHEMA } from '../tests/fixtures/ndis-draft07-schema';
import { validateDraft07Schema } from '../tests/helpers/assertion-utils';

async function check() {
  const auditPkg = await evaluateBSPDocument(scenario1_CompliantBSP);
  const jsonPkg = generateAuditJsonPackage(auditPkg, scenario1_CompliantBSP);

  console.log('Deliberation trace item in generated JSON:', jsonPkg.deliberationTraces[0]);

  const val1 = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
  console.log('Schema validation result without message:', val1.valid, val1.errors);

  // If message is added:
  jsonPkg.deliberationTraces = jsonPkg.deliberationTraces.map((t: any) => ({
    ...t,
    message: t.reasoning || 'Deliberation trace details'
  }));

  const val2 = validateDraft07Schema(jsonPkg, NDIS_APO_AUDIT_PACKAGE_SCHEMA);
  console.log('Schema validation result WITH message:', val2.valid, val2.errors);
}

check();
