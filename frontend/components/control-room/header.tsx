"use client";

import { useEffect, useState } from "react";
import type { SystemStatus } from "@/lib/control-room-store";
import { Activity, Radio } from "lucide-react";

interface HeaderProps {
  systemStatus: SystemStatus;
  controlRoomId: string;
  cityName: string;
}

export function Header({ systemStatus, controlRoomId, cityName }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isAlert = systemStatus === "ALERT";

  return (
    <header className="bg-card border-b border-border px-4 py-3 md:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">
              State Electricity Board – Control Room
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm">
              {cityName} • {controlRoomId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* System Status Indicator */}
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              isAlert
                ? "animate-pulse bg-destructive/20 text-destructive"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Radio
              className={`h-4 w-4 ${isAlert ? "animate-ping" : ""}`}
            />
            <span>{systemStatus}</span>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col items-end rounded-md bg-secondary px-3 py-1.5">
            <span className="font-mono text-sm font-medium text-foreground">
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {currentTime.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
