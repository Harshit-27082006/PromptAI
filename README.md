# SafeWalk AI v2.0 — Predictive Personal Safety Companion & Safety Network

> **PromptWar Hackathon Entry** | Theme: **“Safety Net”**  
> *“Don't wait for the emergency. Detect the unusual journey pattern early.”*

---

## 🌟 Executive Summary

Most personal safety applications are purely **reactive**: they require a user in acute distress to unlock their phone, open an app, and manually press an emergency SOS button.

**SafeWalk AI v2.0** establishes a complete, resilient **Safety Net**:
1. **Understands & Evaluates:** Analyzes movement kinematics, time of day, route adherence, and safe havens.
2. **Predicts & Explains:** Multi-window AI forecasting (2m/5m/10m) with transparent decision factors and safer route advice.
3. **Proactive & Resilient:** Smart check-ins, **Auto-Escalation** if user becomes unresponsive during critical risk, **Hands-Free Spacebar trigger**, and **100% Offline Resilience**.
4. **Scalable Network:** Community hazard intelligence and **Campus / Institutional Operations Center** for universities, tech parks, and residential safe communities.

```
Traditional Safety Apps:
[ Danger Strikes ] ──> [ User Struggles to Press SOS ] ──> [ Alert Sent ]

SafeWalk AI Safety Network:
[ Monitor Journey ] ──> [ AI Forecasts Rising Risk ] ──> [ Kinematic Anomaly Detected ]
                    ──> [ Proactive Check-In Prompt ] ──> [ User Unresponsive ]
                    ──> [ Auto-Escalation Simulator ] ──> [ Trusted Contact & Campus Dispatch ]
                    ──> [ Offline Queue Retries When Reconnected ]
```

---

## 🧠 Complete Architecture Overview

```
                        User & Journey Telemetry
                                   ↓
                     Unified Safety Context Builder
                                   ↓
     ┌────────────────────────────────────────────────────────────┐
     │              AI Safety Intelligence Engine                 │
     ├────────────────────┬───────────────────┬───────────────────┤
     │   Risk Predictor   │   Route Advisor   │    Behavior AI    │
     │ (2m/5m/10m Trends) │ (Safety Scoring)  │ (Kinematic Anom.) │
     ├────────────────────┼───────────────────┼───────────────────┤
     │ Hazard Cluster AI  │ Alert Prioritizer │  Safety Explainer │
     │(Emerging Risk Area)│(CRITICAL Priority)│ (Why & Breakdown) │
     └────────────────────┴───────────────────┴───────────────────┘
                                   ↓
                     Central Reactive Store & Event Bus
                                   ↓
      ┌────────────────────────────┬────────────────────────────┐
      │   Client-Side Interface    │  Resilient REST API Layer  │
      ├────────────────────────────┼────────────────────────────┤
      │ • Walker Journey Planner   │ • GET  /api/health         │
      │ • Live Interactive Map     │ • GET  /api/safety/status  │
      │ • AI Intelligence Panel    │ • POST /api/safety/event   │
      │ • Spacebar Hold Trigger    │ • POST /api/safety/check-in│
      │ • "I Can't Talk" SOS View  │ • POST /api/safety/escalate│
      │ • Trusted Contact Console  │ • GET  /api/risk-zones     │
      │ • Institutional Dashboard  │ • Local Event Queueing     │
      └────────────────────────────┴────────────────────────────┘
```

---

## 🚀 Key Feature Capabilities

### 1. 🌐 Vercel-Ready REST API Layer & Offline Resilience
* Built with zero-config serverless endpoints in `api/` and matched in `server.py`:
  * `GET /api/health`: Service health and timestamp.
  * `GET /api/safety/status`: Live session telemetry and risk status.
  * `POST /api/safety/event`: Real-time safety telemetry sink.
  * `POST /api/safety/check-in`: Handles check-in confirmations and resets safety interval.
  * `POST /api/safety/escalate`: Simulated emergency escalation event.
  * `GET /api/risk-zones`: Community risk zones and report metadata.
* **Offline Local Mode:** When offline, the app switches to `● OFFLINE (LOCAL MODE)`. Events are safely queued in `localStorage` and automatically flushed when connectivity is restored.

