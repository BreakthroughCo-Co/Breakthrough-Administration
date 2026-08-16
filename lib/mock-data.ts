import {
  UserProfile,
  Client,
  CaseNote,
  RestrictivePractice,
  Incident,
  Lead,
  Practitioner,
  ABCLog,
  BSPDocument,
  BillingClaim,
  AuditLog,
  CommunicationLog,
  NDISSupportItem,
  RestrictivePracticeUsageLog,
  NDISMonthlyReturnRecord,
  PRODABatch,
  GoogleDriveFile,
  GoogleCalendarEvent,
  AICopilotMessage,
  ClinicalAssessmentRecord,
  PracticeBrandingConfig,
  NDISCommissionAuditPackage,
  ClinicBranch,
  ExtractedClinicalReport,
  OfflineSyncQueueItem
} from '@/types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@breakthrough.org.au',
    role: 'ADMIN',
    position: 'Clinical Director & Lead Behaviour Practitioner',
    practitionerId: 'prac-1',
    workerScreeningStatus: 'Active',
    workerScreeningExpiry: '2028-11-15',
    policeCheckExpiry: '2027-04-20',
    ndisOrientationDone: true,
    activeCaseload: 8,
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@breakthrough.org.au',
    role: 'PRACTITIONER',
    position: 'Senior Behaviour Support Practitioner',
    practitionerId: 'prac-2',
    workerScreeningStatus: 'Active',
    workerScreeningExpiry: '2027-08-30',
    policeCheckExpiry: '2026-12-10',
    ndisOrientationDone: true,
    activeCaseload: 12,
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@breakthrough.org.au',
    role: 'VIEWER',
    position: 'NDIS Quality & Compliance Officer',
    workerScreeningStatus: 'Active',
    workerScreeningExpiry: '2028-02-14',
    policeCheckExpiry: '2027-01-18',
    ndisOrientationDone: true,
    activeCaseload: 0,
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-101',
    ndisNumber: '430891204',
    name: 'Jordan Miller',
    dateOfBirth: '2005-04-12',
    status: 'Active',
    primaryDisability: 'Autism Spectrum Disorder (Level 3)',
    secondaryDisabilities: ['Intellectual Disability', 'Sensory Processing Sensitivity'],
    goals: [
      {
        id: 'g-1',
        title: 'Develop emotion regulation strategies during noisy public transitions',
        category: 'Capacity Building',
        targetDate: '2026-12-31',
        progressPercent: 65,
        status: 'In Progress',
        gasScore: 0,
        gasHistory: [
          { date: '2026-03-01', score: -2, note: 'Baseline assessment: Frequent escalation during loud transitions' },
          { date: '2026-05-15', score: -1, note: 'Partial progress: Uses noise-cancelling headphones when prompted' },
          { date: '2026-08-01', score: 0, note: 'Expected outcome reached: Initiates headphone use independently' },
        ],
      },
      {
        id: 'g-2',
        title: 'Increase independent communication using AAC tablet during meal times',
        category: 'Capacity Building',
        targetDate: '2026-10-15',
        progressPercent: 80,
        status: 'In Progress',
        gasScore: 1,
        gasHistory: [
          { date: '2026-04-10', score: -1, note: 'Requires verbal prompts to navigate AAC folder' },
          { date: '2026-07-20', score: 1, note: 'Somewhat higher than expected: Spontaneously creates 3-word requests' },
        ],
      },
    ],
    planStartDate: '2025-07-01',
    planEndDate: '2026-06-30',
    totalBudget: 42500,
    allocatedBudget: 35000,
    spentBudget: 22800,
    primaryPractitionerId: 'prac-2',
    primaryPractitionerName: 'Marcus Vance',
    riskLevel: 'High',
    emergencyContact: {
      name: 'Karen Miller',
      relationship: 'Mother / Primary Carer',
      phone: '0412 889 012',
    },
    restrictivePracticesActive: true,
    createdAt: '2025-07-02T09:00:00Z',
    updatedAt: '2026-08-01T14:20:00Z',
  },
  {
    id: 'cli-102',
    ndisNumber: '431002981',
    name: 'Chloe Zhang',
    dateOfBirth: '1998-09-24',
    status: 'Active',
    primaryDisability: 'Acquired Brain Injury (ABI)',
    secondaryDisabilities: ['Expressive Aphasia'],
    goals: [
      {
        id: 'g-3',
        title: 'Maintain community participation 3 days per week with positive behavior supports',
        category: 'Social & Community',
        targetDate: '2026-11-30',
        progressPercent: 45,
        status: 'In Progress',
      },
    ],
    planStartDate: '2025-09-15',
    planEndDate: '2026-09-14',
    totalBudget: 38000,
    allocatedBudget: 30000,
    spentBudget: 14200,
    primaryPractitionerId: 'prac-1',
    primaryPractitionerName: 'Dr. Sarah Jenkins',
    riskLevel: 'Medium',
    emergencyContact: {
      name: 'David Zhang',
      relationship: 'Brother',
      phone: '0433 112 456',
    },
    restrictivePracticesActive: false,
    createdAt: '2025-09-16T11:30:00Z',
    updatedAt: '2026-08-04T10:15:00Z',
  },
  {
    id: 'cli-103',
    ndisNumber: '438902115',
    name: 'Liam O\'Connor',
    dateOfBirth: '2012-01-30',
    status: 'Onboarding',
    primaryDisability: 'Global Developmental Delay & Challenging Behaviours',
    goals: [],
    planStartDate: '2026-02-01',
    planEndDate: '2027-01-31',
    totalBudget: 28000,
    allocatedBudget: 15000,
    spentBudget: 1200,
    primaryPractitionerId: 'prac-2',
    primaryPractitionerName: 'Marcus Vance',
    riskLevel: 'Critical',
    emergencyContact: {
      name: 'Sean O\'Connor',
      relationship: 'Father',
      phone: '0421 990 882',
    },
    restrictivePracticesActive: true,
    createdAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-08-08T16:00:00Z',
  },
];

export const INITIAL_CASE_NOTES: CaseNote[] = [
  {
    id: 'cn-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practitionerId: 'prac-2',
    practitionerName: 'Marcus Vance',
    date: '2026-08-05',
    sessionDurationMinutes: 90,
    format: 'SIMPL',
    subjective: 'Jordan expressed high arousal prior to transport to day program due to loud construction nearby.',
    objective: 'Practitioner modeled deep breathing and visual schedule token system. Jordan accepted noise-cancelling headphones within 4 minutes.',
    assessment: 'Proactive environmental modification reduced physical agitation from baseline 8/10 to 3/10.',
    plan: 'Continue training support staff on early antecedent cues. Next session on Thursday.',
    linkedGoalIds: ['g-1'],
    status: 'Approved',
    flaggedForReview: false,
    createdAt: '2026-08-05T11:00:00Z',
    updatedAt: '2026-08-05T14:00:00Z',
  },
  {
    id: 'cn-2',
    clientId: 'cli-102',
    clientName: 'Chloe Zhang',
    practitionerId: 'prac-1',
    practitionerName: 'Dr. Sarah Jenkins',
    date: '2026-08-06',
    sessionDurationMinutes: 60,
    format: 'BIRP',
    subjective: 'Chloe reported feeling overwhelmed during community shopping trial.',
    objective: 'Implemented 15-minute quiet break in cafe. Reviewed choice board for emergency exit route.',
    assessment: 'Chloe self-advocated using her AAC device to request a break for the first time.',
    plan: 'Fading practitioner prompts; carer to observe next week.',
    linkedGoalIds: ['g-3'],
    status: 'Approved',
    flaggedForReview: false,
    createdAt: '2026-08-06T15:30:00Z',
    updatedAt: '2026-08-06T16:00:00Z',
  },
];

export const INITIAL_RESTRICTIVE_PRACTICES: RestrictivePractice[] = [
  {
    id: 'rp-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practiceType: 'Environmental',
    description: 'Locked kitchen cupboard containing cleaning agents and sharp utensils to prevent severe pica / self-harm during high-arousal episodes.',
    status: 'Authorized',
    authorizationBody: 'VIC Senior Practitioner & NDIS Quality Commission',
    authorizationReference: 'RPR-2025-VIC-88102',
    startDate: '2025-10-01',
    expiryDate: '2026-09-30',
    reductionPlanSummary: 'Gradual introduction of supervised cooking trials with visual safety cues to fade lock requirement by 50% in 6 months.',
    monthlyReportStatus: 'Submitted',
    lastReportedDate: '2026-08-01',
  },
  {
    id: 'rp-2',
    clientId: 'cli-103',
    clientName: 'Liam O\'Connor',
    practiceType: 'Chemical',
    description: 'Low-dose prescribed PRN anti-anxiety medication prior to medical appointments when severe self-injurious behaviour escalates.',
    status: 'Active',
    authorizationBody: 'NDIS Quality & Safeguards Commission Panel',
    authorizationReference: 'RPR-2026-VIC-90211',
    startDate: '2026-03-01',
    expiryDate: '2027-02-28',
    reductionPlanSummary: 'Desensitization protocol in progress with Occupational Therapy.',
    monthlyReportStatus: 'Due',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-101',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practitionerId: 'prac-2',
    practitionerName: 'Marcus Vance',
    incidentDate: '2026-07-28T14:15:00Z',
    severity: 'High',
    status: 'Reported to NDIS Commission',
    isNdisReportable: true,
    ndis24hrNotified: true,
    ndis5daySubmitted: true,
    description: 'Participant engaged in severe head-banging against vehicle window during transport after sudden schedule change.',
    immediateActionTaken: 'Driver safely pulled over. Practitioner applied sensory weighted blanket and verbal calming script.',
    rootCauseAnalysis: 'Unannounced shift in route combined with elevated background noise level.',
    correctiveActions: 'Vehicle now equipped with visual route map; driver briefed to notify 10 mins prior to detours.',
    reportedBy: 'Marcus Vance (Senior BSP)',
    createdAt: '2026-07-28T15:00:00Z',
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    prospectName: 'Ethan Wright',
    ndisNumber: '439901233',
    contactName: 'Amanda Wright',
    contactEmail: 'amanda.wright@example.com',
    contactPhone: '0488 223 901',
    stage: 'Screening & Qualification',
    source: 'Support Coordinator Referral',
    estimatedPlanValue: 24000,
    assignedPractitionerId: 'prac-1',
    assignedPractitionerName: 'Dr. Sarah Jenkins',
    notes: 'Requires urgent Behaviour Support Plan for residential group home placement.',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-05T11:20:00Z',
  },
];

