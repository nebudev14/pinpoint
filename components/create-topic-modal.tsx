"use client";

import { useState } from "react";
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
import { CalendarPlus, Check, ChevronsUpDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Dispatch, SetStateAction } from "react";


export default function CreateTopicModal({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  // const [open, setOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState(""); 


  console.log('CREATING NEW TOPIC');

  async function handleCreatePin(e: React.FormEvent){
    console.log("REACHED")
    e.preventDefault();
    // Here you would typically send the data to your backend or state management system
    console.log("Topic created:", { topicName, topicDescription });
    setOpen(false);

    const { data, error } = await supabase
    .from('topics') // Replace with your actual table name
    .insert([
      {
        name: topicName,
        description: topicDescription,
        user_id: user?.id,
      }
    ]);

  if (error) {
    console.error('Error adding topic:', error);
  } else {
    console.log('Topic added successfully:', data);
  }

    // Reset form
    setTopicName("");
    setTopicDescription("");
  };

  const { user } = useUser();
  console.log(user?.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Fill in the details for your new topic. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreatePin}>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-name" className="text-right">
                Name
              </Label>
              <Input
                id="topic-name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="col-span-3"
                placeholder="Enter topic name"
              />
            </div>
            {/* Add a description field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-description" className="text-right">
                Description
              </Label>
              <Input
                id="topic-description"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                className="col-span-3"
                placeholder="Enter topic description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Topic</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
