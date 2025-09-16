
import React, { useEffect, useRef } from 'react';
import { Plumber } from '../types';

declare const L: any;

interface MapProps {
    plumbers: Plumber[];
    userLocation: { lat: number; lng: number } | null;
    onPlumberSelect: (plumber: Plumber) => void;
}

const Map: React.FC<MapProps> = ({ plumbers, userLocation, onPlumberSelect }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any | null>(null);
    const plumberMarkersRef = useRef<any | null>(null);
    const userMarkerRef = useRef<any | null>(null);

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, {
                scrollWheelZoom: false // Better for scrollable pages
            }).setView([31.7917, -7.0926], 6); // Centered on Morocco
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            mapRef.current = map;
            plumberMarkersRef.current = L.layerGroup().addTo(map);
            userMarkerRef.current = L.layerGroup().addTo(map);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update plumber markers
    useEffect(() => {
        const plumberMarkers = plumberMarkersRef.current;
        if (!plumberMarkers) return;

        plumberMarkers.clearLayers();

        plumbers.forEach(plumber => {
            if (plumber.latitude && plumber.longitude) {
                const marker = L.marker([plumber.latitude, plumber.longitude]);
                
                const popupContent = document.createElement('div');
                popupContent.innerHTML = `
                    <div class="font-sans">
                        <p class="font-bold text-base mb-1">${plumber.name}</p>
                        <p class="text-sm text-gray-600">${plumber.city}</p>
                    </div>
                `;
                const viewProfileButton = document.createElement('button');
                viewProfileButton.innerHTML = 'View Profile';
                viewProfileButton.className = 'w-full text-center mt-2 px-3 py-1 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors';
                viewProfileButton.onclick = () => onPlumberSelect(plumber);

                popupContent.appendChild(viewProfileButton);
                
                marker.bindPopup(popupContent);
                plumberMarkers.addLayer(marker);
            }
        });
    }, [plumbers, onPlumberSelect]);
    
    // Update user location marker
    useEffect(() => {
        const userMarker = userMarkerRef.current;
        if (!userMarker) return;

        userMarker.clearLayers();

        if (userLocation) {
            const userIcon = L.divIcon({
                className: '', // No extra class, just use the HTML
                html: `<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .bindPopup('Your Location')
                .addTo(userMarker);
        }
    }, [userLocation]);

    return <div ref={mapContainerRef} className="w-full h-[600px]" />;
};

export default Map;