export const INITIAL_PRACTITIONERS: Practitioner[] = [
  {
    id: 'prac-1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@breakthrough.org.au',
    phone: '0411 200 301',
    position: 'Senior Behaviour Support Practitioner',
    qualification: 'Ph.D. Clinical Psychology, BCBA-D',
    ndisRegistrationNumber: 'PR-881902',
    pbsRegistrationLevel: 'Advanced Practitioner',
    specialties: ['High Intensity Behaviours', 'Restrictive Practices', 'Trauma-Informed Care', 'Intellectual Disability'],
    status: 'ACTIVE / APPROVED',
    workerScreeningNumber: 'NWSC-VIC-991201',
    workerScreeningExpiry: '2028-11-15',
    wwccNumber: 'WWCC-9918230-V',
    wwccExpiry: '2028-11-15',
    screeningStatus: 'Valid',
    screeningExpiryDate: '2028-11-15',
    policeCheckExpiryDate: '2027-04-20',
    ndisOrientationCompleted: true,
    cpdHoursThisYear: 32,
    caseloadLimit: 10,
    activeCaseloadCount: 8,
    historicalSuccessRate: 98,
    completedSessionsCount: 420,
    rating: 4.95,
  },
  {
    id: 'prac-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@breakthrough.org.au',
    phone: '0422 300 402',
    position: 'Senior Behaviour Support Practitioner',
    qualification: 'M.Sc. Applied Behaviour Analysis',
    ndisRegistrationNumber: 'PR-441209',
    pbsRegistrationLevel: 'Proficient Practitioner',
    specialties: ['Autism Spectrum Disorder', 'AAC Communication', 'School & Community Transitions', 'Functional Behaviour Assessments'],
    status: 'ACTIVE / APPROVED',
    workerScreeningNumber: 'NWSC-VIC-448102',
    workerScreeningExpiry: '2027-08-30',
    wwccNumber: 'WWCC-4481920-V',
    wwccExpiry: '2027-08-30',
    screeningStatus: 'Valid',
    screeningExpiryDate: '2027-08-30',
    policeCheckExpiryDate: '2026-12-10',
    ndisOrientationCompleted: true,
    cpdHoursThisYear: 28,
    caseloadLimit: 15,
    activeCaseloadCount: 12,
    historicalSuccessRate: 94,
    completedSessionsCount: 310,
    rating: 4.88,
  },
  {
    id: 'prac-3',
    name: 'Liam Davies',
    email: 'liam.davies@breakthrough.org.au',
    phone: '0433 400 503',
    position: 'Occupational Therapist',
    qualification: 'B.App.Sc (Occupational Therapy) - AHPRA Registered',
    ndisRegistrationNumber: 'PR-662104',
    pbsRegistrationLevel: 'Proficient Practitioner',
    specialties: ['Sensory Profiles', 'Environmental Adaptation', 'Assistive Tech Assessments', 'Fine Motor & Regulation'],
    status: 'ACTIVE / APPROVED',
    workerScreeningNumber: 'NWSC-VIC-772199',
    workerScreeningExpiry: '2028-06-12',
    wwccNumber: 'WWCC-7721094-V',
    wwccExpiry: '2028-06-12',
    screeningStatus: 'Valid',
    screeningExpiryDate: '2028-06-12',
    policeCheckExpiryDate: '2027-08-14',
    ndisOrientationCompleted: true,
    cpdHoursThisYear: 30,
    caseloadLimit: 12,
    activeCaseloadCount: 7,
    historicalSuccessRate: 96,
    completedSessionsCount: 260,
    rating: 4.92,
  },
  {
    id: 'prac-4',
    name: 'Chloe Taylor',
    email: 'chloe.taylor@breakthrough.org.au',
    phone: '0444 500 604',
    position: 'Speech Pathologist',
    qualification: 'M.Sp.Path - Certified Practising Speech Pathologist (CPSP)',
    ndisRegistrationNumber: 'PR-551029',
    pbsRegistrationLevel: 'Core Practitioner',
    specialties: ['Augmentative & Alternative Communication (AAC)', 'Receptive Language', 'Social Interaction Skills', 'Mealtime Management'],
    status: 'ACTIVE / APPROVED',
    workerScreeningNumber: 'NWSC-VIC-551829',
    workerScreeningExpiry: '2027-10-22',
    wwccNumber: 'WWCC-5519820-V',
    wwccExpiry: '2027-10-22',
    screeningStatus: 'Valid',
    screeningExpiryDate: '2027-10-22',
    policeCheckExpiryDate: '2027-02-15',
    ndisOrientationCompleted: true,
    cpdHoursThisYear: 26,
    caseloadLimit: 14,
    activeCaseloadCount: 9,
    historicalSuccessRate: 97,
    completedSessionsCount: 195,
    rating: 4.90,
  },
  {
    id: 'prac-5',
    name: 'Zara Patel',
    email: 'zara.patel@breakthrough.org.au',
    phone: '0455 600 705',
    position: 'Core Behaviour Specialist',
    qualification: 'B.Psych (Hons), PBS Core Registered Practitioner',
    ndisRegistrationNumber: 'PR-339102',
    pbsRegistrationLevel: 'Core Practitioner',
    specialties: ['Routine Structuring', 'Skill Acquisition', 'Community Participation', 'Proactive De-escalation'],
    status: 'ACTIVE / APPROVED',
    workerScreeningNumber: 'NWSC-VIC-339102',
    workerScreeningExpiry: '2026-09-15',
    wwccNumber: 'WWCC-3391022-V',
    wwccExpiry: '2026-09-15',
    screeningStatus: 'Expiring Soon',
    screeningExpiryDate: '2026-09-15',
    policeCheckExpiryDate: '2026-08-30',
    ndisOrientationCompleted: true,
    cpdHoursThisYear: 18,
    caseloadLimit: 10,
    activeCaseloadCount: 4,
    historicalSuccessRate: 91,
    completedSessionsCount: 88,
    rating: 4.75,
  },
];

export const INITIAL_ABC_LOGS: ABCLog[] = [
  {
    id: 'abc-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    timestamp: '2026-08-07T10:30:00Z',
    timeOfDay: '10:30',
    hourOfDay: 10,
    dayOfWeek: 'Friday',
    antecedent: 'Transition from free time to structured group math task.',
    behavior: 'Vocal frustration, pushing desk chair backward, knocking over pencil cup.',
    consequence: 'Carer offered 2-minute visual timer and quiet sensory corner.',
    intensity: 3,
    durationMinutes: 6,
    location: 'Day Program Activity Room',
    perceivedFunction: 'Escape/Avoidance',
    settingEvent: 'Arrived 15 mins late due to heavy traffic on bus.',
    sensoryTriggers: ['Fluorescent light buzz', 'Loud group laughter'],
    deescalationAttempted: 'Visual choice board offered; headphone prompt.',
    recordedBy: 'Support Worker Dave',
  },
  {
    id: 'abc-2',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    timestamp: '2026-08-10T14:15:00Z',
    timeOfDay: '14:15',
    hourOfDay: 14,
    dayOfWeek: 'Monday',
    antecedent: 'Unannounced lawnmower noise outside activity room window.',
    behavior: 'Covering ears tightly, pacing rapidly, high-pitch vocalisation.',
    consequence: 'Staff closed window blinds and assisted with noise-cancelling headphones.',
    intensity: 4,
    durationMinutes: 12,
    location: 'Community Hub Common Area',
    perceivedFunction: 'Sensory/Automatic',
    settingEvent: 'Warm afternoon temperature, missed morning sensory swing.',
    sensoryTriggers: ['Sudden high decibel acoustic trigger'],
    deescalationAttempted: 'Deep pressure weighted lap pad and quiet room transition.',
    recordedBy: 'Marcus Vance (Senior BSP)',
  },
  {
    id: 'abc-3',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    timestamp: '2026-08-11T11:45:00Z',
    timeOfDay: '11:45',
    hourOfDay: 11,
    dayOfWeek: 'Tuesday',
    antecedent: 'Peer requested turn with the community iPad during allocated session.',
    behavior: 'Gripped iPad with both hands, turned back to peer, stamped foot twice.',
    consequence: 'Practitioner initiated 3-minute visual countdown timer on secondary device.',
    intensity: 2,
    durationMinutes: 4,
    location: 'Digital Learning Suite',
    perceivedFunction: 'Tangible/Access',
    settingEvent: 'Favourite video game had not reached save point.',
    sensoryTriggers: ['Device change transition'],
    deescalationAttempted: 'Social story reminder regarding sharing turn-taking.',
    recordedBy: 'Support Worker Dave',
  },
  {
    id: 'abc-4',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    timestamp: '2026-08-12T14:30:00Z',
    timeOfDay: '14:30',
    hourOfDay: 14,
    dayOfWeek: 'Wednesday',
    antecedent: 'Preparation for afternoon van departure with 6 passengers.',
    behavior: 'Refused to exit doorway, sat on floor with arms crossed, vocal hum.',
    consequence: 'Allowed Jordan to be the first passenger boarded with front row seat choice.',
    intensity: 3,
    durationMinutes: 8,
    location: 'Facility Exit Foyer',
    perceivedFunction: 'Escape/Avoidance',
    settingEvent: 'Afternoon crowding in narrow hallway.',
    sensoryTriggers: ['Crowded hallway', 'Multiple overlapping voices'],
    deescalationAttempted: 'Offered first-choice seating card.',
    recordedBy: 'Driver / Carer Sam',
  },
  {
    id: 'abc-5',
    clientId: 'cli-102',
    clientName: 'Chloe Zhang',
    timestamp: '2026-08-13T13:00:00Z',
    timeOfDay: '13:00',
    hourOfDay: 13,
    dayOfWeek: 'Thursday',
    antecedent: 'Noisy supermarket checkout queue during peak lunchtime.',
    behavior: 'Trembling hands, dropped shopping basket, disengaged eye contact.',
    consequence: 'Practitioner guided Chloe to outdoor courtyard; reviewed AAC communication app.',
    intensity: 2,
    durationMinutes: 5,
    location: 'Local Supermarket',
    perceivedFunction: 'Escape/Avoidance',
    settingEvent: 'Long wait time at register.',
    sensoryTriggers: ['Beeping registers', 'Bright overhead halogen lights'],
    deescalationAttempted: 'Stepped out of line immediately into shaded quiet area.',
    recordedBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'abc-6',
    clientId: 'cli-103',
    clientName: 'Liam O\'Connor',
    timestamp: '2026-08-14T09:15:00Z',
    timeOfDay: '09:15',
    hourOfDay: 9,
    dayOfWeek: 'Friday',
    antecedent: 'Requested access to preferred snack cupboard prior to morning circle.',
    behavior: 'Repetitive door handle rattling, vocal protest, throwing soft cushion.',
    consequence: 'Offered visual schedule showing morning snack at 10:00 AM; provided chew necklace.',
    intensity: 3,
    durationMinutes: 7,
    location: 'Group Home Kitchenette',
    perceivedFunction: 'Tangible/Access',
    settingEvent: 'Early wake-up at 06:00 AM.',
    sensoryTriggers: ['Smell of toast from staff room'],
    deescalationAttempted: 'Sensory oral motor chew tool and timer.',
    recordedBy: 'Marcus Vance (Senior BSP)',
  }
];

