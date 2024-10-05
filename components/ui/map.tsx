import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);


const containerStyle = {
  width: '100%',
  height: '100%'
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
  const [pins, setPins] = useState<any[]>([]); // State to store pins

  const fetchPins = async () => {
    // Fetching data from the "pins" table
    const { data, error } = await supabase.from('pins').select('*');
    if (error) {
      console.error('Error fetching pins:', error);
    } else {
      setPins(data || []);
    }
  };

  useEffect(() => {
    fetchPins(); // Fetch pins on component mount
  }, []);

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
   <div className='h-screen'>
     <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Render a marker for each pin */}
        {pins.map(pin => (
            <Marker
              key={pin.id}
              position={{ lat: pin.latitude, lng: pin.longitude }}
              title={pin.name} // Optional: Set the name of the pin as the marker title
            />
          ))}
      </GoogleMap>
    </LoadScript>
   </div>
  );
};

export default React.memo(Map);

