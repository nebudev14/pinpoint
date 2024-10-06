"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@supabase/supabase-js";

// const searchResults = [
//   { id: 1, title: "Home" },
//   { id: 2, title: "Products" },
//   { id: 3, title: "About Us" },
//   { id: 4, title: "Contact" },
//   { id: 5, title: "Blog" },
// ];

interface Topic {
  id: number;
  name: string;
  // Add any other fields that exist in your topics table
}

export default function DropdownSearch() {
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<typeof searchResults>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    async function fetchTopics() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("id, name")
          .order("name");

        if (error) throw error;

        setTopics(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setError("Failed to load topics. Please try again later.");
        setIsLoading(false);
      }
    }
    fetchTopics();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchResults = topics?.map((topic) => ({
    id: topic.id,
    title: topic.name,
  }));

  const filteredResults = searchResults?.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) &&
      !selectedItems.some((selected) => selected.id === item.id)
  );


  const handleSelectItem = (item: (typeof searchResults)[0]) => {
    setSelectedItems([...selectedItems, item]);
    setQuery("");
    inputRef.current?.focus();
  };

  const handleRemoveItem = (id: number) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };



  return (
    <div className="relative w-full max-w-sm mx-auto mt-8" ref={dropdownRef}>
      <div className="relative flex items-center w-full bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <div className="flex flex-wrap items-center gap-1 pl-10 pr-10 py-2 w-full min-h-[42px]">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="flex items-center gap-1 text-sm"
            >
              {item.title}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveItem(item.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {item.title}</span>
              </Button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedItems.length === 0 ? "Search..." : ""}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="flex-grow outline-none bg-transparent text-sm"
          />
        </div>
        {(query || selectedItems.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setSelectedItems([]);
              setIsOpen(false);
            }}
            className="absolute right-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear all</span>
          </Button>
        )}
      </div>

      <div
        className={`absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-10 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="py-1">
          {filteredResults.length === 0 ? (
            <li className="px-4 py-2 text-sm text-gray-500">
              No results found.
            </li>
          ) : (
            filteredResults.map((item) => (
              <li
                key={item.id}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectItem(item)}
              >
                {item.title}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
