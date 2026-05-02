"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { ReportType } from "@/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon Leaflet + webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function makeIcon(type: ReportType) {
    const color = type === "missing" ? "#ef4444" : "#22c55e";
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
                fill="${color}" stroke="white" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>
    `;
    return L.divIcon({
        html: svg,
        className: "",
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36],
    });
}

interface MiniMapProps {
    lat: number;
    lng: number;
    label: string;
    type: ReportType;
}

export default function MiniMap({ lat, lng, label, type }: MiniMapProps) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: 200, width: "100%" }}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]} icon={makeIcon(type)}>
                <Popup>{label}</Popup>
            </Marker>
        </MapContainer>
    );
}