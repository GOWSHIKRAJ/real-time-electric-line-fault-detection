"use client";

import { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import {
  type ControlRoomState,
  getInitialState,
} from "@/lib/control-room-store";
import { Header } from "./header";
import { TransformerGridPanel } from "./transformer-grid-panel";
import { ElectricalParametersPanel } from "./electrical-parameters-panel";
import { FaultAlertPanel } from "./fault-alert-panel";
import { PublicAlertBroadcast } from "./public-alert-broadcast";
import { EventLogPanel } from "./event-log-panel";
import { Footer } from "./footer";
import { io } from "socket.io-client";

export function Dashboard(): JSX.Element {
  const [state, setState] = useState<ControlRoomState>(() =>
    getInitialState()
  );

  /* 🔔 Alarm */
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  /* 🔓 Enable alarm (ONE click – browser rule) */
  const enableAlarm = () => {
    if (!alarmRef.current) return;

    alarmRef.current
      .play()
      .then(() => {
        alarmRef.current?.pause();
        alarmRef.current.currentTime = 0;
        setAlarmEnabled(true);
      })
      .catch(() => {});
  };

  /* 🔌 Listen to backend (Socket.IO) */
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("power-status", (data) => {
      if (data.systemStatus === "ALERT") {
        setState((prev) => ({
          ...prev,
          systemStatus: "ALERT",
          currentFault: {
            type: "POWER CUT / WIRE FALLEN",
            zone: "Zone 3",
            transformer: "TX-03",
            timestamp: new Date(),
            message: "Electrical line fault detected. Power cut for safety.",
          },
        }));
      }

      if (data.systemStatus === "NORMAL") {
        setState((prev) => ({
          ...prev,
          systemStatus: "NORMAL",
          currentFault: null,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* 🔔 Alarm logic (KEY PART) */
  useEffect(() => {
    if (state.systemStatus === "ALERT") {
      if (alarmEnabled) {
        alarmRef.current?.play().catch(() => {});
      }
    } else {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
      }
    }
  }, [state.systemStatus, alarmEnabled]);

  const isAlert = state.systemStatus === "ALERT";
  const affectedZone = state.zones[state.affectedZoneIndex];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 🔊 Alarm audio */}
      <audio ref={alarmRef} src="/alarm.mp3" loop />

      {/* 🔓 Enable alarm button (shown only once) */}
      {!alarmEnabled && (
        <div className="bg-yellow-100 text-yellow-900 p-3 text-center">
          <button
            onClick={enableAlarm}
            className="rounded bg-yellow-600 px-4 py-2 font-semibold text-white"
          >
            Enable Alarm Sound
          </button>
        </div>
      )}

      <Header
        systemStatus={state.systemStatus}
        controlRoomId={state.controlRoomId}
        cityName={state.cityName}
      />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-3">
              <FaultAlertPanel
                fault={state.currentFault}
                isAlert={isAlert}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ElectricalParametersPanel
                parameters={state.parameters}
                isAlert={isAlert}
              />
              <TransformerGridPanel
                zones={state.zones}
                affectedZoneId={isAlert ? affectedZone.id : undefined}
              />
            </div>

            <div className="space-y-6">
              <PublicAlertBroadcast
                isAlert={isAlert}
                affectedZone={affectedZone.name}
                alertMessage={
                  state.currentFault?.message || "No active alerts"
                }
              />
              <EventLogPanel events={state.eventLog} />
            </div>
          </div>
        </div>
      </main>

      <Footer controlRoomId={state.controlRoomId} />
    </div>
  );
}
