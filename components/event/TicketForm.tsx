import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

export default function TicketTypeForm() {
  const [unlimitedTotal, setUnlimitedTotal] = useState(true);
  const [totalTickets, setTotalTickets] = useState("");
  const [unlimitedPerCustomer, setUnlimitedPerCustomer] = useState(false);
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(false);
  const [maxPerCustomer, setMaxPerCustomer] = useState("");
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Ticket Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ticketName">Ticket Name*</Label>
          <Input id="ticketName" placeholder="Event Ticket Name" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ticket Restrictions</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="totalTickets">
                Total number of tickets available
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="totalTickets"
                  checked={unlimitedTotal}
                  onCheckedChange={setUnlimitedTotal}
                />
                <span>Unlimited</span>
              </div>
            </div>
            {!unlimitedTotal && (
              <Input
                type="number"
                id="totalTicketsInput"
                placeholder="Enter Total Tickets"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="maxPerCustomer">
              Maximum number of tickets for each customer
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="maxPerCustomer"
                checked={unlimitedPerCustomer}
                onCheckedChange={setUnlimitedPerCustomer}
              />
              <span>Unlimited</span>
            </div>
          </div>
          {!unlimitedPerCustomer && (
            <Input
              type="number"
              id="maxPerCustomerInput"
              placeholder="Enter Maximum Tickets Per Customer"
              value={maxPerCustomer}
              onChange={(e) => setMaxPerCustomer(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketOrder">Ticket Order*</Label>
          <Select>
            <SelectTrigger id="ticketOrder">
              <SelectValue placeholder="1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketDescription">Ticket Description*</Label>
          <Textarea
            id="ticketDescription"
            placeholder="Description will go here"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Variations (1)</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input id="price" placeholder="Price" type="number" />
            </div>
            <div>
              <Label htmlFor="variationName">Variation Name *</Label>
              <Input id="variationName" placeholder="Variation Name" />
            </div>
            <div className="flex items-end">
              <Button variant="destructive" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="earlyBirdDiscount"
              checked={earlyBirdDiscount}
              onCheckedChange={setEarlyBirdDiscount}
            />
            <Label htmlFor="earlyBirdDiscount">
              I want to offer early bird discount
            </Label>
          </div>
          <p className="text-sm text-gray-500">
            Enabling this discount lets your attendees get all the regular
            tickets features at a discounted price.
            <a href="#" className="text-blue-500 hover:underline ml-1">
              Learn more
            </a>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-green-500 hover:bg-green-600">Save</Button>
      </CardFooter>
    </Card>
  );
}
