import { supabase, isSupabaseConfigured } from './supabase';
import {
  BookingRequest,
  ServiceItem,
  StaffMember,
  CustomerReview,
  BusinessSettings,
  NotificationItem,
} from './types';

// =======================
// BOOKINGS
// =======================
export async function getBookingsFromSupabase(): Promise<BookingRequest[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings from Supabase:', error);
    return null;
  }
  return data?.map((row) => row.data as BookingRequest) || [];
}

export async function upsertBookingToSupabase(booking: BookingRequest): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('bookings').upsert({
    id: booking.id,
    service_id: booking.serviceId,
    service_name: booking.serviceName,
    customer_name: booking.customer.fullName,
    customer_phone: booking.customer.phoneNumber,
    status: booking.status,
    lead_source: booking.leadSource,
    data: booking,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving booking to Supabase:', error);
    return false;
  }
  return true;
}

// =======================
// SERVICES
// =======================
export async function getServicesFromSupabase(): Promise<ServiceItem[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('services').select('*').order('name');
  if (error) {
    console.error('Error fetching services from Supabase:', error);
    return null;
  }
  return data?.map((row) => row.data as ServiceItem) || [];
}

export async function upsertServiceToSupabase(service: ServiceItem): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('services').upsert({
    id: service.id,
    slug: service.slug,
    name: service.name,
    category: service.category,
    base_price: service.basePrice,
    is_published: service.isPublished,
    data: service,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving service to Supabase:', error);
    return false;
  }
  return true;
}

// =======================
// STAFF
// =======================
export async function getStaffFromSupabase(): Promise<StaffMember[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('staff').select('*');
  if (error) {
    console.error('Error fetching staff from Supabase:', error);
    return null;
  }
  return data?.map((row) => row.data as StaffMember) || [];
}

export async function upsertStaffToSupabase(staff: StaffMember): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('staff').upsert({
    id: staff.id,
    name: staff.name,
    role: staff.role,
    phone: staff.phone,
    email: staff.email,
    status: staff.status,
    data: staff,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving staff to Supabase:', error);
    return false;
  }
  return true;
}

// =======================
// REVIEWS
// =======================
export async function getReviewsFromSupabase(): Promise<CustomerReview[] | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching reviews from Supabase:', error);
    return null;
  }
  return data?.map((row) => row.data as CustomerReview) || [];
}

export async function upsertReviewToSupabase(review: CustomerReview): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('reviews').upsert({
    id: review.id,
    request_id: review.requestId,
    customer_name: review.customerName,
    service_name: review.serviceName,
    rating: review.rating,
    is_approved: review.isApproved,
    data: review,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving review to Supabase:', error);
    return false;
  }
  return true;
}

// =======================
// SETTINGS
// =======================
export async function getSettingsFromSupabase(): Promise<BusinessSettings | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('business_settings').select('*').limit(1).maybeSingle();
  if (error) {
    console.error('Error fetching business settings from Supabase:', error);
    return null;
  }
  return data ? (data.data as BusinessSettings) : null;
}

export async function updateSettingsInSupabase(settings: BusinessSettings): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase.from('business_settings').upsert({
    id: 'primary',
    name: settings.name,
    data: settings,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving settings to Supabase:', error);
    return false;
  }
  return true;
}
