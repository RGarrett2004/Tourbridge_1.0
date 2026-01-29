
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LocationPoint, MarkerType } from '../types';
import { COLORS } from '../constants';

// Fix for default marker icons in Leaflet + React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createColoredIcon = (color: string, isDynamic: boolean = false) => {
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" class="${isDynamic ? 'animate-pulse' : ''}">
      ${isDynamic ? `<circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2">
        <animate attributeName="r" from="10" to="14" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.2" to="0" dur="1.5s" repeatCount="indefinite" />
      </circle>` : ''}
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.19 7 11.88 7 9z"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgTemplate,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const MapController = ({ center, onBoundsChange }: { center: [number, number], onBoundsChange: (lat: number, lng: number, zoom: number) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (zoom >= 11) {
        onBoundsChange(center.lat, center.lng, zoom);
      }
    },
  });

  return null;
};

interface MapComponentProps {
  points: LocationPoint[];
  onPointSelect: (point: LocationPoint) => void;
  center: [number, number];
  onViewChange: (lat: number, lng: number, zoom: number) => void;
  children?: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ points, onPointSelect, center, onViewChange, children }) => {
  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} onBoundsChange={onViewChange} />
        
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.lat, point.lng]} 
            icon={createColoredIcon(
              point.type === MarkerType.VENUE ? COLORS.VENUE : 
              point.type === MarkerType.HOST ? COLORS.HOST : 
              point.type === MarkerType.PRO ? COLORS.PRO : 
              point.type === MarkerType.PROMOTER ? COLORS.PROMOTER : COLORS.CREATOR,
              point.isDynamic
            )}
            eventHandlers={{
              click: () => onPointSelect(point),
            }}
          >
            <Popup className="dark-popup">
              <div className="text-gray-900 font-medium">
                <div className="flex items-center gap-2 mb-1">
                   <p className="font-bold border-b ">{point.name}</p>
                   {point.isDynamic && <span className="text-[8px] bg-yellow-500 text-black px-1 rounded font-black uppercase tracking-tighter">Live Discover</span>}
                </div>
                <p className="text-xs text-gray-600">{point.category || point.type}</p>
                <p className="text-xs italic">{point.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {children}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
