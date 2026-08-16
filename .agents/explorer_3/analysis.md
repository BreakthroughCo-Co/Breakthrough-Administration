# NDIS Regulatory & Quality Specification Mining Report
**Author**: Explorer 3 (NDIS Regulatory & Quality Spec Miner)  
**Date**: 2026-08-16  
**Status**: Authoritative Reference Specification  
**Governing Standard**: NDIS Quality and Safeguards Commission (Australia), *National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018*, Positive Behaviour Support Capability Framework, and State/Territory Senior Practitioner Requirements.

---

## Executive Summary
This document provides the complete, authoritative specification for the **NDIS Behaviour Support Plan (BSP) Quality & Safeguards Compliance Auditor**. It defines:
1. The **12 NDIS Quality & Safeguards Commission Quality Indicators** for comprehensive BSP evaluation.
2. The **5 Regulated Restrictive Practice Categories** under the *NDIS Authorised Restrictive Practices Rules 2018* with compliance benchmarks, least-restrictive tests, and fade-out criteria.
3. The **4 Regulatory Pillars and Mathematical Scoring Model (0–100%)** with exact weightings, penalty multipliers, and audit thresholds.
4. The **Multi-Agent Deliberation Framework** for the three specialized perspectives:
   - Human Rights & Legal Safeguards Agent
   - Clinical PBS Specialist Agent
   - Quality Panel Lead Synthesizer
5. The **Official NDIS Authorised Program Officer (APO) Submission Scorecard Structure and Machine-Readable JSON Schema**.

---

## 1. The 12 NDIS Quality Indicators for BSP Evaluation

| Indicator ID | Indicator Title | Regulatory & Clinical Focus | Mandatory Evidence Items | Non-Compliance Triggers | Weight |
|:---|:---|:---|:---|:---|:---:|
| **QI-01** | Participant Profile & Person-Centred Context | Neuroaffirming identity, communication modality, sensory profile, medical/health factors, strengths, and trauma history. | Expressive/receptive communication mode, sensory preferences (hypo/hyper-reactivity), medical contraindications, likes/strengths. | Generic or missing communication mode; omission of sensory profile in sensory-sensitive diagnoses. | 8% |
| **QI-02** | Consultation & Multi-Agency Collaboration | Participant, family/guardian, support provider, and allied health engagement in plan development. | Documented consultation dates, attendee roles, participant involvement modality, nominee consent records. | Zero record of participant or support team consultation; lack of guardian engagement. | 7% |
| **QI-03** | Operational Definitions of Target Behaviours | Objective, observable, and measurable descriptions of behaviours of concern. | Verbatim operational definition, baseline frequency, duration, intensity (1–5 scale), and severity categorization. | Subjective labels (e.g. "being aggressive", "acting out") without observable motor definitions. | 8% |
| **QI-04** | Functional Behaviour Assessment (FBA) & Hypothesis Formulation | Evidence-based analysis of behavioral function derived from structured data (ABC logs, MAS, QABF). | Explicit functional hypothesis statement identifying 4 functions (Escape, Tangible, Attention, Sensory), setting events, immediate antecedents, and maintaining consequences. | Missing functional hypothesis statement; disconnect between ABC data triggers and stated hypothesis. | 10% |
| **QI-05** | Proactive Environmental & Ecological Accommodations | Pre-emptive adjustments to physical, sensory, social, and routine environments to minimize triggers. | Minimum 3 distinct environmental adaptations (e.g. lighting adjustments, visual schedules, noise mitigation, routine predictability). | Sole reliance on reactive or staff-management strategies without environmental modification. | 10% |
| **QI-06** | Skill Teaching & Functional Replacement Behaviours | Systematic acquisition of functionally equivalent, alternative skills (FCT, coping, regulation). | Clear replacement behaviour directly matching the FBA function, Functional Communication Training (FCT) protocol, reinforcement schedule (FR1/variable). | Replacement behaviour does not serve the same function as the target behaviour; absent teaching method. | 10% |
| **QI-07** | Early Warning Signs & Active De-escalation | Recognition of early physiological/behavioral precursors and non-aversive de-escalation actions. | Observable escalation precursor signs (breathing, posture, vocal cues), low-arousal verbal/environmental de-escalation steps. | Jumping directly from baseline to crisis response; punitive or demanding prompts during escalation. | 8% |
| **QI-08** | Crisis Management & Reactive Response Protocols | Graded, safety-focused, non-punitive steps during acute crisis to ensure physical and psychological safety. | Clear phase-based protocol (Agitation $\to$ Escalation $\to$ Peak $\to$ Recovery), physical distancing, bystander safety, post-peak recovery period ($\ge 20$ min). | Mandating unauthorized physical intervention; failure to specify staff safety positioning. | 7% |
| **QI-09** | Restrictive Practices Justification & Least Restrictive Test | Identification, clinical justification, and evidence of least restrictive alternatives attempted. | Categorization of all restrictive practices, specific clinical rationale, documentation of exhausted less-restrictive options, human rights impact analysis. | Undocumented restrictive practices; blanket use without least restrictive justification. | 12% |
| **QI-10** | Reduction & Fade-Out Schedule | Measurable, time-bound milestones for decreasing and eliminating restrictive practices. | Quantitative fading thresholds, graduated reduction steps, specific skill acquisition criteria triggering reduction, review timetable. | Restrictive practice without an active fade-out plan; open-ended perpetual restriction. | 10% |
| **QI-11** | Post-Incident Debriefing & Trauma-Informed Review | Structured recovery and debriefing protocols for the participant, support staff, and incident data logging. | Participant trauma-informed emotional check-in protocol, staff debriefing within 24–48 hours, ABC incident logging requirements. | Absence of participant debrief protocol; punitive debriefing conducted prior to emotional recovery. | 5% |
| **QI-12** | Implementation, Staff Training & Governance Schedule | Competency-based staff training, monitoring mechanisms, and formal review cadence. | Staff training curriculum, Authorised Program Officer (APO) submission date, annual review date ($\le 12$ months), state authorization references. | Expired review date ($> 12$ months); lack of assigned monitoring lead practitioner. | 5% |

