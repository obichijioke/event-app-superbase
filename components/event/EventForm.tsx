"use client";
import { useState, useEffect } from "react";
import { createEventAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/eventTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Bold,
  Italic,
  Link,
  List,
  Image as ImageIcon,
} from "lucide-react";
import { getCategories } from "@/app/actions";

export default function EventForm() {
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("1h");
  const [eventDescription, setEventDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm">
              1
            </span>
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event-name">Give your event a name.*</Label>
            <p className="text-sm text-gray-500">
              See how your name appears on the event page and a list of all
              places where your event name will be used.{" "}
              <a href="#" className="text-green-600 hover:underline">
                Learn more
              </a>
            </p>
            <Input
              id="event-name"
              placeholder="Enter event name here"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Choose a category for your event.*</Label>
            <p className="text-sm text-gray-500">
              Choosing relevant categories helps to improve the discoverability
              of your event.{" "}
              <a href="#" className="text-green-600 hover:underline">
                Learn more
              </a>
            </p>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
                
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>When is your event?*</Label>
            <p className="text-sm text-gray-500">
              Tell your attendees when your event starts so they can get ready
              to attend.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Event Date*</Label>
                <div className="relative">
                  <Input
                    id="event-date"
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <div className="relative">
                  <Input
                    id="event-time"
                    type="text"
                    placeholder="10:00 AM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-duration">Duration</Label>
                <Select value={eventDuration} onValueChange={setEventDuration}>
                  <SelectTrigger id="event-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30m">30m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="2h">2h</SelectItem>
                    <SelectItem value="3h">3h</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add a few images to your event banner.</Label>
            <p className="text-sm text-gray-500">
              Upload colorful and vibrant images as the banner for your event!
              See how beautiful images help your event details page.{" "}
              <a href="#" className="text-green-600 hover:underline">
                Learn more
              </a>
            </p>
            <div className="relative h-48 bg-blue-600 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold">
                B
              </div>
              <Button className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100">
                Change Image
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">
              Please describe your event.
            </Label>
            <p className="text-sm text-gray-500">
              Write a few words below to describe your event and provide any
              extra information such as schedules, itinerary or any special
              instructions required to attend your event.
            </p>
            <div className="border rounded-md">
              <div className="flex items-center gap-1 p-2 border-b">
                <select className="text-sm border-none bg-transparent">
                  <option>Paragraph</option>
                </select>
                <Button variant="ghost" size="sm">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                id="event-description"
                placeholder="Start typing here..."
                className="border-none focus:ring-0"
                rows={5}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
