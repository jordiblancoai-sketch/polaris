"use client";
import { Suspense } from "react";
import { CorridorExplorer } from "@/components/CorridorExplorer";

export default function DemoMapPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-navy-950" />}>
      <CorridorExplorer />
    </Suspense>
  );
}
