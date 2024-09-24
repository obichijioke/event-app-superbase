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
import useErrorHandler from "@/hooks/useErrorHandler";
import useSuccessHandler from "@/hooks/useSuccessHandler";
interface TicketFormProps {
  eventId: string;
}

export default function TicketForm({ eventId }: TicketFormProps) {
  const [unlimitedTotal, setUnlimitedTotal] = useState(true);
  const [unlimitedPerCustomer, setUnlimitedPerCustomer] = useState(false);
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(false);
  const handleError = useErrorHandler();
  const handleSuccess = useSuccessHandler();

  const formik = useFormik({
    initialValues: {
      name: "",
      quantity: "",
      tickets_per_customer: "",
      ticketOrder: "1",
      description: "",
      price: "",
      discount_percentage: "",
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("event_id", eventId);
      formData.append("name", values.name);
      formData.append("quantity", values.quantity);
      formData.append("tickets_per_customer", values.tickets_per_customer);
      formData.append("ticketOrder", values.ticketOrder);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("unlimitedTotal", unlimitedTotal.toString());
      formData.append("unlimitedPerCustomer", unlimitedPerCustomer.toString());
      formData.append("earlyBirdDiscount", earlyBirdDiscount.toString());
      if (earlyBirdDiscount) {
        formData.append("discount_percentage", values.discount_percentage);
      }

      const response = await createTicketAction(formData);

      if (response.error) {
        handleError(response.error);
      } else {
        handleSuccess("Ticket created successfully");
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
            <Label htmlFor="name">Ticket Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="Event Ticket Name"
              onChange={formik.handleChange}
              value={formik.values.name}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ticket Restrictions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quantity">
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
                  id="quantity"
                  name="quantity"
                  placeholder="Enter Total Tickets"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  className="mt-2"
                  required={!unlimitedTotal}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tickets_per_customer">
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
                id="tickets_per_customer"
                name="tickets_per_customer"
                placeholder="Enter Maximum Tickets Per Customer"
                value={formik.values.tickets_per_customer}
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
            <Label htmlFor="description">Ticket Description*</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description will go here"
              onChange={formik.handleChange}
              value={formik.values.description}
              required
            />
          </div>

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
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="earlyBirdDiscount"
                checked={earlyBirdDiscount}
                onCheckedChange={setEarlyBirdDiscount}
              />
              <Label htmlFor="discount_percentage">
                I want to offer early bird discount
              </Label>
            </div>
            {earlyBirdDiscount && (
              <div className="mt-2">
                <Label htmlFor="discount_percentage">
                  Early Bird Discount Percentage
                </Label>
                <Input
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  placeholder="Enter discount percentage"
                  value={formik.values.discount_percentage}
                  onChange={formik.handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
            )}
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
