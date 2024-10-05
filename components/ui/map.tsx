import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.73061,
  lng: -73.935242
};

const Map: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  // Optional: Handling onLoad event when map is initialized
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('Map loaded!', map);
  }, []);

  // Optional: Handling onUnmount event when map is unmounted
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

    // Define map options
    const mapOptions = {
        mapTypeControl: false, // Disable the map type control (MAP | SATELLITE)
        streetViewControl: false, // Optional: Disable Street View control
        fullscreenControl: false, // Optional: Disable Fullscreen control
        zoomControl: true, // Enable zoom control if needed
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
}

export default React.memo(Map);