### 2. ⚡ Hands-Free & Rapid Emergency Trigger (`HandsFreeTrigger.js`)
* **2-Second Spacebar Hold:** Hold the spacebar anywhere to trigger SOS with a live visual progress circle.
* **Keyboard Shortcut:** Press `Shift + E` for instantaneous silent emergency mode.
* **Voice Trigger Simulator:** Optional Web Speech recognition listening for *"HELP"* or *"SAFEWALK SOS"*.

### 3. 🚨 Auto-Escalation Simulator
* If a critical risk state occurs and the user does not respond to a Smart Check-In within the timeout window, the system automatically escalates:
  * Triggers 5-second cancel countdown.
  * Initiates **AUTO-ESCALATION ACTIVE (SIMULATED)**.
  * Broadcasts live GPS coordinates and incident reason to the Trusted Contact and Campus Dispatch.

### 4. 🏛️ Campus & Institutional Operations Dashboard (`InstitutionalDashboard.js`)
* Real-time monitoring for Universities, Corporate Parks, and Residential RWAs:
  * Live metrics: Active Walkers, Active Journeys, Blue Light Kiosks (18 operational), Hazard Zones, Average Response Time (1.4m).
  * 1-Click Rapid Patrol Escort Dispatch simulator.
  * Campus Blue Light Kiosk network and safe pedestrian corridors.

### 5. 🔮 AI Predictive Risk Engine (`riskPrediction.js`)
* Computes multi-window forecasts (2m, 5m, 10m) with directional trend indicators (`DECREASING`, `STABLE`, `INCREASING`, `RAPIDLY_INCREASING`).
* Generates natural language trajectory explanations.

### 6. 🗺️ AI Risk-Aware Route Advisor (`routeAdvisor.js`)
* Evaluates 3 candidate routes (Shortcut, AI Recommended, Alternative) based on illumination, hazard density, and safe zone proximity.

### 7. 🛑 Behavior Anomaly Detector (`behaviorAnalyzer.js`)
* Detects sudden stops, prolonged stationary periods, and backtracking.

### 8. 🛡️ Robust Fail-Safe Error Boundary (`ErrorBoundary.js`)
* Wraps the application in a React Error Boundary ensuring that an unexpected error never produces a blank screen.

---

## ⚡ Hackathon Demo Suite & 10 Test Scenarios

Access the **⚡ Hackathon Demo Suite** in the navigation bar to test all 10 judge scenarios:

| # | Scenario Name | Status | Key Highlight |
|---|---------------|--------|---------------|
| 🟢 **1** | Normal Safe Walk | `GREEN` | Steady on-route daytime walking; risk remains low. |
| 🟡 **2** | Route Deviation | `YELLOW` | Off-route detour into unlit alley at 11 PM. |
| 🔴 **3** | Missed Check-In Escalation | `RED` | Check-in prompt times out -> Auto-Escalation countdown. |
| 🤫 **4** | "I Can't Talk" Silent SOS | `RED` | 1-tap zero-typing stealth emergency with safe haven routing. |
| ⚠️ **5** | Community Hazard Pin | `YELLOW` | Real-time injection of community hazard into path. |
| 🔮 **6** | AI Predicts Rising Risk | `YELLOW → RED` | Forecasts rising trajectory ($38 \to 71$ in 5m). |
| 🗺️ **7** | AI Safer Route Advisor | `GREEN` | Evaluates 3 candidate routes, recommends Route B (Score 98/100). |
| 🛑 **8** | Behavior Anomaly Detection | `YELLOW` | Detects sudden stop + backtracking; Anomaly Score: 82. |
| ⚠️ **9** | Emerging Community Risk | `YELLOW` | Detects high-density hazard cluster within 250m. |
| 🚨 **10**| Smart Alert Prioritization | `CRITICAL` | Dispatches enriched CRITICAL assessment to Trusted Contact. |
| 🎬 | **2-Min Automated Demo Flow** | `ALL` | Fully narrated end-to-end judge walkthrough running in 2 minutes. |

---

## 🛠️ Quickstart & Verification

### Option A: Start Local Web Server
```powershell
python server.py
```
Open your browser at:
```
http://localhost:8000
```

### Option B: Run Automated Test Suite
```powershell
node test_engine.js
```
*Executes all 33 unit and integration tests validating geodesics, AI predictions, route scoring, behavior anomaly kinematics, hazard clustering, and serverless REST APIs.*
