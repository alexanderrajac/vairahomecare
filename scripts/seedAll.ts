import { createClient } from '@supabase/supabase-js';
import {
  initialBusinessSettings,
  initialServices,
  initialStaff,
  initialReviews,
} from '../lib/data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://izqlaicmbzlkfplmsyse.supabase.co';
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_syw4HeB_jO8p7bbcDP46OQ_nY7eSaQr';

const client = createClient(url, key);

async function main() {
  console.log('--- Seeding Supabase Database ---');

  // 1. Settings
  console.log('Seeding Business Settings...');
  const { error: setErr } = await client.from('business_settings').upsert({
    id: 'primary',
    name: initialBusinessSettings.name,
    data: initialBusinessSettings,
    updated_at: new Date().toISOString(),
  });
  if (setErr) console.error('Settings error:', setErr.message);
  else console.log('✓ Business settings seeded');

  // 2. Services
  console.log(`Seeding ${initialServices.length} Services...`);
  for (const s of initialServices) {
    const { error: sErr } = await client.from('services').upsert({
      id: s.id,
      slug: s.slug,
      name: s.name,
      category: s.category,
      base_price: s.basePrice,
      is_published: s.isPublished,
      data: s,
      updated_at: new Date().toISOString(),
    });
    if (sErr) console.error(`Error seeding service ${s.name}:`, sErr.message);
  }
  console.log(`✓ Services seeded`);

  // 3. Staff: Real staff register via Staff Portal or Supabase Auth

  // 4. Reviews
  console.log(`Seeding ${initialReviews.length} Reviews...`);
  for (const r of initialReviews) {
    const { error: rErr } = await client.from('reviews').upsert({
      id: r.id,
      request_id: r.requestId,
      customer_name: r.customerName,
      service_name: r.serviceName,
      rating: r.rating,
      is_approved: r.isApproved,
      data: r,
      updated_at: new Date().toISOString(),
    });
    if (rErr) console.error(`Error seeding review ${r.id}:`, rErr.message);
  }
  console.log(`✓ Reviews seeded`);

  console.log('\nAll initial data successfully seeded to Supabase!');
}

main().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
