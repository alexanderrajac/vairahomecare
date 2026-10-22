'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  User,
  MapPin,
  Calendar,
  Sliders,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Info,
  CreditCard,
  PhoneCall,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { ServiceItem, LeadSource } from '@/lib/types';
import { initialBusinessSettings } from '@/lib/data';

interface BookingStepperProps {
  initialServiceSlug?: string;
}

export default function BookingStepper({ initialServiceSlug }: BookingStepperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publishedServices, createBookingRequest, isHydrated } = useVairaStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  // Step 1: Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  // Step 2: Customer Information
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');

  // Step 3: Location
  const [houseBuilding, setHouseBuilding] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [area, setArea] = useState('Kanchipuram');
  const [city, setCity] = useState('Kanchipuram');
  const [pincode, setPincode] = useState('631501');
  const [landmark, setLandmark] = useState('');
  const [isServiceLocation, setIsServiceLocation] = useState(true);

  // Step 4: Care Requirement
  const [recipient, setRecipient] = useState<'Self' | 'Parent' | 'Spouse' | 'Child' | 'Other'>('Parent');
  const [generalRequirement, setGeneralRequirement] = useState('');
  const [careType, setCareType] = useState('General Bedside Care & Vitals Support');
  const [urgency, setUrgency] = useState<'Normal' | 'Today' | 'Urgent'>('Normal');

  // Step 5: Schedule
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(tomorrowStr);
  const [preferredStartTime, setPreferredStartTime] = useState('08:00 AM');
  const [shiftType, setShiftType] = useState<'12h' | '24h'>('12h');
  const [preferredDuration, setPreferredDuration] = useState('7 Days');
  const [recurringType, setRecurringType] = useState<'one-time' | 'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // Step 6: Preferences
  const [genderPreference, setGenderPreference] = useState<'No Preference' | 'Female' | 'Male'>('No Preference');
  const [languagePreference, setLanguagePreference] = useState('Tamil');
  const [caregiverPreferenceNote, setCaregiverPreferenceNote] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Step 7 / Summary: Terms
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [acknowledgementAgreed, setAcknowledgementAgreed] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect lead source from URL params or default to Website
  const [leadSource, setLeadSource] = useState<LeadSource>('Website');

  useEffect(() => {
    const sourceParam = searchParams.get('utm_source') || searchParams.get('ref');
    if (sourceParam) {
      const match = ['Google', 'Justdial', 'Instagram', 'Facebook', 'WhatsApp', 'Referral', 'Direct', 'Website'].find(
        (s) => s.toLowerCase() === sourceParam.toLowerCase()
      );
      if (match) setLeadSource(match as LeadSource);
    }
  }, [searchParams]);

  // Sync initial service
  useEffect(() => {
    if (publishedServices.length > 0 && !selectedServiceId) {
      if (initialServiceSlug) {
        const found = publishedServices.find((s) => s.slug === initialServiceSlug);
        if (found) {
          setSelectedServiceId(found.id);
          return;
        }
      }
      setSelectedServiceId(publishedServices[0].id);
    }
  }, [publishedServices, initialServiceSlug, selectedServiceId]);

  const selectedService = publishedServices.find((s) => s.id === selectedServiceId) || publishedServices[0];

  // Price Calculation
  const calculateEstimate = () => {
    if (!selectedService) return { base: 0, durationMultiplier: 1, total: 0, determined: false, rate: 0 };

    let multiplier = 1;
    if (recurringType === 'one-time') {
      multiplier = 1;
    } else if (recurringType === 'daily') {
      if (preferredDuration.includes('7')) multiplier = 7;
      else if (preferredDuration.includes('14')) multiplier = 14;
      else if (preferredDuration.includes('30')) multiplier = 30;
      else if (preferredDuration.includes('3')) multiplier = 3;
      else multiplier = 5;
    } else if (recurringType === 'monthly') {
      multiplier = 30;
    } else if (recurringType === 'weekly') {
      multiplier = 7;
    }

    const rate = shiftType === '24h'
      ? (selectedService.price24h || selectedService.basePrice)
      : (selectedService.price12h || selectedService.basePrice);

    if (rate === 0) {
      return {
        base: 0,
        rate: 0,
        durationMultiplier: multiplier,
        total: 0,
        determined: false,
      };
    }

    const total = rate * multiplier;
    return {
      base: rate,
      rate,
      durationMultiplier: multiplier,
      total,
      determined: true,
    };
  };

  const estimate = calculateEstimate();

  // Step Validation
  const validateStep = (step: number) => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!selectedServiceId) errors.service = 'Please select a home care service';
    } else if (step === 2) {
      if (!fullName.trim()) errors.fullName = 'Full name is required';
      if (!phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^[0-9+ ]{10,14}$/.test(phoneNumber.trim())) {
        errors.phoneNumber = 'Please enter a valid 10-digit mobile number';
      }
    } else if (step === 3) {
      if (!houseBuilding.trim()) errors.houseBuilding = 'House / flat / building name is required';
      if (!streetLocality.trim()) errors.streetLocality = 'Street / locality name is required';
      if (!area.trim()) errors.area = 'Service area is required';
      if (!pincode.trim()) errors.pincode = 'Pincode is required';
    } else if (step === 4) {
      if (!generalRequirement.trim()) errors.generalRequirement = 'Please describe the care requirement briefly';
    } else if (step === 5) {
      if (!preferredDate) errors.preferredDate = 'Please select a preferred start date';
    } else if (step === 7) {
      if (!termsAgreed) errors.terms = 'Please confirm that the provided information is correct';
      if (!acknowledgementAgreed) errors.ack = 'Please confirm that you understand this is a request subject to review';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(7)) return;

    setIsSubmitting(true);

    try {
      const finalPhone = phoneNumber.trim();
      const finalWhatsApp = sameAsPhone ? finalPhone : whatsappNumber.trim() || finalPhone;

      const created = createBookingRequest({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        customer: {
          fullName: fullName.trim(),
          phoneNumber: finalPhone,
          whatsappNumber: finalWhatsApp,
          email: email.trim() || undefined,
        },
        location: {
          houseBuilding: houseBuilding.trim(),
          streetLocality: streetLocality.trim(),
          area,
          city,
          pincode: pincode.trim(),
          landmark: landmark.trim() || undefined,
          isServiceLocation,
        },
        careRequirement: {
          recipient,
          generalRequirement: generalRequirement.trim(),
          careType,
          urgency,
        },
        schedule: {
          preferredDate,
          preferredStartTime,
          preferredDuration,
          shiftType: shiftType === '24h' ? '24 Hours Stay-in' : '12 Hours (Day/Night)',
          recurringType,
          recurringDays: recurringType !== 'one-time' ? selectedDays : undefined,
          startDate: preferredDate,
        },
        preferences: {
          genderPreference,
          languagePreference,
          caregiverPreferenceNote: caregiverPreferenceNote.trim() || undefined,
          additionalInstructions: additionalInstructions.trim() || undefined,
        },
        priceEstimate: {
          basePrice: estimate.base,
          durationMultiplier: estimate.durationMultiplier,
          additionalCharges: 0,
          discount: 0,
          estimatedTotal: estimate.total,
          isFinalPriceDetermined: estimate.determined,
          priceNotice: estimate.determined
            ? 'Final service availability and charges will be confirmed by the Vaira Home Care team.'
            : 'Price will be confirmed by the Vaira Home Care team.',
        },
        termsAgreed,
        acknowledgementAgreed,
        leadSource,
      });

      // Navigate to confirmation page
      router.push(`/booking/confirmation/${created.id}`);
    } catch (e) {
      console.error('Submission failed:', e);
      alert('An error occurred submitting your request. Please try again or call us directly.');
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { number: 1, label: 'Service' },
    { number: 2, label: 'Customer' },
    { number: 3, label: 'Location' },
    { number: 4, label: 'Care Needs' },
    { number: 5, label: 'Schedule' },
    { number: 6, label: 'Preferences' },
    { number: 7, label: 'Review & Submit' },
  ];

  if (!isHydrated || !selectedService) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-3 text-sm text-slate-500">Loading booking coordination wizard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile-first Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-2">
          {stepsList.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center min-w-[70px] sm:min-w-[90px]">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === step.number
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-sm'
                      : currentStep > step.number
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-semibold text-center whitespace-nowrap ${
                    currentStep === step.number ? 'text-emerald-700 font-bold' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div
                  className={`flex-1 h-0.5 min-w-[20px] mx-1 transition-colors ${
                    currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8">
        {/* STEP 1: SERVICE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 1 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Select Home Care Service</h2>
              <p className="text-sm text-slate-500 mt-1">
                Choose the service you require. You can adjust the exact requirements in the following steps.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Care Packages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {publishedServices.map((service) => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-sm text-slate-900">{service.name}</div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{service.shortDescription}</p>
                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            12h: ₹{(service.price12h || service.basePrice).toLocaleString()}
                          </span>
                          <span className="font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">
                            24h: ₹{(service.price24h || service.basePrice).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] hidden sm:inline">{service.availabilityHours}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {formErrors.service && <p className="text-xs text-rose-600">{formErrors.service}</p>}
            </div>

            {/* Selected Service Scope Preview */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Service Inclusions Summary for {selectedService.name}</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                {selectedService.whatIncluded.slice(0, 3).map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
              <p className="text-slate-400 italic pt-1">
                * Note: Physician discharge summary/prescription required prior to care deployment.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOMER INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 2 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Customer Contact Information</h2>
              <p className="text-sm text-slate-500 mt-1">
                We only ask for details necessary to coordinate with you.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. K. Rajagopal"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
                {formErrors.fullName && <p className="text-xs text-rose-600 mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (Calling) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 98401 11223"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
                {formErrors.phoneNumber && <p className="text-xs text-rose-600 mt-1">{formErrors.phoneNumber}</p>}
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>WhatsApp number is the same as calling number</span>
                </label>

                {!sameAsPhone && (
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 98401 11223"
                      className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajagopal@example.com"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your phone number will only be used by our care coordination desk to verify your request.</span>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICE LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 3 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Service Location</h2>
              <p className="text-sm text-slate-500 mt-1">
                Provide the patient residence address. Your full address is kept private and never shown publicly.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  House / Flat / Building Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={houseBuilding}
                  onChange={(e) => setHouseBuilding(e.target.value)}
                  placeholder="e.g. Plot 42, Sri Krishna Villa"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
                {formErrors.houseBuilding && <p className="text-xs text-rose-600 mt-1">{formErrors.houseBuilding}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Street / Locality <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={streetLocality}
                  onChange={(e) => setStreetLocality(e.target.value)}
                  placeholder="e.g. Gandhi Road, Near Bus Terminus"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
                {formErrors.streetLocality && <p className="text-xs text-rose-600 mt-1">{formErrors.streetLocality}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Area / Town <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    {initialBusinessSettings.serviceAreas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                    <option value="Other Area">Other nearby location</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    District / City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kanchipuram"
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 631501"
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                  />
                  {formErrors.pincode && <p className="text-xs text-rose-600 mt-1">{formErrors.pincode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opp. Government Hospital or Near Mariamman Temple"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              {/* Is this the service location question (Prompt requirement) */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Is this the actual service delivery location?
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="isServiceLoc"
                      checked={isServiceLocation}
                      onChange={() => setIsServiceLocation(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Yes, patient resides here</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="isServiceLoc"
                      checked={!isServiceLocation}
                      onChange={() => setIsServiceLocation(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>No, this is billing/family address</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CARE REQUIREMENT */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 4 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Care Requirements & Urgency</h2>
              <p className="text-sm text-slate-500 mt-1">
                Provide non-diagnostic context to help us coordinate the most suitable staff.
              </p>
            </div>

            {/* Crucial Emergency Warning Banner (Section 4 Requirement) */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-sm block">Emergency Disclaimer</strong>
                <span>
                  For acute medical emergencies, sudden breathlessness, chest pain, or trauma, contact your local emergency medical service / dial <strong>108</strong> or proceed immediately to the hospital emergency department. Home care is for stable bedside care.
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Who needs the care? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Parent', 'Self', 'Spouse', 'Child', 'Other'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecipient(r)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        recipient === r
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  General Requirement Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={generalRequirement}
                  onChange={(e) => setGeneralRequirement(e.target.value)}
                  placeholder="e.g. Elderly father discharged after surgery. Requires assistance with morning bath, walking support, and vitals monitoring."
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
                {formErrors.generalRequirement && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.generalRequirement}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Care Assistance Type
                  </label>
                  <select
                    value={careType}
                    onChange={(e) => setCareType(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="General Bedside Care & Vitals Support">General Bedside Care & Vitals Support</option>
                    <option value="Post-Operative Dressing & Wound Care">Post-Operative Dressing & Wound Care</option>
                    <option value="Senior Citizen Daily Living & Mobility">Senior Citizen Daily Living & Mobility</option>
                    <option value="Stroke / Paralysis Bedside Care">Stroke / Paralysis Bedside Care</option>
                    <option value="Tracheostomy & Respiratory Nursing">Tracheostomy & Respiratory Nursing</option>
                    <option value="Hospital Bedside Inpatient Attender">Hospital Bedside Inpatient Attender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Request Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="Normal">Normal (Start within 24-48 hours)</option>
                    <option value="Today">Today (Subject to immediate staff check)</option>
                    <option value="Urgent">Urgent Request (Non-emergency priority review)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SCHEDULE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 5 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Preferred Schedule & Shifts</h2>
              <p className="text-sm text-slate-500 mt-1">
                Select your preferred start date, shift hours, and recurring duration.
              </p>
            </div>

            <div className="space-y-5">
              {/* Shift Duration Selection (12h vs 24h) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Care Shift Duration <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setShiftType('12h');
                      if (preferredStartTime === '24h Continuous') setPreferredStartTime('08:00 AM');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                      shiftType === '12h'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">12-Hour Shift</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Day / Night</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Day Shift (8 AM - 8 PM) or Night Shift (8 PM - 8 AM)</p>
                      <div className="mt-2 text-sm font-black text-slate-900">
                        ₹{(selectedService.price12h || selectedService.basePrice).toLocaleString()} <span className="text-xs font-medium text-slate-500">/ day</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${shiftType === '12h' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                      {shiftType === '12h' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setShiftType('24h');
                      setPreferredStartTime('24h Continuous');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                      shiftType === '24h'
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">24-Hour Stay-in Care</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Round-The-Clock</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Continuous stay-in bedside nursing and companion support</p>
                      <div className="mt-2 text-sm font-black text-emerald-700">
                        ₹{(selectedService.price24h || selectedService.basePrice).toLocaleString()} <span className="text-xs font-medium text-slate-500">/ day</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${shiftType === '24h' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                      {shiftType === '24h' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                  />
                  {formErrors.preferredDate && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Timing
                  </label>
                  <select
                    value={preferredStartTime}
                    onChange={(e) => setPreferredStartTime(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="08:00 AM">Morning Shift (08:00 AM)</option>
                    <option value="09:00 AM">General Day (09:00 AM)</option>
                    <option value="08:00 PM">Night Shift (08:00 PM)</option>
                    <option value="24h Continuous">24-Hour Stay-in</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recurring Service Type
                  </label>
                  <select
                    value={recurringType}
                    onChange={(e) => setRecurringType(e.target.value as any)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="daily">Daily Continuous</option>
                    <option value="one-time">One-time / Single Visit</option>
                    <option value="weekly">Weekly Routine</option>
                    <option value="monthly">Monthly Full-Term</option>
                    <option value="custom">Custom Arrangement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Duration Commitment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Single Visit', '3 Days', '7 Days', '14 Days', '30 Days'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setPreferredDuration(dur)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        preferredDuration === dur
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {recurringType !== 'one-time' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Care Days Required
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const isSelected = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (selectedDays.length > 1) {
                                setSelectedDays(selectedDays.filter((d) => d !== day));
                              }
                            } else {
                              setSelectedDays([...selectedDays, day]);
                            }
                          }}
                          className={`w-11 h-10 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Our coordination team checks real-time staff rosters against your requested date before final confirmation.
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: PREFERENCES */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 6 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Caregiver Preferences</h2>
              <p className="text-sm text-slate-500 mt-1">
                Help us assign the best suited professional for patient comfort.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender Preference
                  </label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value as any)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="No Preference">No Preference (Recommended for fastest match)</option>
                    <option value="Female">Female Caregiver / Nurse</option>
                    <option value="Male">Male Caregiver / Attender</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Spoken Language
                  </label>
                  <select
                    value={languagePreference}
                    onChange={(e) => setLanguagePreference(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all font-medium"
                  >
                    <option value="Tamil">Tamil (Native)</option>
                    <option value="English & Tamil">English & Tamil</option>
                    <option value="Telugu & Tamil">Telugu & Tamil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specific Caregiver or Experience Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={caregiverPreferenceNote}
                  onChange={(e) => setCaregiverPreferenceNote(e.target.value)}
                  placeholder="e.g. Sister Revathi if available, or someone experienced with stroke rehabilitation"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Household Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. First floor flat with elevator, caregiver will be provided meals."
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <p className="font-semibold">Note on Caregiver Allocation:</p>
              <p className="mt-0.5">
                Caregiver preference is matched based on roster availability and required clinical skills. We do not guarantee a specific individual until our coordination desk confirms assignment.
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: PRICE ESTIMATE & BOOKING SUMMARY */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Step 7 of 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Review Booking Summary & Submit</h2>
              <p className="text-sm text-slate-500 mt-1">
                Verify your service request before submission.
              </p>
            </div>

            {/* Price Estimate Breakdown (Section 4 Step 7) */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Transparent Estimate
                  </span>
                  <h3 className="text-lg font-bold">{selectedService.name}</h3>
                </div>
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="py-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Shift:</span>
                  <span className="font-bold text-white">
                    {shiftType === '24h' ? '24-Hour Stay-in Care' : '12-Hour Shift (Day/Night)'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Daily Rate:</span>
                  <span className="font-bold text-emerald-300">
                    ₹{estimate.rate.toLocaleString()} / day
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Commitment / Shifts:</span>
                  <span>{preferredDuration}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Additional Travel Charges:</span>
                  <span>₹0 (Standard coverage)</span>
                </div>
                <div className="pt-2 border-t border-slate-700/80 flex justify-between items-baseline font-bold">
                  <span className="text-white text-base">Estimated Total:</span>
                  <span className="text-emerald-400 text-xl font-black">
                    {estimate.determined ? `₹${estimate.total.toLocaleString()}` : 'To be confirmed'}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-emerald-200/90 italic border-t border-emerald-800/50">
                * Final service availability and charges will be confirmed by the Vaira Home Care team after reviewing your request. Never any hidden fees.
              </div>
            </div>

            {/* Complete Booking Summary Card (Section 5) */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs sm:text-sm space-y-4">
              <div className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200 flex items-center justify-between">
                <span>Request Verification Details</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Status: Pending Submission
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Customer</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{fullName}</p>
                  <p className="text-xs text-slate-600">{phoneNumber}</p>
                  {email && <p className="text-xs text-slate-500">{email}</p>}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Location</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {houseBuilding}, {streetLocality}
                  </p>
                  <p className="text-xs text-slate-600">
                    {area}, {city} - {pincode}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Schedule</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    Start: {preferredDate} at {preferredStartTime}
                  </p>
                  <p className="text-xs text-slate-600">
                    Duration: {preferredDuration} ({recurringType})
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Care Needs</span>
                  <p className="font-semibold text-slate-800 mt-0.5">For: {recipient}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{generalRequirement}</p>
                </div>
              </div>
            </div>

            {/* Mandatory Checkboxes (Section 5 Terms) */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>I confirm</strong> that the information provided regarding the patient's care requirement and residence location is correct.
                </span>
              </label>
              {formErrors.terms && <p className="text-xs text-rose-600 pl-7">{formErrors.terms}</p>}

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledgementAgreed}
                  onChange={(e) => setAcknowledgementAgreed(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                />
                <span className="text-xs text-slate-700 font-medium">
                  <strong>I understand</strong> that submitting this request does not guarantee immediate clinical confirmation. Service deployment is finalized once the Vaira Home Care coordination team reviews requirements and matches verified staff.
                </span>
              </label>
              {formErrors.ack && <p className="text-xs text-rose-600 pl-7">{formErrors.ack}</p>}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-lg shadow-emerald-700/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Request...' : 'SUBMIT SERVICE REQUEST'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
