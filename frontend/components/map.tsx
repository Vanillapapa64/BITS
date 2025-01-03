"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Location } from "../types/location";

interface MapComponentProps {
  locations: Location[];
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

export const DEFAULT_CENTER = { lat: 0, lng: 0 };
export const DEFAULT_ZOOM = 2;

export default function MapComponent({
  locations,
  userLocation,
  mapCenter,
  zoom,
  isLocating,
  locationError,
}: {
  locations: MapComponentProps["locations"];
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  zoom: number;
  isLocating: boolean;
  locationError: string | null;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const mapOptions = useMemo(
    () => ({
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      zoomControl: false,
      styles: [
        // General geometry and labels
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] }, // Light gray background
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] }, // Hides icons for a cleaner map
        { elementType: "labels.text.fill", stylers: [{ color: "#4f4f4f" }] }, // Dark gray for text
        { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] }, // White outline for text

        // Administrative - National Borders
        {
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [
            { color: "#9e9e9e" }, // Medium gray for borders
            { weight: 1.5 }, // Slightly thicker for visibility
          ],
        },
        {
          featureType: "administrative.country",
          elementType: "labels.text.fill",
          stylers: [{ color: "#333333" }], // Dark gray for country labels
        },

        // Administrative - Land Parcels
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#a3a3a3" }], // Neutral gray for administrative text
        },

        // Points of Interest (POI)
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eaeaea" }], // Slightly darker gray for POI areas
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#7c7c7c" }], // Medium gray for POI text
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#d9e9d9" }], // Very soft green hint for parks
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b8e6b" }], // Muted green for park labels
        },

        // Roads
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }], // White for roads
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8c8c8c" }], // Light gray for arterial road labels
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#e0e0e0" }], // Very light gray for highways
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#7a7a7a" }], // Medium gray for highway labels
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#a6a6a6" }], // Neutral gray for local roads
        },

        // Transit
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#cccccc" }], // Light gray for transit lines
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#eaeaea" }], // Light gray for transit stations
        },

        // Water
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#d0e7f9" }], // Very soft blue for water
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#758596" }], // Muted blue-gray for water labels
        },
      ],
    }),
    []
  );

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="space-y-4 h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={mapOptions}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: 0, // Use a simple circle
              scale: 7,
              fillColor: "#4285f4",
              fillOpacity: 1,
              strokeColor: "#BBD5FF",
              strokeWeight: 3,
            }}
          />
        )}

        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.place_id}
            position={location.geometry.location}
            icon="/marker.svg"
            onClick={() => handleMarkerClick(location)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={selectedLocation.geometry.location}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2">
              <h3 className="font-bold">{selectedLocation.name}</h3>
              <p className="text-sm mt-1">{selectedLocation.vicinity}</p>
              {selectedLocation.rating && (
                <p className="text-sm mt-1">
                  Rating: {selectedLocation.rating} (
                  {selectedLocation.user_ratings_total} reviews)
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
