import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";

interface AddressComponentType {
  long_name: string;
  short_name: string;
  types: string[];
}

interface PlaceType {
  address_components: AddressComponentType[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

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

interface AddressAutocompleteProps {
  apiKey: string;
  onAddressSelect: (address: AddressObject) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  apiKey,
  onAddressSelect,
}) => {
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (libraryLoaded && inputRef.current) {
      autoCompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          fields: ["address_components", "formatted_address", "geometry"],
        }
      );

      autoCompleteRef.current.addListener("place_changed", handlePlaceSelect);
    }
  }, [libraryLoaded]);

  const handlePlaceSelect = () => {
    const addressObject = autoCompleteRef.current?.getPlace() as PlaceType;

    if (addressObject && addressObject.geometry) {
      const addressComponents = addressObject.address_components;
      const formattedAddress = addressObject.formatted_address;
      const latitude = addressObject.geometry.location.lat();
      const longitude = addressObject.geometry.location.lng();

      const addressData: AddressObject = {
        street_number: "",
        route: "",
        locality: "",
        administrative_area_level_1: "",
        country: "",
        postal_code: "",
        formatted_address: formattedAddress,
        latitude,
        longitude,
      };

      addressComponents.forEach((component) => {
        const type = component.types[0] as keyof Omit<
          AddressObject,
          "latitude" | "longitude" | "formatted_address"
        >;
        if (type in addressData) {
          addressData[type] = component.long_name;
        }
      });

      onAddressSelect(addressData);
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => setLibraryLoaded(true)}
      />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter your address"
        className="w-full p-2 border border-gray-300 rounded"
      />
    </>
  );
};

export default AddressAutocomplete;
