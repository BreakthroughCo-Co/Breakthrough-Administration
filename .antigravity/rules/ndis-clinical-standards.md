# NDIS Clinical & PBS Standards Invariant

When developing or modifying clinical, behavioural, or compliance features in Breakthrough Administration:

1. **NDIS Quality & Safeguards Commission Compliance**:
   - Every Positive Behaviour Support Plan (BSP) must support the full 6-section structure: Participant Profile, Functional Assessment Summary (FBA), Proactive Strategies, Skill Teaching, Active & Reactive Protocols, and Regulated Restrictive Practices.
   - Any Regulated Restrictive Practice (Chemical, Mechanical, Physical, Environmental, Seclusion) must include an Authorization Body (e.g., Victorian/NSW Senior Practitioner), Authorization Reference Number, Expiry Date, and an associated Fading/Reduction Plan.

2. **Unified Clinical Data Pipeline**:
   - ABC (Antecedent-Behavior-Consequence) logs must preserve rich observational context: setting events, intensity ratings (1-5), duration in minutes, environmental triggers, and perceived functional category (Escape, Attention, Tangible, Sensory).
   - Functional Behaviour Assessments (FBA) synthesized from ABC data must be seamlessly transferable into active BSP drafts.
   - Restrictive Practice implementations must be tracked via individual usage logs that record pre-intervention de-escalation attempts, duration, and staff debriefs to support the mandatory NDIS Monthly Return report.

3. **Multi-Format Export & Interoperability**:
   - Provide multi-format export capabilities:
     - Printable / PDF formatted Clinical BSP documents with practitioner sign-off headers.
     - Schema-compliant NDIS Commission XML/JSON submission payloads.
     - Official NDIS Restrictive Practices Monthly Return CSV format.
     - Google Docs / Slides synchronization ready for Google Workspace Hub.

4. **Neuroaffirming & Trauma-Informed Language**:
   - All AI-generated BSP drafts, Social Stories, and clinical summaries must maintain neuroaffirming, respectful, first-person or person-centered phrasing without punitive terminology.
