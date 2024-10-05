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
    <div className="flex flex-col h-screen">
      <header className="z-10 flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <h1 className="text-xl font-bold">Community Events</h1>
        <Button variant="ghost" size="icon">
          <MapPin className="h-6 w-6" />
          <span className="sr-only">My Location</span>
        </Button>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Map component */}
        <div className="absolute inset-0">
          <Map />
        </div>

        {/* Integrated search bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 w-full bg-white bg-opacity-90 text-black placeholder:text-gray-500 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                WebkitAppearance: 'none',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Integrated Floating Action Button (FAB) for adding new events */}
        <div className="absolute bottom-20 left-4 z-10">
          <div className="relative">
            <Button
              className="rounded-full shadow-lg bg-white bg-opacity-90 text-primary hover:bg-primary hover:text-primary-foreground"
              size="icon"
              onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add New Event</span>
            </Button>
            {isFabMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 space-y-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-md">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => console.log("Add Pin clicked")}
                >
                  Add Pin
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => console.log("Add Topic clicked")}
                >
                  Add Topic
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Slide-up menu */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg transition-transform duration-300 ease-in-out transform ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'
          } z-20`}
        >
          <div 
            className="flex justify-center p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronUp className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </div>
          <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold mb-2 overflow-hidden whitespace-nowrap">
              {isMenuOpen ? 'Upcoming Events' : ''}
            </h2>
            <div className={`space-y-4 overflow-y-auto transition-all duration-300 ${isMenuOpen ? 'max-h-[50vh]' : 'max-h-0'}`}>
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