---

## 2. The 5 Regulated Restrictive Practice Categories (NDIS Rules 2018)

Under the *National Disability Insurance Scheme (Restrictive Practices and Behaviour Support) Rules 2018 (Part 1, Section 6)*, any practice that has the effect of restricting the free movement or liberty of a person with disability must be identified, authorized, and monitored.

```
+------------------------------------------------------------------------------------------------+
|                        NDIS AUTHORISED RESTRICTIVE PRACTICES TAXONOMY                          |
+------------------------------------------------------------------------------------------------+
| 1. CHEMICAL RESTRAINT     | Medication used primarily to control behaviour (Routine / PRN)     |
| 2. MECHANICAL RESTRAINT   | Device or equipment used to subdue or restrict bodily movement    |
| 3. PHYSICAL RESTRAINT     | Direct physical contact / bodily force used to subdue movement     |
| 4. ENVIRONMENTAL RESTRAINT| Restricting access to physical parts of environment, items, doors  |
| 5. SECLUSION              | Sole confinement in a room/space where voluntary exit is prevented |
+------------------------------------------------------------------------------------------------+
```

### 2.1 Chemical Restraint
- **Statutory Definition**: The use of medication for the primary purpose of influencing a person’s behaviour or modifying behaviour of concern (excluding medication prescribed specifically for the treatment of a diagnosed mental illness or physical condition).
- **Sub-types**:
  - *Routine Chemical Restraint*: Daily or scheduled psychotropic/sedative medication.
  - *PRN (Pro Re Nata / As Needed) Chemical Restraint*: Administered on an emergency or situational basis.
- **Mandatory Compliance Criteria**:
  1. Prescribing Medical Practitioner / Psychiatrist name, AHPRA registration, and clinical rationale.
  2. Clear diagnosis and documented diagnostic formulation.
  3. Administration protocol specifying exact behavioral escalation thresholds (for PRN).
  4. Mandatory side-effect monitoring protocol (e.g. DISCUS, Dyskinesia, metabolic monitoring).
  5. Clear reduction and gradual medication titration / review plan agreed with prescriber.
  6. State/Territory Senior Practitioner Authorization Reference Number.
  7. Monthly usage reporting to the NDIS Quality and Safeguards Commission.

### 2.2 Mechanical Restraint
- **Statutory Definition**: The use of a device to prevent, restrict, or subdue a person’s movement for the primary purpose of influencing a person’s behaviour (excluding devices used for postural support or therapeutic reasons as assessed by an AHPRA registered Allied Health Practitioner).
- **Examples**: Splints, locked harnesses, bed rails for behavioral restraint, weighted garments used coercively, restrictive gloves.
- **Mandatory Compliance Criteria**:
  1. Technical description, dimensions, and specifications of the device.
  2. Occupational Therapy / Physiotherapy therapeutic clinical assessment.
  3. Maximum allowable application duration (e.g. max 15 minutes) and mandatory release intervals.
  4. Continuous or 5-minute visual observation protocol while applied.
  5. Fading plan featuring alternative sensory/physical regulation tools.
  6. State/Territory Senior Practitioner Authorization.

### 2.3 Physical Restraint
- **Statutory Definition**: The use or action of physical force to prevent, restrict, or subdue movement of a person’s body, or part of their body, for the primary purpose of influencing their behaviour (excluding reflex redirection, touch used for reassurance, or safe escort without resistance).
- **Prohibited Restraints (Rule 8 - Strictly Prohibited under Australian Law)**:
  - *Prone Restraint* (face-down restraint on chest/abdomen) $\to$ **CRITICAL FATAL RISK**
  - *Supine Restraint* (face-up restraint on back)
  - *Basket Holds / Bear Hugs* restricting diaphragm
  - *Neck / Throat holds, mechanical pressure on torso*
