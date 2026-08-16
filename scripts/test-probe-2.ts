import { evaluateBSPDocument, applyRemediationPatch } from '../tests/helpers/reference-evaluator.ts';
import { scenario2_ProhibitedPhysicalRestraintBSP } from '../tests/fixtures/sample-bsps.ts';

const bsp = JSON.parse(JSON.stringify(scenario2_ProhibitedPhysicalRestraintBSP));

// Let's test what happens if all fields are sanitized:
bsp.reactiveStrategies = [
  'Immediate low-arousal positioning: Step back 2 metres, maintain neutral posture.',
  'Grant immediate access to quiet break room.'
];
bsp.activeReactive.reactiveProtocols = [
  'Maintain 2-metre safety buffer. Do NOT use physical restraint.',
  'Offer immediate access to quiet sensory room.'
];
bsp.restrictivePractices[0].description = '2-person standing breakaway boundary escort strictly during imminent roadway danger.';

const pkgAfterManualClean = evaluateBSPDocument(bsp);
console.log('Score after cleaning prohibited holds from all 3 text sources:', pkgAfterManualClean.overallScore);
console.log('Prohibited detected:', pkgAfterManualClean.restrictivePracticesSummary.prohibitedDetected);
console.log('Active multipliers:', pkgAfterManualClean.activePenaltyMultipliers.map(m => m.type));
console.log('Red flags:', pkgAfterManualClean.redFlags.map(rf => `${rf.id} (${rf.affectedIndicator})`));

// Now if we apply remaining remediations:
let current = bsp;
for (const rf of pkgAfterManualClean.redFlags) {
  const res = applyRemediationPatch(current, rf);
  if (res.patchApplied) current = res.updatedBsp;
}
const finalPkg = evaluateBSPDocument(current);
console.log('\nFinal score after batch remediating remaining flags:', finalPkg.overallScore);
console.log('Final Grade:', finalPkg.complianceGrade);
console.log('APO Endorsement recommendation:', finalPkg.apoEndorsement?.recommendation);
console.log('Remaining red flags:', finalPkg.redFlags.map(rf => `${rf.id}`));
