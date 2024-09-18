import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AutoAddressCompleteComponent from "./AutoAddressCompleteComponent";
import dynamic from "next/dynamic";
import { createLocationAction } from "@/app/actions";

// Dynamically import the map component with ssr disabled
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

interface AddressObject {
  street_number: string;
  route: string;
  locality: string;
  administrative_area_level_1: string;
  country: string;
  postal_code: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
}

export default function LocationComponent({
  eventId,
  completed,
}: {
  eventId?: number;
  completed: (result?: any) => void;
}) {
  const formik = useFormik({
    initialValues: {
      venue: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      latitude: "",
      longitude: "",
    },
    validationSchema: Yup.object({
      venue: Yup.string(),
      addressLine1: Yup.string().required("Address line 1 is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string(),
      zipCode: Yup.string().required("Zip/Post Code is required"),
      latitude: Yup.number(),
      longitude: Yup.number(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("venue", values.venue);
      formData.append("address_line_1", values.addressLine1);
      formData.append("address_line_2", values.addressLine2);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("zip_postal_code", values.zipCode);
      formData.append("latitude", values.latitude.toString());
      formData.append("longitude", values.longitude.toString());
      formData.append("event_id", eventId?.toString() || "");

      await createLocationAction(formData);
      completed();
    },
  });

  const handleAddressSelect = (selectedAddress: AddressObject) => {
    formik.setFieldValue("venue", selectedAddress.formatted_address);
    formik.setFieldValue("addressLine1", selectedAddress.street_number);
    formik.setFieldValue("addressLine2", selectedAddress.route);
    formik.setFieldValue("country", selectedAddress.country);
    formik.setFieldValue("state", selectedAddress.administrative_area_level_1);
    formik.setFieldValue("city", selectedAddress.locality);
    formik.setFieldValue("zipCode", selectedAddress.postal_code);
    formik.setFieldValue("latitude", selectedAddress.latitude);
    formik.setFieldValue("longitude", selectedAddress.longitude);
    console.log("Selected address:", selectedAddress);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Where is your event taking place?*</CardTitle>
        <p className="text-sm text-gray-500">
          Add a venue to your event to tell your attendees where to join the
          event.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <MapWithNoSSR
              setPosition={(position) => {
                formik.setFieldValue("latitude", position.lat);
                formik.setFieldValue("longitude", position.lng);
              }}
              position={
                formik.values.latitude && formik.values.longitude
                  ? {
                      lat: parseFloat(formik.values.latitude),
                      lng: parseFloat(formik.values.longitude),
                    }
                  : { lat: 0, lng: 0 }
              }
            />
          </div>

          <div className="space-y-4">
            <div className="mt-4">
              <Label htmlFor="venue">Venue</Label>
              <AutoAddressCompleteComponent
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                onAddressSelect={(address) => {
                  handleAddressSelect(address);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address line</Label>
                <Input
                  id="addressLine1"
                  {...formik.getFieldProps("addressLine1")}
                />
                {formik.touched.addressLine1 && formik.errors.addressLine1 && (
                  <div className="text-red-500">
                    {formik.errors.addressLine1}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="addressLine2">Address line 2</Label>
                <Input
                  id="addressLine2"
                  {...formik.getFieldProps("addressLine2")}
                />
                {formik.touched.addressLine2 && formik.errors.addressLine2 && (
                  <div className="text-red-500">
                    {formik.errors.addressLine2}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formik.values.country}
                  onValueChange={(value) =>
                    formik.setFieldValue("country", value)
                  }
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.country && formik.errors.country && (
                  <div className="text-red-500">{formik.errors.country}</div>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...formik.getFieldProps("state")} />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City/Suburb</Label>
                <Input id="city" {...formik.getFieldProps("city")} />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-red-500">{formik.errors.city}</div>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip/Post Code</Label>
                <Input id="zipCode" {...formik.getFieldProps("zipCode")} />
                {formik.touched.zipCode && formik.errors.zipCode && (
                  <div className="text-red-500">{formik.errors.zipCode}</div>
                )}
              </div>
            </div>
          </div>

          <Button className="mt-3" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