- **Mandatory Compliance Criteria**:
  1. Permissible strictly as an emergency reactive safety measure of last resort to prevent imminent severe physical injury.
  2. Clear specification of non-injurious, low-arousal holding techniques (e.g. open-palm boundary escort).
  3. Immediate release criterion: Must cease immediately when imminent danger has passed or within maximum 3 minutes.
  4. Post-restraint physical health assessment and vital signs check.
  5. 24-hour / 5-day NDIS Commission Reportable Incident notification.

### 2.4 Environmental Restraint
- **Statutory Definition**: Restricting a person’s free access to all parts of their environment, including items, activities, or spaces within their living or community setting.
- **Examples**: Locked kitchen cupboards, locked pantry, locked laundry/cleaning storage, delayed-egress magnetic doors, locking access to personal devices/vehicle keys.
- **Mandatory Compliance Criteria**:
  1. Exact spatial boundaries and physical items restricted.
  2. Documented safety assessment justifying why less restrictive measures (e.g. supervision, non-toxic alternatives) are insufficient.
  3. Access request procedure: How the participant can request and obtain access during daily living.
  4. Graduated fading schedule: Planned trials of supervised access and skill teaching (e.g. safe kitchen knife usage).
  5. Formal State/Territory Authorization Reference.

### 2.5 Seclusion
- **Statutory Definition**: The sole confinement of a person with disability in a room or a physical space at any hour of the day or night where voluntary exit is prevented, or not facilitated, or it is implied that voluntary exit is not permitted.
- **Mandatory Compliance Criteria**:
  1. Must only be used in emergency situations of extreme acute violence/harm as an absolute last resort.
  2. Room safety standards: No ligature points, shatterproof observation glass, emergency egress, climate control, adequate lighting.
  3. Continuous direct 1-to-1 staff visual observation throughout the period.
  4. Strict maximum duration cap (e.g. 10 minutes) with mandatory continuous clinical assessment for release.
  5. Immediate de-escalation release protocol.
  6. Senior Practitioner Approval & mandatory 24-hour NDIS Commission Incident Submission.

---

## 3. The 4 Regulatory Pillars & Mathematical Scoring Model

The Quality Scorecard aggregates findings into 4 distinct Regulatory Pillars, weighted to reflect clinical efficacy and legal compliance under Australian disability legislation.

```
+---------------------------------------------------------------------------------------------------+
|                            REGULATORY PILLARS & WEIGHT DISTRIBUTION                              |
+---------------------------------------------------------------------------------------------------+
| Pillar 1: Human Rights & Legal Safeguards                      | 30% Weight (Max 30 pts)          |
| Pillar 2: Evidence-Based Clinical PBS                          | 30% Weight (Max 30 pts)          |
| Pillar 3: Proactive Environmental & Least Restrictive Supports | 20% Weight (Max 20 pts)          |
| Pillar 4: Crisis Management, Fading & Governance               | 20% Weight (Max 20 pts)          |
+---------------------------------------------------------------------------------------------------+
| Total Baseline Score                                           | 100%                             |
+---------------------------------------------------------------------------------------------------+
```

### 3.1 Pillar Definitions and Indicator Mappings

#### Pillar 1: Human Rights & Legal Safeguards (Weight: 30%)
- **Mapped Quality Indicators**: QI-01 (Profile), QI-02 (Consultation), QI-09 (Restrictive Justification & Legal Authorization).
- **Core Verification Questions**:
  - Has informed consent/consultation been documented with the participant/nominee?
  - Are all active restrictive practices accurately categorized and legally authorized by the relevant State Senior Practitioner?
  - Does the plan demonstrate proportionality and protection of the participant's dignity of risk?
- **Pillar Sub-score Formula**:
  $$P_1 = \left( 0.25 \times S_{\text{QI-01}} \right) + \left( 0.25 \times S_{\text{QI-02}} \right) + \left( 0.50 \times S_{\text{QI-09}} \right)$$

#### Pillar 2: Evidence-Based Clinical PBS (Weight: 30%)
- **Mapped Quality Indicators**: QI-03 (Operational Definitions), QI-04 (FBA Hypothesis), QI-06 (Replacement Skills & FCT).
- **Core Verification Questions**:
  - Are target behaviours operationally defined with observable criteria?
  - Is the functional hypothesis grounded in empirical ABC/observational data across the 4 functions?
  - Is there a robust Functional Communication Training (FCT) protocol and differential reinforcement schedule?
