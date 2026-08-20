"use client";

import { useEffect, useState } from "react";
import type { FaultInfo } from "@/lib/control-room-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  MapPin,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { io } from "socket.io-client";

export function FaultAlertPanel() {
  const [isAlert, setIsAlert] = useState(false);
  const [fault, setFault] = useState<FaultInfo | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Connected to backend");
    });

    socket.on("power-status", (data) => {
      console.log("🔥 POWER STATUS:", data);

      if (data.systemStatus === "ALERT") {
        setIsAlert(true);
        setFault({
          type: "POWER CUT / WIRE FALLEN",
          message:
            data.message || "Electrical line fault detected. Power cut for safety.",
          zone: "Zone 3",
          transformer: "TX-03",
          timestamp: new Date(),
        });
      }

      if (data.systemStatus === "NORMAL") {
        setIsAlert(false);
        setFault(null);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ================= NORMAL STATE ================= */
  if (!isAlert || !fault) {
    return (
      <Card className="border-border bg-secondary/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldAlert className="h-4 w-4 text-status-normal" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-md bg-status-normal/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-normal/20">
              <ShieldAlert className="h-5 w-5 text-status-normal" />
            </div>
            <div>
              <p className="font-medium text-status-normal">
                All Systems Normal
              </p>
              <p className="text-sm text-muted-foreground">
                No active faults detected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* ================= ALERT STATE ================= */
  return (
    <Card className="animate-pulse border-destructive bg-destructive/5 ring-2 ring-destructive/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 animate-bounce" />
          ACTIVE FAULT DETECTED
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="rounded-md bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-destructive">
                  {fault.type}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {fault.message}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md bg-secondary p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Zone
              </div>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {fault.zone}
              </p>
            </div>

            <div className="rounded-md bg-secondary p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                Transformer
              </div>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {fault.transformer}
              </p>
            </div>

            <div className="rounded-md bg-secondary p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Time
              </div>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {fault.timestamp.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
