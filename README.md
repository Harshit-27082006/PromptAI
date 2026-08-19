# SafeWalk AI v2.0 — Predictive Personal Safety Companion

> **PromptWar Hackathon Entry** | Theme: **“Safety Net”**  
> *“Don't wait for the emergency. Detect the unusual journey pattern early.”*

---

## 🌟 Executive Summary & Phase 2 AI Innovation

Most personal safety applications are purely **reactive**: they require a user in acute distress to unlock their phone, open an app, and manually press an emergency SOS button.

**SafeWalk AI v2.0** introduces a comprehensive **AI Safety Intelligence Layer** on top of the real-time journey monitoring engine. Instead of merely displaying static scores, SafeWalk AI analyzes kinetic movement patterns, forecasts risk trajectories over 2m/5m/10m windows, detects spatial hazard clusters, recommends safer illuminated routes, and prioritizes emergency dispatches with explainable AI reasoning.

```
Traditional Safety Apps:
[ Danger Strikes ] ──> [ User Struggles to Press SOS ] ──> [ Alert Sent ]

SafeWalk AI Phase 1:
[ Monitor Journey ] ──> [ Detect Deviation / Hazard ] ──> [ Proactive Check-In ] ──> [ Auto-Escalate ]

SafeWalk AI Phase 2 (AI Intelligence Layer):
[ Context Builder ] ──> [ Predict Rising Risk Trajectory ] ──> [ Kinematic Anomaly Detection ]
                    ──> [ Spatial Hazard Cluster AI ] ──> [ Safer Route Advisor ]
                    ──> [ Smart Alert Prioritization ] ──> [ Explainable Decision Support ]
```

---

## 🧠 Phase 2 AI Intelligence Architecture

```
User & Journey Telemetry (Speed, GPS, Deviation, Inactivity, Time, Hazards, Safe Zones)
                                ↓
                 Unified Safety Context Builder
                                ↓
      ┌────────────────────────────────────────────────────────┐
      │          AI Safety Intelligence Coordinator            │
      ├──────────────────┬──────────────────┬──────────────────┤
      │  Risk Predictor  │  Route Advisor   │   Behavior AI    │
      │ (2m/5m/10m Trend)│ (Safety Scoring) │ (Anomaly Kinem.) │
      ├──────────────────┼──────────────────┼──────────────────┤
      │  Hazard Cluster  │ Alert Prioritizer│ Safety Explainer │
      │(Emerging Risk AI)│(CRITICAL/HIGH/MED│(Why & Next Steps)│
      └──────────────────┴──────────────────┴──────────────────┘
                                ↓
          Actionable Recommendations & Live Sync Bus
                                ↓
                User Interface + Trusted Contact Console
```

---

## 🚀 Complete Feature Capabilities

### 1. 🔮 AI Predictive Risk Engine (`riskPrediction.js`)
* Analyzes current risk, time of day, movement velocity, deviation slope, and approaching hazard vectors.
* Computes multi-window forecasts:
  * **Next 2 Minutes**
  * **Next 5 Minutes (Primary)**
  * **Next 10 Minutes**
* Classifies trend direction: `DECREASING` | `STABLE` | `INCREASING` | `RAPIDLY_INCREASING`.
* Generates natural language trajectory forecasts (*e.g. "Risk is predicted to rise from 38 to 61 in the next 5 minutes because trajectory heads towards an unlit street segment."*).

### 2. 🗺️ AI Risk-Aware Route Advisor (`routeAdvisor.js`)
* Intelligently compares candidate routes based on multi-factor safety formula:
  $$\text{Route Safety Score} = 100 - \text{Hazard Penalty} - \text{Isolation Cost} - \text{Distance Exposure} + \text{Safe Zone Bonus} - \text{Night Penalty}$$
* Generates 3 candidate paths:
  1. **Route A (Shortcut):** Shortest distance, but passes through unlit alleys (Score: 58/100).
  2. **Route B (AI Recommended):** Well-lit commercial avenue with 7-Eleven Safe Hub and Police Precinct (Score: 86–98/100).
  3. **Route C (Alternative):** Long boulevard perimeter with active traffic (Score: 78/100).
* Renders the **AI Recommended Safer Route** directly on the interactive Leaflet map.

### 3. 🛑 Behavior Anomaly Detector (`behaviorAnalyzer.js`)
* Monitors kinetic patterns: sudden stops, prolonged inactivity, backtracking / path reversals, and repeated route departure.
* Generates an **Anomaly Score (0–100)** and classifies status (`NORMAL`, `UNUSUAL`, `HIGHLY_UNUSUAL`).
* Automatically prompts proactive Smart Check-Ins when unusual movement is detected.