- **Pillar Sub-score Formula**:
  $$P_2 = \left( 0.25 \times S_{\text{QI-03}} \right) + \left( 0.45 \times S_{\text{QI-04}} \right) + \left( 0.30 \times S_{\text{QI-06}} \right)$$

#### Pillar 3: Proactive Environmental & Least Restrictive Supports (Weight: 20%)
- **Mapped Quality Indicators**: QI-05 (Proactive Environmental Modifications), QI-07 (Early Warning Signs & Active De-escalation).
- **Core Verification Questions**:
  - Does the plan specify meaningful modifications to sensory, physical, and routine environments?
  - Are early precursor signs clearly identified with actionable low-arousal de-escalation techniques?
- **Pillar Sub-score Formula**:
  $$P_3 = \left( 0.50 \times S_{\text{QI-05}} \right) + \left( 0.50 \times S_{\text{QI-07}} \right)$$

#### Pillar 4: Crisis Management, Fading & Governance (Weight: 20%)
- **Mapped Quality Indicators**: QI-08 (Crisis Response), QI-10 (Reduction & Fade-Out Schedule), QI-11 (Post-Incident Debrief), QI-12 (Training & Governance).
- **Core Verification Questions**:
  - Is the reactive response non-punitive and phased with recovery intervals?
  - Is there a quantitative, milestone-driven reduction and fade-out schedule for all restrictive practices?
  - Are post-incident debriefing and staff competency training clearly scheduled?
- **Pillar Sub-score Formula**:
  $$P_4 = \left( 0.25 \times S_{\text{QI-08}} \right) + \left( 0.40 \times S_{\text{QI-10}} \right) + \left( 0.15 \times S_{\text{QI-11}} \right) + \left( 0.20 \times S_{\text{QI-12}} \right)$$

---

### 3.2 Mathematical Scoring & Penalty Multiplier Model

1. **Raw Weighted Score Calculation**:
   $$S_{\text{raw}} = 0.30 \cdot P_1 + 0.30 \cdot P_2 + 0.20 \cdot P_3 + 0.20 \cdot P_4$$
   where $P_1, P_2, P_3, P_4 \in [0, 100]$.

2. **Critical Red-Flag Multipliers ($M_k$)**:
   Severe regulatory breaches introduce multiplicative penalty factors:
   - **$M_{\text{unauth}}$ (Unauthorized Restrictive Practice)**:
     If one or more restrictive practices are present without a verified state authorization reference number:
     $$M_{\text{unauth}} = 0.60 \quad (\text{Caps overall plan score at } \le 60\%)$$
   - **$M_{\text{prohib}}$ (Prohibited Restraint Strategy Detected)**:
     If prone, supine, or mechanical neck/torso holds are described or implied:
     $$M_{\text{prohib}} = 0.00 \quad (\text{Immediate Fail / Score } = 0\%)$$
   - **$M_{\text{nofade}}$ (Restrictive Practice with No Fade-Out Schedule)**:
     If restrictive practices exist but QI-10 is scored $< 30\%$:
     $$M_{\text{nofade}} = 0.75$$
   - **$M_{\text{nohypo}}$ (Absence of Functional Assessment / Hypothesis)**:
     If QI-04 is scored $< 20\%$:
     $$M_{\text{nohypo}} = 0.80$$

3. **Final Authoritative Score Formula**:
   $$S_{\text{final}} = \min\left(100, \max\left(0, \operatorname{round}\left(S_{\text{raw}} \times \prod_{k} M_k\right)\right)\right)$$

4. **Compliance Classification Thresholds**:

| Score Range | Compliance Tier | Regulatory Status | APO Review Action |
|:---:|:---:|:---:|:---|
| **90% – 100%** | **Grade A** | **Fully Compliant** (Audit Ready) | **Unconditional Approval** for NDIS Commission / State Submission |
| **75% – 89%** | **Grade B** | **Substantially Compliant** | **Conditional Approval** (Minor remediation required within 14 days) |
| **50% – 74%** | **Grade C** | **Non-Compliant (Gaps Identified)** | **Rejection / Mandatory Remediation** prior to submission |
| **0% – 49%** | **Grade F** | **Critical Breach / Severe Risk** | **Immediate Clinical Cease & Re-authoring Order** |

---

## 4. Multi-Agent Deliberation Framework

The autonomous compliance audit engine employs a tri-agent deliberation architecture that mirrors an official clinical review panel:

