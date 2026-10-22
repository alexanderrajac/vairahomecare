import {
  ServiceItem,
  StaffMember,
  BookingRequest,
  BusinessSettings,
  CustomerReview,
} from "./types";

export const initialBusinessSettings: BusinessSettings = {
  name: "Vaira Home Care Service",
  phone1: "+91 87545 19060",
  phone2: "+91 98765 43210",
  whatsapp: "918754519060",
  email: "care@vairahomecare.com",
  address: "No. 14, Gandhi Road, Near Bus Terminus, Vembedu & Kanchipuram, Tamil Nadu 631502",
  serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
  operatingHours: "24 Hours Ambulance & Caregiver Coordination / Desk: 7:00 AM - 10:00 PM",
  experienceYears: 9,
  verifiedStaffCount: 48,
  emergencyDisclaimer:
    "Vaira Home Care Service provides supportive home nursing, elder care, and bedside caregiver assistance under physician prescription. We do not provide acute hospital emergency medical treatment. In life-threatening medical emergencies, please immediately dial 108 or proceed to the nearest hospital emergency department.",
};

export const initialServices: ServiceItem[] = [
  {
    id: "srv-01",
    slug: "home-nursing-care",
    name: "Home Nursing Care",
    category: "nursing",
    shortDescription:
      "Professional clinical bedside nursing care, vitals charting, doctor-prescribed medication administration, and injection support at home.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Patients requiring vital signs monitoring (BP, Pulse, SpO2, Blood Sugar)",
      "Individuals needing doctor-prescribed IM/IV injections or medication administration",
      "Patients recovering from illnesses needing structured nursing routines",
      "Families needing compassionate clinical care for elderly or recovering relatives",
    ],
    whatIncluded: [
      "Regular vital signs documentation & clinical charting",
      "Administration of prescribed oral, IV, or IM medications",
      "Nebulization, oxygen therapy monitoring, and diabetic sugar testing",
      "Bedside clinical hygiene, skin integrity maintenance, and infection prevention",
      "Prompt family communication and adherence to physician discharge instructions",
    ],
    whatNotIncluded: [
      "Independent doctor diagnosis or prescribing unapproved medicines",
      "Acute emergency resuscitation (call 108 for life emergencies)",
      "Supply of pharmaceutical medicines and disposables (family provides)",
      "Domestic housework outside patient care",
    ],
    availabilityHours: "12-Hour Shift (Day/Night) or 24-Hour Stay-in",
    availableDays: "All 7 Days (Monday to Sunday)",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
    minimumDuration: "1 Day commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1200,
    price12h: 1200,
    price24h: 1400,
    additionalChargesNotice:
      "Flat rates: ₹1,200 for 12 Hours | ₹1,400 for 24 Hours. Transparent pricing across Kanchipuram and Vembedu areas.",
    requiredInformation: [
      "Patient diagnosis or hospital discharge summary",
      "Prescribed medication sheet & doctor instructions",
      "Residence address and family contact numbers",
    ],
    faqs: [
      {
        question: "What are the shift timings for 12h vs 24h nursing?",
        answer:
          "12-Hour shifts run either Day (8:00 AM - 8:00 PM) or Night (8:00 PM - 8:00 AM). 24-Hour care provides continuous round-the-clock stay-in bedside nursing.",
      },
      {
        question: "What are the exact fees?",
        answer:
          "Home Nursing Care is fixed at ₹1,200 for 12-hour shifts and ₹1,400 for 24-hour continuous care.",
      },
      {
        question: "Are your nurses qualified?",
        answer:
          "Yes, our home nursing staff have verified clinical credentials (GNM / B.Sc Nursing / Certified Home Health Aide) with hospital background.",
      },
    ],
    cancellationPolicy: "Please give 24-hour advance notice for reschedule or cancellation.",
    termsNotice: "Clinical procedures strictly follow doctor written orders.",
    seoTitle: "Home Nursing Care in Kanchipuram & Vembedu | Vaira Home Care",
    seoDescription:
      "Reliable home nursing care in Kanchipuram and Vembedu. ₹1,200 for 12 Hours, ₹1,400 for 24 Hours. Qualified nurses for bedside recovery.",
    isPublished: true,
  },
  {
    id: "srv-02",
    slug: "patient-care",
    name: "Patient Care",
    category: "attender",
    shortDescription:
      "Dedicated bedside patient attender for daily living hygiene, assisted mobility, feeding support, and non-invasive patient comfort.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Patients recovering from minor illness or surgery needing personal assistance",
      "Individuals with fractures or temporary mobility restrictions",
      "Patients needing assistance with bedpan, diaper change, and hygiene",
      "Busy family members needing trustworthy bedside support during work hours",
    ],
    whatIncluded: [
      "Bed-bath, sponge bath, grooming, and clothing change",
      "Assisted transfer from bed to wheelchair or commode",
      "Prompt diaper change, skin cleaning, and rash prevention",
      "Feeding support with soft/liquid diet and timely hydration",
      "Gentle physical support and respectful bedside companionship",
    ],
    whatNotIncluded: [
      "Invasive clinical injections or catheter insertions (requires nursing)",
      "Medical diagnostics or treatment changes",
      "Household domestic cleaning or laundry for others",
    ],
    availabilityHours: "12-Hour Shift (Day/Night) or 24-Hour Stay-in",
    availableDays: "Daily",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
    minimumDuration: "1 Day commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1100,
    price12h: 1100,
    price24h: 1300,
    additionalChargesNotice:
      "Flat rates: ₹1,100 for 12 Hours | ₹1,300 for 24 Hours bedside attender care.",
    requiredInformation: [
      "Patient condition & level of mobility (bed-bound or assisted walking)",
      "Primary family contact and location",
    ],
    faqs: [
      {
        question: "What is the cost of Patient Care attender?",
        answer:
          "Patient Care attender service is ₹1,100 for a 12-hour shift and ₹1,300 for a 24-hour shift.",
      },
      {
        question: "Can the attender stay 24 hours at home?",
        answer:
          "Yes, our 24-hour attenders stay with the patient continuously with basic food and rest accommodation provided by the family.",
      },
    ],
    cancellationPolicy: "24-hour advance notice for cancellations.",
    termsNotice: "Non-invasive bedside attender care. Medical procedures handled by nurses.",
    seoTitle: "Bedside Patient Care in Kanchipuram & Vembedu | Vaira Home Care",
    seoDescription:
      "Experienced patient attender care in Kanchipuram. ₹1,100 for 12 Hours, ₹1,300 for 24 Hours. Assistance with bathing, feeding, and transfers.",
    isPublished: true,
  },
  {
    id: "srv-03",
    slug: "bedridden-patient-care",
    name: "Bedridden Patient Care",
    category: "specialized",
    shortDescription:
      "Specialized care for completely bed-bound individuals, 2-hourly position turning, bedsore prevention, catheter maintenance, and total hygiene.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Paralyzed, stroke recovery, or comatose patients restricted to bed",
      "Elderly individuals with severe frailty and zero mobility",
      "Patients prone to painful pressure ulcers and bedsores",
      "Patients requiring Ryle’s tube feeding and urinary catheter management",
    ],
    whatIncluded: [
      "Strict 2-hourly lateral position changing to eliminate pressure ulcers",
      "Daily complete bed sponge baths, oral hygiene, and hair washing",
      "Adult diaper changing, perineal care, and barrier cream application",
      "Ryle’s tube/PEG feeding assistance and prescribed hydration schedule",
      "Catheter bag emptying, drainage tube hygiene, and vitals monitoring",
    ],
    whatNotIncluded: [
      "Acute ICU ventilation management without intensivist",
      "Doctor consultations (must consult treating hospital physician)",
      "Purchase of adult diapers, air beds, or medical tubes",
    ],
    availabilityHours: "12-Hour Shift or 24-Hour Stay-in",
    availableDays: "All 7 Days",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
    minimumDuration: "3 Days commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1400,
    price12h: 1400,
    price24h: 1700,
    additionalChargesNotice:
      "Flat rates: ₹1,400 for 12 Hours | ₹1,700 for 24 Hours specialized bed-bound care.",
    requiredInformation: [
      "Doctor summary, presence of bed-sores (stage if any)",
      "Ryle’s tube/catheter details and feeding schedule",
    ],
    faqs: [
      {
        question: "How do you prevent bedsores in bedridden patients?",
        answer:
          "Our caregivers turn the patient position every 2 hours, inspect pressure points (sacrum, heels, elbows), apply barrier creams, and maintain dry, clean bedding.",
      },
      {
        question: "What is the charge for Bedridden Patient Care?",
        answer:
          "Charges are ₹1,400 for 12-hour shifts and ₹1,700 for 24-hour continuous care.",
      },
    ],
    cancellationPolicy: "24-hour notice required for schedule modifications.",
    termsNotice: "Air mattress and hygiene supplies recommended for bed-bound recovery.",
    seoTitle: "Bedridden Patient Care in Kanchipuram & Vembedu | Vaira Home Care",
    seoDescription:
      "Expert bed-bound patient care in Kanchipuram. ₹1,400 for 12 Hours, ₹1,700 for 24 Hours. Bedsore prevention, sponge baths, and catheter hygiene.",
    isPublished: true,
  },
  {
    id: "srv-04",
    slug: "baby-care",
    name: "Baby Care",
    category: "specialized",
    shortDescription:
      "Gentle newborn and infant care by experienced baby caregivers: oil massage, baby bath, burping, sleep routine, and postpartum mother assistance.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Newborn babies needing gentle traditional oil massage and warm water bath",
      "First-time mothers needing postpartum guidance, rest, and feeding support",
      "Infants needing structured nap schedules and soothing sleep routines",
      "Families wanting vetted, hygienic, patient female baby caregivers",
    ],
    whatIncluded: [
      "Traditional Ayurvedic / baby oil massage with proper gentle strokes",
      "Safe warm water baby bath, navel hygiene, and skin moisturizing",
      "Assisting mother with breastfeeding latching and bottle sterilization",
      "Diaper change, cloth nappy changing, and rash care",
      "Soothing crying babies, colic relief burping, and night calming",
    ],
    whatNotIncluded: [
      "Pediatric medical diagnosis or administering unprescribed infant medications",
      "Heavy cooking or household laundry for the entire family",
      "Unsupervised infant transport outside home",
    ],
    availabilityHours: "12-Hour Day Shift or 24-Hour Stay-in",
    availableDays: "Daily",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur"],
    minimumDuration: "7 Days commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1200,
    price12h: 1200,
    price24h: 1500,
    additionalChargesNotice:
      "Flat rates: ₹1,200 for 12 Hours | ₹1,500 for 24 Hours dedicated baby and mother care.",
    requiredInformation: [
      "Baby age in days/months and birth weight",
      "Whether mother had normal delivery or C-section",
      "Preferred shift: 12-hour day or 24-hour stay-in",
    ],
    faqs: [
      {
        question: "What are the charges for Baby Care?",
        answer:
          "Baby Care is ₹1,200 for 12-hour daytime care and ₹1,500 for 24-hour round-the-clock stay-in assistance.",
      },
      {
        question: "Does the caregiver also help the new mother?",
        answer:
          "Yes, our baby caregivers assist with preparing warm water, burping after feeding, and giving the mother essential recovery sleep.",
      },
    ],
    cancellationPolicy: "48-hour prior notice for recurring schedule adjustments.",
    termsNotice: "Caregivers maintain strict hand sanitization before handling newborns.",
    seoTitle: "Newborn Baby Care & Mother Support in Kanchipuram | Vaira Home Care",
    seoDescription:
      "Compassionate baby care and infant massage in Kanchipuram and Vembedu. ₹1,200 for 12 Hours, ₹1,500 for 24 Hours. Verified female caregivers.",
    isPublished: true,
  },
  {
    id: "srv-05",
    slug: "post-operative-care",
    name: "Operator Care (Post-Operative Care)",
    category: "nursing",
    shortDescription:
      "Professional clinical care following surgical operations: wound dressing, surgical drain monitoring, pain relief medications, and recovery.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Patients discharged following orthopedic surgeries (knee, hip, fracture fixations)",
      "Patients recovering from abdominal, cardiac, general, or laparoscopic surgeries",
      "Individuals needing sterile surgical dressings and drainage tube tracking",
      "Surgical patients needing assisted mobilization under doctor protocols",
    ],
    whatIncluded: [
      "Sterile aseptic wound dressing and incision monitoring for signs of infection",
      "Doctor-prescribed oral/IV pain medication and antibiotic administration",
      "Surgical drain recording, emptying, and output documentation",
      "Assisted gentle mobilization, deep breathing, and DVT prevention exercises",
      "Daily vitals charting and coordination with family regarding surgeon reviews",
    ],
    whatNotIncluded: [
      "Suture or staple removal without written surgeon authorization",
      "Independent medicine changes or altering surgeon prescriptions",
      "Emergency operating interventions (hospital referral required)",
    ],
    availabilityHours: "12-Hour Shift or 24-Hour Stay-in",
    availableDays: "All 7 Days",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
    minimumDuration: "3 Days commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1500,
    price12h: 1500,
    price24h: 1800,
    additionalChargesNotice:
      "Flat rates: ₹1,500 for 12 Hours | ₹1,800 for 24 Hours skilled post-operative operator care.",
    requiredInformation: [
      "Surgeon discharge summary & operation notes",
      "Prescribed wound dressing schedule and medications",
    ],
    faqs: [
      {
        question: "What is the fee for Operator Care (Post-Operative)?",
        answer:
          "Operator Care is ₹1,500 for 12-hour shifts and ₹1,800 for 24-hour continuous post-surgical recovery.",
      },
      {
        question: "Can your nurses dress surgical incisions at home?",
        answer:
          "Yes, our nurses are clinically trained in aseptic non-touch dressing techniques to prevent surgical site infections.",
      },
    ],
    cancellationPolicy: "24-hour advance notice for reschedule or cancellation.",
    termsNotice: "Surgeon discharge summary required prior to nurse deployment.",
    seoTitle: "Operator Care & Post-Operative Recovery Nursing in Kanchipuram | Vaira Home Care",
    seoDescription:
      "Hospital-to-home post-operative operator care in Kanchipuram and Vembedu. ₹1,500 for 12 Hours, ₹1,800 for 24 Hours. Wound dressings and medication support.",
    isPublished: true,
  },
  {
    id: "srv-06",
    slug: "special-operative-care",
    name: "Special Operator Care (Special Post-Op)",
    category: "nursing",
    shortDescription:
      "Intensive post-surgical nursing for high-dependency cases, major multi-trauma, cardiac/neuro surgery recovery, and complex surgical care.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Patients recovering from major complex surgeries (neuro, open-heart, spinal, oncology)",
      "High-dependency post-op patients with multiple drains, stoma, or central lines",
      "Post-surgical patients requiring strict hourly vitals and continuous ICU-grade vigilance",
      "Elderly post-op patients with high delirium or pulmonary complications risk",
    ],
    whatIncluded: [
      "Continuous clinical vital parameters logging (BP, Pulse, SpO2, Temperature, Sugar)",
      "Complex sterile dressings (laparotomy, orthopedic implants, chest tube sites)",
      "Multiple drain output measurement, fluid balance chart, and urine output tracking",
      "Administration of specialized IV infusions, antibiotics, and analgesic regimens",
      "Immediate escalation and emergency reporting to family and operating surgeon",
    ],
    whatNotIncluded: [
      "Mechanical ventilator programming without attending intensivist instructions",
      "Independent prescription changes",
      "General household chores",
    ],
    availabilityHours: "12-Hour Shift or 24-Hour Stay-in",
    availableDays: "All 7 Days",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur", "Chengalpattu"],
    minimumDuration: "3 Days commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1800,
    price12h: 1800,
    price24h: 2100,
    additionalChargesNotice:
      "Flat rates: ₹1,800 for 12 Hours | ₹2,100 for 24 Hours advanced surgical operator care.",
    requiredInformation: [
      "Hospital operation theatre discharge summary and ICU transfer note",
      "Emergency surgeon contact and specific postoperative orders",
    ],
    faqs: [
      {
        question: "What is the charge for Special Operator Care?",
        answer:
          "Special Operator Care is ₹1,800 for 12-hour shifts and ₹2,100 for 24-hour round-the-clock intensive care.",
      },
      {
        question: "Who attends these special cases?",
        answer:
          "Senior registered nurses with experience in surgical wards and intensive recovery units.",
      },
    ],
    cancellationPolicy: "24-hour notice required for cancellations.",
    termsNotice: "Specialized clinical service subject to surgeon discharge protocol.",
    seoTitle: "Special Post-Operative Care Kanchipuram & Vembedu | Vaira Home Care",
    seoDescription:
      "Advanced surgical recovery care in Kanchipuram. ₹1,800 for 12 Hours, ₹2,100 for 24 Hours. Dedicated nurses for complex surgical patients.",
    isPublished: true,
  },
  {
    id: "srv-07",
    slug: "home-care-support",
    name: "Home Care Support",
    category: "elderly",
    shortDescription:
      "Compassionate daily home care assistance, senior companionship, medication reminders, walking support, and domestic caregiving.",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=900&q=80",
    whoThisIsFor: [
      "Senior citizens living independently needing daily support and companionship",
      "Elders needing gentle assisted walking, fall prevention, and meal accompaniment",
      "Individuals needing polite reminders for prescription medicines and hydration",
      "Families seeking a respectful, trustworthy caregiver for elderly parents",
    ],
    whatIncluded: [
      "Personal grooming assistance, sponge bath, and clothing assistance",
      "Assisted walking, light exercise support, and fall-risk monitoring",
      "Timely reminders for prescribed medications and nutritious meals",
      "Warming and serving meals, feeding support, and kitchen hydration",
      "Respectful companionship, listening, and polite daily conversation in Tamil/English",
    ],
    whatNotIncluded: [
      "Invasive clinical injections or nursing procedures (handled by nurses)",
      "Heavy domestic house cleaning or cooking for large gatherings",
      "Financial handling or bank transactions",
    ],
    availabilityHours: "12-Hour Shift (Day/Night) or 24-Hour Stay-in",
    availableDays: "Monday to Sunday",
    serviceAreas: ["Tambaram", "Vandalur", "Perungalathur", "Urapakkam", "Kanchipuram", "Vembedu", "Walajabad", "Oragadam", "Sriperumbudur"],
    minimumDuration: "3 Days commitment",
    pricingModel: "per_shift_12h",
    basePrice: 1100,
    price12h: 1100,
    price24h: 1400,
    additionalChargesNotice:
      "Flat rates: ₹1,100 for 12 Hours | ₹1,400 for 24 Hours supportive elder home care.",
    requiredInformation: [
      "Elder age, daily routine preferences, and mobility level",
      "Primary family member contact and residence address",
    ],
    faqs: [
      {
        question: "What is the cost for Home Care Support?",
        answer:
          "Home Care Support is ₹1,100 for 12-hour shifts and ₹1,400 for 24-hour continuous care.",
      },
      {
        question: "Do your caregivers speak Tamil?",
        answer:
          "Yes! All caregivers are local to Kanchipuram and Vembedu and speak fluent Tamil.",
      },
    ],
    cancellationPolicy: "24-hour advance notice for reschedule or cancellation.",
    termsNotice: "Non-clinical supportive care. Background verified caregivers.",
    seoTitle: "Home Care Support & Elder Assistance Kanchipuram | Vaira Home Care",
    seoDescription:
      "Compassionate elder home care support in Kanchipuram and Vembedu. ₹1,100 for 12 Hours, ₹1,400 for 24 Hours. Punctual, verified caregivers.",
    isPublished: true,
  },
];

