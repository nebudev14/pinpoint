"use client";

import { useState, Dispatch, SetStateAction, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { CommandList } from "cmdk";
import { cn } from "@/utils/cn";
import { useUser } from "@clerk/nextjs";

export default function CreatePinModal({ topics, open, setOpen }: { topics: any, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const center = {
    lat: 40.7128,
    lng: -74.006,
  };

  const [pinName, setPinName] = useState("");
  const [pinType, setPinType] = useState("");
  const [pinDescription, setPinDescription] = useState(""); 
  const [location, setLocation] = useState(center);

  const { user } = useUser();

  async function handleCreatePin(e: React.FormEvent){
    e.preventDefault();
    console.log("Creating pin:", {
      name: pinName,
      type: pinType,
      description: pinDescription,
      location,
    });

    const { data, error } = await supabase
      .from('pins')
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
      console.error('Error adding pin:', error);
    } else {
      console.log('Pin added successfully:', data);
    }

    setPinName("");
    setPinType("");
    setPinDescription("");
    setLocation(center);
    setOpen(false);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-background border-t border-border rounded-t-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Pin</h2>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            &times;
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Enter the details for your new pin and select its location on the map. Click create when you're done.
        </p>
        <form onSubmit={handleCreatePin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin-name">Name</Label>
            <Input
              id="pin-name"
              value={pinName}
              onChange={(e) => setPinName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pin-type">Type</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !pinType && "text-muted-foreground"
                  )}
                >
                  {pinType
                    ? topics?.find((type: any) => type?.value === pinType)
                        ?.label
                    : "Select pin type"}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search pin type..." />
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
          <div className="space-y-2">
            <Label htmlFor="pin-description">Description</Label>
            <Input
              id="pin-description"
              value={pinDescription}
              onChange={(e) => setPinDescription(e.target.value)}
              placeholder="Enter pin description"
            />
          </div>
          <div className="space-y-2">
            <Label>Coordinates</Label>
            <p className="text-sm text-muted-foreground">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          </div>
          <Button type="submit" className="w-full">
            Create Pin
          </Button>
        </form>
      </div>
    </div>
  );
}