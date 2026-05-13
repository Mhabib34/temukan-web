"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { getMapPins } from "@/api/map";
import { queryKeys } from "@/lib/queryClient";
import type { MapPin, ReportType } from "@/types";
import Image from "next/image";

// ── Fix Leaflet default icon (Next.js SSR workaround) ────────────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ── Custom pin icons ──────────────────────────────────────────────────────────
function makePinIcon(color: string) {
  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
                fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="14" cy="14" r="5" fill="white"/>
        </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

const ICON_MISSING = makePinIcon("#ef4444"); // red-500
const ICON_FOUND = makePinIcon("#22c55e"); // green-500

// ── Bounds listener — refetch saat map dipindah ───────────────────────────────
function BoundsWatcher({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: string) => void;
}) {
  const getBoundsStr = useCallback((map: L.Map) => {
    const b = map.getBounds();
    return `${b.getSouth().toFixed(4)},${b.getWest().toFixed(4)},${b.getNorth().toFixed(4)},${b.getEast().toFixed(4)}`;
  }, []);

  const map = useMapEvents({
    moveend: () => onBoundsChange(getBoundsStr(map)),
    zoomend: () => onBoundsChange(getBoundsStr(map)),
    load: () => onBoundsChange(getBoundsStr(map)),
  });

  // trigger sekali saat mount
  useEffect(() => {
    onBoundsChange(getBoundsStr(map));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ── Pin popup ─────────────────────────────────────────────────────────────────
function PinPopup({
  pin,
  onNavigate,
}: {
  pin: MapPin;
  onNavigate: (id: string) => void;
}) {
  const isMissing = pin.type === "missing";
  const badgeClass = isMissing
    ? "bg-red-500 text-white"
    : "bg-green-500 text-white";
  const badgeLabel = isMissing ? "Hilang" : "Ditemukan";
  const genderLabel =
    pin.gender === "male"
      ? "Laki-laki"
      : pin.gender === "female"
        ? "Perempuan"
        : "?";
  const timeAgo = formatDistanceToNow(new Date(pin.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    <div className="min-w-45">
      {pin.photo_url && (
        <Image
          fill
          src={pin.photo_url}
          alt="foto"
          className="w-full h-28 object-cover rounded-lg mb-2"
        />
      )}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}
        >
          {badgeLabel}
        </span>
      </div>
      <p className="text-xs text-stone-600">
        {genderLabel}
        {pin.estimated_age ? `, ±${pin.estimated_age} thn` : ""}
      </p>
      <p className="text-xs text-stone-500 mt-0.5">{pin.city}</p>
      <p className="text-[10px] text-stone-400 mt-0.5">{timeAgo}</p>
      <button
        onClick={() => onNavigate(pin.id)}
        className="mt-2.5 w-full rounded-lg bg-orange-500 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition"
      >
        Lihat Detail
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PetaMap() {
  const router = useRouter();
  const [filterType, setFilterType] = useState<ReportType | undefined>(
    undefined,
  );
  const [bounds, setBounds] = useState<string | undefined>(undefined);

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.map.pins({ type: filterType, bounds }),
    queryFn: () => getMapPins({ type: filterType, bounds }),
    enabled: true,
    staleTime: 30_000,
  });

  const pins = data?.data.pins ?? [];
  const total = data?.data.total ?? 0;

  // Indonesia center
  const CENTER: [number, number] = [-2.5, 118.0];

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-1000 pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 pt-4 flex items-start justify-between gap-3">
          {/* Filter pills */}
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-100 shadow-md px-3 py-2">
            <span className="text-xs text-stone-500 font-medium mr-1 hidden sm:inline">
              Filter:
            </span>
            {(
              [
                { label: "Semua", value: undefined },
                { label: "Hilang", value: "missing" as ReportType },
                { label: "Ditemukan", value: "found" as ReportType },
              ] as const
            ).map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setFilterType(opt.value)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  filterType === opt.value
                    ? opt.value === "missing"
                      ? "bg-red-500 text-white"
                      : opt.value === "found"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Stats + loading */}
          <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-100 shadow-md px-3 py-2">
            {isFetching ? (
              <span className="text-xs text-stone-400 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                Memuat...
              </span>
            ) : (
              <span className="text-xs text-stone-600 font-medium">
                <span className="font-bold text-stone-800">{pins.length}</span>
                {total > pins.length ? `/${total}` : ""} pin di area ini
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="absolute bottom-24 md:bottom-6 left-4 z-1000">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-100 shadow-md px-3.5 py-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span className="text-xs text-stone-600">Hilang</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
            <span className="text-xs text-stone-600">Ditemukan</span>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <MapContainer
        center={CENTER}
        zoom={5}
        className="flex-1 w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsWatcher onBoundsChange={setBounds} />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={pin.type === "missing" ? ICON_MISSING : ICON_FOUND}
          >
            <Popup minWidth={200} maxWidth={240}>
              <PinPopup
                pin={pin}
                onNavigate={(id) => router.push(`/report/${id}`)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