export const initialStaff: StaffMember[] = [];

export const initialReviews: CustomerReview[] = [
  {
    id: "rev-01",
    requestId: "VC-2026-000101",
    customerName: "Senthil Nathan (Collectorate Road, Kanchipuram)",
    serviceName: "Home Nursing Care",
    rating: 5,
    reviewText:
      "We engaged Vaira Home Care for my father after his cardiac stent procedure. Sister Revathi was extremely punctual, gentle, and monitored his BP and medications with great discipline. Having a verified nurse at home gave our family tremendous relief.",
    careFeedback: "Very professional, kept daily vitals chart clearly documented.",
    createdAt: "2026-09-10T14:30:00Z",
    isApproved: true,
  },
  {
    id: "rev-02",
    requestId: "VC-2026-000102",
    customerName: "Vasantha Kumari (Vembedu)",
    serviceName: "Home Care Support",
    rating: 5,
    reviewText:
      "My 82-year-old mother lives in Vembedu while I work in Chennai. Caregiver Lakshmi has been a blessing. She helps with daily walking, ensures medicine timings, and speaks with utmost respect. Truly grateful for Vaira Home Care.",
    careFeedback: "Friendly, patient, and speaks Tamil naturally with my mother.",
    createdAt: "2026-09-12T11:00:00Z",
    isApproved: true,
  },
  {
    id: "rev-03",
    requestId: "VC-2026-000103",
    customerName: "Gopinath R. (Oragadam)",
    serviceName: "Post-Operative Care",
    rating: 5,
    reviewText:
      "Excellent post-operative care service after my knee surgery. Nurse Mary visited on 12-hour shifts exactly on time, used sterile packs, and the healing progressed smoothly without any complications.",
    careFeedback: "Very neat dressing technique and followed doctor advice strictly.",
    createdAt: "2026-09-14T09:15:00Z",
    isApproved: true,
  },
];

export const initialBookings: BookingRequest[] = [];
