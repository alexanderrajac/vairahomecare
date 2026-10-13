'use client';

import { useState, useEffect } from 'react';
import {
  ServiceItem,
  BookingRequest,
  StaffMember,
  CustomerReview,
  BusinessSettings,
  NotificationItem,
  BookingStatus,
  LeadSource,
  BookingPayment,
  StaffAuthSession,
} from './types';
import {
  initialBusinessSettings,
  initialServices,
  initialStaff,
  initialBookings,
  initialReviews,
} from './data';

const STORAGE_KEYS = {
  SERVICES: 'vaira_services_v1',
  BOOKINGS: 'vaira_bookings_v1',
  STAFF: 'vaira_staff_v1',
  REVIEWS: 'vaira_reviews_v1',
  SETTINGS: 'vaira_settings_v1',
  NOTIFICATIONS: 'vaira_notifications_v1',
  STAFF_SESSION: 'vaira_staff_session_v1',
};

export function useVairaStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [settings, setSettings] = useState<BusinessSettings>(initialBusinessSettings);
  const [currentStaffSession, setCurrentStaffSession] = useState<StaffAuthSession | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (storedServices) setServices(JSON.parse(storedServices));

      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (storedBookings) setBookings(JSON.parse(storedBookings));

      const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (storedStaff) setStaff(JSON.parse(storedStaff));

      const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (storedReviews) setReviews(JSON.parse(storedReviews));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));

      const storedSession = localStorage.getItem(STORAGE_KEYS.STAFF_SESSION);
      if (storedSession) setCurrentStaffSession(JSON.parse(storedSession));
    } catch (e) {
      console.warn('Storage hydration failed, using default data:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const saveStaffSession = (session: StaffAuthSession | null) => {
    setCurrentStaffSession(session);
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEYS.STAFF_SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEYS.STAFF_SESSION);
      }
    } catch (e) {}
  };

  // Save changes to localStorage
  const saveServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
    } catch (e) {}
  };

  const saveBookings = (newBookings: BookingRequest[]) => {
    setBookings(newBookings);
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(newBookings));
    } catch (e) {}
  };

  const saveStaff = (newStaff: StaffMember[]) => {
    setStaff(newStaff);
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(newStaff));
    } catch (e) {}
  };

  const saveReviews = (newReviews: CustomerReview[]) => {
    setReviews(newReviews);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(newReviews));
    } catch (e) {}
  };

  const saveSettings = (newSettings: BusinessSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (e) {}
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [item, ...notifications];
    setNotifications(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {}
  };

  // Service CRUD operations (Section 16: Admin Service Configuration)
  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newId = `srv-${Date.now().toString().slice(-4)}`;
    const newService: ServiceItem = { ...service, id: newId };
    saveServices([newService, ...services]);
    return newService;
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveServices(updated);
  };

  const deleteService = (id: string) => {
    saveServices(services.filter((s) => s.id !== id));
  };

  const toggleServicePublish = (id: string) => {
    const target = services.find((s) => s.id === id);
    if (target) {
      updateService(id, { isPublished: !target.isPublished });
    }
  };

  // Booking Request Operations
  const createBookingRequest = (
    requestData: Omit<
      BookingRequest,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'adminNotes' | 'auditTrail'
    >
  ): BookingRequest => {
    const nextNumber = bookings.length + 104;
    const newId = `VC-2026-${String(nextNumber).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const newBooking: BookingRequest = {
      ...requestData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      status: 'REQUEST_RECEIVED',
      adminNotes: [],
      auditTrail: [
        {
          action: 'Service Request Submitted by Customer',
          timestamp: now,
          performedBy: 'Customer (Web Portal)',
          details: `Service: ${requestData.serviceName} | Area: ${requestData.location.area}`,
        },
      ],
    };

    saveBookings([newBooking, ...bookings]);

    addNotification({
      requestId: newId,
      type: 'RECEIVED',
      title: 'New Service Request',
      message: `${requestData.customer.fullName} submitted a request for ${requestData.serviceName} (${requestData.location.area}).`,
      channel: 'In-App',
    });

    return newBooking;
  };

  const updateBookingStatus = (
    requestId: string,
    newStatus: BookingStatus,
    performedBy: string = 'Admin Coordinator',
    note?: string
  ) => {
    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;
      const newAudit = [
        ...b.auditTrail,
        {
          action: `Status updated from ${b.status} to ${newStatus}`,
          timestamp: now,
          performedBy,
          details: note,
        },
      ];
      return {
        ...b,
        status: newStatus,
        updatedAt: now,
        auditTrail: newAudit,
      };
    });

    saveBookings(updated);

    addNotification({
      requestId,
      type:
        newStatus === 'CONFIRMED'
          ? 'CONFIRMED'
          : newStatus === 'CONTACTED'
          ? 'CONTACTED'
          : newStatus === 'COMPLETED'
          ? 'COMPLETED'
          : newStatus === 'CANCELLED'
          ? 'CANCELLED'
          : 'RECEIVED',
      title: `Status: ${newStatus.replace('_', ' ')}`,
      message: `Request ${requestId} status updated to ${newStatus}.`,
      channel: 'WhatsApp',
    });
  };

  const assignStaffToBooking = (requestId: string, staffId: string, adminName: string = 'Admin') => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return;

    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;
      return {
        ...b,
        assignedStaffId: staffMember.id,
        assignedStaffName: `${staffMember.name} (${staffMember.role})`,
        updatedAt: now,
        auditTrail: [
          ...b.auditTrail,
          {
            action: `Staff Assigned: ${staffMember.name}`,
            timestamp: now,
            performedBy: adminName,
            details: `Assigned role: ${staffMember.role}`,
          },
        ],
      };
    });

    saveBookings(updated);

    // Update staff count
    const updatedStaff = staff.map((s) =>
      s.id === staffId ? { ...s, currentAssignedCount: s.currentAssignedCount + 1 } : s
    );
    saveStaff(updatedStaff);

    addNotification({
      requestId,
      type: 'CONFIRMED',
      title: 'Caregiver Assigned',
      message: `${staffMember.name} assigned to request ${requestId}.`,
      channel: 'SMS',
    });
  };

  const addAdminNote = (requestId: string, noteText: string, author: string = 'Admin') => {
    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;
      const newNotes = [
        ...b.adminNotes,
        {
          id: `note-${Date.now()}`,
          note: noteText,
          author,
          createdAt: now,
        },
      ];
      return {
        ...b,
        adminNotes: newNotes,
        updatedAt: now,
      };
    });
    saveBookings(updated);
  };

  const requestReschedule = (
    requestId: string,
    requestedDate: string,
    requestedTime: string,
    reason: string
  ) => {
    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;
      return {
        ...b,
        rescheduleRequest: {
          requestedDate,
          requestedTime,
          reason,
          status: 'PENDING' as const,
          requestedAt: now,
        },
        updatedAt: now,
        auditTrail: [
          ...b.auditTrail,
          {
            action: 'Reschedule Requested by Customer',
            timestamp: now,
            performedBy: 'Customer',
            details: `New date: ${requestedDate} at ${requestedTime}. Reason: ${reason}`,
          },
        ],
      };
    });
    saveBookings(updated);

    addNotification({
      requestId,
      type: 'RESCHEDULED',
      title: 'Reschedule Request',
      message: `Customer requested reschedule for ${requestId} to ${requestedDate} (${requestedTime}).`,
      channel: 'In-App',
    });
  };

  const requestCancellation = (requestId: string, reason: string) => {
    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;
      return {
        ...b,
        status: 'CANCELLED' as BookingStatus,
        cancellationRequest: {
          reason,
          status: 'APPROVED' as const,
          requestedAt: now,
        },
        updatedAt: now,
        auditTrail: [
          ...b.auditTrail,
          {
            action: 'Cancellation Submitted by Customer',
            timestamp: now,
            performedBy: 'Customer',
            details: `Reason: ${reason}`,
          },
        ],
      };
    });
    saveBookings(updated);

    addNotification({
      requestId,
      type: 'CANCELLED',
      title: 'Booking Cancelled',
      message: `Customer cancelled request ${requestId}. Reason: ${reason}`,
      channel: 'SMS',
    });
  };

  const submitCustomerReview = (
    requestId: string,
    customerName: string,
    serviceName: string,
    rating: number,
    reviewText: string,
    careFeedback?: string
  ) => {
    const now = new Date().toISOString();
    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      requestId,
      customerName,
      serviceName,
      rating,
      reviewText,
      careFeedback,
      createdAt: now,
      isApproved: true, // auto-published or can be toggled by admin
    };

    saveReviews([newReview, ...reviews]);

    const updatedBookings = bookings.map((b) =>
      b.id === requestId ? { ...b, review: newReview, updatedAt: now } : b
    );
    saveBookings(updatedBookings);

    addNotification({
      requestId,
      type: 'REVIEW',
      title: 'New Review Submitted',
      message: `${customerName} left a ${rating}-star review for ${serviceName}.`,
      channel: 'In-App',
    });
  };

  // Staff Authentication & Registration
  const loginStaffWithGoogle = (email: string, name: string, avatarUrl?: string): StaffAuthSession => {
    // Check if staff member already exists by email or name
    let staffMember = staff.find(
      (s) => s.email?.toLowerCase() === email.toLowerCase() || s.name.toLowerCase() === name.toLowerCase()
    );

    if (!staffMember) {
      // Auto-register new staff member with basic profile
      const newStaffId = `stf-${Date.now().toString().slice(-4)}`;
      staffMember = {
        id: newStaffId,
        name,
        email,
        avatarUrl,
        role: 'Certified Nursing Staff',
        phone: '+91 94441 ' + Math.floor(10000 + Math.random() * 90000),
        experienceYears: 4,
        verifiedSkills: ['Bedside Care', 'Vitals Monitoring', 'Elder Support'],
        assignedAreas: ['Kanchipuram', 'Vembedu'],
        shiftAvailability: 'Flexible',
        status: 'AVAILABLE',
        rating: 5.0,
        languages: ['Tamil', 'English'],
        currentAssignedCount: 0,
        registeredAt: new Date().toISOString(),
      };
      saveStaff([...staff, staffMember]);
    } else if (avatarUrl && !staffMember.avatarUrl) {
      const updatedStaff = staff.map((s) => (s.id === staffMember!.id ? { ...s, avatarUrl } : s));
      saveStaff(updatedStaff);
    }

    const session: StaffAuthSession = {
      staffId: staffMember.id,
      email: staffMember.email || email,
      name: staffMember.name,
      avatarUrl: staffMember.avatarUrl || avatarUrl,
      role: staffMember.role,
    };

    saveStaffSession(session);
    return session;
  };

  const registerStaffMember = (
    staffData: Omit<StaffMember, 'id' | 'currentAssignedCount' | 'rating' | 'status'>
  ): StaffAuthSession => {
    const newStaffId = `stf-${Date.now().toString().slice(-4)}`;
    const newStaff: StaffMember = {
      ...staffData,
      id: newStaffId,
      status: 'AVAILABLE',
      rating: 5.0,
      currentAssignedCount: 0,
      registeredAt: new Date().toISOString(),
    };

    const updatedList = [...staff, newStaff];
    saveStaff(updatedList);

    const session: StaffAuthSession = {
      staffId: newStaff.id,
      email: newStaff.email || `${newStaffId}@vairahomecare.com`,
      name: newStaff.name,
      avatarUrl: newStaff.avatarUrl,
      role: newStaff.role,
    };

    saveStaffSession(session);
    return session;
  };

  const logoutStaff = () => {
    saveStaffSession(null);
  };

  const updateStaffDutyStatus = (staffId: string, newStatus: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE') => {
    const updated = staff.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s));
    saveStaff(updated);
  };

  // Payment Recording & Collection
  const recordPayment = (
    requestId: string,
    paymentData: Partial<BookingPayment>,
    performedBy: string = 'Staff / Customer via UPI QR'
  ) => {
    const now = new Date().toISOString();
    const updated = bookings.map((b) => {
      if (b.id !== requestId) return b;

      const currentPayment: BookingPayment = b.payment || {
        status: 'PENDING',
        amount: b.priceEstimate.estimatedTotal || 0,
      };

      const finalPayment: BookingPayment = {
        ...currentPayment,
        ...paymentData,
        amount: paymentData.amount ?? currentPayment.amount,
        status: paymentData.status ?? 'ADVANCE_PAID',
        paidAt: now,
      };

      const newAudit = [
        ...b.auditTrail,
        {
          action: `Payment Recorded: ₹${finalPayment.amount} (${finalPayment.status})`,
          timestamp: now,
          performedBy,
          details: `Method: ${finalPayment.paymentMethod || 'UPI_QR'}. Ref: ${finalPayment.transactionRef || 'Direct UPI'}`,
        },
      ];

      return {
        ...b,
        payment: finalPayment,
        updatedAt: now,
        auditTrail: newAudit,
      };
    });

    saveBookings(updated);

    addNotification({
      requestId,
      type: 'CONFIRMED',
      title: 'Payment Received',
      message: `Payment of ₹${paymentData.amount || 0} recorded for request ${requestId}.`,
      channel: 'WhatsApp',
    });
  };

  return {
    isHydrated,
    services,
    publishedServices: services.filter((s) => s.isPublished),
    bookings,
    staff,
    reviews: reviews.filter((r) => r.isApproved),
    allReviews: reviews,
    settings,
    notifications,
    currentStaffSession,
    // Operations
    addService,
    updateService,
    deleteService,
    toggleServicePublish,
    createBookingRequest,
    updateBookingStatus,
    assignStaffToBooking,
    addAdminNote,
    requestReschedule,
    requestCancellation,
    submitCustomerReview,
    saveSettings,
    saveStaff,
    // Staff Auth & Duty
    loginStaffWithGoogle,
    registerStaffMember,
    logoutStaff,
    updateStaffDutyStatus,
    // Payments
    recordPayment,
  };
}
