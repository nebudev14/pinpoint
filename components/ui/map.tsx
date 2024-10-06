import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { createClient } from "@supabase/supabase-js";
import Modal from "./modal"; // Import your Modal component

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 40.807384,
  lng: -73.963036,
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f2e9" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b2e0ff" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f7f2e6" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e1f7d5" }, { visibility: "on" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f5f2e5" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7b6f5c" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { weight: 2 }],
  },
];

export default function Map({ pins }: { pins: any[] }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");

  const fetchPins = async () => {
    // Fetch pins from Supabase (you can uncomment this if you need it)
    // const { data, error } = await supabase.from('pins').select('*');
    // if (error) {
    //   console.error('Error fetching pins:', error);
    // } else {
    //   setPins(data || []);
    // }
  };

  

  useEffect(() => {
    fetchPins(); // Fetch pins on component mount

    // Get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Ensure google object is defined before using it
      if (userLocation && google) {
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#1A73E8",
            fillOpacity: 1,
            strokeWeight: 4,
            strokeColor: "#FFFFFF",
          },
        });
      }
    },
    [userLocation]
  );

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    styles: mapStyles,
    backgroundColor: "#f5f2e9",
    gestureHandling: "greedy",
  };

  const handleMarkerClick = async (pin: any) => {
    setSelectedPin(pin);
    setModalOpen(true);

    // Fetch user data
    const { data, error } = await supabase
      .from("users")
      .select("firstname, lastname")
      .eq("id", pin.user_id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data) {
      setUserFirstName(data.firstname);
      setUserLastName(data.lastname);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPin(null);
    setUserFirstName("");
    setUserLastName("");
  };


  return (
    <div className="h-screen">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: userLocation?.lat as number, lng: userLocation?.lng as number  }}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={{ lat: pin.latitude, lng: pin.longitude }}
              onClick={() => handleMarkerClick(pin)}
              title={pin.name}
              icon={{
                url: "/assets/bathroom.svg",
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          ))}

          {userLocation && mapRef.current && (
            <Marker
              position={userLocation}
              title="You are here"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#1A73E8",
                fillOpacity: 1,
                strokeWeight: 4,
                strokeColor: "#FFFFFF",
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedPin?.name || ""}
        description={selectedPin?.description || ""}
        firstname={userFirstName}
        lastname={userLastName}
      />
    </div>
  );
}
