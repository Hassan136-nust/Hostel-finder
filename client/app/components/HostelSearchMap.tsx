"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { HiOutlineLocationMarker, HiStar } from "react-icons/hi";

interface HostelSearchMapProps {
    hostels: any[];
}

const HostelSearchMap: React.FC<HostelSearchMapProps> = ({ hostels }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Default: Islamabad center if no hostels
        const defaultCenter: [number, number] = [33.6844, 73.0479];

        const map = L.map(mapRef.current, {
            center: defaultCenter,
            zoom: 12,
            zoomControl: false, 
        });

        // Use CartoDB Voyager for a cleaner, modern look
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when hostels change
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        
        const map = mapInstanceRef.current;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (hostels.length === 0) return;

        const bounds = L.latLngBounds([]);

        hostels.forEach((hostel) => {
            if (hostel.coordinates?.lat && hostel.coordinates?.lng) {
                // Custom Price Market
                const priceLabel = hostel.minPrice 
                    ? `PK ${(hostel.minPrice / 1000).toFixed(1)}k`
                    : 'N/A';

                const customIcon = L.divIcon({
                    html: `<div class="bg-white dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-bold text-xs px-1 py-1 rounded-lg shadow-lg border border-[#2c1b13]/10 dark:border-white/10 whitespace-nowrap hover:scale-110 transition-transform">
                        ${priceLabel}
                    </div>`,
                    className: "custom-map-marker", 
                    iconSize: [60, 30],
                    iconAnchor: [30, 15]
                });

                const marker = L.marker([hostel.coordinates.lat, hostel.coordinates.lng], { icon: customIcon })
                    .addTo(map);

                // Create popup content manually to keep styles
                const popupContent = `
                    <div style="width: 200px; font-family: sans-serif;">
                        <div style="height: 120px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; position: relative;">
                            <img src="${hostel.images?.[0]?.url || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                            <div style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; display: flex; align-items: center; gap: 2px;">
                                <span>★</span> ${hostel.rating?.toFixed(1) || 'New'}
                            </div>
                        </div>
                        <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #2c1b13;">${hostel.name}</h3>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${hostel.city}</p>
                        <a href="/hostels/${hostel._id}" style="display: block; margin-top: 8px; text-align: center; background: #2c1b13; color: white; padding: 6px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">View Details</a>
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    maxWidth: 220,
                    minWidth: 220,
                    closeButton: false,
                    className: 'custom-popup' 
                });

                markersRef.current.push(marker);
                bounds.extend([hostel.coordinates.lat, hostel.coordinates.lng]);
            }
        });

        if (markersRef.current.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }

    }, [hostels]);

    return (
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-[#2c1b13]/5 z-0 relative">
            <div ref={mapRef} className="w-full h-full" />
            <style jsx global>{`
                .custom-map-marker {
                    background: transparent;
                    border: none;
                }
                .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .leaflet-popup-content {
                    margin: 12px;
                }
                .leaflet-popup-tip {
                    background: white;
                }
            `}</style>
        </div>
    );
};

export default HostelSearchMap;
