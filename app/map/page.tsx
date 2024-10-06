"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopicSearch from "@/components/topic-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "@/components/ui/map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Plus,
  Search,
  ChevronUp,
  Calendar,
  Clock,
  FileText,
  ThumbsUp,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { MultiValue } from "react-select";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
import { motion, AnimatePresence } from "framer-motion";
import CreatePinModal from "@/components/create-event-modal"; // Ensure this import is present
import CreateTopicModal from "@/components/create-topic-modal";
import DropdownSearch from "@/components/dropdown-search";

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<
    MultiValue<{ value: number; label: string }>
  >([]);
  const [queriedPins, setQueriedPins] = useState<any[]>([]);
  const [isCreatePinModalOpen, setIsCreatePinModalOpen] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  // Mock data for each category
  const recommendedEvents = [
    {
      id: 1,
      title: "Tech Conference 2023",
      location: "San Francisco, CA",
      date: "2023-09-15",
      time: "09:00 AM",
      color: "bg-blue-50",
    },
    {
      id: 2,
      title: "Art Exhibition",
      location: "New York, NY",
      date: "2023-09-20",
      time: "10:00 AM",
      color: "bg-purple-50",
    },
  ];

  const upcomingEvents = [
    {
      id: 3,
      title: "Music Festival",
      location: "Austin, TX",
      date: "2023-10-01",
      time: "12:00 PM",
      color: "bg-green-50",
    },
    {
      id: 4,
      title: "Food & Wine Expo",
      location: "Chicago, IL",
      date: "2023-10-05",
      time: "11:00 AM",
      color: "bg-yellow-50",
    },
  ];

  const trendingEvents = [
    {
      id: 5,
      title: "Fashion Week",
      location: "Paris, France",
      date: "2023-09-25",
      time: "02:00 PM",
      color: "bg-pink-50",
    },
    {
      id: 6,
      title: "Gaming Convention",
      location: "Los Angeles, CA",
      date: "2023-10-10",
      time: "10:00 AM",
      color: "bg-indigo-50",
    },
  ];

  const [activeTab, setActiveTab] = useState("recommended");

  const renderEvents = (events: any[]) => (
    <div className="space-y-4">
      {events.map((event: any) => (
        <Card key={event.id} className={`overflow-hidden ${event.color}`}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">
              {event.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {event.location}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              {event.date}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              {event.time}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  async function handleSearchTopics(data: any) {
    // console.log("SEARCHING TOPICS");
    // e.preventDefault();
    console.log("Database Found Topics:", data);
    setQueriedPins(data);
  }
  // console.log(isCreatePinModalOpen)

  useEffect(() => {
    const fetchTopics = async () => {
      const { data, error } = await supabase.from("topics").select();

      if (error) {
        console.error("Error fetching topics:", error);
      } else {
        const eventTypes = data.map((topic: any) => ({
          value: topic.id,
          label: topic.name,
        }));

        setTopics(eventTypes);
      }
    };

    const fetchPins = async () => {
      const { data, error } = await supabase
        .from("pins")
        .select()
        .in("topic_id", [8, 6, 5, 7]);

      if (error) {
        console.error("Error fetching pins:", error);
      } else {
        setEvents(data);
      }
    };

    fetchPins();
    fetchTopics();
  }, [setTopics]);

  console.log("EVENTS");
  console.log(events);

  return (
    <div className="flex flex-col h-screen">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <h1 className="text-xl font-bold">PINPOINT</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCreatePinModalOpen(true)}
        >
          <MapPin className="w-6 h-6" />
          <span className="sr-only">My Location</span>
        </Button>
      </header>
      <div className="absolute z-10 top-20 left-4 right-4">
        <div className="relative">
          <TopicSearch onSearch={handleSearchTopics} />
          {/* <DropdownSearch /> */}
        </div>
      </div>
      <main className="relative flex-1">
        {/* Map component */}
        <div className="absolute inset-0 h-screen">
          <Map pins={queriedPins} />
        </div>

        <CreatePinModal
          topics={topics} // Ensure topics is defined or passed correctly
          open={isCreatePinModalOpen}
          setOpen={setIsCreatePinModalOpen}
        />

        <CreateTopicModal
          open={isCreateTopicModalOpen}
          setOpen={setIsCreateTopicModalOpen}
        />

        <div className="absolute z-10 top-20 left-4 right-4">
          <div className="relative">
            <Slider
              className="absolute"
              defaultValue={[33]}
              max={100}
              step={1}
            />
          </div>
        </div>

        {/* Floating Action Button (FAB) for adding new events */}
        <div className="absolute right-4">
          <div className="relative flex items-end justify-center h-screen pb-20">
            <motion.div
              className="relative"
              initial={false}
              animate={isFabMenuOpen ? "open" : "closed"}
            >
              <motion.div
                className="flex flex-col items-center overflow-hidden rounded-full shadow-lg bg-primary text-primary-foreground"
                variants={{
                  open: { height: "auto" },
                  closed: { height: 56 },
                }}
              >
                <AnimatePresence>
                  {isFabMenuOpen && (
                    <motion.div
                      className="flex flex-col py-2 space-y-2"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        className="p-2 text-white bg-blue-500 rounded-full"
                        onClick={() =>
                          setIsCreatePinModalOpen(!isCreatePinModalOpen)
                        }
                      >
                        <MapPin size={20} />
                      </button>
                      <button
                        className="p-2 text-white bg-green-500 rounded-full"
                        onClick={() =>
                          setIsCreateTopicModalOpen(!isCreateTopicModalOpen)
                        }
                      >
                        <FileText size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  className="flex items-center justify-center p-4 rounded-full bg-primary text-primary-foreground"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
                >
                  <motion.div
                    animate={{ rotate: isFabMenuOpen ? 225 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus size={24} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
          {/* <Button
            className="rounded-full shadow-lg"
            size="icon"
            onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          >
            <Plus className="w-6 h-6" />
            <span className="sr-only">Add New Event</span>
          </Button> */}
        </div>

        {/* Slide-up menu */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${
            isMenuOpen ? "translate-y-0" : "translate-y-[calc(100%-2.5rem)]"
          } z-20`}
        >
          <div
            className="flex justify-center p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronUp
              className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="w-full max-w-md mx-auto p-4 bg-background">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="recommended" className="text-xs py-2">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    For You
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="text-xs py-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="text-xs py-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Trending
                  </TabsTrigger>
                </TabsList>
                <div className="max-h-[calc(100vh-160px)] overflow-y-auto px-1">
                  <TabsContent value="recommended">
                    <h2 className="mb-4 text-xl font-bold flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Recommended for you
                    </h2>
                    {renderEvents(recommendedEvents)}
                  </TabsContent>
                  <TabsContent value="upcoming">
                    <h2 className="mb-4 text-xl font-bold flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Upcoming Events
                    </h2>
                    {renderEvents(
                      events.slice(0, 2).map((event, index) => {
                        return {
                          title: event.name,
                          location: event.latitude + ", " + event.longitude,
                          date:
                            event.datetime !== null
                              ? event.datetime!.split("T")[0]
                              : "N/A",
                          time:
                            event.datetime !== null
                              ? event.datetime!.split("T")[1]
                              : "N/A",
                          color: index === 0 ? "bg-green-50" : "bg-yellow-50",
                        };
                      })
                    )}
                  </TabsContent>
                  <TabsContent value="trending">
                    <h2 className="mb-4 text-xl font-bold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Trending
                    </h2>
                    {renderEvents(trendingEvents)}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
