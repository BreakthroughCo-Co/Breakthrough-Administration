import { evaluateBSPDocument, applyRemediationPatch } from '../tests/helpers/reference-evaluator.ts';
import { scenario2_ProhibitedPhysicalRestraintBSP } from '../tests/fixtures/sample-bsps.ts';

const bsp = JSON.parse(JSON.stringify(scenario2_ProhibitedPhysicalRestraintBSP));
const initialPkg = evaluateBSPDocument(bsp);
console.log('Initial score:', initialPkg.overallScore);
console.log('Prohibited detected:', initialPkg.restrictivePracticesSummary.prohibitedDetected);
console.log('Red flags:', initialPkg.redFlags.map(rf => `${rf.id} (${rf.affectedIndicator})`));

// Apply prohibited flag patch
const prohibFlag = initialPkg.redFlags.find(rf => rf.id === 'rf-prohib-restraint')!;
const patch1 = applyRemediationPatch(bsp, prohibFlag);
const pkg1 = evaluateBSPDocument(patch1.updatedBsp);
console.log('\nAfter patch 1 (prohibFlag):');
console.log('Score:', pkg1.overallScore);
console.log('Prohibited detected:', pkg1.restrictivePracticesSummary.prohibitedDetected);
console.log('Active multipliers:', pkg1.activePenaltyMultipliers.map(m => m.type));
console.log('Reactive protocols:', patch1.updatedBsp.activeReactive.reactiveProtocols);
console.log('Reactive strategies in BSP root:', patch1.updatedBsp.reactiveStrategies);
console.log('Restrictive practice description:', patch1.updatedBsp.restrictivePractices[0].description);
