import {
  ServiceItem,
  StaffMember,
  BookingRequest,
  BusinessSettings,
  CustomerReview,
} from './types';

export const initialBusinessSettings: BusinessSettings = {
  name: 'Vaira Home Care Service',
  phone1: '+91 94441 23456',
  phone2: '+91 98402 78910',
  whatsapp: '919444123456',
  email: 'care@vairahomecare.com',
  address: 'No. 14, Gandhi Road, Near Bus Terminus, Vembedu & Kanchipuram, Tamil Nadu 631502',
  serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur', 'Chengalpattu'],
  operatingHours: '24 Hours Caregiver Coordination / Desk: 7:00 AM - 10:00 PM',
  experienceYears: 9,
  verifiedStaffCount: 48,
  emergencyDisclaimer:
    'Vaira Home Care Service provides supportive home nursing, elder care, and bedside caregiver assistance under physician prescription. We do not provide acute hospital emergency medical treatment. In life-threatening medical emergencies, please immediately dial 108 or proceed to the nearest hospital emergency department.',
};

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-01',
    slug: '24-hour-home-nursing',
    name: '24-Hour Home Nursing',
    category: 'nursing',
    shortDescription:
      'Continuous round-the-clock bedside nursing by qualified nurses for critically dependent, bed-bound, or postoperative patients.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients requiring continuous vital signs monitoring following hospital discharge',
      'Bed-ridden individuals needing structured bedside clinical hygiene and medication administration',
      'Post-surgical patients with wound drains, IV lines, or specialized medical regimens',
      'Families seeking overnight peace of mind with vetted nursing supervision',
    ],
    whatIncluded: [
      'Continuous vital signs documentation (BP, Pulse, SpO2, Blood Sugar as prescribed)',
      'Administration of doctor-prescribed oral, IV, or IM medications',
      'Bed-sore prevention protocols, frequent position turning, and skin integrity checks',
      'Catheter, Ryle’s tube, or stoma routine maintenance per physician protocol',
      'Daily progress log and structured communication with attending family members',
    ],
    whatNotIncluded: [
      'Emergency medical resuscitation or ICU-level ventilation',
      'Independent doctor diagnosis or medicine prescription (only physician-ordered medicines given)',
      'Supply of pharmaceuticals, disposable surgical kits, or hospital beds',
      'Inpatient hospital admissions or acute ambulance transport',
      'Services outside the agreed scope of home nursing care',
    ],
    availabilityHours: '24 Hours (Rotating 12h shifts or 24h stay-in)',
    availableDays: 'All 7 Days (Monday to Sunday)',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur', 'Chengalpattu'],
    minimumDuration: '3 Days minimum commitment',
    pricingModel: 'per_shift_24h',
    basePrice: 2200,
    additionalChargesNotice:
      'Travel allowance may apply for remote rural locations beyond primary town radius. Final service availability and charges will be confirmed by the Vaira Home Care team after reviewing your request.',
    requiredInformation: [
      'Attending hospital discharge summary or physician prescription',
      'Current prescribed medication schedule and dietary guidelines',
      'Exact residence address and primary family contact in charge',
    ],
    faqs: [
      {
        question: 'How do the 24-hour nursing shifts work?',
        answer:
          'Depending on family preference and patient comfort, we coordinate either a continuous stay-in nurse or two rotating 12-hour shifts (Day: 8 AM - 8 PM, Night: 8 PM - 8 AM) to ensure constant alertness.',
      },
      {
        question: 'What qualifications do your home nurses hold?',
        answer:
          'Our nurses hold recognized GNM (General Nursing and Midwifery) or B.Sc Nursing credentials with verified bedside clinical experience.',
      },
      {
        question: 'Can the nurse prescribe new medicines if symptoms change?',
        answer:
          'No. Our nurses strictly adhere to doctor orders. If any symptom changes or acute distress arises, the nurse contacts the family and advises immediate consultation with the treating doctor or calling 108.',
      },
    ],
    cancellationPolicy:
      'Advance notice of at least 24 hours is required for planned cancellations or schedule adjustments to allow staff reallocation.',
    termsNotice:
      'Service deployment requires signed consent and submission of recent physician documentation. Submitting this request does not guarantee immediate clinical confirmation.',
    seoTitle: '24-Hour Home Nursing in Kanchipuram & Vembedu | Vaira Home Care',
    seoDescription:
      'Professional round-the-clock bedside home nursing care in Kanchipuram, Vembedu and surrounding Tamil Nadu areas. Vetted nurses for post-operative and elderly recovery.',
    isPublished: true,
  },
  {
    id: 'srv-02',
    slug: 'senior-citizen-care',
    name: 'Senior Citizen Care',
    category: 'elderly',
    shortDescription:
      'Compassionate, dedicated daily living assistance, mobility support, medication reminders, and companionship for elders.',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Elderly parents living independently while children work or reside abroad',
      'Seniors with mild mobility issues needing gentle fall-prevention assistance',
      'Elders needing polite reminders for meal times, hydration, and prescribed medicines',
      'Seniors recovering from minor illness seeking respectful daily companionship',
    ],
    whatIncluded: [
      'Assistance with personal grooming, sponge bath, dressing, and oral hygiene',
      'Gentle mobility assistance, assisted walking, and wheelchair support',
      'Timely reminders for doctor-prescribed medications and hydration',
      'Warming and serving prescribed meals and special dietary care',
      'Empathetic companionship, newspaper reading, and meaningful conversation in Tamil/English',
    ],
    whatNotIncluded: [
      'Invasive medical treatments (handled only by licensed nurses)',
      'Heavy domestic house cleaning, laundry of entire household, or cooking for visitors',
      'Independent administration of unprescribed medication',
      'Financial transactions or bank handling on behalf of the senior',
    ],
    availabilityHours: '12 Hours (Day/Night) or 24 Hours Stay-in',
    availableDays: 'Monday to Sunday',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur'],
    minimumDuration: '7 Days commitment',
    pricingModel: 'per_shift_12h',
    basePrice: 950,
    additionalChargesNotice:
      'Stay-in arrangements include caregiver food and rest accommodations. Final pricing confirmed upon assessment of mobility requirements.',
    requiredInformation: [
      'Senior age, weight, and general mobility status (independent/assisted/wheelchair)',
      'Daily routine preferences and language preference (Tamil/English/Telugu)',
      'Emergency contact numbers of family members',
    ],
    faqs: [
      {
        question: 'Do your caregivers speak Tamil?',
        answer:
          'Yes, our caregivers are locally based in Kanchipuram, Vembedu, and nearby districts and speak fluent Tamil.',
      },
      {
        question: 'Can the caregiver help with light meal preparation?',
        answer:
          'Caregivers assist with warming pre-prepared food, preparing simple oats/porridge/tea for the senior, and feeding support.',
      },
    ],
    cancellationPolicy:
      '48-hour prior notification is required for discontinuing recurring care.',
    termsNotice:
      'Service agreement and home environment safety check required prior to start.',
    seoTitle: 'Senior Citizen Care Services in Kanchipuram | Vaira Home Care',
    seoDescription:
      'Dedicated elder care, bedside assistance, and companionship for senior citizens in Kanchipuram and Vembedu by verified, compassionate caregivers.',
    isPublished: true,
  },
  {
    id: 'srv-03',
    slug: 'patient-care',
    name: 'Patient Care Service',
    category: 'attender',
    shortDescription:
      'Trained hospital-to-home patient attenders for hygiene support, feeding, bed transfers, and routine non-invasive comfort.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients recently discharged from hospital needing temporary recovery assistance',
      'Patients with fractures or orthopedic cast restricting self-movement',
      'Individuals requiring assistance with bedpan, urinal, and personal hygiene',
      'Families needing support during work hours to care for a sick relative',
    ],
    whatIncluded: [
      'Bed-bath, sponge bath, hair combing, and oral hygiene',
      'Assisted transfer from bed to wheelchair or commode chair',
      'Diaper change and skin sanitization to prevent rashes',
      'Feeding assistance with prescribed soft/liquid diet',
      'Periodic change of posture to avoid pressure soreness',
    ],
    whatNotIncluded: [
      'Invasive procedures such as IV drip insertion or arterial cannulation',
      'Clinical diagnostic tests or interpreting laboratory reports',
      'Prescription or purchase of pharmaceutical supplies',
    ],
    availabilityHours: '8 Hours, 12 Hours, or 24 Hours',
    availableDays: 'Daily',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Chengalpattu'],
    minimumDuration: '3 Days',
    pricingModel: 'per_shift_12h',
    basePrice: 900,
    additionalChargesNotice:
      'Additional charges may apply for nighttime hours or holiday shifts as notified by coordinator.',
    requiredInformation: [
      'Current medical condition summary from treating hospital',
      'Patient weight and level of bed mobility',
      'Location and preferred shift duration',
    ],
    faqs: [
      {
        question: 'Is this service available on short notice?',
        answer:
          'We review requests within 2 to 4 business hours and coordinate attender deployment subject to staff availability.',
      },
    ],
    cancellationPolicy:
      '24-hour advance notice for reschedule or cancellation without fees.',
    termsNotice:
      'Non-clinical bedside support only. Clinical procedures require nursing service.',
    seoTitle: 'Home Patient Attender Care in Kanchipuram & Vembedu',
    seoDescription:
      'Affordable bedside patient care and attender services for hospital recovery in Kanchipuram and surrounding areas.',
    isPublished: true,
  },
  {
    id: 'srv-04',
    slug: 'post-operative-care',
    name: 'Post-Operative Care',
    category: 'nursing',
    shortDescription:
      'Structured clinical recovery care following major or minor surgeries under your surgeon’s guidelines.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients discharged following orthopedic surgery (knee/hip replacement)',
      'Abdominal, cardiac, or general surgical recovery at home',
      'Patients needing surgical site observation and drainage monitoring',
      'Individuals requiring assisted mobilization as permitted by surgeon',
    ],
    whatIncluded: [
      'Sterile surgical wound dressings under surgical protocol',
      'Pain management medication administration per doctor’s prescription',
      'Monitoring surgical drain output and vital parameters',
      'Prevention of deep vein thrombosis through guided gentle movement',
      'Coordination with family regarding surgeon follow-up milestones',
    ],
    whatNotIncluded: [
      'Surgical suture removal without explicit doctor written authorization',
      'Altering medication doses without consulting the operating surgeon',
      'Emergency re-operation or acute bleeding interventions',
    ],
    availabilityHours: '12 Hours or 24 Hours Shift',
    availableDays: 'All 7 Days',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Sriperumbudur', 'Chengalpattu'],
    minimumDuration: '5 Days',
    pricingModel: 'per_shift_12h',
    basePrice: 1400,
    additionalChargesNotice:
      'Sterile dressing packs and antiseptics are provided by the patient/family or billed as consumable supplies at actual cost.',
    requiredInformation: [
      'Operation theatre summary and discharge protocol from surgeon',
      'Prescribed wound dressing schedule and medications',
    ],
    faqs: [
      {
        question: 'Who provides post-operative care?',
        answer:
          'Only qualified Registered Nurses with aseptic surgical dressing training are assigned to post-operative cases.',
      },
    ],
    cancellationPolicy:
      '24-hour notice required for rescheduling visits.',
    termsNotice:
      'Surgeon discharge summary must be provided prior to first visit.',
    seoTitle: 'Post-Operative Home Nursing Care in Kanchipuram & Vembedu',
    seoDescription:
      'Skilled post-surgical home nursing in Kanchipuram. Aseptic dressings, vitals monitoring, and recovery assistance under surgeon protocols.',
    isPublished: true,
  },
  {
    id: 'srv-05',
    slug: 'surgical-dressing',
    name: 'Surgical Dressing & Wound Care',
    category: 'nursing',
    shortDescription:
      'Aseptic, sterile home visits for diabetic foot ulcers, post-surgical incisions, bed sores, and wound dressings.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients needing periodic sterile dressing for healing surgical incisions',
      'Individuals managing Stage I or Stage II pressure sores (bed-sores)',
      'Diabetic foot ulcer routine antiseptic cleaning and protective dressings',
      'Patients unable to travel frequently to hospital outpatient clinics',
    ],
    whatIncluded: [
      'Strict aseptic sterile field setup at home',
      'Gentle cleaning with prescribed normal saline/antiseptic solutions',
      'Application of doctor-prescribed ointments, collagen, or silver dressings',
      'Assessment and photographic documentation of wound healing progression (with consent)',
      'Advice on positioning to avoid pressure on healing tissue',
    ],
    whatNotIncluded: [
      'Surgical debridement of necrotic deep tissue requiring operating theatre',
      'Prescribing antibiotics or oral wound medications',
      'Treating acute spreading cellulitis without doctor consultation',
    ],
    availabilityHours: 'Scheduled Visit (Morning or Evening)',
    availableDays: 'Daily / Alternate Days as prescribed',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam'],
    minimumDuration: 'Per-visit service',
    pricingModel: 'hourly',
    basePrice: 450,
    additionalChargesNotice:
      'Specialized dressing materials (hydrocolloid, foam, silver dressings) to be supplied by family or billed at pharmacy cost.',
    requiredInformation: [
      'Prescription specifying dressing protocol and topical ointments',
      'Wound location and approximate size',
    ],
    faqs: [
      {
        question: 'Can the nurse visit once every two days?',
        answer:
          'Yes, we schedule visits strictly adhering to your doctor’s advised dressing frequency.',
      },
    ],
    cancellationPolicy:
      'Cancel up to 4 hours before scheduled home visit time.',
    termsNotice:
      'Single procedure visit. Does not include continuous stay.',
    seoTitle: 'Home Wound Dressing & Bed Sore Care in Kanchipuram',
    seoDescription:
      'Sterile home surgical dressing and diabetic wound care by experienced nurses in Kanchipuram and Vembedu.',
    isPublished: true,
  },
  {
    id: 'srv-06',
    slug: 'tracheostomy-care',
    name: 'Tracheostomy Care at Home',
    category: 'nursing',
    shortDescription:
      'Specialized clinical suctioning, stoma hygiene, tube care, and respiratory monitoring by ICU-trained nurses.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients discharged with temporary or permanent tracheostomy tubes',
      'Individuals needing regular sterile airway suctioning to clear secretions',
      'Patients requiring specialized stoma dressing and humidification monitoring',
    ],
    whatIncluded: [
      'Sterile airway suctioning using correct pressure techniques',
      'Tracheostomy site antiseptic cleaning, gauze change, and tie security check',
      'Continuous oxygen saturation (SpO2) and respiratory pattern checks',
      'Nebulization and chest physiotherapy support as prescribed by pulmonologist',
      'Immediate alert to family upon changes in secretion color, odor, or distress',
    ],
    whatNotIncluded: [
      'Emergency mechanical ventilator programming without intensivist supervision',
      'Emergency decannulation or re-insertion in acute respiratory arrest',
      'Supply of oxygen cylinders or suction machine hardware (rental can be guided)',
    ],
    availabilityHours: '12h Shift or 24h Stay-in',
    availableDays: 'All 7 Days',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur'],
    minimumDuration: '7 Days',
    pricingModel: 'per_shift_12h',
    basePrice: 1800,
    additionalChargesNotice:
      'Requires operational suction machine and backup power at patient home.',
    requiredInformation: [
      'Pulmonologist/ENT discharge summary with tracheostomy tube size and type',
      'Prescribed suctioning frequency and nebulization schedule',
    ],
    faqs: [
      {
        question: 'Do your nurses have ICU/Tracheostomy experience?',
        answer:
          'Yes, only nurses with verified respiratory and suctioning clinical experience are assigned.',
      },
    ],
    cancellationPolicy:
      '48-hour advance notice for recurring tracheostomy nursing cancellations.',
    termsNotice:
      'Family must ensure electricity backup for medical suction devices at home.',
    seoTitle: 'Tracheostomy Home Nursing Care in Kanchipuram & Vembedu',
    seoDescription:
      'Professional tracheostomy tube care, sterile suctioning, and airway monitoring at home by trained nurses in Kanchipuram.',
    isPublished: true,
  },
  {
    id: 'srv-07',
    slug: 'stroke-patient-care',
    name: 'Stroke Patient Care',
    category: 'specialized',
    shortDescription:
      'Long-term holistic supportive care, gentle passive movements, speech support, and safe swallowing assistance for stroke survivors.',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Stroke survivors with hemiplegia or hemiparesis recovering at home',
      'Patients with dysphagia (swallowing difficulty) requiring careful feeding routines',
      'Elders needing gentle assisted mobilization to prevent joint contractures',
    ],
    whatIncluded: [
      'Assistance with prescribed passive limb exercises and joint range of motion',
      'Careful semi-upright feeding assistance to prevent aspiration',
      'Skin care, positioning every two hours, and pressure-point relief',
      'Patience with speech rehabilitation exercises recommended by therapist',
      'Emotional reassurance and dignified assistance with all daily tasks',
    ],
    whatNotIncluded: [
      'Acute thrombolytic treatment or stroke intervention',
      'Independent neuro-physiotherapy diagnosis (follows neuro-therapist chart)',
    ],
    availabilityHours: '12 Hours or 24 Hours Stay-in',
    availableDays: 'Daily',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Sriperumbudur', 'Chengalpattu'],
    minimumDuration: '14 Days',
    pricingModel: 'per_shift_12h',
    basePrice: 1200,
    additionalChargesNotice:
      'Monthly package rates available upon coordinator assessment.',
    requiredInformation: [
      'Neurologist discharge summary and current rehabilitation goals',
      'Patient feeding status (oral / pureed / Ryle’s tube)',
    ],
    faqs: [
      {
        question: 'Can the caregiver assist with physical exercises?',
        answer:
          'Our caregivers assist with repetitive doctor-approved range of motion exercises and walking assistance.',
      },
    ],
    cancellationPolicy:
      '48-hour advance notice required.',
    termsNotice:
      'Long-term rehabilitative care. Clinical procedures managed by visiting nurse.',
    seoTitle: 'Stroke Patient Rehabilitation & Home Care in Kanchipuram',
    seoDescription:
      'Compassionate home care for stroke survivors in Kanchipuram, Vembedu. Safe feeding, mobility assistance, and bedside support.',
    isPublished: true,
  },
  {
    id: 'srv-08',
    slug: 'paralysis-care',
    name: 'Paralysis & Bedridden Care',
    category: 'specialized',
    shortDescription:
      'Comprehensive, dignified bedside support for paraplegic, quadriplegic, or immobility conditions.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients with spinal cord trauma or neurological mobility loss',
      'Bedridden chronic patients needing round-the-clock comfort and hygiene',
      'Families seeking trained attender support for turning and transfers',
    ],
    whatIncluded: [
      'Scheduled two-hourly body turning to prevent bedsores',
      'Full bed sponge bath, hair washing with dry shampoo/rinse, and nail care',
      'External catheter care and hygiene maintenance',
      'Air mattress pressure maintenance and skin barrier cream application',
      'Respectful, continuous attention and family communication',
    ],
    whatNotIncluded: [
      'Invasive medical treatments without nursing orders',
      'Curative guarantees (care is supportive and palliative)',
    ],
    availabilityHours: '12 Hours or 24 Hours Stay-in',
    availableDays: 'Monday through Sunday',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur'],
    minimumDuration: '15 Days',
    pricingModel: 'per_shift_24h',
    basePrice: 1600,
    additionalChargesNotice:
      'Rates vary based on patient weight and requirement of single vs two-person transfers.',
    requiredInformation: [
      'Physician summary, level of mobility, and weight',
      'Bed setup details (air bed / hospital cot / regular bed)',
    ],
    faqs: [
      {
        question: 'Do you provide air beds on rent?',
        answer:
          'We can connect families with trusted medical equipment providers in Kanchipuram for air mattresses and hospital beds.',
      },
    ],
    cancellationPolicy:
      '48-hour prior notice for long-term contract adjustments.',
    termsNotice:
      'Adequate space and clean environment required for caregiver stay.',
    seoTitle: 'Paralysis & Bedridden Patient Home Care Kanchipuram',
    seoDescription:
      'Dignified, round-the-clock care for paralyzed and bedridden patients in Kanchipuram and Vembedu. Bed sore prevention, hygiene, and full attender support.',
    isPublished: true,
  },
  {
    id: 'srv-09',
    slug: 'caregiver-attender-service',
    name: 'Caregiver / Hospital Attender Service',
    category: 'attender',
    shortDescription:
      'Reliable, experienced attenders for bedside companionship and non-clinical assistance at home or hospital.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Families needing a reliable companion by a patient’s side at home',
      'Hospital inpatient stay bedside assistance while family rests',
      'Short-term illness recovery assistance',
    ],
    whatIncluded: [
      'Assisting with walking, bathroom trips, and wheelchair mobility',
      'Serving meals, water, and assisting with snacks',
      'Calling duty nurses/doctors in hospital or family members at home',
      'Keeping the bedside environment tidy, clean, and calm',
    ],
    whatNotIncluded: [
      'Clinical interventions, injections, or IV lines',
      'Taking medical decisions on behalf of family',
    ],
    availabilityHours: '12 Hours (Day/Night) or 24 Hours',
    availableDays: '7 Days a Week',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Chengalpattu'],
    minimumDuration: '2 Days',
    pricingModel: 'per_shift_12h',
    basePrice: 850,
    additionalChargesNotice:
      'Hospital attender duty may have minor surcharge based on hospital regulations.',
    requiredInformation: [
      'Patient details, location (home or hospital name/ward)',
      'Preferred shift timings',
    ],
    faqs: [
      {
        question: 'Can your attenders stay overnight in hospitals?',
        answer:
          'Yes, our attenders are accustomed to hospital bedside night shifts in Kanchipuram and Chengalpattu hospitals.',
      },
    ],
    cancellationPolicy:
      '24-hour notice required for cancellation.',
    termsNotice:
      'Non-clinical support only. Hospital pass/permission to be arranged by family.',
    seoTitle: 'Caregiver & Hospital Attender Services Kanchipuram & Vembedu',
    seoDescription:
      'Trustworthy hospital attenders and home caregivers in Kanchipuram and Vembedu. 12-hour and 24-hour assistance for patients and seniors.',
    isPublished: true,
  },
  {
    id: 'srv-10',
    slug: 'other-home-care-services',
    name: 'Custom Home Care Coordination',
    category: 'specialized',
    shortDescription:
      'Personalized home healthcare coordination for unique patient needs, palliative comfort, or combined nursing-attender care.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80',
    whoThisIsFor: [
      'Patients needing a combination of nursing visits and daily attender care',
      'Palliative comfort care for terminally ill patients in home setting',
      'Post-delivery mother and newborn non-clinical supportive care',
      'Any home care requirement not fully covered by standard packages',
    ],
    whatIncluded: [
      'Initial care coordination call by senior supervisor',
      'Tailored staff matching based on specific domestic requirements',
      'Flexible scheduling (part-time, full-time, or split shift)',
      'Dedicated case manager contact for continuous feedback',
    ],
    whatNotIncluded: [
      'Unsupervised invasive clinical procedures',
      'Services conflicting with medical safety or ethics',
    ],
    availabilityHours: 'Flexible / Customized',
    availableDays: 'All days',
    serviceAreas: ['Kanchipuram', 'Vembedu', 'Walajabad', 'Oragadam', 'Sriperumbudur', 'Chengalpattu'],
    minimumDuration: 'Custom assessment',
    pricingModel: 'custom',
    basePrice: 0,
    additionalChargesNotice:
      'Price will be assessed and confirmed by Vaira Home Care coordination team based on exact requirements.',
    requiredInformation: [
      'Detailed description of family/patient requirements',
      'Doctor recommendations or special medical notes',
    ],
    faqs: [
      {
        question: 'How quickly does the coordinator get in touch?',
        answer:
          'Our care coordinator contacts you within 2 business hours to understand the specific needs.',
      },
    ],
    cancellationPolicy:
      'Custom terms discussed upon service agreement.',
    termsNotice:
      'Tailored service subject to mutual home safety review and staff availability.',
    seoTitle: 'Custom Home Healthcare Coordination Kanchipuram | Vaira Home Care',
    seoDescription:
      'Customized home nursing and caregiver solutions tailored to your family needs in Kanchipuram, Vembedu, and nearby areas.',
    isPublished: true,
  },
];