export const INITIAL_BSP_DOCUMENTS: BSPDocument[] = [
  {
    id: 'bsp-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    version: 'v2.1',
    status: 'Published',
    summary: 'Comprehensive Positive Behaviour Support Plan focused on sensory self-regulation, environmental predictability, and neuroaffirming proactive adaptations.',
    primaryBehaviorsOfConcern: [
      'Physical agitation & ear covering during unannounced noise spikes (>75dB)',
      'Task avoidance & seat pushing during unexpected activity transitions',
      'Doorway hesitation during crowded afternoon group departures'
    ],
    proactiveStrategies: [
      'Visual schedule board with physical velcro token countdowns updated 10 mins prior to any transition',
      'Scheduled 10-minute sensory breaks every 45 minutes incorporating weighted lap pad & proprioceptive input',
      'Pre-briefing Jordan before entering crowded environments with "First-In / First-Seated" transport pass',
      'Noise-cancelling over-ear headphones permanently positioned on desk / carry bag'
    ],
    reactiveStrategies: [
      'Immediate low-arousal positioning: Step back 2 metres, maintain neutral body language, avoid sustained eye contact',
      'Deliver 2-word calm verbal prompts ("Safe space", "Headphones on") alongside pictorial cue card',
      'Grant immediate access to designated quiet sensory break space without requiring verbal negotiation',
      'Allow minimum 15-minute recovery baseline period before re-introducing environmental demands'
    ],
    restrictivePractices: INITIAL_RESTRICTIVE_PRACTICES.filter((r) => r.clientId === 'cli-101'),
    reviewDate: '2026-12-01',
    authorName: 'Marcus Vance (Senior BSP)',
    lastUpdated: '2026-08-01',
    participantProfile: {
      communicationMode: 'Multimodal: Combines spoken 2-3 word phrases with AAC tablet (Proloquo2Go) and picture exchange cards.',
      sensoryPreferences: [
        'Proprioceptive deep pressure (weighted vest / lap pad)',
        'Noise-cancelling headphones in public venues',
        'Low-lumen amber warm lighting preferred over fluorescent overheads'
      ],
      strengthsAndInterests: [
        'Exceptional digital technology and tablet navigational skills',
        'Passion for train networks, Lego engineering models, and spatial puzzles',
        'Gentle and affectionate with familiar animals and therapy dogs'
      ],
      medicalHealthFactors: 'Allergy to dairy products; occasional sleep disturbance during full moon cycles; no seizure history.',
      decisionMakingPreferences: 'Prefers visual 2-option forced choice boards over open-ended verbal inquiries.'
    },
    functionalAssessment: {
      targetBehaviors: [
        {
          behavior: 'Acoustic Overload Escalation (Covering ears, pacing, vocal distress)',
          operationalDefinition: 'Participant places hands over both ears, paces rapidly (>1.5 m/s), and produces high-pitched vocalisations when sudden noise exceeds 75dB.',
          severity: 4,
          frequency: '2-3 times per week during transport or hall transitions'
        },
        {
          behavior: 'Demand Transition Resistance (Pushing chair, refusing movement)',
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
      functionalHypothesis: 'When exposed to unpredictable sensory noise spikes or abrupt demand changes (especially when fatigued), Jordan engages in physical agitation and task avoidance primarily to ESCAPE sensory overload and regain somatic self-regulation.'
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
      postIncidentDebrief: 'Conduct trauma-informed non-judgmental staff debrief within 24 hours. Log ABC observation and review trigger patterns.'
    },
    complianceScore: 96,
    missingComplianceItems: [
      'State Senior Practitioner annual authorization review scheduled in 58 days'
    ]
  }
];

export const INITIAL_RESTRICTIVE_USAGE_LOGS: RestrictivePracticeUsageLog[] = [
  {
    id: 'rpu-1',
    practiceId: 'rp-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practiceType: 'Environmental',
    timestamp: '2026-08-11T16:20:00Z',
    durationMinutes: 180,
    antecedentTrigger: 'Evening cooking prep in shared group kitchen while participant exhibited severe pica mouthing impulses.',
    priorDeescalationTried: 'Visual boundary markers, supervised redirect to sensory chew tool, and 1-on-1 staff engagement.',
    staffPresent: ['Support Worker Dave', 'Nurse Claire Evans'],
    authorizedBy: 'Dr. Sarah Jenkins (Clinical Director)',
    debriefCompleted: true,
    notes: 'Locked pantry cupboard maintained as per Authorized BSP Protocol. Participant safely engaged in puzzle table with zero ingestion attempts.',
    reportedToCommission: true
  },
  {
    id: 'rpu-2',
    practiceId: 'rp-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practiceType: 'Environmental',
    timestamp: '2026-08-13T18:00:00Z',
    durationMinutes: 120,
    antecedentTrigger: 'Routine evening cleaning with chemical disinfectant sprays in common living spaces.',
    priorDeescalationTried: 'Relocated participant to sensory bedroom with preferred music.',
    staffPresent: ['Support Worker Dave', 'Carer Marcus Vance'],
    authorizedBy: 'Dr. Sarah Jenkins (Clinical Director)',
    debriefCompleted: true,
    notes: 'Cupboard lock secured during 2-hour cleaning period. Fading trial successfully allowed participant to assist with harmless paper towel wiping.',
    reportedToCommission: true
  },
  {
    id: 'rpu-3',
    practiceId: 'rp-2',
    clientId: 'cli-103',
    clientName: 'Liam O\'Connor',
    practiceType: 'Chemical',
    timestamp: '2026-08-05T09:30:00Z',
    durationMinutes: 240,
    antecedentTrigger: 'Emergency dental extraction appointment causing severe panic and acute self-injurious head hitting.',
    priorDeescalationTried: 'Social story reading, noise-cancelling headphones, parent soothing presence for 45 minutes.',
    staffPresent: ['Dr. Sarah Jenkins', 'Father Sean O\'Connor', 'Dr. Peter Wong (Dentist)'],
    authorizedBy: 'Treating Psychiatrist & NDIS Panel',
    debriefCompleted: true,
    notes: 'Prescribed PRN diazepam 2mg administered under GP supervision. Procedure completed safely without physical injury.',
    reportedToCommission: true
  }
];

export const INITIAL_MONTHLY_RETURNS: NDISMonthlyReturnRecord[] = [
  {
    id: 'mr-2026-07',
    month: '2026-07',
    participantId: 'cli-101',
    participantName: 'Jordan Miller',
    ndisNumber: '430891204',
    practiceType: 'Environmental (Locked Cleaning Cupboard)',
    authorizationReference: 'RPR-2025-VIC-88102',
    totalUsageInstances: 14,
    totalDurationMinutes: 1680,
    reductionProgressNote: 'Supervised kitchen access trials increased from 1 to 3 weekly; lock duration decreased by 18% compared to June.',
    submissionStatus: 'Submitted',
    submissionDate: '2026-08-03'
  },
  {
    id: 'mr-2026-08',
    month: '2026-08',
    participantId: 'cli-101',
    participantName: 'Jordan Miller',
    ndisNumber: '430891204',
    practiceType: 'Environmental (Locked Cleaning Cupboard)',
    authorizationReference: 'RPR-2025-VIC-88102',
    totalUsageInstances: 6,
    totalDurationMinutes: 720,
    reductionProgressNote: 'Fading plan on track. Zero pica escalations recorded during supervised afternoon snack preparation.',
    submissionStatus: 'Ready'
  },
  {
    id: 'mr-2026-08-liam',
    month: '2026-08',
    participantId: 'cli-103',
    participantName: 'Liam O\'Connor',
    ndisNumber: '438902115',
    practiceType: 'Chemical (PRN Dental/Medical)',
    authorizationReference: 'RPR-2026-VIC-90211',
    totalUsageInstances: 1,
    totalDurationMinutes: 240,
    reductionProgressNote: 'PRN utilized once for emergency dental procedure. Desensitization OT sessions continue.',
    submissionStatus: 'Ready'
  }
];

export const INITIAL_BILLING_CLAIMS: BillingClaim[] = [
  {
    id: 'clm-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    ndisNumber: '430891204',
    serviceDate: '2026-08-05',
    ndisSupportItem: '07_002_0115_8_3 - Specialist Behavioural Intervention Support',
    supportItemCode: '07_002_0115_8_3',
    hours: 1.5,
    unitRate: 214.41,
    totalAmount: 321.62,
    status: 'Approved',
    invoiceNumber: 'INV-2026-0891',
  },
];

export const INITIAL_SUPPORT_ITEMS: NDISSupportItem[] = [
  {
    code: '07_002_0115_8_3',
    name: 'Specialist Behavioural Intervention Support',
    category: 'Capacity Building - Improved Relationships',
    pricePerUnit: 214.41,
    unitOfMeasure: 'Hour',
  },
  {
    code: '07_004_0115_8_3',
    name: 'Individual Behaviour Support Plan Development & Training',
    category: 'Capacity Building - Improved Relationships',
    pricePerUnit: 214.41,
    unitOfMeasure: 'Hour',
  },
  {
    code: '15_056_0128_1_3',
    name: 'Assessment Recommendation Therapy Support - Allied Health',
    category: 'Capacity Building - Improved Daily Living',
    pricePerUnit: 193.99,
    unitOfMeasure: 'Hour',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-08T11:20:00Z',
    actorId: 'usr-1',
    actorName: 'Dr. Sarah Jenkins',
    actorRole: 'ADMIN',
    action: 'BSP Plan Approved',
    entity: 'BSPDocument',
    entityId: 'bsp-1',
    details: 'Approved v2.1 Behaviour Support Plan for Jordan Miller after panel review.',
    ipAddress: '10.0.4.12',
  },
];

export const INITIAL_COMMUNICATIONS: CommunicationLog[] = [
  {
    id: 'comm-1',
    entityType: 'Client',
    entityId: 'cli-101',
    entityName: 'Jordan Miller',
    type: 'Phone Call',
    timestamp: '2026-08-04T10:00:00Z',
    authorName: 'Marcus Vance',
    summary: 'Spoke with mother Karen regarding home transport sensory adjustments.',
    followUpRequired: true,
    followUpDate: '2026-08-15',
  },
];

export const INITIAL_PRODA_BATCHES: PRODABatch[] = [
  {
    id: 'batch-2026-08A',
    batchReference: 'NDIS-B2G-20260810-001',
    createdAt: '2026-08-10T09:00:00Z',
    claimCount: 4,
    totalAmount: 1856.44,
    status: 'ACCEPTED',
    submissionDate: '2026-08-10T10:15:00Z',
    ndiaResponseCode: 'NDIA_PAID_FULL',
    claimIds: ['clm-1', 'clm-2'],
  },
  {
    id: 'batch-2026-08B',
    batchReference: 'NDIS-B2G-20260814-002',
    createdAt: '2026-08-14T14:30:00Z',
    claimCount: 3,
    totalAmount: 1147.20,
    status: 'SCRUBBED_VALID',
    claimIds: ['clm-3', 'clm-4'],
  },
];

export const INITIAL_DRIVE_FILES: GoogleDriveFile[] = [
  {
    id: 'drive-folder-1',
    name: 'NDIS Participants 2026',
    mimeType: 'folder',
    parentId: null,
    lastModified: '2026-08-15T08:00:00Z',
    author: 'Dr. Sarah Jenkins',
    tags: ['Clinical', 'Active'],
  },
  {
    id: 'drive-folder-2',
    name: 'PBS Plans & Quality Commission',
    mimeType: 'folder',
    parentId: null,
    lastModified: '2026-08-14T11:20:00Z',
    author: 'Marcus Vance',
    tags: ['PBS', 'Compliance'],
  },
  {
    id: 'drive-folder-3',
    name: 'PRODA Payment Batches',
    mimeType: 'folder',
    parentId: null,
    lastModified: '2026-08-12T16:00:00Z',
    author: 'Elena Rostova',
    tags: ['Billing', 'Finance'],
  },
  {
    id: 'drive-file-1',
    name: 'Jordan Miller - Comprehensive BSP v2.2.gdoc',
    mimeType: 'application/vnd.google-apps.document',
    parentId: 'drive-folder-2',
    sizeBytes: 148200,
    lastModified: '2026-08-15T09:45:00Z',
    author: 'Dr. Sarah Jenkins',
    tags: ['BSP', 'Jordan Miller', 'v2.2'],
    docContent: '# Positive Behaviour Support Plan - Jordan Miller (NDIS #430891204)\n\n## Section 1: Participant Profile\nCommunication: Multimodal (AAC + verbal)...\n\n## Section 2: Functional Behaviour Assessment\nPrimary Function: Escape from sensory auditory overload...',
  },
  {
    id: 'drive-file-2',
    name: 'August 2026 PRODA Claims Batch 001.gsheet',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parentId: 'drive-folder-3',
    sizeBytes: 89400,
    lastModified: '2026-08-10T10:15:00Z',
    author: 'Elena Rostova',
    tags: ['NDIS-B2G-20260810-001', 'PRODA'],
  },
  {
    id: 'drive-file-3',
    name: 'Restrictive Practices Monthly Return - July 2026.pdf',
    mimeType: 'application/pdf',
    parentId: 'drive-folder-2',
    sizeBytes: 320000,
    lastModified: '2026-08-05T12:00:00Z',
    author: 'Marcus Vance',
    tags: ['Senior Practitioner', 'State Authorised'],
  },
];

export const INITIAL_CALENDAR_EVENTS: GoogleCalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Lego-Based Therapy Session (Jordan Miller)',
    start: '2026-08-17T09:30:00',
    end: '2026-08-17T11:00:00',
    type: 'SESSION',
    participantId: 'cli-101',
    participantName: 'Jordan Miller',
    practitionerId: 'prac-2',
    practitionerName: 'Marcus Vance',
    location: 'Suite 4B, Breakthrough Community Clinic',
    status: 'CONFIRMED',
    description: 'Collaborative build focusing on turn taking and receptive communication tokens.',
  },
  {
    id: 'cal-2',
    title: 'FBA Environmental Assessment (Chloe Taylor)',
    start: '2026-08-17T13:00:00',
    end: '2026-08-17T15:00:00',
    type: 'ASSESSMENT',
    participantId: 'cli-102',
    participantName: 'Chloe Taylor',
    practitionerId: 'prac-1',
    practitionerName: 'Dr. Sarah Jenkins',
    location: 'Day Activity Center, Geelong',
    status: 'CONFIRMED',
    description: 'Observational ABC data logging during afternoon classroom transit.',
  },
  {
    id: 'cal-3',
    title: 'Senior Practitioner Restrictive Practice Panel',
    start: '2026-08-18T10:00:00',
    end: '2026-08-18T11:30:00',
    type: 'SUPERVISION',
    practitionerId: 'prac-1',
    practitionerName: 'Dr. Sarah Jenkins',
    location: 'Google Meet Virtual Boardroom',
    status: 'CONFIRMED',
    description: 'Monthly state authorization review for environmental boundary fading protocols.',
  },
  {
    id: 'cal-4',
    title: 'NDIS Plan Review Stakeholder Meeting (Samira Khan)',
    start: '2026-08-19T14:00:00',
    end: '2026-08-19T15:30:00',
    type: 'STAKEHOLDER_MEETING',
    participantId: 'cli-103',
    participantName: 'Samira Khan',
    practitionerId: 'prac-2',
    practitionerName: 'Marcus Vance',
    location: 'Participant Residence, Melbourne',
    status: 'CONFIRMED',
    description: 'Presenting Year 1 GAS progress metrics and recommended Capacity Building budget.',
  },
];

export const INITIAL_COPILOT_MESSAGES: AICopilotMessage[] = [
  {
    id: 'copilot-msg-1',
    role: 'assistant',
    content: 'Welcome to Breakthrough AI Copilot. I have live context across all 19 clinical, operations, billing, and Google Workspace modules. Ask me to synthesize ABC observational data, audit BSPs for NDIS compliance, scrub PRODA payment batches, or prepare shift schedules.',
    timestamp: new Date().toISOString(),
    suggestedActions: [
      { label: 'Audit BSP Compliance', actionType: 'TRIGGER_AUDIT' },
      { label: 'Summarize ABC Trends', actionType: 'NAVIGATE', payload: 'abc-analyser' },
      { label: 'Scrub PRODA Claims Batch', actionType: 'EXPORT_PRODA' },
    ],
  },
];