```
                                  +---------------------------------------+
                                  |         INPUT BSP DOCUMENT            |
                                  +---------------------------------------+
                                                      |
                               +----------------------+----------------------+
                               |                                             |
                               v                                             v
               +-------------------------------+             +-------------------------------+
               |   AGENT 1: HUMAN RIGHTS &     |             |   AGENT 2: CLINICAL PBS       |
               |   LEGAL SAFEGUARDS AGENT      |             |   SPECIALIST AGENT            |
               |                               |             |                               |
               | - Participant consent & rights|             | - FBA hypothesis rigor        |
               | - Restrictive practice class  |             | - ABC data alignment          |
               | - State authorization status  |             | - FCT & replacement skills    |
               | - Least restrictive test      |             | - Reinforcement schedules     |
               +-------------------------------+             +-------------------------------+
                               |                                             |
                               +----------------------+----------------------+
                                                      |
                                                      v
                                      +-------------------------------+
                                      |   AGENT 3: QUALITY PANEL      |
                                      |   LEAD SYNTHESIZER            |
                                      |                               |
                                      | - Cross-agent consensus audit |
                                      | - Pillar & Indicator scoring  |
                                      | - Red-flag risk isolation     |
                                      | - 1-Click remediation bundle  |
                                      | - Official APO export payload |
                                      +-------------------------------+
                                                      |
                                                      v
                                      +-------------------------------+
                                      |    INTERACTIVE AUDIT STUDIO   |
                                      |    & OFFICIAL APO SCORECARD   |
                                      +-------------------------------+
```

### 4.1 Agent Roles & Reasoning Profiles

#### 1. Human Rights & Legal Safeguards Agent (`human_rights_safeguards_agent`)
- **System Identity**: Senior Legal & Human Rights Specialist with expertise in the *NDIS Act 2013*, *UN Convention on the Rights of Persons with Disabilities (CRPD)*, and State Authorised Restrictive Practices Rules.
- **Audit Mandate**:
  1. Inspect participant voice, consent documentation, and nominee agreements.
  2. Scrutinize all interventions for hidden or misclassified restrictive practices (e.g. "environmental safety locks", "PRN calming syrup").
  3. Validate state authorization reference formatting (e.g. `RPR-YYYY-STATE-XXXXX`).
  4. Ensure least-restrictive principle has been legally satisfied with documented alternative failures.

#### 2. Clinical PBS Specialist Agent (`clinical_pbs_specialist_agent`)
- **System Identity**: Senior Board Certified Behaviour Analyst (BCBA-D) and NDIS Advanced Registered Behaviour Support Practitioner.
- **Audit Mandate**:
  1. Evaluate the clinical validity of the Functional Behaviour Assessment (FBA).
  2. Verify that operational definitions of target behaviours meet empirical standards (frequency, intensity, latency, topography).
  3. Check that replacement behaviours directly compete with and replace target behaviours under the same functional reinforcer.
  4. Validate Functional Communication Training (FCT) errorless learning and reinforcement thinning schedules.

#### 3. Quality Panel Lead Synthesizer (`quality_panel_lead_synthesizer`)
- **System Identity**: Authorised Program Officer (APO) Panel Lead and Senior Clinical Auditor.
- **Audit Mandate**:
  1. Synthesize independent findings from Agent 1 and Agent 2 into a structured consensus trace.
  2. Detect deliberation divergences (e.g. when Agent 1 flags an environmental lock as a legal violation while Agent 2 accepts it as a safety accommodation).
  3. Apply the authoritative mathematical scoring model and penalty multipliers.
  4. Generate concrete **1-Click Remediation Payloads** that inject compliant clinical text directly into the target BSP sections.

---

### 4.2 Deliberation Consensus Protocol & Trace Structure

The deliberation process produces a structured event stream (`deliberationTrace`) rendered in real-time in the UI Studio.

```typescript
export interface DeliberationMessage {
  id: string;
  agentRole: 'human_rights_safeguards' | 'clinical_pbs' | 'quality_panel_lead';
  agentName: string;
  agentAvatar: string;
  timestamp: string;
  phase: 'initial_review' | 'deep_scrutiny' | 'consensus_debate' | 'final_synthesis';
  focusIndicator: string; // e.g. "QI-04", "QI-09", "Pillar 1"
  scoreAwarded?: number;  // 0-100
  sentiment: 'compliant' | 'warning' | 'critical_breach' | 'consensus_reached';
  reasoning: string;
  proposedRemediation?: {
    fieldToUpdate: string;
    suggestedText: string;
    remediationLabel: string;
  };
}
```

---

## 5. Official NDIS Authorised Program Officer (APO) Submission Scorecard & JSON Schema

The audit output must be exportable as both an interactive PDF/printable APO scorecard and a valid machine-readable JSON package for NDIS Commission compliance repositories.

### 5.1 Official APO Scorecard Structure
1. **Header & Metadata**:
   - Participant Name, NDIS Number, Date of Birth, Primary Disability.
   - Provider Name, NDIS Registration Number, Implementing Provider Branch.
   - Lead Practitioner Name, PBS Registration Level (Specialist / Advanced / Proficient / Core), AHPRA / NDIS PR Number.
   - Plan Version, Submission Date, Review Cadence (12-Month Due Date).
