"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface HostelMapProps {
    lat: number;
    lng: number;
    name: string;
}

const HostelMap: React.FC<HostelMapProps> = ({ lat, lng, name }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const customIcon = L.divIcon({
            html: `<div style="background: #2c1b13; color: white; width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                <svg style="transform: rotate(45deg); width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 14.229l-4.419 2.585A1 1 0 014 16V4z"/>
                </svg>
            </div>`,
            className: "",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const map = L.map(mapRef.current, {
            center: [lat, lng],
            zoom: 15,
            zoomControl: false,
            attributionControl: false
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        L.marker([lat, lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<div style="font-weight: bold; font-size: 14px;">${name}</div>`)
            .openPopup();

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, name]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <div ref={mapRef} className="w-full h-full" />
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#2c1b13]/90 backdrop-blur-sm text-xs font-medium text-[#2c1b13] dark:text-[#fcf2e9]">
                📍 {lat.toFixed(4)}, {lng.toFixed(4)}
            </div>
        </div>
    );
};

export default HostelMap;