export const initialStaff: StaffMember[] = [];

export const initialReviews: CustomerReview[] = [
  {
    id: 'rev-01',
    requestId: 'VC-2026-000101',
    customerName: 'Senthil Nathan (Collectorate Road, Kanchipuram)',
    serviceName: '24-Hour Home Nursing',
    rating: 5,
    reviewText:
      'We engaged Vaira Home Care for my father after his cardiac stent procedure. Sister Revathi was extremely punctual, gentle, and monitored his BP and medications with great discipline. Having a verified nurse at home gave our family tremendous relief.',
    careFeedback: 'Very professional, kept daily vitals chart clearly documented.',
    createdAt: '2026-09-10T14:30:00Z',
    isApproved: true,
  },
  {
    id: 'rev-02',
    requestId: 'VC-2026-000102',
    customerName: 'Vasantha Kumari (Vembedu)',
    serviceName: 'Senior Citizen Care',
    rating: 5,
    reviewText:
      'My 82-year-old mother lives in Vembedu while I work in Chennai. Caregiver Lakshmi has been a blessing. She helps with daily walking, ensures medicine timings, and speaks with utmost respect. Truly grateful for Vaira Home Care.',
    careFeedback: 'Friendly, patient, and speaks Tamil naturally with my mother.',
    createdAt: '2026-09-12T11:00:00Z',
    isApproved: true,
  },
  {
    id: 'rev-03',
    requestId: 'VC-2026-000103',
    customerName: 'Gopinath R. (Oragadam)',
    serviceName: 'Post-Operative Care',
    rating: 5,
    reviewText:
      'Excellent wound care dressing service after my knee surgery. Nurse Mary visited on alternate days exactly on time, used sterile packs, and the healing progressed smoothly without any complications.',
    careFeedback: 'Very neat dressing technique and followed doctor advice strictly.',
    createdAt: '2026-09-14T09:15:00Z',
    isApproved: true,
  },
];

export const initialBookings: BookingRequest[] = [];
