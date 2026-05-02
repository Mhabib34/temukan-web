"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MARKER_ICON = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
            fill="#f97316" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    className: "",
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
});

// ─── Click Handler ────────────────────────────────────────────────────────────

function ClickHandler({
                          onPick,
                      }: {
    onPick: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onPick(
                parseFloat(e.latlng.lat.toFixed(6)),
                parseFloat(e.latlng.lng.toFixed(6))
            );
        },
    });
    return null;
}

// ─── Auto-center ke posisi user ───────────────────────────────────────────────

function UserLocator({
                         onLocated,
                     }: {
    onLocated: (lat: number, lng: number) => void;
}) {
    const map = useMapEvents({});
    const done = useRef(false);

    useEffect(() => {
        if (done.current) return;
        done.current = true;

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], 15);
                onLocated(
                    parseFloat(latitude.toFixed(6)),
                    parseFloat(longitude.toFixed(6))
                );
            },
            () => {
                // fallback: tengah Indonesia
                map.setView([-2.5489, 118.0149], 5);
            },
            { timeout: 8000 }
        );
    }, []);

    return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface LocationPickerProps {
    value: { lat: number; lng: number } | null;
    onChange: (coords: { lat: number; lng: number } | null) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
    const [located, setLocated] = useState(false);

    function handlePick(lat: number, lng: number) {
        onChange({ lat, lng });
    }

    function handleLocated(lat: number, lng: number) {
        setLocated(true);
        // Hanya set koordinat awal jika belum ada value dari user
        if (!value) {
            onChange({ lat, lng });
        }
    }

    return (
        <div className="space-y-2">
            <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
                <MapContainer
                    center={[-2.5489, 118.0149]}
                    zoom={5}
                    style={{ height: 280, width: "100%" }}
                    zoomControl
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <ClickHandler onPick={handlePick} />
                    <UserLocator onLocated={handleLocated} />
                    {value && (
                        <Marker
                            position={[value.lat, value.lng]}
                            icon={MARKER_ICON}
                        />
                    )}
                </MapContainer>
            </div>

            {value ? (
                <div className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 text-xs">
                    <span className="font-mono text-orange-700">
                        {value.lat}, {value.lng}
                    </span>
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="text-stone-400 transition hover:text-red-500"
                    >
                        Hapus titik
                    </button>
                </div>
            ) : (
                <p className="text-xs text-stone-400">
                    {located
                        ? "Ketuk peta untuk menandai lokasi"
                        : "Memuat lokasi Anda…"}
                </p>
            )}
        </div>
    );
}