export const INITIAL_CLINICAL_ASSESSMENTS: ClinicalAssessmentRecord[] = [
  {
    id: 'ass-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    practitionerId: 'prac-1',
    practitionerName: 'Dr. Sarah Jenkins',
    assessmentTool: 'Vineland-3',
    assessmentDate: '2026-06-15',
    domainScores: [
      { domainName: 'Communication', rawScore: 68, standardScore: 62, percentileRank: 1, adaptiveLevel: 'Extremely Low' },
      { domainName: 'Daily Living Skills', rawScore: 84, standardScore: 71, percentileRank: 3, adaptiveLevel: 'Moderately Low' },
      { domainName: 'Socialization', rawScore: 55, standardScore: 58, percentileRank: 0.3, adaptiveLevel: 'Extremely Low' },
      { domainName: 'Motor Skills', rawScore: 92, standardScore: 88, percentileRank: 21, adaptiveLevel: 'Adequate' },
    ],
    clinicalInterpretation: 'Jordan demonstrates marked strengths in gross motor physical activities while experiencing clinically significant challenges in functional receptive and expressive communication. Receptive sensory overload directly impacts social participation in group community settings.',
    recommendations: [
      'Implement structured visual schedules with high-contrast icon sequencing.',
      'Provide noise-cancelling acoustic headsets during high-stimulus community access.',
      'Train support team in PECS/AAC augmentative communication replacement prompts.'
    ],
    status: 'COMPLETED',
  },
  {
    id: 'ass-2',
    clientId: 'cli-102',
    clientName: 'Chloe Taylor',
    practitionerId: 'prac-2',
    practitionerName: 'Marcus Vance',
    assessmentTool: 'Sensory Profile 2',
    assessmentDate: '2026-07-02',
    domainScores: [
      { domainName: 'Auditory Processing', rawScore: 38, standardScore: 32, adaptiveLevel: 'High' },
      { domainName: 'Visual Processing', rawScore: 24, standardScore: 20, adaptiveLevel: 'Adequate' },
      { domainName: 'Touch / Tactile', rawScore: 42, standardScore: 36, adaptiveLevel: 'High' },
      { domainName: 'Vestibular & Proprioception', rawScore: 29, standardScore: 25, adaptiveLevel: 'Adequate' },
    ],
    clinicalInterpretation: 'Sensory Profile 2 demonstrates Sensory Avoiding patterns in Auditory and Tactile quadrants. Sudden loud noises and unexpected physical contact precipitate rapid autonomic nervous system hyperarousal.',
    recommendations: [
      'Introduce scheduled heavy work proprioceptive breaks every 90 minutes.',
      'Establish quiet retreat sensory nook with dimmed lighting and weighted blankets.',
      'Provide 5-minute pre-warning countdowns before noisy acoustic transitions.'
    ],
    status: 'COMPLETED',
  },
];

export const DEFAULT_PRACTICE_BRANDING: PracticeBrandingConfig = {
  practiceName: 'Breakthrough Coaching & Behaviour Support',
  ndisRegistrationNumber: '405001234',
  abn: '48 123 456 789',
  address: 'Suite 402, 120 Collins Street, Melbourne VIC 3000',
  phone: '1300 000 279',
  email: 'admin@breakthrough.org.au',
  website: 'https://breakthrough.org.au',
  primaryColorHex: '#0d9488',
  accentColorHex: '#059669',
  reportHeaderNotice: 'CONFIDENTIAL NDIS ALLIED HEALTH CLINICAL RECORD — PROTECTED UNDER PRIVACY ACT 1988 & NDIS ACT 2013',
  reportFooterDisclaimer: 'Breakthrough Coaching & Behaviour Support is a Registered NDIS Provider (Registration ID: 405001234). All Positive Behaviour Support Plans and Restrictive Practice audits comply strictly with NDIS Quality and Safeguards Commission Rules 2018.',
};

export const INITIAL_CLINICS: ClinicBranch[] = [
  {
    id: 'clinic-melb-cbd',
    name: 'Melbourne CBD Flagship Clinic',
    code: 'VIC-CBD',
    state: 'VIC',
    address: 'Suite 402, 120 Collins Street, Melbourne VIC 3000',
    phone: '(03) 9000 1200',
    email: 'melbourne@breakthrough.org.au',
    leadPractitionerName: 'Dr. Sarah Jenkins',
    activeCaseloadCount: 24,
  },
  {
    id: 'clinic-geelong',
    name: 'Geelong & Surf Coast Regional Hub',
    code: 'VIC-GLG',
    state: 'VIC',
    address: 'Level 1, 88 Moorabool Street, Geelong VIC 3220',
    phone: '(03) 5200 8900',
    email: 'geelong@breakthrough.org.au',
    leadPractitionerName: 'Marcus Vance',
    activeCaseloadCount: 16,
  },
  {
    id: 'clinic-sydney-east',
    name: 'Sydney Specialist PBS & Autism Center',
    code: 'NSW-SYD',
    state: 'NSW',
    address: 'Suite 12, 155 George Street, Sydney NSW 2000',
    phone: '(02) 8000 4500',
    email: 'sydney@breakthrough.org.au',
    leadPractitionerName: 'Elena Rostova',
    activeCaseloadCount: 19,
  },
];

export const INITIAL_EXTRACTED_REPORTS: ExtractedClinicalReport[] = [
  {
    id: 'rep-1',
    clientId: 'cli-101',
    clientName: 'Jordan Miller',
    fileName: 'Jordan_Miller_Royal_Childrens_Hospital_Neuro_2026.pdf',
    uploadDate: '2026-07-28',
    reportType: 'Paediatric Assessment',
    extractedDiagnoses: [
      'Autism Spectrum Disorder (Level 3 - DSM-5-TR 299.00)',
      'Sensory Processing Sensitivity with Auditory Hyper-reactivity (ICD-11 6A02.3)',
      'Developmental Coordination Challenge'
    ],
    sensorySensitivities: [
      'Acoustic reverberation > 75dB triggers autonomic fight/flight escalation',
      'Tactile sensitivity to stiff clothing tags and unannounced touch',
      'Visual discomfort under flickering 50Hz fluorescent lighting'
    ],
    antecedentTriggers: [
      'Abrupt task cessation without visual countdown timer',
      'Unstructured transitions in high-density communal hallways',
      'Receptive verbal overload (> 5 word instructions)'
    ],
    recommendedStrategies: [
      'Provision of acoustic noise-cancelling headphones prior to transit',
      'Use 3-step visual schedule with high-contrast icon strip',
      '10-minute proprioceptive heavy-work breaks every 2 hours'
    ],
    summaryNarrative: 'Comprehensive neurological assessment confirms Level 3 Autism Spectrum Disorder with pronounced sensory modulation difficulties. Highlights critical importance of environmental modifications and visual communication supports to prevent sensory overload.',
    status: 'TRANSFERRED_TO_BSP',
  },
];

// ============================================================================
// R1: Participant Outcome Tracking Mock Data
// ============================================================================

import {
  NDISPlanBudgetLine,
  GASGoal,
  OutcomeMeasurement,
  PlanReviewSummary,
  CPDRecord,
  StaffCredential,
  OnboardingChecklist,
  CompetencyMatrixEntry,
  TrainingModule,
  TrainingCompletion,
  Referral,
  WaitlistEntry,
  ServiceAgreement,
  IntakeAssessment,
  EnhancedNotification,
  NotificationPreference,
  DigestSummary,
  WorkflowTemplate,
  AutomationRule,
  TaskAssignment,
  BatchAction,
  WorkloadPrediction,
} from '@/types';

export const INITIAL_PLAN_BUDGET_LINES: NDISPlanBudgetLine[] = [
  { id: 'pbl-1', clientId: 'cli-101', clientName: 'Jordan Miller', supportCategory: 'Improved Daily Living', supportItemCode: '15_038_0117_1_3', allocated: 18500, spent: 12200, utilizationPercent: 65.9, planStartDate: '2026-02-01', planEndDate: '2027-01-31', lastClaimDate: '2026-08-05' },
  { id: 'pbl-2', clientId: 'cli-101', clientName: 'Jordan Miller', supportCategory: 'Capacity Building - CB Daily Activity', supportItemCode: '09_011_0117_6_3', allocated: 8200, spent: 6150, utilizationPercent: 75.0, planStartDate: '2026-02-01', planEndDate: '2027-01-31', lastClaimDate: '2026-08-02' },
  { id: 'pbl-3', clientId: 'cli-101', clientName: 'Jordan Miller', supportCategory: 'Social & Community Participation', supportItemCode: '04_104_0125_6_1', allocated: 12000, spent: 4800, utilizationPercent: 40.0, planStartDate: '2026-02-01', planEndDate: '2027-01-31', lastClaimDate: '2026-07-20' },
  { id: 'pbl-4', clientId: 'cli-102', clientName: 'Amara Osei', supportCategory: 'Positive Behaviour Support', supportItemCode: '11_022_0117_6_3', allocated: 22000, spent: 19800, utilizationPercent: 90.0, planStartDate: '2026-03-15', planEndDate: '2027-03-14', lastClaimDate: '2026-08-08' },
  { id: 'pbl-5', clientId: 'cli-102', clientName: 'Amara Osei', supportCategory: 'Assistive Technology', supportItemCode: '05_010_0117_1_3', allocated: 5000, spent: 3250, utilizationPercent: 65.0, planStartDate: '2026-03-15', planEndDate: '2027-03-14', lastClaimDate: '2026-06-15' },
  { id: 'pbl-6', clientId: 'cli-103', clientName: 'Liam Chen', supportCategory: 'Therapeutic Supports', supportItemCode: '15_056_0128_1_3', allocated: 15000, spent: 2250, utilizationPercent: 15.0, planStartDate: '2026-06-01', planEndDate: '2027-05-31', lastClaimDate: '2026-07-30' },
];

export const INITIAL_GAS_GOALS: GASGoal[] = [
  {
    id: 'gas-1', clientId: 'cli-101', clientName: 'Jordan Miller',
    goalTitle: 'Independent use of emotion regulation strategies in community settings',
    domain: 'Self-Regulation', expectedLevel: 0, baselineLevel: -2, currentLevel: 0, weight: 1.0,
    measurements: [
      { id: 'gm-1', date: '2026-03-01', level: -2, note: 'Baseline: Requires full physical prompting to use calming strategies', measuredBy: 'Dr. Sarah Jenkins' },
      { id: 'gm-2', date: '2026-05-01', level: -1, note: 'Uses noise-cancelling headphones when verbally prompted', measuredBy: 'Dr. Sarah Jenkins' },
      { id: 'gm-3', date: '2026-07-01', level: 0, note: 'Independently initiates headphone use in 7/10 community outings', measuredBy: 'Dr. Sarah Jenkins' },
    ],
    tScore: 50.0, startDate: '2026-03-01', targetDate: '2026-12-31', status: 'Active',
  },
  {
    id: 'gas-2', clientId: 'cli-101', clientName: 'Jordan Miller',
    goalTitle: 'Functional communication via AAC device during mealtimes',
    domain: 'Communication', expectedLevel: 0, baselineLevel: -2, currentLevel: 1, weight: 1.2,
    measurements: [
      { id: 'gm-4', date: '2026-03-01', level: -2, note: 'Baseline: No spontaneous use of AAC at meals', measuredBy: 'Marcus Vance' },
      { id: 'gm-5', date: '2026-05-15', level: -1, note: 'Uses AAC to request 1 preferred food with gestural prompt', measuredBy: 'Marcus Vance' },
      { id: 'gm-6', date: '2026-07-15', level: 1, note: 'Independently navigates AAC to request 3+ items and refuse non-preferred foods', measuredBy: 'Marcus Vance' },
    ],
    tScore: 60.0, startDate: '2026-03-01', targetDate: '2026-10-15', status: 'Active',
  },
  {
    id: 'gas-3', clientId: 'cli-102', clientName: 'Amara Osei',
    goalTitle: 'Reduce frequency of SIB episodes during transitions',
    domain: 'Behaviour Reduction', expectedLevel: 0, baselineLevel: -2, currentLevel: -1, weight: 1.5,
    measurements: [
      { id: 'gm-7', date: '2026-04-01', level: -2, note: 'Baseline: 12+ SIB episodes per week during transitions', measuredBy: 'Dr. Sarah Jenkins' },
      { id: 'gm-8', date: '2026-06-15', level: -1, note: 'Reduced to 6-8 episodes/week with visual schedule introduction', measuredBy: 'Dr. Sarah Jenkins' },
    ],
    tScore: 43.5, startDate: '2026-04-01', targetDate: '2027-03-14', status: 'Active',
  },
  {
    id: 'gas-4', clientId: 'cli-102', clientName: 'Amara Osei',
    goalTitle: 'Engage in structured leisure activity for 20+ minutes',
    domain: 'Community Participation', expectedLevel: 0, baselineLevel: -2, currentLevel: 0, weight: 0.8,
    measurements: [
      { id: 'gm-9', date: '2026-04-01', level: -2, note: 'Baseline: Disengages from activities within 3 minutes', measuredBy: 'Marcus Vance' },
      { id: 'gm-10', date: '2026-06-01', level: -1, note: 'Maintains engagement for 10 minutes with 1:1 support', measuredBy: 'Marcus Vance' },
      { id: 'gm-11', date: '2026-08-01', level: 0, note: 'Participates in swimming lesson for 22 minutes independently', measuredBy: 'Marcus Vance' },
    ],
    tScore: 50.0, startDate: '2026-04-01', targetDate: '2027-01-31', status: 'Active',
  },
  {
    id: 'gas-5', clientId: 'cli-103', clientName: 'Liam Chen',
    goalTitle: 'Follow 2-step instructions without physical prompting',
    domain: 'Receptive Communication', expectedLevel: 0, baselineLevel: -2, currentLevel: -2, weight: 1.0,
    measurements: [
      { id: 'gm-12', date: '2026-06-15', level: -2, note: 'Baseline: Requires hand-over-hand for all multi-step tasks', measuredBy: 'Dr. Sarah Jenkins' },
    ],
    tScore: 30.0, startDate: '2026-06-15', targetDate: '2027-05-31', status: 'Active',
  },
];

