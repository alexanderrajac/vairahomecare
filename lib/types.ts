export type ServiceCategory = 'nursing' | 'elderly' | 'specialized' | 'attender' | 'rehab';

export type PricingModel = 'hourly' | 'daily' | 'per_shift_12h' | 'per_shift_24h' | 'monthly' | 'custom';

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  image: string;
  category: ServiceCategory;
  whoThisIsFor: string[];
  whatIncluded: string[];
  whatNotIncluded: string[];
  availabilityHours: string;
  availableDays: string;
  serviceAreas: string[];
  minimumDuration: string;
  pricingModel: PricingModel;
  basePrice: number;
  price12h?: number;
  price24h?: number;
  additionalChargesNotice: string;
  requiredInformation: string[];
  faqs: ServiceFAQ[];
  cancellationPolicy: string;
  termsNotice: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
}

export type BookingStatus =
  | 'REQUEST_RECEIVED'
  | 'UNDER_REVIEW'
  | 'CONTACTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type LeadSource =
  | 'Google'
  | 'Justdial'
  | 'Instagram'
  | 'Facebook'
  | 'WhatsApp'
  | 'Referral'
  | 'Direct'
  | 'Website'
  | 'Other';

export interface AuditLogEntry {
  action: string;
  timestamp: string;
  performedBy: string;
  details?: string;
}

export interface AdminNote {
  id: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  requestId: string;
  customerName: string;
  serviceName: string;
  rating: number; // 1 to 5
  reviewText: string;
  careFeedback?: string;
  createdAt: string;
  isApproved: boolean;
}

export interface BookingRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  serviceName: string;
  customer: {
    fullName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    email?: string;
  };
  location: {
    houseBuilding: string;
    streetLocality: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
    isServiceLocation: boolean;
  };
  careRequirement: {
    recipient: 'Self' | 'Parent' | 'Spouse' | 'Child' | 'Other';
    generalRequirement: string;
    careType: string;
    urgency: 'Normal' | 'Today' | 'Urgent';
  };
  schedule: {
    preferredDate: string;
    preferredStartTime: string;
    preferredDuration: string;
    shiftType?: string;
    recurringType: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'custom';
    recurringDays?: string[];
    recurringDuration?: string;
    startDate?: string;
    endDate?: string;
  };
  preferences: {
    genderPreference?: 'No Preference' | 'Female' | 'Male';
    languagePreference?: string;
    caregiverPreferenceNote?: string;
    additionalInstructions?: string;
  };
  priceEstimate: {
    basePrice: number;
    durationMultiplier: number;
    additionalCharges: number;
    discount: number;
    estimatedTotal: number;
    isFinalPriceDetermined: boolean;
    priceNotice: string;
  };
  termsAgreed: boolean;
  acknowledgementAgreed: boolean;
  status: BookingStatus;
  leadSource: LeadSource;
  assignedStaffId?: string;
  assignedStaffName?: string;
  rescheduleRequest?: {
    requestedDate: string;
    requestedTime: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
    requestedAt: string;
  };
  cancellationRequest?: {
    reason: string;
    status: 'PENDING' | 'APPROVED';
    requestedAt: string;
  };
  adminNotes: AdminNote[];
  followUpReminder?: {
    date: string;
    note: string;
  };
  auditTrail: AuditLogEntry[];
  review?: CustomerReview;
  payment?: BookingPayment;
}

export type PaymentStatus = 'PENDING' | 'ADVANCE_PAID' | 'FULLY_PAID' | 'PAY_ON_ARRIVAL';

export interface BookingPayment {
  status: PaymentStatus;
  amount: number;
  advanceAmount?: number;
  upiId?: string;
  transactionRef?: string;
  paidAt?: string;
  paymentMethod?: 'UPI_QR' | 'CASH' | 'NET_BANKING';
  collectedByStaffName?: string;
}

export interface StaffAuthSession {
  staffId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  googleId?: string;
  avatarUrl?: string;
  experienceYears: number;
  verifiedSkills: string[];
  assignedAreas: string[];
  shiftAvailability: 'Day (12h)' | 'Night (12h)' | '24h Stay-in' | 'Flexible';
  status: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE';
  rating: number;
  languages: string[];
  currentAssignedCount: number;
  registeredAt?: string;
}

export interface BusinessSettings {
  name: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  serviceAreas: string[];
  operatingHours: string;
  experienceYears: number;
  verifiedStaffCount: number;
  emergencyDisclaimer: string;
}

export interface NotificationItem {
  id: string;
  requestId: string;
  type: 'RECEIVED' | 'CONTACTED' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'REVIEW';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'In-App';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'customer' | 'admin' | 'staff';
  avatarUrl?: string;
  provider?: string;
  createdAt?: string;
}
