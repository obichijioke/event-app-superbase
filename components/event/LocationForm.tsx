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

export default function LocationComponent() {
  const [address, setAddress] = useState({
    venue: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Where is your event taking place?*</CardTitle>
        <p className="text-sm text-gray-500">
          Add a venue to your event to tell your attendees where to join the
          event.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Input
              id="venue"
              name="venue"
              value={address.venue}
              onChange={handleInputChange}
              placeholder="Enter venue name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addressLine1">Address line 1*</Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleInputChange}
                placeholder="Enter address line 1"
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address line 2*</Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleInputChange}
                placeholder="Enter address line 2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country*</Label>
              <Select
                value={address.country}
                onValueChange={(value) =>
                  setAddress((prev) => ({ ...prev, country: value }))
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
            </div>
            <div>
              <Label htmlFor="state">State*</Label>
              <Input
                id="state"
                name="state"
                value={address.state}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City/Suburb*</Label>
              <Input
                id="city"
                name="city"
                value={address.city}
                onChange={handleInputChange}
                placeholder="Enter city or suburb"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip/Post Code*</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={address.zipCode}
                onChange={handleInputChange}
                placeholder="Enter zip or post code"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
