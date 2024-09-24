import React, { useState } from "react";
import { useFormik } from "formik";
import { createTicketAction } from "@/app/actions";
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

interface TicketFormProps {
  eventId: string;
}

export default function TicketForm({ eventId }: TicketFormProps) {
  const [unlimitedTotal, setUnlimitedTotal] = useState(true);
  const [unlimitedPerCustomer, setUnlimitedPerCustomer] = useState(false);
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(false);

  const formik = useFormik({
    initialValues: {
      ticketName: "",
      totalTickets: "",
      maxPerCustomer: "",
      ticketOrder: "1",
      ticketDescription: "",
      price: "",
      variationName: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("event_id", eventId);
      formData.append("ticketName", values.ticketName);
      formData.append("totalTickets", values.totalTickets);
      formData.append("maxPerCustomer", values.maxPerCustomer);
      formData.append("ticketOrder", values.ticketOrder);
      formData.append("ticketDescription", values.ticketDescription);
      formData.append("price", values.price);
      formData.append("variationName", values.variationName);
      formData.append("unlimitedTotal", unlimitedTotal.toString());
      formData.append("unlimitedPerCustomer", unlimitedPerCustomer.toString());
      formData.append("earlyBirdDiscount", earlyBirdDiscount.toString());

      const response = await createTicketAction(formData);

      if (response.error) {
        // Handle error (e.g., display a notification)
        console.error(response.error);
      } else {
        // Handle success (e.g., display a success message and reset form)
        console.log("Ticket created successfully:", response.data);
        resetForm();
        setUnlimitedTotal(true);
        setUnlimitedPerCustomer(false);
        setEarlyBirdDiscount(false);
      }
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={formik.handleSubmit}>
        <CardHeader>
          <CardTitle>Create Ticket Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ticketName">Ticket Name*</Label>
            <Input
              id="ticketName"
              name="ticketName"
              placeholder="Event Ticket Name"
              onChange={formik.handleChange}
              value={formik.values.ticketName}
              required
            />
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
                    id="unlimitedTotal"
                    checked={unlimitedTotal}
                    onCheckedChange={setUnlimitedTotal}
                  />
                  <span>Unlimited</span>
                </div>
              </div>
              {!unlimitedTotal && (
                <Input
                  type="number"
                  id="totalTickets"
                  name="totalTickets"
                  placeholder="Enter Total Tickets"
                  value={formik.values.totalTickets}
                  onChange={formik.handleChange}
                  className="mt-2"
                  required={!unlimitedTotal}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maxPerCustomer">
                Maximum number of tickets for each customer
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="unlimitedPerCustomer"
                  checked={unlimitedPerCustomer}
                  onCheckedChange={setUnlimitedPerCustomer}
                />
                <span>Unlimited</span>
              </div>
            </div>
            {!unlimitedPerCustomer && (
              <Input
                type="number"
                id="maxPerCustomer"
                name="maxPerCustomer"
                placeholder="Enter Maximum Tickets Per Customer"
                value={formik.values.maxPerCustomer}
                onChange={formik.handleChange}
                className="mt-2"
                required={!unlimitedPerCustomer}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticketOrder">Ticket Order*</Label>
            <Select
              name="ticketOrder"
              onValueChange={(value) =>
                formik.setFieldValue("ticketOrder", value)
              }
              value={formik.values.ticketOrder}
              required
            >
              <SelectTrigger>
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
              name="ticketDescription"
              placeholder="Description will go here"
              onChange={formik.handleChange}
              value={formik.values.ticketDescription}
              required
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
                <Input
                  id="price"
                  name="price"
                  placeholder="Price"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  required
                />
              </div>
              <div>
                <Label htmlFor="variationName">Variation Name *</Label>
                <Input
                  id="variationName"
                  name="variationName"
                  placeholder="Variation Name"
                  onChange={formik.handleChange}
                  value={formik.values.variationName}
                  required
                />
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
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button className="bg-green-500 hover:bg-green-600" type="submit">
            Save
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
