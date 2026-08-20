"use client";

import React from "react"

import type { ElectricalParameters } from "@/lib/control-room-store";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gauge,
  Thermometer,
  Activity,
  Zap,
  Radio,
  TrendingUp,
} from "lucide-react";

interface ElectricalParametersPanelProps {
  parameters: ElectricalParameters;
  isAlert: boolean;
}

interface ParameterCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status?: "normal" | "warning" | "danger";
}

function ParameterCard({
  icon,
  label,
  value,
  unit,
  status = "normal",
}: ParameterCardProps) {
  const statusColors = {
    normal: "text-status-normal",
    warning: "text-status-warning",
    danger: "text-status-danger",
  };

  return (
    <Card className="bg-secondary/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="rounded-md bg-primary/10 p-2">{icon}</div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="mt-3">
          <span className={`font-mono text-2xl font-bold ${statusColors[status]}`}>
            {value}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ElectricalParametersPanel({
  parameters,
  isAlert,
}: ElectricalParametersPanelProps) {
  const voltageStatus =
    parameters.voltage < 210 || parameters.voltage > 250 ? "danger" : "normal";
  const frequencyStatus =
    parameters.frequency < 49.5 || parameters.frequency > 50.5
      ? "warning"
      : "normal";
  const tempStatus = parameters.temperature > 60 ? "danger" : parameters.temperature > 50 ? "warning" : "normal";
  const loadStatus = parameters.powerLoad > 80 ? "danger" : parameters.powerLoad > 60 ? "warning" : "normal";

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Gauge className="h-4 w-4 text-primary" />
        Electrical Parameters
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <ParameterCard
          icon={<Zap className="h-4 w-4 text-primary" />}
          label="Voltage"
          value={parameters.voltage.toFixed(1)}
          unit="V"
          status={voltageStatus}
        />
        <ParameterCard
          icon={<Activity className="h-4 w-4 text-primary" />}
          label="Current"
          value={parameters.current.toFixed(1)}
          unit="A"
          status="normal"
        />
        <ParameterCard
          icon={<Radio className="h-4 w-4 text-primary" />}
          label="Frequency"
          value={parameters.frequency.toFixed(2)}
          unit="Hz"
          status={frequencyStatus}
        />
        <ParameterCard
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          label="Power Load"
          value={parameters.powerLoad.toFixed(1)}
          unit="MW"
          status={loadStatus}
        />
        <ParameterCard
          icon={<Thermometer className="h-4 w-4 text-primary" />}
          label="Temperature"
          value={parameters.temperature.toFixed(1)}
          unit="°C"
          status={tempStatus}
        />
        <Card className="bg-secondary/50">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div className="rounded-md bg-primary/10 p-2">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Line Status</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  isAlert
                    ? "animate-pulse bg-status-danger"
                    : parameters.lineStatus === "Online"
                      ? "bg-status-normal"
                      : parameters.lineStatus === "Degraded"
                        ? "bg-status-warning"
                        : "bg-status-danger"
                }`}
              />
              <span
                className={`font-mono text-lg font-bold ${
                  isAlert
                    ? "text-status-danger"
                    : parameters.lineStatus === "Online"
                      ? "text-status-normal"
                      : parameters.lineStatus === "Degraded"
                        ? "text-status-warning"
                        : "text-status-danger"
                }`}
              >
                {isAlert ? "INTERRUPTED" : parameters.lineStatus}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
