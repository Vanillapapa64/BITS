"use server";

import { cookies } from "next/headers";

const expiration = 60 * 60 * 24 * 7; // 1 week

export async function SetLocationCookies({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const cookieStore = await cookies();
  cookieStore.set("userLat", latitude.toString(), {
    maxAge: expiration,
  });
  cookieStore.set("userLng", longitude.toString(), {
    maxAge: expiration,
  });
}

export async function GetLocationFromCookies() {
  const cookieStore = await cookies();
  const userLat = cookieStore.get("userLat")?.value;
  const userLng = cookieStore.get("userLng")?.value;

  if (!userLat || !userLng) {
    return null;
  }
  return { userLat: parseFloat(userLat), userLng: parseFloat(userLng) };
}
