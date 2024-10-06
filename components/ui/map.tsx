import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { createClient } from '@supabase/supabase-js';
import Modal from './modal'; // Import your Modal component

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.807384,
  lng: -73.963036,
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
    elementType: 'all',
    stylers: [
      { visibility: 'off' }, // Hides all points of interest
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
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#e1f7d5' },
      { visibility: 'on'}, // Set a different color for parks (light green)
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
    const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const [selectedPin, setSelectedPin] = useState<any>(null); // State to store selected pin
  
    const fetchPins = async () => {
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
    }, []);
  
    const onUnmount = useCallback(() => {
      mapRef.current = null;
    }, []);
  
    const mapOptions: google.maps.MapOptions = {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      styles: mapStyles,
      backgroundColor: '#f5f2e9',
      gestureHandling: 'greedy',
    };
  
    const handleMarkerClick = (pin: any) => {
        setSelectedPin(pin);
        setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
        setSelectedPin(null);
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
                onClick={() => handleMarkerClick(pin)} // Set click handler
                title={pin.name} // Optional: Set the name of the pin as the marker title
              />
            ))}
          </GoogleMap>
        </LoadScript>
  
        {/* Modal for displaying pin details */}
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title={selectedPin?.name || ''}
          description={selectedPin?.description || ''}
        />
      </div>
    );
  };
  
  export default React.memo(Map);