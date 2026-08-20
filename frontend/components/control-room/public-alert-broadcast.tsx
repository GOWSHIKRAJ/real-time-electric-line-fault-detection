"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, Radio, Send, Users } from "lucide-react";

interface PublicAlertBroadcastProps {
  isAlert: boolean;
  affectedZone: string;
  alertMessage: string;
}

interface House {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface MessageCard {
  id: number;
  targetHouse: number;
  progress: number;
}

export function PublicAlertBroadcast({
  isAlert,
  affectedZone,
  alertMessage,
}: PublicAlertBroadcastProps) {
  const [messages, setMessages] = useState<MessageCard[]>([]);

  // Generate houses arranged in a circle around the center
  const houses = useMemo<House[]>(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i * 360) / count - 90; // Start from top
      const radians = (angle * Math.PI) / 180;
      const radius = 120;
      return {
        id: i,
        x: Math.cos(radians) * radius,
        y: Math.sin(radians) * radius,
        angle,
      };
    });
  }, []);

  // Animate messages flowing to houses when in alert state
  useEffect(() => {
    if (!isAlert) {
      setMessages([]);
      return;
    }

    let messageId = 0;
    const interval = setInterval(() => {
      const targetHouse = Math.floor(Math.random() * houses.length);
      setMessages((prev) => {
        const newMessages = [
          ...prev.filter((m) => m.progress < 100),
          { id: messageId++, targetHouse, progress: 0 },
        ].slice(-12); // Keep only last 12 messages
        return newMessages;
      });
    }, 400);

    const animationInterval = setInterval(() => {
      setMessages((prev) =>
        prev.map((m) => ({ ...m, progress: Math.min(m.progress + 4, 100) }))
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [isAlert, houses.length]);

  return (
    <Card className={`${isAlert ? "border-destructive/50" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Radio
            className={`h-4 w-4 ${isAlert ? "animate-pulse text-destructive" : "text-primary"}`}
          />
          Public Alert Broadcast System
          {isAlert && (
            <span className="ml-auto rounded bg-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive">
              BROADCASTING
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-secondary/50 py-8">
          {/* Central Control Hub */}
          <div className="relative h-[280px] w-[280px]">
            {/* Connection lines to houses */}
            <svg className="absolute inset-0 h-full w-full" viewBox="-150 -150 300 300">
              {houses.map((house) => (
                <line
                  key={`line-${house.id}`}
                  x1="0"
                  y1="0"
                  x2={house.x}
                  y2={house.y}
                  className={`${isAlert ? "stroke-destructive/30" : "stroke-border"}`}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Animated messages */}
            {isAlert &&
              messages.map((msg) => {
                const house = houses[msg.targetHouse];
                const progress = msg.progress / 100;
                const x = house.x * progress;
                const y = house.y * progress;
                const opacity = msg.progress < 80 ? 1 : 1 - (msg.progress - 80) / 20;

                return (
                  <div
                    key={msg.id}
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      opacity,
                    }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive shadow-lg shadow-destructive/50">
                      <AlertTriangle className="h-3 w-3 text-destructive-foreground" />
                    </div>
                  </div>
                );
              })}

            {/* Central Hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                  isAlert
                    ? "animate-pulse border-destructive bg-destructive/20"
                    : "border-primary bg-primary/10"
                }`}
              >
                <Send
                  className={`h-6 w-6 ${isAlert ? "text-destructive" : "text-primary"}`}
                />
              </div>
              <p className="mt-1 text-center text-xs font-medium text-muted-foreground">
                Control
              </p>
            </div>

            {/* Houses arranged in a circle */}
            {houses.map((house) => (
              <div
                key={house.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(calc(-50% + ${house.x}px), calc(-50% + ${house.y}px))`,
                }}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                    isAlert
                      ? "border-destructive/50 bg-destructive/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Home
                    className={`h-5 w-5 ${isAlert ? "text-destructive" : "text-muted-foreground"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Message Display */}
        <div
          className={`mt-4 rounded-lg p-4 ${
            isAlert
              ? "animate-pulse bg-destructive/10 border border-destructive/30"
              : "bg-secondary/50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isAlert ? "bg-destructive/20" : "bg-muted"
              }`}
            >
              {isAlert ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <Users className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              {isAlert ? (
                <>
                  <p className="text-sm font-medium text-destructive">
                    Broadcasting to {affectedZone} Residents
                  </p>
                  <p className="mt-1 text-sm text-foreground">{alertMessage}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-muted-foreground">
                    No Active Broadcast
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Public alert system is on standby
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
