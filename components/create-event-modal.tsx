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


export default function CreateEventModal({ topics }: { topics: any }) {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);

  console.log(topics);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend or state management system
    console.log("Event created:", { eventName, eventType });
    setOpen(false);
    // Reset form
    setEventName("");
    setEventType("");
  };

  const eventTypes = topics.map((topic: any) => ({
    value: topic.id,
    label: topic.name,
  }));


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details for your new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                placeholder="Enter event name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-type" className="text-right">
                Type
              </Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="col-span-3 justify-between"
                  >
                    {eventType
                      ? eventTypes.find((type: any) => type.value === eventType)
                          ?.label
                      : "Select event type..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search event type..." />
                    <CommandEmpty>No event type found.</CommandEmpty>
                    <CommandList>
                      {eventTypes.map((type: any  ) => (
                        <CommandItem
                          key={type.value}
                          onSelect={() => {
                            setEventType(
                              type.value === eventType ? "" : type.value
                            );
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              eventType === type.value
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {type.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
