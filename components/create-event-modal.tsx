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

export default function CreatePinModal({ topics, open, setOpen }: { topics: any, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
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

  const [pinName, setpinName] = useState("");
  const [pinType, setPinType] = useState("");
  const [pinDescription, setpinDescription] = useState(""); 
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

  async function handleCreatePin(e: React.FormEvent){
    console.log("CREATING NEW EVENT");
    e.preventDefault();
    console.log("Creating event:", {
      name: pinName,
      type: pinType,
      description: pinDescription,
      location,
    });

  const { data, error } = await supabase
    .from('pins') // Replace with your actual table name
    .insert([
      {
        name: pinName,
        description: pinDescription,
        topic_id: pinType,
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

    setpinName("");
    setPinType("");
    setLocation(center);
    setOpen(false);
  };


  const { user } = useUser();


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Pin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Pin</DialogTitle>
          <DialogDescription>
            Enter the details for your new pin and select its location on the
            map. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
          <form onSubmit={handleCreatePin}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="event-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="event-name"
                  value={pinName}
                  onChange={(e) => setpinName(e.target.value)}
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
                        !pinType && "text-muted-foreground"
                      )}
                    >
                      {pinType
                        ? topics?.find((type: any) => type?.value === pinType)
                            ?.label
                        : "Select event type"}
                      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search event type..." />
                      <CommandEmpty>No pin category found.</CommandEmpty>
                      <CommandList>
                        {topics?.map((type: any) => (
                          <CommandItem
                            key={type?.value}
                            onSelect={() => {
                              setPinType(
                                type?.value === pinType ? "" : type?.value
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                pinType === type?.value
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
                value={pinDescription}
                onChange={(e) => setpinDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter pin description"
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
                Create Pin
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