export const INITIAL_OUTCOME_MEASUREMENTS: OutcomeMeasurement[] = [
  { id: 'om-1', clientId: 'cli-101', clientName: 'Jordan Miller', domain: 'Communication', instrument: 'Vineland-3 Communication Domain', baselineValue: 62, currentValue: 71, maxValue: 160, measurementDate: '2026-07-15', assessedBy: 'Dr. Sarah Jenkins', trend: 'Improving' },
  { id: 'om-2', clientId: 'cli-101', clientName: 'Jordan Miller', domain: 'Daily Living Skills', instrument: 'Vineland-3 Daily Living Skills', baselineValue: 55, currentValue: 59, maxValue: 160, measurementDate: '2026-07-15', assessedBy: 'Dr. Sarah Jenkins', trend: 'Improving' },
  { id: 'om-3', clientId: 'cli-101', clientName: 'Jordan Miller', domain: 'Socialization', instrument: 'Vineland-3 Socialization Domain', baselineValue: 48, currentValue: 50, maxValue: 160, measurementDate: '2026-07-15', assessedBy: 'Dr. Sarah Jenkins', trend: 'Stable' },
  { id: 'om-4', clientId: 'cli-101', clientName: 'Jordan Miller', domain: 'Sensory Processing', instrument: 'Sensory Profile 2 - Caregiver', baselineValue: 28, currentValue: 35, maxValue: 80, measurementDate: '2026-07-20', assessedBy: 'Marcus Vance', trend: 'Improving' },
  { id: 'om-5', clientId: 'cli-102', clientName: 'Amara Osei', domain: 'Adaptive Behaviour', instrument: 'ABAS-3 General Adaptive Composite', baselineValue: 58, currentValue: 61, maxValue: 160, measurementDate: '2026-08-01', assessedBy: 'Dr. Sarah Jenkins', trend: 'Improving' },
  { id: 'om-6', clientId: 'cli-102', clientName: 'Amara Osei', domain: 'Behaviour Frequency', instrument: 'BPI-01 Self-Injury Subscale', baselineValue: 42, currentValue: 35, maxValue: 52, measurementDate: '2026-08-01', assessedBy: 'Dr. Sarah Jenkins', trend: 'Improving' },
  { id: 'om-7', clientId: 'cli-103', clientName: 'Liam Chen', domain: 'Communication', instrument: 'PPVT-5 Receptive Vocabulary', baselineValue: 45, currentValue: 45, maxValue: 160, measurementDate: '2026-07-30', assessedBy: 'Marcus Vance', trend: 'Stable' },
  { id: 'om-8', clientId: 'cli-103', clientName: 'Liam Chen', domain: 'Motor Skills', instrument: 'Vineland-3 Motor Skills Domain', baselineValue: 52, currentValue: 54, maxValue: 160, measurementDate: '2026-07-30', assessedBy: 'Marcus Vance', trend: 'Improving' },
];

// ============================================================================
// R2: Staff Training & Credential Mock Data
// ============================================================================

