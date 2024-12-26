"use client";
import { useEffect } from "react";

export default function CallPage() {
  useEffect(() => {
    async function fetchData() {
    const response = await fetch("http://localhost:3000/api/v1/maps/searchhospital", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userLat":"31.599833",
        "userLng":"74.933556",
        "radius":5000,
        "keyword":"eye"
    }),
    });
    const data = await response.json();
    console.log(data);
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"></main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
