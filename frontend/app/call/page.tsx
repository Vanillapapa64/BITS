"use client";
import MapComponent from "@/components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { locations } from "@/data/locations";
import { Location } from "@/types/location";
import { useEffect, useMemo, useState } from "react";

export default function CallPage() {
  // const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 31.599833, lng: 74.933556 });

  useEffect(() => {
    async function fetchData() {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${api}/api/v1/maps/searchhospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLat: "31.599833",
          userLng: "74.933556",
          radius: 5000,
          keyword: "eye",
        }),
      });
      const data = await response.json();
      console.log(data);

      interface ApiResponse {
        id: string;
        lat: number;
        lng: number;
        name: string;
        description: string;
      }

      // const nLoc: Location[] = (data as ApiResponse[]).map((loc: ApiResponse) => {
      //   return {
      //     id: loc.id,
      //     position: { lat: loc.lat, lng: loc.lng },
      //     name: loc.name,
      //     description: loc.description,
      //   };
      // });

      // console.log(nLoc);
      // setLocations(nLoc);
      // setLocations(data);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      console.log(position.coords.latitude, position.coords.longitude);
    });

    fetchData();
  }, []);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <MapComponent locations={locations} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
