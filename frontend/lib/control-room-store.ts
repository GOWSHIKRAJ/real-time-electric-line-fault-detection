// Mock state store for the EB Control Room Dashboard
export type SystemStatus = "NORMAL" | "ALERT";

export interface Transformer {
  id: string;
  location: string;
  status: "Active" | "Tripped";
  load: number;
}

export interface GridZone {
  id: string;
  name: string;
  loadPercentage: number;
  status: "normal" | "warning" | "critical";
  transformers: Transformer[];
}

export interface ElectricalParameters {
  voltage: number;
  current: number;
  frequency: number;
  powerLoad: number;
  temperature: number;
  lineStatus: "Online" | "Offline" | "Degraded";
}

export interface FaultInfo {
  type: string;
  zone: string;
  transformer: string;
  timestamp: Date;
  message: string;
}

export interface EventLogEntry {
  id: string;
  timestamp: Date;
  type: "info" | "warning" | "error" | "success";
  message: string;
}

export interface ControlRoomState {
  systemStatus: SystemStatus;
  controlRoomId: string;
  cityName: string;
  zones: GridZone[];
  parameters: ElectricalParameters;
  currentFault: FaultInfo | null;
  eventLog: EventLogEntry[];
  affectedZoneIndex: number;
}

// Initial mock data
export const initialTransformers: Transformer[] = [
  { id: "TR-001", location: "Main Substation", status: "Active", load: 78 },
  { id: "TR-002", location: "Industrial Area", status: "Active", load: 85 },
  { id: "TR-003", location: "Residential Block A", status: "Active", load: 62 },
  { id: "TR-004", location: "Commercial District", status: "Active", load: 71 },
  { id: "TR-005", location: "Residential Block B", status: "Active", load: 55 },
  { id: "TR-006", location: "Hospital Complex", status: "Active", load: 45 },
];

export const initialZones: GridZone[] = [
  {
    id: "zone-a",
    name: "Zone A",
    loadPercentage: 72,
    status: "normal",
    transformers: [initialTransformers[0], initialTransformers[1]],
  },
  {
    id: "zone-b",
    name: "Zone B",
    loadPercentage: 58,
    status: "normal",
    transformers: [initialTransformers[2], initialTransformers[3]],
  },
  {
    id: "zone-c",
    name: "Zone C",
    loadPercentage: 85,
    status: "warning",
    transformers: [initialTransformers[4], initialTransformers[5]],
  },
  {
    id: "zone-d",
    name: "Zone D",
    loadPercentage: 41,
    status: "normal",
    transformers: [],
  },
];

export const initialParameters: ElectricalParameters = {
  voltage: 230.5,
  current: 142.8,
  frequency: 50.02,
  powerLoad: 32.8,
  temperature: 45.2,
  lineStatus: "Online",
};

export const initialEventLog: EventLogEntry[] = [
  {
    id: "evt-1",
    timestamp: new Date(Date.now() - 3600000),
    type: "info",
    message: "System startup completed successfully",
  },
  {
    id: "evt-2",
    timestamp: new Date(Date.now() - 1800000),
    type: "info",
    message: "Routine maintenance check - Zone C",
  },
  {
    id: "evt-3",
    timestamp: new Date(Date.now() - 900000),
    type: "warning",
    message: "High load detected in Zone C - 85%",
  },
];

export const faultTypes = [
  "Fallen Wire Detected",
  "Overload Condition",
  "Transformer Fault",
  "Line Break Detected",
  "Insulation Failure",
];

export function getInitialState(): ControlRoomState {
  return {
    systemStatus: "NORMAL",
    controlRoomId: "CR-TN-001",
    cityName: "Chennai Metropolitan",
    zones: initialZones,
    parameters: initialParameters,
    currentFault: null,
    eventLog: initialEventLog,
    affectedZoneIndex: 0,
  };
}
