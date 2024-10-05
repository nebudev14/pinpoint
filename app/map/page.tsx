"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Map from "@/components/ui/map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Search, ChevronUp, Calendar, Clock } from "lucide-react"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false)

  // Mock data for upcoming events
  const upcomingEvents = [
    { id: 1, title: "Community Picnic", date: "2023-07-15", time: "12:00 PM", location: "Central Park" },
    { id: 2, title: "Local Art Exhibition", date: "2023-07-18", time: "6:00 PM", location: "City Gallery" },
    { id: 3, title: "Farmers Market", date: "2023-07-20", time: "9:00 AM", location: "Main Street" },
  ]

  return (
    <div className="flex flex-col h-screen ">
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <h1 className="text-xl font-bold ">Community Events</h1>
        <Button variant="ghost" size="icon">
          <MapPin className="h-6 w-6" />
          <span className="sr-only">My Location</span>
        </Button>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {/* Map component */}
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <Map />
        </div>

        {/* Floating search bar */}
        <div className="absolute top-4 left-0 right-0 px-4">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 pr-4 py-2 w-full bg-background/90 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        {/* Floating Action Button (FAB) for adding new events */}
        <div className="absolute bottom-16 right-4">
          {isFabMenuOpen && (
            <div className="mb-4 space-y-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => console.log("Add Pin clicked")}
              >
                Add Pin
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => console.log("Add Topic clicked")}
              >
                Add Topic
              </Button>
            </div>
          )}
          <Button
            className="rounded-full shadow-lg"
            size="icon"
            onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add New Event</span>
          </Button>
        </div>

        {/* Slide-up menu */}
        <div className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'}`}>
          <div 
            className="flex justify-center p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronUp className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </div>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}