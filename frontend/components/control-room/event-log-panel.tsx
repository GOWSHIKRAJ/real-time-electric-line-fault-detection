"use client";

import type { EventLogEntry } from "@/lib/control-room-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface EventLogPanelProps {
  events: EventLogEntry[];
}

function getEventIcon(type: EventLogEntry["type"]) {
  switch (type) {
    case "info":
      return <Info className="h-3.5 w-3.5 text-status-info" />;
    case "warning":
      return <AlertTriangle className="h-3.5 w-3.5 text-status-warning" />;
    case "error":
      return <XCircle className="h-3.5 w-3.5 text-status-danger" />;
    case "success":
      return <CheckCircle className="h-3.5 w-3.5 text-status-normal" />;
  }
}

function getEventBgColor(type: EventLogEntry["type"]) {
  switch (type) {
    case "info":
      return "bg-status-info/10";
    case "warning":
      return "bg-status-warning/10";
    case "error":
      return "bg-status-danger/10";
    case "success":
      return "bg-status-normal/10";
  }
}

export function EventLogPanel({ events }: EventLogPanelProps) {
  const sortedEvents = [...events].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-primary" />
          Activity / Event Log
          <span className="ml-auto rounded bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground">
            {events.length} events
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 rounded-md p-2.5 ${getEventBgColor(event.type)}`}
              >
                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{event.message}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}{" "}
                    •{" "}
                    {event.timestamp.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
