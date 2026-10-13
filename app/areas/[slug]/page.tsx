'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import ServiceCard from '@/components/ServiceCard';
import { initialBusinessSettings } from '@/lib/data';

interface AreaDetails {
  name: string;
  slug: string;
  pincode: string;
  landmarks: string[];
  description: string;
  hospitalHubs: string[];
}

const areaDetailsMap: { [key: string]: AreaDetails } = {
  kanchipuram: {
    name: 'Kanchipuram',
    slug: 'kanchipuram',
    pincode: '631501 / 631502',
    landmarks: ['Gandhi Road', 'Collectorate Complex', 'Kamakshi Amman Temple Outer Ring', 'Bus Stand Area'],
    description:
      'Providing verified round-the-clock home nursing, post-operative surgical wound care, and elderly bedside companionship throughout historic Kanchipuram town and extended residential zones.',
    hospitalHubs: ['Kanchipuram Government Headquarters Hospital', 'Meenakshi Medical College & Research Institute', 'CSI Rainy/Local Nursing Homes'],
  },
  vembedu: {
    name: 'Vembedu',
    slug: 'vembedu',
    pincode: '631502',
    landmarks: ['Vembedu Main Road', 'Mariamman Kovil Street', 'Panchayat Union School Junction'],
    description:
      'Home care and bedside attender dispatch directly to families in Vembedu village and adjoining rural residences. Dedicated Tamil-speaking certified caregivers for seniors and recovering patients.',
    hospitalHubs: ['Vembedu Primary Health Centre', 'Kanchipuram District Hospital'],
  },
  walajabad: {
    name: 'Walajabad',
    slug: 'walajabad',
    pincode: '631605',
    landmarks: ['Walajabad Railway Station Road', 'Gandhi Nagar', 'State Highway Link'],
    description:
      'Compassionate home healthcare coordination for seniors and bed-bound patients in Walajabad. Scheduled nursing visits for surgical dressings and catheter routines.',
    hospitalHubs: ['Walajabad Government Hospital', 'Chengalpattu Medical College (connecting route)'],
  },
  oragadam: {
    name: 'Oragadam',
    slug: 'oragadam',
    pincode: '602105',
    landmarks: ['Industrial Corridor Townships', 'Sriperumbudur-Oragadam Highway Residences'],
    description:
      'Professional home nursing and patient attender support for modern residential communities and executive families in the Oragadam growth corridor.',
    hospitalHubs: ['Local Multispecialty Clinics', 'Sriperumbudur Government Hospital'],
  },
  sriperumbudur: {
    name: 'Sriperumbudur',
    slug: 'sriperumbudur',
    pincode: '602105',
    landmarks: ['National Highway 48 Belt', 'Rajiv Gandhi Memorial Vicinity', 'Ramanujar Temple Precinct'],
    description:
      'Reliable 12-hour and 24-hour stay-in elder care and nursing coordination for families residing in Sriperumbudur town and residential layouts.',
    hospitalHubs: ['Sriperumbudur Government Taluk Hospital', 'Saveetha Medical College & Hospital'],
  },
  chengalpattu: {
    name: 'Chengalpattu',
    slug: 'chengalpattu',
    pincode: '603001',
    landmarks: ['GST Road Suburbs', 'Medical College Outer Ring', 'Collectorate Corridor'],
    description:
      'Bedside nursing and hospital attender support for patients discharged from Chengalpattu regional healthcare centres requiring step-down home care.',
    hospitalHubs: ['Chengalpattu Government Medical College & Hospital'],
  },
};

export default function AreaPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || 'kanchipuram';
  const slug = rawSlug.toLowerCase();

  const areaInfo = areaDetailsMap[slug] || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    slug,
    pincode: 'Tamil Nadu',
    landmarks: ['Local Resident Neighborhoods'],
    description: `Comprehensive home care coordination, bedside nursing, and elder living support for patients in ${slug.replace(/-/g, ' ')}.`,
    hospitalHubs: ['District Headquarters Hospital'],
  };

  const { publishedServices } = useVairaStore();

  // Find services that operate in this area
  const localServices = publishedServices.filter((s) =>
    s.serviceAreas.some((a) => a.toLowerCase().includes(areaInfo.name.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-50/70 to-white border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-emerald-700">Areas</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">{areaInfo.name}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Local Doorstep Service Coverage</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Home Nursing & Elder Care in {areaInfo.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {areaInfo.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/book"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Request Care in {areaInfo.name}</span>
            </Link>

            <a
              href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Desk ({initialBusinessSettings.phone1})</span>
            </a>
          </div>
        </div>
      </section>

      {/* Local Coverage Matrix */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pincodes Covered
            </strong>
            <p className="font-bold text-slate-900 text-sm">{areaInfo.pincode}</p>
            <p className="text-xs text-slate-500">Fast caregiver deployment within town limits.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Key Localities & Landmarks
            </strong>
            <ul className="text-xs text-slate-600 space-y-1">
              {areaInfo.landmarks.map((l, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Regional Medical Centres
            </strong>
            <ul className="text-xs text-slate-600 space-y-1">
              {areaInfo.hospitalHubs.map((h, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Available Services in this Area */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Services Available in {areaInfo.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verified caregivers and nurses available for day, night, and 24-hour shifts in {areaInfo.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(localServices.length > 0 ? localServices : publishedServices.slice(0, 3)).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
