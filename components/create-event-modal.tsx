"use client";

import { useState } from "react";
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

export default function CreateEventModal({ topics }: { topics: any }) {
  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = {
    lat: 40.7128,
    lng: -74.006,
  };

  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState(center);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // Replace with your actual API key
  });

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

  const handleCreateEvent = () => {
    console.log("Creating event:", {
      name: eventName,
      type: eventType,
      location,
    });
    setEventName("");
    setEventType("");
    setLocation(center);
    setOpen(false);
  };

  const eventTypes = topics.map((topic: any) => ({
    value: topic.id,
    label: topic.name,
  }));

  const { user } = useUser();
  console.log(user?.id);

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
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
                    ? eventTypes.find((type: any) => type.value === eventType)
                        ?.label
                    : "Select event type"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search event type..." />
                  <CommandEmpty>No event type found.</CommandEmpty>
                  <CommandList>
                    {eventTypes.map((type: any) => (
                      <CommandItem
                        key={type.value}
                        onSelect={() => {
                          setEventType(
                            type.value === eventType ? "" : type.value
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            eventType === type.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Location</Label>
            <div className="col-span-3">
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
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Coordinates</Label>
            <div className="col-span-3">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