2. **Executive Compliance Summary**:
   - Authoritative Quality Score (0–100%) & Compliance Grade (A/B/C/F).
   - 4 Pillars Weighted Score Gauges.
   - Total Indicators Passed ($X / 12$).
3. **Restrictive Practices Register & Authorisation Status Table**:
   - Practice Type (Chemical, Mechanical, Physical, Environmental, Seclusion).
   - State Authorization Reference & Expiry Date.
   - Clinical Justification & Least Restrictive Evidence.
   - Reduction Milestone & Next Fading Review Date.
4. **Detailed 12 Quality Indicators Audit Breakdown**:
   - Indicator ID, Name, Score (0–100%), Pass/Fail Status, Findings & Identified Gaps.
5. **Red-Flag Risk Register & 1-Click Remediation Audit**:
   - Severity Level (Critical, High, Medium, Low).
   - Standard Breached, Risk Description, Clinical Remediation Action Taken.
6. **APO Sign-off & Panel Endorsement**:
   - APO Panel Outcome: **APPROVED / CONDITIONALLY APPROVED / REJECTED**.
   - Reviewer Signature Block, Professional Registration ID, Digital Timestamp Hash.

---

### 5.2 Machine-Readable JSON Schema (OpenAPI / JSON Schema Draft-07)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "NDIS_APO_BSP_Compliance_Audit_Package",
  "type": "object",
  "required": [
    "auditMetadata",
    "participantProfile",
    "practitionerProfile",
    "overallScorecard",
    "regulatoryPillars",
    "qualityIndicatorsAudit",
    "restrictivePracticesAudit",
    "redFlagAlerts",
    "deliberationTraces",
    "apoEndorsement"
  ],
  "properties": {
    "auditMetadata": {
      "type": "object",
      "required": ["auditId", "auditTimestamp", "auditorEngineVersion", "bspVersion", "integrityHash"],
      "properties": {
        "auditId": { "type": "string", "example": "AUDIT-2026-BSP-430891-01" },
        "auditTimestamp": { "type": "string", "format": "date-time" },
        "auditorEngineVersion": { "type": "string", "example": "Breakthrough-NDIS-Auditor-v2.6" },
        "bspVersion": { "type": "string", "example": "v2.2" },
        "integrityHash": { "type": "string", "example": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
      }
    },
    "participantProfile": {
      "type": "object",
      "required": ["participantId", "ndisNumber", "fullName", "primaryDisability", "riskLevel"],
      "properties": {
        "participantId": { "type": "string" },
        "ndisNumber": { "type": "string", "pattern": "^[0-9]{9}$" },
        "fullName": { "type": "string" },
        "dateOfBirth": { "type": "string", "format": "date" },
        "primaryDisability": { "type": "string" },
        "riskLevel": { "type": "string", "enum": ["Low", "Medium", "High", "Critical"] }
      }
    },
    "practitionerProfile": {
      "type": "object",
      "required": ["practitionerName", "ndisRegistrationNumber", "pbsRegistrationLevel"],
      "properties": {
        "practitionerName": { "type": "string" },
        "ndisRegistrationNumber": { "type": "string" },
        "pbsRegistrationLevel": {
          "type": "string",
          "enum": ["Core Practitioner", "Proficient Practitioner", "Advanced Practitioner", "Specialist Practitioner"]
        }
      }
    },
    "overallScorecard": {
      "type": "object",
      "required": ["finalQualityScore", "rawWeightedScore", "complianceGrade", "complianceStatus", "passedIndicatorsCount", "totalIndicatorsCount"],
      "properties": {
        "finalQualityScore": { "type": "number", "minimum": 0, "maximum": 100 },
        "rawWeightedScore": { "type": "number", "minimum": 0, "maximum": 100 },
        "complianceGrade": { "type": "string", "enum": ["Grade A", "Grade B", "Grade C", "Grade F"] },
        "complianceStatus": { "type": "string", "enum": ["Fully Compliant", "Substantially Compliant", "Non-Compliant", "Critical Risk"] },
        "passedIndicatorsCount": { "type": "integer", "minimum": 0, "maximum": 12 },
        "totalIndicatorsCount": { "type": "integer", "default": 12 },
        "activePenaltyMultipliers": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": { "type": "string" },
              "factor": { "type": "number" },
              "description": { "type": "string" }
            }
          }
        }
      }
    },
    "regulatoryPillars": {
      "type": "object",
      "required": ["humanRightsAndLegal", "clinicalPbs", "proactiveEnvironmental", "crisisAndFading"],
      "properties": {
        "humanRightsAndLegal": {
          "type": "object",
          "required": ["score", "weight", "status"],
          "properties": {
            "score": { "type": "number", "minimum": 0, "maximum": 100 },
            "weight": { "type": "number", "default": 0.30 },
            "status": { "type": "string", "enum": ["Compliant", "Minor Gaps", "Critical Breach"] },
            "summary": { "type": "string" }
          }
        },
        "clinicalPbs": {
          "type": "object",
          "required": ["score", "weight", "status"],
          "properties": {
            "score": { "type": "number", "minimum": 0, "maximum": 100 },
            "weight": { "type": "number", "default": 0.30 },
            "status": { "type": "string", "enum": ["Compliant", "Minor Gaps", "Critical Breach"] },
            "summary": { "type": "string" }
          }
        },
        "proactiveEnvironmental": {
          "type": "object",
          "required": ["score", "weight", "status"],
          "properties": {
            "score": { "type": "number", "minimum": 0, "maximum": 100 },
            "weight": { "type": "number", "default": 0.20 },
            "status": { "type": "string", "enum": ["Compliant", "Minor Gaps", "Critical Breach"] },
            "summary": { "type": "string" }
          }
        },
        "crisisAndFading": {
          "type": "object",
          "required": ["score", "weight", "status"],
          "properties": {
            "score": { "type": "number", "minimum": 0, "maximum": 100 },
            "weight": { "type": "number", "default": 0.20 },
            "status": { "type": "string", "enum": ["Compliant", "Minor Gaps", "Critical Breach"] },
            "summary": { "type": "string" }
          }
        }
      }
    },
    "qualityIndicatorsAudit": {
      "type": "array",
      "minItems": 12,
      "maxItems": 12,
      "items": {
        "type": "object",
        "required": ["indicatorId", "title", "pillar", "score", "passed", "evaluationDetails", "identifiedGaps"],
        "properties": {
          "indicatorId": { "type": "string", "example": "QI-01" },
          "title": { "type": "string" },
          "pillar": { "type": "string" },
          "score": { "type": "number", "minimum": 0, "maximum": 100 },
          "passed": { "type": "boolean" },
          "evaluationDetails": { "type": "string" },
          "identifiedGaps": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "restrictivePracticesAudit": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["practiceType", "description", "status", "authorizationStatus", "leastRestrictiveJustified", "fadingPlanPresent"],
        "properties": {
          "practiceId": { "type": "string" },
          "practiceType": { "type": "string", "enum": ["Chemical", "Mechanical", "Physical", "Environmental", "Seclusion"] },
          "description": { "type": "string" },
          "status": { "type": "string", "enum": ["Proposed", "Authorized", "Active", "Superseded", "Expired"] },
          "authorizationStatus": { "type": "string", "enum": ["Fully Authorized", "Pending Review", "Unauthorized Breach"] },
          "authorizationReference": { "type": "string" },
          "authorizationExpiry": { "type": "string", "format": "date" },
          "leastRestrictiveJustified": { "type": "boolean" },
          "fadingPlanPresent": { "type": "boolean" },
          "reductionTarget": { "type": "string" }
        }
      }
    },
    "redFlagAlerts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["alertId", "severity", "indicatorId", "title", "description", "recommendedRemediation"],
        "properties": {
          "alertId": { "type": "string" },
          "severity": { "type": "string", "enum": ["CRITICAL", "HIGH", "MODERATE", "LOW"] },
          "indicatorId": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "recommendedRemediation": { "type": "string" },
          "remediationPayload": {
            "type": "object",
            "properties": {
              "targetSection": { "type": "string" },
              "injectedContent": { "type": "string" }
            }
          }
        }
      }
    },
    "deliberationTraces": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "agentRole", "agentName", "timestamp", "phase", "sentiment", "reasoning"],
        "properties": {
          "id": { "type": "string" },
          "agentRole": { "type": "string", "enum": ["human_rights_safeguards", "clinical_pbs", "quality_panel_lead"] },
          "agentName": { "type": "string" },
          "timestamp": { "type": "string", "format": "date-time" },
          "phase": { "type": "string", "enum": ["initial_review", "deep_scrutiny", "consensus_debate", "final_synthesis"] },
          "focusIndicator": { "type": "string" },
          "scoreAwarded": { "type": "number" },
          "sentiment": { "type": "string", "enum": ["compliant", "warning", "critical_breach", "consensus_reached"] },
          "reasoning": { "type": "string" }
        }
      }
    },
    "apoEndorsement": {
      "type": "object",
      "required": ["recommendation", "authorizedProgramOfficerName", "decisionDate", "endorsementNotes"],
      "properties": {
        "recommendation": {
          "type": "string",
          "enum": [
            "APPROVED_FOR_COMMISSION_SUBMISSION",
            "CONDITIONALLY_APPROVED_PENDING_REMEDIATION",
            "REJECTED_MANDATORY_REVISION_REQUIRED"
          ]
        },
        "authorizedProgramOfficerName": { "type": "string" },
        "apoRegistrationNumber": { "type": "string" },
        "decisionDate": { "type": "string", "format": "date" },
        "conditionsOrMandatedChanges": {
          "type": "array",
          "items": { "type": "string" }
        },
        "endorsementNotes": { "type": "string" }
      }
    }
  }
}
```

---

## 6. Features Discovered & Specification Catalog

```
## Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Quality Evaluation | 12 NDIS Quality Indicators (QI-01..QI-12) | Evaluates complete BSP against NDIS Quality & Safeguards Commission PBS standards | Full BSPDocument payload | Per-indicator score (0-100%), pass/fail boolean, identified gap notes | Degrades to specific gap alerts if text sections are brief or missing | NDIS PBS Capability Framework / BSP-QE-II Tool |
| 2 | Restrictive Practices | 5 Restrictive Practice Categories | Rules 2018 validation for Chemical, Mechanical, Physical, Environmental, Seclusion | RestrictivePractice array, usage logs | Practice classification, least restrictive audit, authorization verification | Flags missing authorization reference as critical severity | NDIS Authorised Restrictive Practices Rules 2018 |
| 3 | Scoring Engine | 4 Regulatory Pillars Scoring Model | 0-100% mathematical model weighting Human Rights (30%), Clinical PBS (30%), Proactive (20%), Crisis/Fading (20%) | Indicator scores QI-01..QI-12 | Raw weighted score, final score (0-100%), Compliance Grade (A/B/C/F) | Penalizes missing fade plans and unauthorized practices via multipliers | NDIS Practice Standards Core & Specialist Modules |
| 4 | Multi-Agent Deliberation | Tri-Agent Consensus Pipeline | Tri-agent evaluation (Human Rights Agent, Clinical PBS Specialist, Quality Panel Synthesizer) | Raw BSP content & client profile | Chronological deliberation trace stream with avatars, confidence scores, reasoning | Fallback to heuristic rule-based deliberation if LLM API is unavailable | Multi-Agent Clinical Evaluation Architecture |
| 5 | Remediation System | 1-Click Safeguard Remediation | Generates and injects structured compliant text fixes directly into active BSP state | Identified gap & alert payload | Updated BSP Document in Zustand state store | Safe non-destructive update preserving existing non-conflicting sections | Breakthrough OS BSP Authoring Workflow |
| 6 | APO Governance | Official NDIS APO Submission Scorecard | Senior Practitioner review scorecard with endorsement options, compliance gauges, audit tables | Full audit assessment package | Interactive printable modal report and clean PDF-ready export | Validates required signatures before generating official submission package | Victoria / NSW Senior Practitioner APO Guidelines |
| 7 | Machine-Readable Export | Audit Package JSON Schema | Schema Draft-07 compliant JSON export for audit trails, PRODA, and NDIS Portal | Full evaluation result object | Formatted JSON download file and clipboard payload | Validates strict JSON syntax and type safety before download | NDIS Commission Digital Compliance Specs |

