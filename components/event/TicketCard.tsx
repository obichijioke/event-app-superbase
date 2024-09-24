import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, Users, ShoppingCart, MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  ticket: {
    name: string;
    price: number;
    date: string;
    totalTickets: string | number;
    ticketLimit: string | number;
    discount: string;
    isActive: boolean;
  };
  index: number;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, index }) => {
  return (
    <Card key={index} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <Ticket className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold">
                {ticket.name} - ${ticket.price.toFixed(2)}
              </h3>
              <p className="text-sm text-gray-500">{ticket.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-1 rounded-full">
              <Ticket className="h-4 w-4 text-red-500" />
            </div>
            <Switch checked={ticket.isActive} />
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Total tickets</p>
              <p className="text-sm">{ticket.totalTickets}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Ticket limit per customer</p>
              <p className="text-sm">{ticket.ticketLimit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Discount</p>
              <p className="text-sm">{ticket.discount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
