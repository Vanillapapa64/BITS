"use client";
import MapComponent, { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GetLocationFromCookies,
  SetLocationCookies,
} from "@/server/locationCookies";
import { Location } from "@/types/location";
import { useEffect, useState } from "react";

export default function CallPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [radius, setRadius] = useState(10000);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData(location: { lat: number; lng: number }) {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${api}/api/v1/maps/searchhospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLat: location.lat.toString(),
          userLng: location.lng.toString(),
          radius: radius,
          keyword: searchKeyword,
        }),
      });

      const data = await response.json();

      setLocations(data.answer);
    }
    // User Location

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(12);
          setIsLocating(false);
          fetchData({ lat: latitude, lng: longitude });
          SetLocationCookies({ latitude, longitude });
        },
        (error) => {
          // Get location from cookies
          (async () => {
            const oldLocation = await GetLocationFromCookies();

            console.log(oldLocation);
            if (oldLocation) {
              setUserLocation({
                lat: oldLocation.userLat,
                lng: oldLocation.userLng,
              });
              setMapCenter({
                lat: oldLocation.userLat,
                lng: oldLocation.userLng,
              });
              setZoom(12);
              setIsLocating(false);
              fetchData({ lat: oldLocation.userLat, lng: oldLocation.userLng });
              setLocationError(
                "Unable to retrieve your location. Using last known location."
              );
            } else {
              setLocationError(
                "Unable to retrieve your location. Using default view."
              );
              setIsLocating(false);
              setZoom(12);
              setMapCenter({ lat: 40.7128, lng: -74.006 }); // New York
              fetchData({ lat: 40.7128, lng: -74.006 });
            }
          })();
        }
      );
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Using default view."
      );
      setIsLocating(false);
    }
  }, [refresh]);

  const handleRadiusChange = (value: number) => {
    setRadius(value);
    setRefresh(!refresh);
  };

  const handleSearchKeywordChange = (value: string) => {
    if (value === "General") {
      value = "";
    }
    setSearchKeyword(value.toLocaleLowerCase());

    setRefresh(!refresh);
  };

  const radiusOptions = [500, 1000, 5000, 10000, 20000, 50000];
  const hospitalTypes = ["General", "Eye", "Dental", "Skin", "Bone"];

  return (
    <main className="flex flex-col gap-8 p-4 row-start-2 items-center">
      <Card className="w-full lg:w-[30rem] lg:h-[calc(100vh-2rem)] lg:fixed lg:top-4 lg:left-4">
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          {isLocating && <div>Locating your position...</div>}
          {locationError && <div className="text-red-500">{locationError}</div>}
          <div
            className={
              isLocating || locationError
                ? "h-[calc(100vh-12rem)]"
                : "h-[calc(100vh-8rem)]"
            }
          >
            <MapComponent
              locations={locations}
              userLocation={userLocation}
              mapCenter={mapCenter}
              zoom={zoom}
              isLocating={isLocating}
              locationError={locationError}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6 lg:mt-0 lg:h-full lg:w-[calc(100%-31rem)] lg:fix lg:top-4 lg:ml-[calc(31rem)]">
        <CardHeader>
          {/* Radius Selector */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <p>Search Range</p>
            {radiusOptions.map((option) => (
              <button
                className="px-4 py-1 bg-neutral-100 rounded-md disabled:bg-black disabled:text-white hover:bg-neutral-200 transition-colors"
                disabled={option === radius}
                key={option}
                onClick={() => handleRadiusChange(option)}
              >
                {option < 1000 ? `${option}m` : `${option / 1000}km`}
              </button>
            ))}
          </div>

          {/* Hospital Type Selector */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <p>Type</p>
            {hospitalTypes.map((type) => (
              <button
                className="px-4 py-1 bg-neutral-100 rounded-md disabled:bg-black disabled:text-white hover:bg-neutral-200 transition-colors "
                disabled={
                  (type.toLowerCase() === searchKeyword &&
                    searchKeyword !== "") ||
                  (type === "General" && searchKeyword === "")
                }
                key={type}
                onClick={() => handleSearchKeywordChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <CardTitle className="text-2xl pt-8">
            {" "}
            Results for{" "}
            <span className="bg-emerald-50 px-2 py-1 border border-emerald-700 text-emerald-700 rounded-md">
              {searchKeyword
                ? hospitalTypes.find(
                    (type) => type.toLowerCase() == searchKeyword
                  )
                : "General"}{" "}
              Hospital
            </span>{" "}
            in{" "}
            <span className="bg-indigo-50 px-2 py-1 border border-indigo-700 text-indigo-700 rounded-md">
              {radius < 1000 ? `${radius}m` : `${radius / 1000}km`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Location List */}
          <ul className="list-none flex flex-col gap-4">
            <h1 className="text-2xl font-bold"></h1>
            {locations.map((location) => (
              <li
                className="flex flex-col gap-2 px-4 py-2 border rounded-md"
                key={location.place_id}
              >
                <p>{location.name}</p>
                <p>{location.vicinity}</p>
                <p>{location.rating}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
