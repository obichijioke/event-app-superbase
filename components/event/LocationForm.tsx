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
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import AutoAddressCompleteComponent from "./AutoAddressCompleteComponent";

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

export default function LocationComponent() {
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
      venue: Yup.string().required("Venue is required"),
      addressLine1: Yup.string().required("Address line 1 is required"),
      country: Yup.string().required("Country is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      zipCode: Yup.string().required("Zip/Post Code is required"),
      latitude: Yup.number(),
      longitude: Yup.number(),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      // Add your form submission logic here
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
          <AutoAddressCompleteComponent
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            onAddressSelect={(address) => {
              handleAddressSelect(address);
            }}
          />

          <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
              Map will be displayed here
            </div>
            <div className="absolute top-2 left-2 bg-white rounded shadow p-1">
              <Button variant="ghost" size="icon">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
            >
              <Maximize className="h-4 w-4 mr-2" />
              View larger map
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="venue">Venue*</Label>
              <Input id="venue" {...formik.getFieldProps("venue")} />
              {formik.touched.venue && formik.errors.venue && (
                <div className="text-red-500">{formik.errors.venue}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address line 1*</Label>
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
                <Label htmlFor="addressLine2">Address line 2*</Label>
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
                <Label htmlFor="country">Country*</Label>
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
                <Label htmlFor="state">State*</Label>
                <Input id="state" {...formik.getFieldProps("state")} />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500">{formik.errors.state}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City/Suburb*</Label>
                <Input id="city" {...formik.getFieldProps("city")} />
                {formik.touched.city && formik.errors.city && (
                  <div className="text-red-500">{formik.errors.city}</div>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">Zip/Post Code*</Label>
                <Input id="zipCode" {...formik.getFieldProps("zipCode")} />
                {formik.touched.zipCode && formik.errors.zipCode && (
                  <div className="text-red-500">{formik.errors.zipCode}</div>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
