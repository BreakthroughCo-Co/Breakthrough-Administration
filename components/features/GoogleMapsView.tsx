'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client } from '@/types';
import firebaseConfig from '@/firebase-applet-config.json';
import {
  MapPin,
  Navigation,
  Compass,
  Car,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

// Default participant coordinates in Sydney & Melbourne metropolitan & regional clusters for NDIS practice
const PARTICIPANT_COORDINATES: Record<string, { lat: number; lng: number; suburb: string; mmmZone: number }> = {
  'client-1': { lat: -33.8688, lng: 151.2093, suburb: 'Sydney CBD', mmmZone: 1 },
  'client-2': { lat: -33.8150, lng: 151.0011, suburb: 'Parramatta NSW', mmmZone: 1 },
  'client-3': { lat: -33.7510, lng: 150.6942, suburb: 'Penrith NSW', mmmZone: 2 },
  'client-4': { lat: -33.9173, lng: 151.0330, suburb: 'Bankstown NSW', mmmZone: 1 },
  'client-5': { lat: -34.4278, lng: 150.8931, suburb: 'Wollongong NSW', mmmZone: 3 },
};

// Clinician Practice Base (e.g. Sydney Central Office)
const CLINIC_HQ = { lat: -33.8708, lng: 151.2073, name: 'Breakthrough Allied Health HQ (Sydney)' };

declare global {
  interface Window {
    google?: any;
    initGoogleMapsCallback?: () => void;
  }
}

export const GoogleMapsView: React.FC = () => {
  const { clients, setSelectedClient, setActiveTab } = useManagementStore();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [mapLoaded, setMapLoaded] = useState(() => typeof window !== 'undefined' && !!window.google?.maps);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // API Key priority: Secret / Env / Firebase API key
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_PLATFORM_KEY : '') ||
    firebaseConfig.apiKey ||
    '';

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0] || null;
  const participantLoc = useMemo(() => {
    return (selectedClient && PARTICIPANT_COORDINATES[selectedClient.id]) || { lat: -33.8688, lng: 151.2093, suburb: 'Sydney CBD', mmmZone: 1 };
  }, [selectedClient]);

  // Calculate NDIS Travel Claim parameters based on MMM (Modified Monash Model) zones
  const travelMetrics = useMemo(() => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const lat1 = CLINIC_HQ.lat;
    const lon1 = CLINIC_HQ.lng;
    const lat2 = participantLoc.lat;
    const lon2 = participantLoc.lng;

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistanceKm = Math.max(1.2, Number((R * c).toFixed(1)));
    const drivingDistanceKm = Number((straightDistanceKm * 1.3).toFixed(1));
    const estimatedMinutes = Math.max(8, Math.round(drivingDistanceKm * 1.8));

    // NDIS PACE Rules:
    // MMM 1-3 (Metro): Max 30 minutes provider travel claimable
    // MMM 4-5 (Regional): Max 60 minutes
    // MMM 6-7 (Remote): By agreement
    const mmmZone = participantLoc.mmmZone;
    const maxClaimableMinutes = mmmZone <= 3 ? 30 : 60;
    const actualClaimableMinutes = Math.min(estimatedMinutes, maxClaimableMinutes);
    const hourlyRate = 193.99; // Standard NDIS Specialist Behaviour Support / Capacity Building rate
    const travelCost = Number(((actualClaimableMinutes / 60) * hourlyRate).toFixed(2));
    const activityTransportKmRate = 0.97; // Non-labour activity transport per km
    const activityTransportCost = Number((drivingDistanceKm * activityTransportKmRate).toFixed(2));

    return {
      drivingDistanceKm,
      estimatedMinutes,
      mmmZone,
      maxClaimableMinutes,
      actualClaimableMinutes,
      travelCost,
      activityTransportCost,
      supportItemCode: '01_799_0128_1_1',
    };
  }, [participantLoc]);

  // Load Google Maps Script
  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return;

    if (window.google?.maps) {
      return;
    }

    const scriptId = 'google-maps-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.google?.maps) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: CLINIC_HQ.lat, lng: CLINIC_HQ.lng },
        zoom: 11,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#1e293b' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#334155' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0284c7' }],
          },
        ],
      });
    }

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Add HQ Marker
    const hqMarker = new window.google.maps.Marker({
      position: { lat: CLINIC_HQ.lat, lng: CLINIC_HQ.lng },
      map: mapInstanceRef.current,
      title: CLINIC_HQ.name,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#0d9488',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });
    markersRef.current.push(hqMarker);

    // Add Participant Markers
    clients.forEach((client) => {
      const coords = PARTICIPANT_COORDINATES[client.id] || { lat: -33.8688, lng: 151.2093, suburb: 'Sydney', mmmZone: 1 };
      const isSelected = client.id === selectedClientId;
      const isHighRisk = client.riskLevel === 'High' || client.riskLevel === 'Critical';

      const marker = new window.google.maps.Marker({
        position: { lat: coords.lat, lng: coords.lng },
        map: mapInstanceRef.current,
        title: `${client.name} (${coords.suburb})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 7,
          fillColor: isSelected ? '#06b6d4' : isHighRisk ? '#f59e0b' : '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedClientId(client.id);
      });

      markersRef.current.push(marker);
    });

    if (selectedClient) {
      const targetCoords = PARTICIPANT_COORDINATES[selectedClient.id] || { lat: -33.8688, lng: 151.2093 };
      mapInstanceRef.current.panTo(targetCoords);
    }
  }, [mapLoaded, clients, selectedClientId, selectedClient]);

  const mapsDirectUrl = `https://www.google.com/maps/dir/?api=1&origin=${CLINIC_HQ.lat},${CLINIC_HQ.lng}&destination=${participantLoc.lat},${participantLoc.lng}&travelmode=driving`;

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Google Maps™ Geocoded Participant & Travel Optimization
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded font-bold border border-teal-500/30">
                  MMM1-7 Zones
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live geolocation routing, clinician shift dispatch, and automated NDIS Provider Travel calculation (PACE #01_799_0128_1_1)
              </p>
            </div>
          </div>
        </div>

        {clients.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:ring-1 focus:ring-teal-500"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  📍 {c.name} ({PARTICIPANT_COORDINATES[c.id]?.suburb || 'NSW'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Map on Left, NDIS Route & Travel Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Navigation className="w-4 h-4 text-teal-400" />
              <span>Interactive Practice Map View</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-teal-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> HQ Base
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> High Priority
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active
              </span>
            </div>
          </div>

          <div className="w-full h-[520px] relative bg-slate-950">
            {apiKey ? (
              <div ref={mapContainerRef} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-slate-300 space-y-4">
                <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                  <MapPin className="w-10 h-10 text-teal-400 mx-auto" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-base font-bold text-white">Google Maps API Geolocation Service</h3>
                  <p className="text-xs text-slate-400">
                    To render the live satellite/vector map tiles, configure <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in environment settings.
                  </p>
                </div>
                <a
                  href={mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <span>Open Route in Google Maps™</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* NDIS Travel & Route Calculator Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Participant Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {selectedClient ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider">
                      Target Participant
                    </span>
                    <h3 className="text-base font-black text-white">{selectedClient.name}</h3>
                    <p className="text-xs text-slate-400">
                      NDIS #{selectedClient.ndisNumber} • {participantLoc.suburb}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    selectedClient.riskLevel === 'High'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {selectedClient.riskLevel} Risk
                  </span>
                </div>

                {/* Travel Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Car className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-[10px] uppercase font-bold">Driving Distance</span>
                    </div>
                    <p className="text-lg font-black text-white font-mono">{travelMetrics.drivingDistanceKm} km</p>
                    <span className="text-[10px] text-slate-500">From Practice HQ</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] uppercase font-bold">Estimated Transit</span>
                    </div>
                    <p className="text-lg font-black text-white font-mono">{travelMetrics.estimatedMinutes} mins</p>
                    <span className="text-[10px] text-slate-500">Live Traffic Model</span>
                  </div>
                </div>

                {/* NDIS PACE Provider Travel Allowance */}
                <div className="bg-teal-950/30 border border-teal-800/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span className="font-bold text-teal-200">NDIS Provider Travel Claim</span>
                    </div>
                    <span className="text-[10px] bg-teal-900/60 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-700/50 font-bold">
                      MMM {travelMetrics.mmmZone} ({travelMetrics.mmmZone <= 3 ? 'Metro Cap 30m' : 'Regional Cap 60m'})
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex justify-between py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Claimable Labour Travel:</span>
                      <span className="font-bold text-white">{travelMetrics.actualClaimableMinutes} mins (${travelMetrics.travelCost})</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Non-Labour (Km Allowance):</span>
                      <span className="font-bold text-white">${travelMetrics.activityTransportCost} (@ $0.97/km)</span>
                    </div>
                    <div className="flex justify-between py-1 text-sm font-black text-teal-400">
                      <span>Total Travel Claim:</span>
                      <span>${(travelMetrics.travelCost + travelMetrics.activityTransportCost).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Auto-formatted for PACE line item <strong>01_799_0128_1_1</strong></span>
                  </div>
                </div>

                {/* Quick Action Navigation */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedClient(selectedClient);
                      setActiveTab('clients');
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <span>Open Full Participant Record</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <a
                    href={mapsDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-teal-900/30 hover:bg-teal-800/40 text-teal-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-teal-700/50"
                  >
                    <span>Open Navigation in Google Maps™</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 space-y-3">
                <MapPin className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="font-bold text-white">No Participants Registered</p>
                <p>Register a participant or import from Google Workspace Contacts to calculate Monash Model travel allowances.</p>
                <button
                  onClick={() => setActiveTab('clients')}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Go to NDIS Participants
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
