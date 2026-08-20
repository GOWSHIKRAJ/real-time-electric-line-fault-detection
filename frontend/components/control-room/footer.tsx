"use client";

import { useEffect, useState } from "react";
import { Server, Clock, Shield } from "lucide-react";

interface FooterProps {
  controlRoomId: string;
}

export function Footer({ controlRoomId }: FooterProps) {
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border bg-card px-4 py-3 md:px-6">
      <div className="flex flex-col gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5" />
            <span>System v2.4.1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>{controlRoomId}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Last Sync:{" "}
            {lastSync.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      </div>
    </footer>
  );
}
