
"use client";

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const locations = [
    { lat: 12.9716, lng: 77.5946, key: 'bangalore' },
    { lat: 18.5204, lng: 73.8567, key: 'pune' },
    { lat: 19.0760, lng: 72.8777, key: 'mumbai' },
];

export function MapComponent({ apiKey }: { apiKey: string }) {
  const position = { lat: 17.3850, lng: 78.4867 }; // Default center to Hyderabad

  return (
    <APIProvider apiKey={apiKey}>
        <Map
            defaultCenter={position}
            defaultZoom={5}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={'e5138135e89a6339'}
        >
            {locations.map(loc => (
                <AdvancedMarker key={loc.key} position={loc} />
            ))}
        </Map>
    </APIProvider>
  );
}
