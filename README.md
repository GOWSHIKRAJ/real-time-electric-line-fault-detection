# ⚡ Real-Time Electric Line Fault Detection & Automated Power Cut-Off System

## 📌 Overview

The **Real-Time Electric Line Fault Detection & Automated Power Cut-Off System** is a smart electrical safety and monitoring platform designed to detect fallen or faulty electrical lines in real time and automatically disconnect the power supply to reduce the risk of electric shock, fire, equipment damage, and public hazards.

The system combines electrical monitoring, real-time communication, automated fault handling, and a web-based control-room dashboard to provide a centralized solution for monitoring electrical line conditions.

---

## 🎯 Problem Statement

Fallen or damaged electrical lines can remain energized and create serious safety risks for people, vehicles, and nearby infrastructure.

Traditional systems may depend on manual detection and reporting, which can cause delays between the occurrence of a fault and power isolation.

This project aims to provide:

- Real-time electrical monitoring
- Automatic fault detection
- Automated power cut-off
- Instant fault alerts
- Centralized monitoring through a control-room dashboard

---

## 💡 Proposed Solution

The system continuously monitors electrical parameters and identifies abnormal conditions that may indicate a fallen wire or electrical fault.

When a fault is detected:

1. The system identifies the abnormal electrical condition.
2. The affected line is automatically isolated.
3. The control room receives a real-time fault notification.
4. The event is recorded in the system.
5. Operators can monitor the affected transformer/line through the dashboard.
6. Public alerts can be issued when required.

---

## ✨ Key Features

### 🚨 Real-Time Fault Detection

Continuously monitors electrical parameters and detects abnormal conditions.

### ⚡ Automated Power Cut-Off

Automatically isolates the affected electrical line when a dangerous fault condition is detected.

### 📊 Control Room Dashboard

Provides centralized monitoring of electrical parameters, transformer status, faults, and system events.

### 🔔 Real-Time Alerts

Displays immediate fault notifications and system alerts.

### 📡 Real-Time Communication

Uses real-time communication between the backend and frontend for live system updates.

### 📝 Event Logging

Maintains a record of detected faults and important system events.

### 🏭 Transformer Monitoring

Provides a centralized view of transformer/line conditions.

### 📢 Public Alert Broadcasting

Allows operators to broadcast safety alerts when a dangerous electrical condition is detected.

---

## 🏗️ System Architecture

```text
        Electrical Line
              │
              ▼
     ┌─────────────────┐
     │ Sensors / Input │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Fault Detection │
     │     System      │
     └────────┬────────┘
              │
        Fault Detected
              │
       ┌──────┴───────┐
       ▼              ▼
┌─────────────┐ ┌───────────────┐
│ Power Cut-  │ │ Alert / Event │
│ Off System  │ │    Logging    │
└─────────────┘ └───────┬───────┘
                        │
                        ▼
              ┌─────────────────┐
              │ Backend Server  │
              └────────┬────────┘
                       │
                Real-Time Data
                       │
                       ▼
              ┌─────────────────┐
              │ Control Room UI │
              │   Dashboard     │
              └─────────────────┘