export const INITIAL_CPD_RECORDS: CPDRecord[] = [
  { id: 'cpd-1', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', activityTitle: 'NDIS PBS Capability Framework Masterclass', category: 'Conference', hours: 8, date: '2026-03-15', provider: 'NDIS Quality & Safeguards Commission', verified: true },
  { id: 'cpd-2', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', activityTitle: 'Functional Behaviour Assessment Advanced Workshop', category: 'Workshop', hours: 6, date: '2026-05-10', provider: 'ABAI Australia Chapter', verified: true },
  { id: 'cpd-3', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', activityTitle: 'Monthly Clinical Supervision Session', category: 'Supervision', hours: 2, date: '2026-07-20', provider: 'Internal', verified: true },
  { id: 'cpd-4', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', activityTitle: 'Trauma-Informed Practice in Disability Settings', category: 'Online Course', hours: 4, date: '2026-04-22', provider: 'Blue Knot Foundation', verified: true },
  { id: 'cpd-5', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', activityTitle: 'AAC Implementation Strategies for Complex Communication Needs', category: 'Workshop', hours: 6, date: '2026-06-08', provider: 'Scope Australia', verified: true },
  { id: 'cpd-6', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', activityTitle: 'Peer Review Case Presentation - SIB Reduction Protocols', category: 'Peer Review', hours: 2, date: '2026-07-15', provider: 'Internal', verified: true },
  { id: 'cpd-7', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', activityTitle: 'NDIS Worker Orientation Module', category: 'Online Course', hours: 8, date: '2026-01-20', provider: 'NDIS Commission', verified: true },
  { id: 'cpd-8', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', activityTitle: 'Restrictive Practices Reduction Framework', category: 'Conference', hours: 4, date: '2026-05-18', provider: 'Office of the Senior Practitioner VIC', verified: false },
];

export const INITIAL_CREDENTIALS: StaffCredential[] = [
  { id: 'cred-1', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', credentialType: 'NDIS Worker Screening', issuer: 'NDIS Quality & Safeguards Commission', credentialNumber: 'WSC-2024-001892', issueDate: '2024-11-15', expiryDate: '2029-11-14', status: 'Valid' },
  { id: 'cred-2', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', credentialType: 'AHPRA Registration', issuer: 'AHPRA', credentialNumber: 'PSY0002145678', issueDate: '2025-12-01', expiryDate: '2026-11-30', status: 'Valid' },
  { id: 'cred-3', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', credentialType: 'Police Check', issuer: 'Victoria Police', credentialNumber: 'NPC-826491', issueDate: '2025-04-20', expiryDate: '2028-04-19', status: 'Valid' },
  { id: 'cred-4', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', credentialType: 'NDIS Worker Screening', issuer: 'NDIS Quality & Safeguards Commission', credentialNumber: 'WSC-2023-007341', issueDate: '2023-08-30', expiryDate: '2026-08-29', status: 'Expiring Soon', reminderSentDays: [90, 60] },
  { id: 'cred-5', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', credentialType: 'First Aid', issuer: 'St John Ambulance', credentialNumber: 'FA-481290', issueDate: '2024-03-10', expiryDate: '2027-03-09', status: 'Valid' },
  { id: 'cred-6', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', credentialType: 'WWCC', issuer: 'Service Victoria', credentialNumber: 'WWCC-1892043', issueDate: '2023-06-15', expiryDate: '2028-06-14', status: 'Valid' },
  { id: 'cred-7', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', credentialType: 'NDIS Worker Screening', issuer: 'NDIS Quality & Safeguards Commission', credentialNumber: 'WSC-2025-012488', issueDate: '2025-01-20', expiryDate: '2026-09-15', status: 'Expiring Soon', reminderSentDays: [90] },
];

export const INITIAL_ONBOARDING_CHECKLISTS: OnboardingChecklist[] = [
  {
    id: 'onb-1', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor',
    startDate: '2026-01-10', targetCompletionDate: '2026-04-10',
    status: 'In Progress', supervisorId: 'prac-1', supervisorName: 'Dr. Sarah Jenkins',
    items: [
      { id: 'oi-1', title: 'Complete NDIS Worker Orientation Module', category: 'Orientation', mandatory: true, completed: true, completedDate: '2026-01-20', completedBy: 'Dr. Priya Kapoor' },
      { id: 'oi-2', title: 'Read & sign Code of Conduct', category: 'Documentation', mandatory: true, completed: true, completedDate: '2026-01-12', completedBy: 'Dr. Priya Kapoor' },
      { id: 'oi-3', title: 'Complete Restrictive Practices e-learning module', category: 'Training', mandatory: true, completed: true, completedDate: '2026-02-05', completedBy: 'Dr. Priya Kapoor' },
      { id: 'oi-4', title: 'First Aid & CPR certification', category: 'Training', mandatory: true, completed: true, completedDate: '2026-02-15', completedBy: 'Dr. Priya Kapoor' },
      { id: 'oi-5', title: 'Shadow 3 clinical sessions with supervisor', category: 'Supervision', mandatory: true, completed: true, completedDate: '2026-03-01', completedBy: 'Dr. Sarah Jenkins' },
      { id: 'oi-6', title: 'Set up Breakthrough OS user account & permissions', category: 'System Access', mandatory: true, completed: true, completedDate: '2026-01-11', completedBy: 'Admin' },
      { id: 'oi-7', title: 'Complete Behaviour Support Plan writing assessment', category: 'Training', mandatory: true, completed: false },
      { id: 'oi-8', title: 'Complete 10hr supervised direct service delivery', category: 'Supervision', mandatory: true, completed: false },
      { id: 'oi-9', title: 'Review practice insurance & indemnity documentation', category: 'Documentation', mandatory: false, completed: false },
      { id: 'oi-10', title: 'Attend team induction meeting', category: 'Orientation', mandatory: false, completed: true, completedDate: '2026-01-15', completedBy: 'Dr. Priya Kapoor' },
    ],
  },
  {
    id: 'onb-2', practitionerId: 'prac-4', practitionerName: 'Alex Nguyen',
    startDate: '2026-07-01', targetCompletionDate: '2026-10-01',
    status: 'In Progress', supervisorId: 'prac-2', supervisorName: 'Marcus Vance',
    items: [
      { id: 'oi-11', title: 'Complete NDIS Worker Orientation Module', category: 'Orientation', mandatory: true, completed: true, completedDate: '2026-07-08', completedBy: 'Alex Nguyen' },
      { id: 'oi-12', title: 'Read & sign Code of Conduct', category: 'Documentation', mandatory: true, completed: true, completedDate: '2026-07-02', completedBy: 'Alex Nguyen' },
      { id: 'oi-13', title: 'Complete Restrictive Practices e-learning module', category: 'Training', mandatory: true, completed: false },
      { id: 'oi-14', title: 'First Aid & CPR certification', category: 'Training', mandatory: true, completed: false },
      { id: 'oi-15', title: 'Shadow 3 clinical sessions with supervisor', category: 'Supervision', mandatory: true, completed: false },
      { id: 'oi-16', title: 'Set up Breakthrough OS user account & permissions', category: 'System Access', mandatory: true, completed: true, completedDate: '2026-07-01', completedBy: 'Admin' },
      { id: 'oi-17', title: 'Complete Behaviour Support Plan writing assessment', category: 'Training', mandatory: true, completed: false },
      { id: 'oi-18', title: 'Complete 10hr supervised direct service delivery', category: 'Supervision', mandatory: true, completed: false },
    ],
  },
  {
    id: 'onb-3', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins',
    startDate: '2023-01-05', targetCompletionDate: '2023-04-05',
    status: 'Complete', supervisorId: 'prac-1', supervisorName: 'Self (Clinical Director)',
    items: [
      { id: 'oi-19', title: 'Complete NDIS Worker Orientation Module', category: 'Orientation', mandatory: true, completed: true, completedDate: '2023-01-10', completedBy: 'Dr. Sarah Jenkins' },
      { id: 'oi-20', title: 'Read & sign Code of Conduct', category: 'Documentation', mandatory: true, completed: true, completedDate: '2023-01-06', completedBy: 'Dr. Sarah Jenkins' },
      { id: 'oi-21', title: 'Set up Breakthrough OS user account & permissions', category: 'System Access', mandatory: true, completed: true, completedDate: '2023-01-05', completedBy: 'Admin' },
    ],
  },
];

export const INITIAL_COMPETENCY_MATRIX: CompetencyMatrixEntry[] = [
  { id: 'cm-1', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', serviceArea: 'Functional Behaviour Assessment', skillLevel: 'Expert', assessedDate: '2026-02-01', assessedBy: 'External Auditor', nextReviewDate: '2027-02-01' },
  { id: 'cm-2', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', serviceArea: 'Positive Behaviour Support Planning', skillLevel: 'Expert', assessedDate: '2026-02-01', assessedBy: 'External Auditor', nextReviewDate: '2027-02-01' },
  { id: 'cm-3', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', serviceArea: 'AAC & Communication Support', skillLevel: 'Advanced', assessedDate: '2026-03-15', assessedBy: 'Dr. Sarah Jenkins', nextReviewDate: '2027-03-15' },
  { id: 'cm-4', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', serviceArea: 'Positive Behaviour Support Planning', skillLevel: 'Advanced', assessedDate: '2026-03-15', assessedBy: 'Dr. Sarah Jenkins', nextReviewDate: '2027-03-15' },
  { id: 'cm-5', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', serviceArea: 'Functional Behaviour Assessment', skillLevel: 'Intermediate', assessedDate: '2026-05-20', assessedBy: 'Dr. Sarah Jenkins', nextReviewDate: '2026-11-20' },
  { id: 'cm-6', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', serviceArea: 'Sensory Processing Assessment', skillLevel: 'Foundation', assessedDate: '2026-05-20', assessedBy: 'Dr. Sarah Jenkins', nextReviewDate: '2026-11-20' },
];

export const INITIAL_TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm-1', title: 'NDIS Code of Conduct & Worker Obligations', category: 'Compliance',
    description: 'Understanding the NDIS Code of Conduct, worker obligations, and reportable incident requirements.',
    durationMinutes: 60, content: 'Module covering NDIS Code of Conduct principles, worker screening requirements, and mandatory reporting obligations under the NDIS Quality and Safeguards Framework.',
    quizQuestions: [
      { id: 'q-1', question: 'How many days do you have to report a reportable incident to the NDIS Commission?', options: ['24 hours', '5 business days', '10 business days', '30 days'], correctIndex: 1 },
      { id: 'q-2', question: 'Which of the following is NOT a regulated restrictive practice?', options: ['Seclusion', 'Chemical restraint', 'Verbal instruction', 'Environmental restraint'], correctIndex: 2 },
      { id: 'q-3', question: 'Worker screening checks must be renewed every:', options: ['1 year', '3 years', '5 years', 'Never'], correctIndex: 2 },
    ],
    passingScore: 80, mandatory: true, createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'tm-2', title: 'Restrictive Practices Reduction Framework', category: 'Clinical Skills',
    description: 'Evidence-based approaches to reducing and eliminating restrictive practices in behaviour support.',
    durationMinutes: 90, content: 'This module covers the legislative framework for restrictive practices, least-restrictive alternatives assessment, fade-out planning, and monitoring compliance.',
    quizQuestions: [
      { id: 'q-4', question: 'What must be documented before implementing any restrictive practice?', options: ['Budget approval', 'Less restrictive alternatives tried', 'Participant weight', 'Room temperature'], correctIndex: 1 },
      { id: 'q-5', question: 'Who must authorise regulated restrictive practices?', options: ['Support worker', 'Family member', 'State/Territory authorisation body', 'The participant'], correctIndex: 2 },
    ],
    passingScore: 80, mandatory: true, createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'tm-3', title: 'Trauma-Informed Care Foundations', category: 'Clinical Skills',
    description: 'Principles of trauma-informed care and their application in disability support settings.',
    durationMinutes: 45, content: 'Understanding trauma responses, creating safety, building trust, and integrating trauma-informed principles into positive behaviour support.',
    quizQuestions: [
      { id: 'q-6', question: 'Which of the following is a core principle of trauma-informed care?', options: ['Punishment-based response', 'Safety and trustworthiness', 'Rapid confrontation', 'Isolation for reflection'], correctIndex: 1 },
    ],
    passingScore: 70, mandatory: false, createdBy: 'Marcus Vance',
  },
  {
    id: 'tm-4', title: 'Manual Handling & Physical Safety', category: 'Safety',
    description: 'Safe manual handling techniques and workplace physical safety procedures.',
    durationMinutes: 30, content: 'Practical guidelines for safe lifting, transferring participants, and preventing workplace injuries.',
    quizQuestions: [
      { id: 'q-7', question: 'What is the first step before performing a manual handling task?', options: ['Lift immediately', 'Risk assessment', 'Call for backup', 'Document the task'], correctIndex: 1 },
    ],
    passingScore: 80, mandatory: true, createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'tm-5', title: 'NDIS Pricing Arrangements & Price Limits', category: 'NDIS Framework',
    description: 'Understanding NDIS pricing rules, support categories, and claiming procedures.',
    durationMinutes: 45, content: 'Overview of NDIS Pricing Arrangements 2025-26, support item codes, claiming rules, and PRODA batch submission.',
    quizQuestions: [
      { id: 'q-8', question: 'What is the maximum hourly rate for Specialist Behaviour Support (Level 3) in 2025-26?', options: ['$150.00', '$193.99', '$214.41', '$265.00'], correctIndex: 2 },
      { id: 'q-9', question: 'Travel claims are limited to:', options: ['30 minutes per appointment', 'No limit', 'MMM classification based', '60 minutes always'], correctIndex: 2 },
    ],
    passingScore: 80, mandatory: false, createdBy: 'Dr. Sarah Jenkins',
  },
];

export const INITIAL_TRAINING_COMPLETIONS: TrainingCompletion[] = [
  { id: 'tc-1', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', moduleId: 'tm-1', moduleTitle: 'NDIS Code of Conduct & Worker Obligations', completedDate: '2026-01-15', quizScore: 100, passed: true, attempts: 1 },
  { id: 'tc-2', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', moduleId: 'tm-2', moduleTitle: 'Restrictive Practices Reduction Framework', completedDate: '2026-01-20', quizScore: 100, passed: true, attempts: 1 },
  { id: 'tc-3', practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', moduleId: 'tm-4', moduleTitle: 'Manual Handling & Physical Safety', completedDate: '2026-02-01', quizScore: 100, passed: true, attempts: 1 },
  { id: 'tc-4', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', moduleId: 'tm-1', moduleTitle: 'NDIS Code of Conduct & Worker Obligations', completedDate: '2026-01-18', quizScore: 80, passed: true, attempts: 2 },
  { id: 'tc-5', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', moduleId: 'tm-2', moduleTitle: 'Restrictive Practices Reduction Framework', completedDate: '2026-02-10', quizScore: 90, passed: true, attempts: 1 },
  { id: 'tc-6', practitionerId: 'prac-2', practitionerName: 'Marcus Vance', moduleId: 'tm-3', moduleTitle: 'Trauma-Informed Care Foundations', completedDate: '2026-03-05', quizScore: 100, passed: true, attempts: 1 },
  { id: 'tc-7', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', moduleId: 'tm-1', moduleTitle: 'NDIS Code of Conduct & Worker Obligations', completedDate: '2026-01-25', quizScore: 67, passed: false, attempts: 1 },
  { id: 'tc-8', practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', moduleId: 'tm-4', moduleTitle: 'Manual Handling & Physical Safety', completedDate: '2026-02-20', quizScore: 80, passed: true, attempts: 1 },
];

// ============================================================================
// R3: Referral & Intake Pipeline Mock Data
// ============================================================================

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-1', participantName: 'Ethan Wright', ndisNumber: '430992145', dateOfBirth: '2010-08-22',
    primaryDisability: 'Autism Spectrum Disorder (Level 2)', referralDate: '2026-07-20',
    source: 'Support Coordinator', referrerName: 'Lisa Thompson', referrerEmail: 'lisa@supportcoord.org.au', referrerPhone: '0412 345 678',
    stage: 'Clinical Assessment', triageFields: { urgency: 3, complexity: 4, serviceAvailability: 3, riskLevel: 'Medium', primaryNeed: 'Behaviour Support Plan development', previousProvider: true, interpreterRequired: false },
    priorityScore: 76, assignedPractitionerId: 'prac-2', assignedPractitionerName: 'Marcus Vance',
    estimatedPlanValue: 28000, notes: 'Previously had PBS from another provider but family seeking second opinion and fresh approach. Transition-related behaviours of concern.',
    createdAt: '2026-07-20T09:00:00Z', updatedAt: '2026-08-05T14:00:00Z',
  },
  {
    id: 'ref-2', participantName: 'Zara Patel', ndisNumber: '431001892', dateOfBirth: '2015-03-11',
    primaryDisability: 'Intellectual Disability & Sensory Processing Disorder', referralDate: '2026-08-01',
    source: 'Hospital / Allied Health', referrerName: 'Dr. Michael Chen', referrerEmail: 'mchen@royalmelb.org.au', referrerPhone: '03 9342 7000',
    stage: 'Triage', triageFields: { urgency: 5, complexity: 5, serviceAvailability: 2, riskLevel: 'Critical', primaryNeed: 'Crisis behaviour support following hospital discharge', previousProvider: false, interpreterRequired: true },
    priorityScore: 94, notes: 'Urgent post-hospital discharge. Significant SIB requiring immediate BSP development. Hindi interpreter needed for family consultation.',
    createdAt: '2026-08-01T11:00:00Z', updatedAt: '2026-08-01T11:00:00Z',
  },
  {
    id: 'ref-3', participantName: 'Noah Williams', ndisNumber: '430875320', dateOfBirth: '2008-11-05',
    primaryDisability: 'Down Syndrome with Anxiety Disorder', referralDate: '2026-06-15',
    source: 'NDIS Portal', referrerName: 'NDIA Local Area Coordinator', referrerEmail: 'lac@ndis.gov.au', referrerPhone: '1800 800 110',
    stage: 'Service Matching', triageFields: { urgency: 2, complexity: 3, serviceAvailability: 4, riskLevel: 'Low', primaryNeed: 'Social skills development and anxiety management', previousProvider: false, interpreterRequired: false },
    priorityScore: 58, assignedPractitionerId: 'prac-1', assignedPractitionerName: 'Dr. Sarah Jenkins',
    estimatedPlanValue: 15000, notes: 'LAC referral for capacity building. Family highly engaged and motivated.',
    createdAt: '2026-06-15T08:30:00Z', updatedAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'ref-4', participantName: 'Mia Gonzalez', dateOfBirth: '2012-01-28',
    primaryDisability: 'Cerebral Palsy with Behavioural Challenges', referralDate: '2026-08-10',
    source: 'GP Referral', referrerName: 'Dr. Amanda Ford', referrerEmail: 'aford@gpmelbourne.com.au', referrerPhone: '03 9876 5432',
    stage: 'New', triageFields: { urgency: 3, complexity: 3, serviceAvailability: 3, riskLevel: 'Medium', primaryNeed: 'Positive behaviour support for challenging transitions', previousProvider: false, interpreterRequired: false },
    priorityScore: 64, notes: 'GP referral following observation of escalating behaviour at school. NDIS plan currently being developed.',
    createdAt: '2026-08-10T15:00:00Z', updatedAt: '2026-08-10T15:00:00Z',
  },
  {
    id: 'ref-5', participantName: 'James O\'Connor', ndisNumber: '430845210', dateOfBirth: '2003-07-14',
    primaryDisability: 'Autism Spectrum Disorder (Level 1)', referralDate: '2026-05-01',
    source: 'Self-Referral', referrerName: 'James O\'Connor', referrerEmail: 'james.oconnor@email.com', referrerPhone: '0433 567 890',
    stage: 'Converted', triageFields: { urgency: 2, complexity: 2, serviceAvailability: 5, riskLevel: 'Low', primaryNeed: 'Independent living skills and employment support', previousProvider: true, interpreterRequired: false },
    priorityScore: 52, assignedPractitionerId: 'prac-2', assignedPractitionerName: 'Marcus Vance',
    estimatedPlanValue: 12000, notes: 'Self-referral. Transitioned from paediatric to adult services. Goal: independent living skills.',
    createdAt: '2026-05-01T10:00:00Z', updatedAt: '2026-06-20T16:00:00Z',
  },
  {
    id: 'ref-6', participantName: 'Sophie Bennett', ndisNumber: '431020456', dateOfBirth: '2014-09-30',
    primaryDisability: 'ADHD with Oppositional Defiant Disorder', referralDate: '2026-08-14',
    source: 'Community Organisation', referrerName: 'Kelly Richards', referrerEmail: 'kelly@communitycare.org.au', referrerPhone: '0401 234 567',
    stage: 'New', triageFields: { urgency: 4, complexity: 4, serviceAvailability: 3, riskLevel: 'High', primaryNeed: 'Behaviour support for school refusal and family conflict', previousProvider: false, interpreterRequired: false },
    priorityScore: 80, notes: 'Community care referral. Child at risk of school exclusion. Family requesting urgent support.',
    createdAt: '2026-08-14T09:30:00Z', updatedAt: '2026-08-14T09:30:00Z',
  },
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  { id: 'wl-1', referralId: 'ref-2', participantName: 'Zara Patel', position: 1, estimatedStartDate: '2026-08-25', serviceType: 'Crisis Behaviour Support', priority: 'Critical', addedDate: '2026-08-02', notes: 'Priority placement due to hospital discharge urgency' },
  { id: 'wl-2', referralId: 'ref-4', participantName: 'Mia Gonzalez', position: 2, estimatedStartDate: '2026-09-15', serviceType: 'Positive Behaviour Support', priority: 'Standard', addedDate: '2026-08-11', notes: 'Awaiting NDIS plan confirmation' },
  { id: 'wl-3', referralId: 'ref-6', participantName: 'Sophie Bennett', position: 3, estimatedStartDate: '2026-09-22', serviceType: 'Behaviour Support Assessment', priority: 'Urgent', addedDate: '2026-08-15', notes: 'School term starts soon — expedite if possible' },
  { id: 'wl-4', referralId: 'ref-1', participantName: 'Ethan Wright', position: 4, estimatedStartDate: '2026-10-01', serviceType: 'Comprehensive BSP Development', assignedPractitionerId: 'prac-2', assignedPractitionerName: 'Marcus Vance', priority: 'Standard', addedDate: '2026-07-25' },
];

export const INITIAL_SERVICE_AGREEMENTS: ServiceAgreement[] = [
  {
    id: 'sa-1', referralId: 'ref-5', participantName: 'James O\'Connor', ndisNumber: '430845210',
    dateOfBirth: '2003-07-14', primaryDisability: 'Autism Spectrum Disorder (Level 1)',
    planStartDate: '2026-06-20', planEndDate: '2027-06-19',
    serviceCategories: [
      { category: 'Improved Daily Living - Behaviour Support', allocatedBudget: 8500, hourlyRate: 193.99 },
      { category: 'Capacity Building - Daily Activity', allocatedBudget: 3500, hourlyRate: 100.14 },
    ],
    totalBudget: 12000, assignedPractitionerId: 'prac-2', assignedPractitionerName: 'Marcus Vance',
    status: 'Active', generatedAt: '2026-06-15T10:00:00Z', signedAt: '2026-06-18T14:00:00Z',
    agreementMarkdown: '# NDIS Service Agreement\n\n**Participant:** James O\'Connor\n**NDIS Number:** 430845210\n**Provider:** Breakthrough Behaviour Support\n**Registration:** 405001234\n\n## Services\n- Positive Behaviour Support (Specialist Level)\n- Capacity Building for Independent Living\n\n## Schedule\n- Fortnightly 1.5hr sessions\n- Monthly progress review\n\n## Funding: $12,000 allocated\n\nSigned: 18 June 2026',
  },
  {
    id: 'sa-2', referralId: 'ref-3', participantName: 'Noah Williams', ndisNumber: '430875320',
    dateOfBirth: '2008-11-05', primaryDisability: 'Down Syndrome with Anxiety Disorder',
    planStartDate: '2026-09-01', planEndDate: '2027-08-31',
    serviceCategories: [
      { category: 'Improved Daily Living - Behaviour Support', allocatedBudget: 10000, hourlyRate: 193.99 },
      { category: 'Social & Community Participation', allocatedBudget: 5000, hourlyRate: 65.09 },
    ],
    totalBudget: 15000, assignedPractitionerId: 'prac-1', assignedPractitionerName: 'Dr. Sarah Jenkins',
    status: 'Draft', generatedAt: '2026-08-12T09:00:00Z',
    agreementMarkdown: '# NDIS Service Agreement\n\n**Participant:** Noah Williams\n**NDIS Number:** 430875320\n**Provider:** Breakthrough Behaviour Support\n\n## Services\n- Social Skills Group Program\n- Individual Anxiety Management Sessions\n\n## Funding: $15,000 allocated\n\n*DRAFT — Awaiting family review and signature*',
  },
  {
    id: 'sa-3', referralId: 'ref-1', participantName: 'Ethan Wright', ndisNumber: '430992145',
    dateOfBirth: '2010-08-22', primaryDisability: 'Autism Spectrum Disorder (Level 2)',
    planStartDate: '2026-10-01', planEndDate: '2027-09-30',
    serviceCategories: [
      { category: 'Positive Behaviour Support', allocatedBudget: 20000, hourlyRate: 214.41 },
      { category: 'Capacity Building', allocatedBudget: 8000, hourlyRate: 100.14 },
    ],
    totalBudget: 28000, assignedPractitionerId: 'prac-2', assignedPractitionerName: 'Marcus Vance',
    status: 'Sent', generatedAt: '2026-08-14T11:00:00Z',
    agreementMarkdown: '# NDIS Service Agreement\n\n**Participant:** Ethan Wright\n**NDIS Number:** 430992145\n**Provider:** Breakthrough Behaviour Support\n\n## Services\n- Comprehensive Behaviour Support Plan Development\n- Capacity Building & Skill Teaching\n\n## Funding: $28,000 allocated\n\n*Sent to family for review on 14 August 2026*',
  },
];

export const INITIAL_INTAKE_ASSESSMENTS: IntakeAssessment[] = [
  {
    id: 'ia-1', referralId: 'ref-1', participantName: 'Ethan Wright', currentStage: 'Service Matching',
    stages: [
      { name: 'Initial Screen', status: 'Complete', startedDate: '2026-07-21', completedDate: '2026-07-22', assignedTo: 'Dr. Sarah Jenkins', findings: 'Appropriate referral. Meets service criteria for Level 2 ASD PBS.' },
      { name: 'Clinical Assessment', status: 'Complete', startedDate: '2026-07-25', completedDate: '2026-08-05', assignedTo: 'Marcus Vance', handoffNotes: 'Completed initial FBA screen. Transition-related behaviours confirmed.', findings: 'Primary function: escape/avoidance of unpredictable transitions.' },
      { name: 'Service Matching', status: 'In Progress', startedDate: '2026-08-06', assignedTo: 'Dr. Sarah Jenkins', handoffNotes: 'Matched to Marcus Vance based on ASD expertise and capacity.' },
      { name: 'Onboarding', status: 'Pending' },
    ],
    createdAt: '2026-07-21T09:00:00Z', updatedAt: '2026-08-06T10:00:00Z',
  },
  {
    id: 'ia-2', referralId: 'ref-2', participantName: 'Zara Patel', currentStage: 'Initial Screen',
    stages: [
      { name: 'Initial Screen', status: 'In Progress', startedDate: '2026-08-02', assignedTo: 'Dr. Sarah Jenkins', findings: 'Urgent case — hospital referral for crisis PBS.' },
      { name: 'Clinical Assessment', status: 'Pending' },
      { name: 'Service Matching', status: 'Pending' },
      { name: 'Onboarding', status: 'Pending' },
    ],
    createdAt: '2026-08-02T11:00:00Z', updatedAt: '2026-08-02T11:00:00Z',
  },
  {
    id: 'ia-3', referralId: 'ref-3', participantName: 'Noah Williams', currentStage: 'Onboarding',
    stages: [
      { name: 'Initial Screen', status: 'Complete', startedDate: '2026-06-16', completedDate: '2026-06-17', assignedTo: 'Dr. Sarah Jenkins', findings: 'Good fit for social skills program.' },
      { name: 'Clinical Assessment', status: 'Complete', startedDate: '2026-06-20', completedDate: '2026-07-10', assignedTo: 'Dr. Sarah Jenkins', findings: 'Mild anxiety presentation. No restrictive practices anticipated.' },
      { name: 'Service Matching', status: 'Complete', startedDate: '2026-07-11', completedDate: '2026-08-01', assignedTo: 'Dr. Sarah Jenkins', findings: 'Matched to Dr. Jenkins — anxiety/social skills specialty.' },
      { name: 'Onboarding', status: 'In Progress', startedDate: '2026-08-10', assignedTo: 'Dr. Sarah Jenkins', handoffNotes: 'Service agreement sent for review. First session scheduled for September.' },
    ],
    createdAt: '2026-06-16T08:30:00Z', updatedAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'ia-4', referralId: 'ref-5', participantName: 'James O\'Connor', currentStage: 'Onboarding',
    stages: [
      { name: 'Initial Screen', status: 'Complete', startedDate: '2026-05-02', completedDate: '2026-05-03', assignedTo: 'Marcus Vance', findings: 'Adult transition case. Independent living focus.' },
      { name: 'Clinical Assessment', status: 'Complete', startedDate: '2026-05-05', completedDate: '2026-05-25', assignedTo: 'Marcus Vance', findings: 'Vineland-3 completed. Adaptive skills in low-average range.' },
      { name: 'Service Matching', status: 'Complete', startedDate: '2026-05-26', completedDate: '2026-06-10', assignedTo: 'Dr. Sarah Jenkins', findings: 'Assigned to Marcus — adult services expertise.' },
      { name: 'Onboarding', status: 'Complete', startedDate: '2026-06-15', completedDate: '2026-06-20', assignedTo: 'Marcus Vance', handoffNotes: 'Service agreement signed. Fortnightly sessions commenced.' },
    ],
    createdAt: '2026-05-02T10:00:00Z', updatedAt: '2026-06-20T16:00:00Z',
  },
  {
    id: 'ia-5', referralId: 'ref-6', participantName: 'Sophie Bennett', currentStage: 'Initial Screen',
    stages: [
      { name: 'Initial Screen', status: 'Pending' },
      { name: 'Clinical Assessment', status: 'Pending' },
      { name: 'Service Matching', status: 'Pending' },
      { name: 'Onboarding', status: 'Pending' },
    ],
    createdAt: '2026-08-14T09:30:00Z', updatedAt: '2026-08-14T09:30:00Z',
  },
];

// ============================================================================
// R5: Enhanced Notifications Mock Data
// ============================================================================

export const INITIAL_ENHANCED_NOTIFICATIONS: EnhancedNotification[] = [
  { id: 'en-1', title: 'NDIS Plan Ending Soon', message: 'Jordan Miller NDIS Plan ends on 2027-01-31 (168 days). Begin plan review preparation.', category: 'agreement', severity: 'warning', timestamp: '2026-08-10T08:00:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 1440, sourceModule: 'outcome-tracking', linkTab: 'outcome-tracking', actionRequired: true, actionLabel: 'Start Plan Review' },
  { id: 'en-2', title: 'Critical Incident Reported', message: 'Amara Osei — SIB episode requiring physical intervention. 24hr NDIS Commission notification required.', category: 'incident', severity: 'critical', timestamp: '2026-08-14T14:30:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 60, sourceModule: 'incidents', linkTab: 'incidents', actionRequired: true, actionLabel: 'Submit NDIS Report' },
  { id: 'en-3', title: 'Worker Screening Expiring', message: 'Marcus Vance NDIS Worker Screening expires on 2026-08-29 (13 days). Renewal action required.', category: 'credential', severity: 'critical', timestamp: '2026-08-16T09:00:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 720, sourceModule: 'staff-training', linkTab: 'staff-training', actionRequired: true, actionLabel: 'Initiate Renewal' },
  { id: 'en-4', title: 'BSP Review Overdue', message: 'Liam Chen BSP review was due on 2026-08-01. Document is 15 days overdue for review.', category: 'compliance', severity: 'critical', timestamp: '2026-08-16T08:00:00Z', read: false, acknowledged: false, escalationLevel: 1, escalatedAt: '2026-08-15T08:00:00Z', escalationTimeoutMinutes: 1440, sourceModule: 'bsp-plans', linkTab: 'bsp-plans', actionRequired: true, actionLabel: 'Review BSP' },
  { id: 'en-5', title: 'New Urgent Referral', message: 'Zara Patel — Hospital discharge referral requiring crisis behaviour support. Priority score: 94/100.', category: 'referral', severity: 'critical', timestamp: '2026-08-01T11:00:00Z', read: true, acknowledged: true, acknowledgedAt: '2026-08-01T11:15:00Z', acknowledgedBy: 'Dr. Sarah Jenkins', escalationLevel: 0, escalationTimeoutMinutes: 120, sourceModule: 'referral-intake', linkTab: 'referral-intake', actionRequired: false },
  { id: 'en-6', title: 'CPD Hours Below Target', message: 'Dr. Priya Kapoor has completed 12/30 CPD hours (40%). 18 hours remaining with 4.5 months left.', category: 'training', severity: 'warning', timestamp: '2026-08-15T09:00:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 10080, sourceModule: 'staff-training', linkTab: 'staff-training', actionRequired: true, actionLabel: 'View CPD Plan' },
  { id: 'en-7', title: 'Billing Claim Rejected', message: 'Claim CLM-2026-0145 for Jordan Miller rejected by NDIA — duplicate support item code on same date.', category: 'billing', severity: 'warning', timestamp: '2026-08-12T16:00:00Z', read: true, acknowledged: true, acknowledgedAt: '2026-08-13T09:00:00Z', acknowledgedBy: 'Dr. Sarah Jenkins', escalationLevel: 0, escalationTimeoutMinutes: 2880, sourceModule: 'billing', linkTab: 'billing', actionRequired: false },
  { id: 'en-8', title: 'Onboarding Task Overdue', message: 'Dr. Priya Kapoor has 2 mandatory onboarding items past due: BSP writing assessment and supervised delivery hours.', category: 'hr', severity: 'warning', timestamp: '2026-08-14T08:00:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 4320, sourceModule: 'staff-training', linkTab: 'staff-training', actionRequired: true, actionLabel: 'View Checklist' },
  { id: 'en-9', title: 'Monthly RP Return Due', message: 'Restrictive practice monthly return for August 2026 due in 5 days. 3 participants with active RPs.', category: 'compliance', severity: 'info', timestamp: '2026-08-11T08:00:00Z', read: true, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 7200, sourceModule: 'restrictive-practices', linkTab: 'restrictive-practices', actionRequired: true, actionLabel: 'Prepare Return' },
  { id: 'en-10', title: 'Service Agreement Pending Signature', message: 'Ethan Wright service agreement sent on Aug 14 — awaiting family signature. Follow up if no response by Aug 21.', category: 'agreement', severity: 'info', timestamp: '2026-08-14T11:30:00Z', read: false, acknowledged: false, escalationLevel: 0, escalationTimeoutMinutes: 10080, sourceModule: 'referral-intake', linkTab: 'referral-intake', actionRequired: false },
];

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  { id: 'np-1', userId: 'usr-1', userRole: 'ADMIN', category: 'incident', enabled: true, emailEnabled: true, escalationEnabled: true },
  { id: 'np-2', userId: 'usr-1', userRole: 'ADMIN', category: 'credential', enabled: true, emailEnabled: true, escalationEnabled: true },
  { id: 'np-3', userId: 'usr-1', userRole: 'ADMIN', category: 'compliance', enabled: true, emailEnabled: true, escalationEnabled: true },
  { id: 'np-4', userId: 'usr-2', userRole: 'PRACTITIONER', category: 'incident', enabled: true, emailEnabled: true, escalationEnabled: false },
  { id: 'np-5', userId: 'usr-2', userRole: 'PRACTITIONER', category: 'credential', enabled: true, emailEnabled: false, escalationEnabled: false },
  { id: 'np-6', userId: 'usr-3', userRole: 'VIEWER', category: 'compliance', enabled: true, emailEnabled: false, escalationEnabled: false },
];

export const INITIAL_DIGEST_SUMMARIES: DigestSummary[] = [
  {
    id: 'dig-1', period: 'weekly', generatedAt: '2026-08-11T06:00:00Z',
    activeClients: 5, sessionsDelivered: 18, revenueThisPeriod: 8540.50, complianceScore: 87,
    pendingActions: [
      { action: 'Review BSP for Liam Chen', module: 'BSP Plans', dueDate: '2026-08-01', priority: 'High' },
      { action: 'Renew Worker Screening - Marcus Vance', module: 'Credentials', dueDate: '2026-08-29', priority: 'Critical' },
      { action: 'Complete onboarding items - Dr. Priya Kapoor', module: 'Staff Training', dueDate: '2026-04-10', priority: 'Medium' },
    ],
    expiringCredentials: 2, overdueReviews: 1, newReferrals: 3, incidentsLogged: 1,
  },
];

// ============================================================================
// R6: Workflow Automation Mock Data
// ============================================================================

export const INITIAL_WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'wf-1', name: 'Referral to Service Delivery', description: 'End-to-end workflow from initial referral through to active service commencement.',
    category: 'Referral Intake', autoAssign: true, enabled: true, createdBy: 'Dr. Sarah Jenkins', createdAt: '2026-01-15T09:00:00Z',
    stages: [
      { id: 'ws-1', name: 'Referral Triage', order: 1, autoTransition: false, assignedRole: 'ADMIN', estimatedDurationDays: 2 },
      { id: 'ws-2', name: 'Initial Clinical Screen', order: 2, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 5 },
      { id: 'ws-3', name: 'Comprehensive Assessment', order: 3, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 14 },
      { id: 'ws-4', name: 'Service Matching & Agreement', order: 4, autoTransition: true, transitionCondition: 'Assessment complete + practitioner capacity available', assignedRole: 'ADMIN', estimatedDurationDays: 7 },
      { id: 'ws-5', name: 'Client Onboarding', order: 5, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 5 },
      { id: 'ws-6', name: 'First Service Session', order: 6, autoTransition: true, transitionCondition: 'Service agreement signed', assignedRole: 'PRACTITIONER', estimatedDurationDays: 7 },
    ],
    triggerEvent: 'referral_created',
  },
  {
    id: 'wf-2', name: 'BSP Review Cycle', description: 'Scheduled behaviour support plan review and update workflow.',
    category: 'BSP Review', autoAssign: true, enabled: true, createdBy: 'Dr. Sarah Jenkins', createdAt: '2026-02-01T09:00:00Z',
    stages: [
      { id: 'ws-7', name: 'Data Collection & Evidence Review', order: 1, autoTransition: true, transitionCondition: '30 days before review date', assignedRole: 'PRACTITIONER', estimatedDurationDays: 14 },
      { id: 'ws-8', name: 'Draft Updated BSP', order: 2, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 7 },
      { id: 'ws-9', name: 'Clinical Supervision Review', order: 3, autoTransition: false, assignedRole: 'ADMIN', estimatedDurationDays: 3 },
      { id: 'ws-10', name: 'Participant & Family Consultation', order: 4, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 7 },
      { id: 'ws-11', name: 'Submit to NDIS Commission', order: 5, autoTransition: true, transitionCondition: 'All stakeholder signatures obtained', assignedRole: 'ADMIN', estimatedDurationDays: 2 },
    ],
    triggerEvent: 'bsp_review_due',
  },
  {
    id: 'wf-3', name: 'Credential Renewal Pipeline', description: 'Automated workflow for staff credential renewal and compliance.',
    category: 'Credential Renewal', autoAssign: false, enabled: true, createdBy: 'Dr. Sarah Jenkins', createdAt: '2026-03-01T09:00:00Z',
    stages: [
      { id: 'ws-12', name: '90-Day Warning Alert', order: 1, autoTransition: true, transitionCondition: '90 days before expiry', assignedRole: 'ADMIN', estimatedDurationDays: 1 },
      { id: 'ws-13', name: 'Renewal Application Submitted', order: 2, autoTransition: false, assignedRole: 'PRACTITIONER', estimatedDurationDays: 30 },
      { id: 'ws-14', name: 'Verification & Documentation', order: 3, autoTransition: false, assignedRole: 'ADMIN', estimatedDurationDays: 14 },
      { id: 'ws-15', name: 'Updated in System', order: 4, autoTransition: true, transitionCondition: 'New credential document uploaded', assignedRole: 'ADMIN', estimatedDurationDays: 1 },
    ],
    triggerEvent: 'credential_expiring',
  },
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'ar-1', name: 'Critical Incident → 24hr Notification Task',
    triggerEvent: 'incident_created', conditions: [{ field: 'severity', operator: 'equals', value: 'Critical / Reportable' }],
    action: { type: 'create_task', targetModule: 'incidents', details: 'Create urgent task: Submit 24-hour NDIS Commission notification for the reportable incident.' },
    enabled: true, triggerCount: 3, lastTriggered: '2026-08-14T14:30:00Z', createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'ar-2', name: 'Credential Expiring → Alert & Renewal Task',
    triggerEvent: 'credential_expiry_check', conditions: [{ field: 'daysToExpiry', operator: 'lessThan', value: 30 }],
    action: { type: 'send_notification', targetModule: 'staff-training', details: 'Send critical notification to practitioner and supervisor about credential expiring within 30 days.' },
    enabled: true, triggerCount: 5, lastTriggered: '2026-08-16T09:00:00Z', createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'ar-3', name: 'BSP Review Overdue → Escalation',
    triggerEvent: 'bsp_review_check', conditions: [{ field: 'daysPastDue', operator: 'greaterThan', value: 7 }],
    action: { type: 'escalate', targetModule: 'bsp-plans', details: 'Escalate BSP review to Clinical Director if more than 7 days overdue.' },
    enabled: true, triggerCount: 2, lastTriggered: '2026-08-15T08:00:00Z', createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'ar-4', name: 'New High-Priority Referral → Auto-Route',
    triggerEvent: 'referral_created', conditions: [{ field: 'priorityScore', operator: 'greaterThan', value: 80 }],
    action: { type: 'assign_practitioner', targetModule: 'referral-intake', details: 'Auto-assign urgent referral to practitioner with matching expertise and lowest caseload.' },
    enabled: true, triggerCount: 2, lastTriggered: '2026-08-14T09:30:00Z', createdBy: 'Dr. Sarah Jenkins',
  },
  {
    id: 'ar-5', name: 'Plan Budget >90% Utilized → Alert',
    triggerEvent: 'budget_utilization_check', conditions: [{ field: 'utilizationPercent', operator: 'greaterThan', value: 90 }],
    action: { type: 'send_notification', targetModule: 'outcome-tracking', details: 'Alert practitioner and admin when NDIS plan budget category exceeds 90% utilization.' },
    enabled: true, triggerCount: 1, lastTriggered: '2026-08-08T10:00:00Z', createdBy: 'Dr. Sarah Jenkins',
  },
];

export const INITIAL_TASK_ASSIGNMENTS: TaskAssignment[] = [
  {
    id: 'ta-1', taskTitle: 'Complete FBA for Ethan Wright', taskType: 'Clinical Assessment',
    sourceModule: 'referral-intake', sourceEntityId: 'ref-1',
    assignedToPractitionerId: 'prac-2', assignedToPractitionerName: 'Marcus Vance',
    matchScore: 87, matchCriteria: [
      { criterion: 'ASD Expertise', score: 95, weight: 0.4 },
      { criterion: 'Current Caseload (8/15)', score: 80, weight: 0.35 },
      { criterion: 'Availability This Week', score: 85, weight: 0.25 },
    ],
    status: 'In Progress', dueDate: '2026-08-30', createdAt: '2026-07-25T10:00:00Z',
  },
  {
    id: 'ta-2', taskTitle: 'Crisis BSP Assessment for Zara Patel', taskType: 'Crisis Intervention',
    sourceModule: 'referral-intake', sourceEntityId: 'ref-2',
    assignedToPractitionerId: 'prac-1', assignedToPractitionerName: 'Dr. Sarah Jenkins',
    matchScore: 92, matchCriteria: [
      { criterion: 'SIB Specialist Skills', score: 98, weight: 0.4 },
      { criterion: 'Current Caseload (8/12)', score: 75, weight: 0.35 },
      { criterion: 'Availability This Week', score: 100, weight: 0.25 },
    ],
    status: 'Pending', dueDate: '2026-08-25', createdAt: '2026-08-02T12:00:00Z',
  },
  {
    id: 'ta-3', taskTitle: 'Submit 24hr NDIS Notification — Amara Osei Incident', taskType: 'Compliance',
    sourceModule: 'incidents', sourceEntityId: 'inc-auto-1',
    assignedToPractitionerId: 'prac-1', assignedToPractitionerName: 'Dr. Sarah Jenkins',
    matchScore: 95, matchCriteria: [
      { criterion: 'Admin/Director Role', score: 100, weight: 0.4 },
      { criterion: 'NDIS Commission Experience', score: 95, weight: 0.35 },
      { criterion: 'Availability Immediate', score: 90, weight: 0.25 },
    ],
    status: 'Completed', dueDate: '2026-08-15', createdAt: '2026-08-14T14:35:00Z', completedAt: '2026-08-14T16:00:00Z',
  },
  {
    id: 'ta-4', taskTitle: 'Renew NDIS Worker Screening', taskType: 'Credential Renewal',
    sourceModule: 'staff-training', sourceEntityId: 'cred-4',
    assignedToPractitionerId: 'prac-2', assignedToPractitionerName: 'Marcus Vance',
    matchScore: 100, matchCriteria: [
      { criterion: 'Self-Assignment (Own Credential)', score: 100, weight: 1.0 },
    ],
    status: 'Pending', dueDate: '2026-08-29', createdAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'ta-5', taskTitle: 'Review BSP for Liam Chen', taskType: 'BSP Review',
    sourceModule: 'bsp-plans', sourceEntityId: 'bsp-3',
    assignedToPractitionerId: 'prac-1', assignedToPractitionerName: 'Dr. Sarah Jenkins',
    matchScore: 90, matchCriteria: [
      { criterion: 'BSP Author/Supervisor', score: 100, weight: 0.4 },
      { criterion: 'Clinical Director Role', score: 95, weight: 0.35 },
      { criterion: 'Availability This Week', score: 70, weight: 0.25 },
    ],
    status: 'Pending', dueDate: '2026-08-20', createdAt: '2026-08-01T08:00:00Z',
  },
];

export const INITIAL_BATCH_ACTIONS: BatchAction[] = [
  {
    id: 'ba-1', actionType: 'bulk_approve', targetModule: 'billing', targetIds: ['clm-2026-0120', 'clm-2026-0121', 'clm-2026-0122'],
    executedBy: 'usr-1', executedByName: 'Dr. Sarah Jenkins', executedAt: '2026-08-10T10:00:00Z',
    result: 'Success', affectedCount: 3, details: 'Bulk approved 3 pending billing claims totalling $1,927.17',
  },
  {
    id: 'ba-2', actionType: 'bulk_update_status', targetModule: 'case-notes', targetIds: ['cn-1', 'cn-2', 'cn-3', 'cn-4'],
    executedBy: 'usr-1', executedByName: 'Dr. Sarah Jenkins', executedAt: '2026-08-08T14:30:00Z',
    result: 'Success', affectedCount: 4, details: 'Bulk updated 4 case notes from Draft to Approved status',
  },
];

export const INITIAL_WORKLOAD_PREDICTIONS: WorkloadPrediction[] = [
  { practitionerId: 'prac-1', practitionerName: 'Dr. Sarah Jenkins', currentCaseload: 8, maxCaseload: 12, utilizationPercent: 67, predictedNextWeek: 9, recommendation: 'Balanced' },
  { practitionerId: 'prac-2', practitionerName: 'Marcus Vance', currentCaseload: 12, maxCaseload: 15, utilizationPercent: 80, predictedNextWeek: 14, recommendation: 'At Capacity', suggestedReallocation: 'Consider reassigning 1-2 low-complexity cases to Dr. Priya Kapoor to prevent overload.' },
  { practitionerId: 'prac-3', practitionerName: 'Dr. Priya Kapoor', currentCaseload: 3, maxCaseload: 8, utilizationPercent: 38, predictedNextWeek: 4, recommendation: 'Under-utilized', suggestedReallocation: 'Available for 4-5 additional cases. Suitable for low-medium complexity referrals under supervision.' },
];