## Edge Cases
| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Unauthorized Restrictive Practice | BSP with Environmental lock but no state reference number | Triggers high-severity red flag; activates multiplier $M_{\text{unauth}} = 0.60$; caps final score at max 60% (Grade C/F). |
| 2 | Prohibited Prone Restraint | BSP text containing physical restraint keywords "prone" or "face down" | Triggers immediate critical safety alert; activates multiplier $M_{\text{prohib}} = 0.00$; score set to 0%; blocks APO submission. |
| 3 | Restrictive Practice without Fade-Out | Restrictive practice with empty `reductionPlanSummary` | Triggers $M_{\text{nofade}} = 0.75$ penalty; generates "1-Click Add Fading Protocol" remediation prompt. |
| 4 | Empty/Minimal FBA Section | BSP with $<20$ character functional hypothesis | Flags QI-04 as Critical Gap; applies $M_{\text{nohypo}} = 0.80$; suggests 1-click ABC data import. |
| 5 | Disconnected Replacement Behaviour | Replacement behaviour does not match the identified FBA function (e.g. FBA is sensory escape, replacement is tangible token) | Clinical PBS Specialist Agent flags mismatch; lowers QI-06 score to $<50\%$; recommends FCT re-alignment. |
| 6 | Offline / API Fallback Mode | AI API endpoint offline or rate limited | Fallback rule-based heuristic auditor executes; produces full 12-indicator audit with local evidence inspection. |
```

---

## 7. Next Steps for Implementation Team
1. **Explorer 1 / Explorer 2 Integration**: Supply this schema and mathematical formula for state modeling (`types/index.ts`, `stores/useManagementStore.ts`) and UI component development (`BSPAuditStudioModal.tsx`).
2. **API Endpoint Development**: Build `/api/compliance-audit/bsp-deliberation` to execute the tri-agent evaluation pipeline and emit structured `NDIS_APO_BSP_Compliance_Audit_Package` JSON responses.
3. **Remediation Store Action**: Add `remediateBSPSection(clientId, sectionKey, content)` in `useManagementStore` for the 1-click remediation capability.
