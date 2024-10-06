"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarPlus, Check, ChevronsUpDown } from "lucide-react";
import { CommandList } from "cmdk";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useRef } from "react";
import { cn } from "@/utils/cn";
import { useUser } from "@clerk/nextjs";

export default function CreateEventModal({ topics, open, setOpen }: { topics: any, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = {
    lat: 40.7128,
    lng: -74.006,
  };

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState(""); 
  const [location, setLocation] = useState(center);

  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // Replace with your actual API key
  // });

  const mapRef = useRef(null);

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((e: any) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  async function handleCreateEvent(e: React.FormEvent){
    console.log("CREATING NEW EVENT");
    e.preventDefault();
    console.log("Creating event:", {
      name: eventName,
      type: eventType,
      description: eventDescription,
      location,
    });

  const { data, error } = await supabase
    .from('pins') // Replace with your actual table name
    .insert([
      {
        name: eventName,
        description: eventDescription,
        topic_id: eventType,
        latitude: location.lat,
        longitude: location.lng,
        user_id: user?.id,
      }
    ]);

  if (error) {
    console.error('Error adding event:', error);
  } else {
    console.log('Event added successfully:', data);
  }

    setEventName("");
    setEventType("");
    setLocation(center);
    setOpen(false);
  };


  const { user } = useUser();


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Enter the details for your new event and select its location on the
            map. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
          <form onSubmit={handleCreateEvent}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="event-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="event-type" className="text-right">
                  Type
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "col-span-3 justify-between",
                        !eventType && "text-muted-foreground"
                      )}
                    >
                      {eventType
                        ? topics?.find((type: any) => type?.value === eventType)
                            ?.label
                        : "Select event type"}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search event type..." />
                      <CommandEmpty>No event type found.</CommandEmpty>
                      <CommandList>
                        {topics?.map((type: any) => (
                          <CommandItem
                            key={type?.value}
                            onSelect={() => {
                              setEventType(
                                type?.value === eventType ? "" : type?.value
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                eventType === type?.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {type?.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Add a description field */}
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="topic-description" className="text-right">
                Description
              </Label>
              <Input
                id="topic-description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter event description"
              />
            </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">Location</Label>
                {/* <div className="col-span-3">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={location}
                      zoom={10}
                      onClick={onMapClick}
                      onLoad={onMapLoad}
                    >
                      <Marker position={location} />
                    </GoogleMap>
                  ) : (
                    <div>Loading map...</div>
                  )}
                </div> */}
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">Coordinates</Label>
                <div className="col-span-3">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Create Event
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
