import { evaluateBSPDocument } from '../tests/helpers/reference-evaluator.ts';
import { generateRemediationForIndicator, applyRemediationPatch } from '../lib/bsp-auditor/remediation-engine.ts';
import { scenario2_ProhibitedPhysicalRestraintBSP } from '../tests/fixtures/sample-bsps.ts';
import { NDISQualityIndicatorId } from '../types/bsp-audit.ts';

let bsp = JSON.parse(JSON.stringify(scenario2_ProhibitedPhysicalRestraintBSP));

const allIndicators: NDISQualityIndicatorId[] = [
  'QI-01', 'QI-02', 'QI-03', 'QI-04', 'QI-05', 'QI-06',
  'QI-07', 'QI-08', 'QI-09', 'QI-10', 'QI-11', 'QI-12'
];

for (const ind of allIndicators) {
  const patch = generateRemediationForIndicator(bsp, ind);
  if (patch.patchApplied) {
    bsp = patch.updatedBsp;
  }
}

// In Scenario 2, restrictivePractices[0].description also has prone text
// If restrictivePractices description is also sanitized:
bsp.restrictivePractices[0].description = '2-person standing breakaway boundary escort strictly during imminent roadway danger.';

const pkg = evaluateBSPDocument(bsp);
console.log('Score after remediating all 12 indicators:', pkg.overallScore);
console.log('Grade:', pkg.complianceGrade);
console.log('Rating:', pkg.rating);
console.log('APO Endorsement recommendation:', pkg.apoEndorsement?.recommendation);
console.log('Pillars:', pkg.pillarScores);
console.log('Red flags:', pkg.redFlags.map(rf => rf.id));