### 4. ⚠️ Community Hazard Intelligence & Cluster AI (`hazardIntelligence.js`)
* Groups nearby crowdsourced reports into spatial clusters ($\le 300\text{m}$ radius).
* Detects **Emerging Risk Areas** (e.g. 3 broken streetlights + 1 harassment report in a 250m radius).
* Visualizes pulsing cluster zones on the map with contributing report breakdowns.

### 5. 🚨 Smart Alert Prioritization (`alertPrioritizer.js`)
* Evaluates emergency incidents to assign intelligent priority levels: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`.
* Contextualizes alerts with risk acceleration, behavior status, and specific recommended contact actions (*e.g. "Attempt telephone contact immediately and guide user toward Central Police Precinct 180m away."*).

### 6. 💬 Transparent Safety Explainer (`safetyExplainer.js`)
* Accessible, human-friendly explainability breakdown (*"How did AI decide?"*) showing mathematical factor impacts ($+18$ Route departure, $+14$ Hazard proximity, $-12$ Safe haven nearby).
* Generates contextual *"Why this recommendation?"* bullet points.

### 7. 🤫 Single-Tap "I Can't Talk" Silent SOS Mode
* Zero typing required: automatically transmits live GPS coordinates and initiates stealth escape guidance.
* 1-tap canned silent status updates (*"I am hiding"*, *"Someone is following me"*, *"Entered safe building"*).

### 8. 👥 Live-Synchronized Trusted Contact Dashboard
* Multi-tab real-time sync powered by `BroadcastChannel` and `LocalStorage`.
* Real-time AI Alert Assessment card with siren alerts, telemetry map, and simulated dispatch actions.

---

## ⚡ Hackathon Demo Suite & 10 Test Scenarios

Access the **⚡ Hackathon Demo Suite** in the navigation bar to test all 10 judge scenarios:

| # | Scenario Name | Status | Key AI Highlight |
|---|---------------|--------|------------------|
| 🟢 **1** | Normal Safe Walk | `GREEN` | Steady on-route daytime walking; risk remains low. |
| 🟡 **2** | Route Deviation | `YELLOW` | Off-route detour into unlit alley at 11 PM; deviation warning shown. |
| 🔴 **3** | Missed Check-In Escalation | `RED` | Check-in prompt times out -> 5s countdown -> Emergency dispatched. |
| 🤫 **4** | "I Can't Talk" Silent SOS | `RED` | 1-tap zero-typing stealth emergency with safe haven routing. |
| ⚠️ **5** | Community Hazard Pin | `YELLOW` | Real-time injection of community hazard into path. |
| 🔮 **6** | **AI Predicts Rising Risk** | `YELLOW → RED` | Forecasts rising trajectory ($38 \to 71$ in 5m) before danger occurs. |
| 🗺️ **7** | **AI Safer Route Advisor** | `GREEN` | Evaluates 3 candidate routes and recommends Route B (Score 86/100). |
| 🛑 **8** | **Behavior Anomaly** | `YELLOW` | Detects sudden stop + backtracking; Anomaly Score: 82. |
| ⚠️ **9** | **Emerging Community Risk** | `YELLOW` | Detects high-density hazard cluster within 250m. |
| 🚨 **10**| **Smart Alert Prioritization** | `CRITICAL` | Dispatches enriched CRITICAL assessment to Trusted Contact. |
| 🎬 | **2-Min Automated Demo Flow** | `ALL` | Fully narrated end-to-end judge walkthrough running in 2 minutes. |

---

## 🔒 Safety Principles & Ethical Guardrails

1. **Decision-Support Tool:** The risk score is clearly labelled as a **predictive journey-risk indicator**, not statistical crime prediction.
2. **Honesty & Transparency:** The application does not falsely claim real police dispatch or carrier SMS integration; alerts are delivered via the integrated real-time notification/dashboard event bus.
3. **Privacy First:** Only necessary location telemetry is processed, with zero third-party tracking.
4. **AI Provider Abstraction:** Built with `LocalSafetyAIProvider` ensuring complete zero-dependency, deterministic offline operation without requiring external API keys.

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

### Option B: Run Automated AI Test Suite
```powershell
node test_engine.js
```
*Executes all 27 unit tests validating geodesic routing, risk prediction, route advisor scoring, behavior anomaly detection, and hazard clustering.*
