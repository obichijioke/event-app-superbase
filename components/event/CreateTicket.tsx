import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Ticket,
  Users,
  ShoppingCart,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import TicketTypeForm from "./TicketForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TicketCard from "./TicketCard";
interface TicketType {
  name: string;
  price: number;
  date: string;
  totalTickets: string | number;
  ticketLimit: string | number;
  discount: string;
  isActive: boolean;
}

const ticketTypes: TicketType[] = [
  {
    name: "New Small",
    price: 10.0,
    date: "May 3, 2022",
    totalTickets: 20,
    ticketLimit: 2,
    discount: "5%",
    isActive: true,
  },
  {
    name: "Group",
    price: 10.0,
    date: "May 3, 2022",
    totalTickets: "Unlimited",
    ticketLimit: "Unlimited",
    discount: "2%",
    isActive: true,
  },
];

export default function CreateTicket() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Tickets
        </CardTitle>
        <p className="text-sm text-gray-500">Let's create tickets!</p>
        <p className="text-sm text-gray-500">
          Create tickets for your event by clicking on the 'Add Tickets' button
          below.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tickets (3)</h2>
          <Button
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={() => setIsOpen(true)}
          >
            Add Tickets
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {ticketTypes.map((ticket, index) => (
          <TicketCard key={index} index={index} ticket={ticket} />
        ))}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Next
          </Button>
        </div>
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl mx-auto">
          <TicketTypeForm eventId={eventId} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
