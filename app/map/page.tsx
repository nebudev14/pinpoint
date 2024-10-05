"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plus, Search, ChevronUp, Calendar, Clock } from "lucide-react"

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        {/* Placeholder for the map component */}
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">Map Component Goes Here</span>
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

        {/* Floating Action Button for adding new events */}
        <Button
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add New Event</span>
        </Button>

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