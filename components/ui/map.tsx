import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.73061,
  lng: -73.935242,
};

// Updated map styles to hide points of interest
const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [
      { color: '#f5f2e9' }, // Light beige background
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#b2e0ff' }, // Light blue for water
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#f7f2e6' }, // Light beige for landscape
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      { color: '#ffffff' }, // White roads
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { visibility: 'off' }, // Hide points of interest
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      { color: '#f5f2e5' }, // Light peach for transit
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#7b6f5c' }, // Subtle beige for text
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' }, // White stroke for better readability
      { weight: 2 },
    ],
  },
];

const Map: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('Map loaded!', map);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    styles: mapStyles,
    backgroundColor: '#f5f2e9', // Matching the background color with the overall theme
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(Map);
