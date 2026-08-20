"use client";

import type { GridZone, Transformer } from "@/lib/control-room-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MapPin, AlertTriangle } from "lucide-react";

interface TransformerGridPanelProps {
  zones: GridZone[];
  affectedZoneId?: string;
}

function getStatusColor(status: "normal" | "warning" | "critical") {
  switch (status) {
    case "normal":
      return "bg-status-normal";
    case "warning":
      return "bg-status-warning";
    case "critical":
      return "bg-status-danger";
  }
}

function getLoadColor(load: number) {
  if (load >= 80) return "text-status-danger";
  if (load >= 60) return "text-status-warning";
  return "text-status-normal";
}

function TransformerCard({
  transformer,
  isAffected,
}: {
  transformer: Transformer;
  isAffected: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border p-2.5 transition-all ${
        isAffected
          ? "animate-pulse border-destructive bg-destructive/10"
          : transformer.status === "Tripped"
            ? "border-destructive/50 bg-destructive/5"
            : "border-border bg-secondary/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Zap
          className={`h-4 w-4 ${
            transformer.status === "Active"
              ? "text-status-normal"
              : "text-status-danger"
          }`}
        />
        <div>
          <p className="text-xs font-medium text-foreground">
            {transformer.id}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {transformer.location}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`text-xs font-medium ${
            transformer.status === "Active"
              ? "text-status-normal"
              : "text-status-danger"
          }`}
        >
          {transformer.status}
        </span>
        <p className={`text-xs ${getLoadColor(transformer.load)}`}>
          {transformer.load}% Load
        </p>
      </div>
    </div>
  );
}

function ZoneCard({
  zone,
  isAffected,
}: {
  zone: GridZone;
  isAffected: boolean;
}) {
  const statusColor = isAffected ? "bg-status-danger" : getStatusColor(zone.status);
  
  return (
    <Card
      className={`transition-all ${
        isAffected ? "animate-pulse border-destructive ring-1 ring-destructive/50" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            {isAffected && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            {zone.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            <span
              className={`text-sm font-medium ${getLoadColor(zone.loadPercentage)}`}
            >
              {zone.loadPercentage}%
            </span>
          </div>
        </div>
        {/* Load bar */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all ${statusColor}`}
            style={{ width: `${zone.loadPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {zone.transformers.length > 0 ? (
            zone.transformers.map((t) => (
              <TransformerCard
                key={t.id}
                transformer={t}
                isAffected={isAffected && t.status === "Tripped"}
              />
            ))
          ) : (
            <p className="text-center text-xs text-muted-foreground py-2">
              No transformers assigned
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TransformerGridPanel({
  zones,
  affectedZoneId,
}: TransformerGridPanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Zap className="h-4 w-4 text-primary" />
        Transformer & Grid Overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            isAffected={zone.id === affectedZoneId}
          />
        ))}
      </div>
    </div>
  );
}
