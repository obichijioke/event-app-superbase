import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { LatLng } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export default function MapComponent({
  setPosition,
  position,
}: {
  setPosition: (position: LatLng) => void;
  position: { lat: number; lng: number };
}) {
  function LocationMarker() {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo([position.lat, position.lng], map.getZoom());
      }
    }, [position, map]);

    return position ? (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null;
  }
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
      {/* Add your LocationMarker component here if needed */}
    </MapContainer>
  );
}
