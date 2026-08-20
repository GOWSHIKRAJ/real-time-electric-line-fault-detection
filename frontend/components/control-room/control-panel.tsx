"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Power, RefreshCw } from "lucide-react";

interface ControlPanelProps {
  isAlert: boolean;
  onSimulateAlert: () => void;
  onResetSystem: () => void;
}

export function ControlPanel({
  isAlert,
  onSimulateAlert,
  onResetSystem,
}: ControlPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Power className="h-4 w-4 text-primary" />
          Demo Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isAlert ? "outline" : "destructive"}
            size="sm"
            onClick={onSimulateAlert}
            disabled={isAlert}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Simulate Fault
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetSystem}
            disabled={!isAlert}
            className="gap-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Reset System
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {isAlert
            ? "Click 'Reset System' to return to normal state"
            : "Click 'Simulate Fault' to trigger an alert. Each simulation affects a different zone."}
        </p>
      </CardContent>
    </Card>
  );
}
