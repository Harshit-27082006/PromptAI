#!/usr/bin/env python3
"""
SafeWalk AI - Local Development & Demo Web Server
Provides instantaneous zero-configuration hosting with built-in REST API routing
for PromptWar hackathon judges and local development.
"""

import http.server
import socketserver
import os
import sys
import json
import time
from datetime import datetime

DEFAULT_PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# In-memory session store for local API testing
SESSION_STORE = {
    "status": "monitoring",
    "riskLevel": "low",
    "riskScore": 12,
    "lastCheckIn": datetime.utcnow().isoformat() + "Z",
    "connectivity": "online"
}

RECENT_EVENTS = []

RISK_ZONES = [
    {
        "id": "rz_001",
        "name": "5th St Alleyway Corridor",
        "category": "poor_lighting",
        "categoryLabel": "Poor Lighting",
        "riskLevel": "high",
        "reports": 14,
        "coords": [37.7794, -122.4240],
        "radiusMeters": 180,
        "description": "Multiple reported broken streetlights; zero illumination past 9 PM."
    },
    {
        "id": "rz_002",
        "name": "Industrial Dock Loading Sector",
        "category": "suspicious_activity",
        "categoryLabel": "Suspicious Activity",
        "riskLevel": "critical",
        "reports": 19,
        "coords": [37.7808, -122.4258],
        "radiusMeters": 220,
        "description": "Frequent loitering and aggressive behavior near abandoned dock."
    },
    {
        "id": "rz_003",
        "name": "North Ave Construction Bypass",
        "category": "road_obstruction",
        "categoryLabel": "Road Obstruction",
        "riskLevel": "moderate",
        "reports": 8,
        "coords": [37.7818, -122.4255],
        "radiusMeters": 150,
        "description": "Sidewalk blocked by scaffolding forcing pedestrians into narrow lane."
    },
    {
        "id": "rz_004",
        "name": "Transit Underpass Crossing",
        "category": "unsafe_road",
        "categoryLabel": "Unsafe Crossing",
        "riskLevel": "moderate",
        "reports": 6,
        "coords": [37.7765, -122.4205],
        "radiusMeters": 120,
        "description": "Rapid turning traffic with malfunctioning pedestrian signal."
    },
    {
        "id": "rz_005",
        "name": "Civic Plaza Transit Hub",
        "category": "crowded_area",
        "categoryLabel": "Crowded Transit Area",
        "riskLevel": "low",
        "reports": 22,
        "coords": [37.7798, -122.4138],
        "radiusMeters": 250,
        "description": "High foot-traffic corridor; well-patrolled by transit security."
    }
]

class SafeWalkHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _send_json(self, data, status_code=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split('?')[0]
        
        # REST API Routes
        if url_path == '/api/health':
            self._send_json({
                "status": "ok",
                "service": "SafeWalk AI",
                "version": "2.0",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            })
            return
        elif url_path == '/api/safety/status':
            self._send_json({
                **SESSION_STORE,
                "serverTimestamp": datetime.utcnow().isoformat() + "Z"
            })
            return
        elif url_path == '/api/safety/event':
            self._send_json({
                "success": True,
                "count": len(RECENT_EVENTS),
                "events": RECENT_EVENTS[:20]
            })
            return
        elif url_path == '/api/risk-zones':
            self._send_json({
                "success": True,
                "count": len(RISK_ZONES),
                "zones": RISK_ZONES
            })
            return

        # Static assets
        super().do_GET()

    def do_POST(self):
        url_path = self.path.split('?')[0]
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        if url_path == '/api/safety/status':
            SESSION_STORE.update({
                "status": body.get("status", SESSION_STORE["status"]),
                "riskLevel": body.get("riskLevel", SESSION_STORE["riskLevel"]),
                "riskScore": body.get("riskScore", SESSION_STORE["riskScore"]),
                "lastCheckIn": body.get("lastCheckIn", datetime.utcnow().isoformat() + "Z")
            })
            self._send_json({
                "success": True,
                "message": "Safety status updated",
                "session": SESSION_STORE
            })
            return
        elif url_path == '/api/safety/event':
            new_event = {
                "id": f"evt_{int(time.time()*1000)}",
                "eventType": body.get("eventType", "telemetry_update"),
                "riskLevel": body.get("riskLevel", "low"),
                "riskScore": body.get("riskScore", 10),
                "location": body.get("location", {"lat": 37.7752, "lng": -122.4245}),
                "details": body.get("details", "Journey telemetry recorded"),
                "timestamp": body.get("timestamp", datetime.utcnow().isoformat() + "Z"),
                "processedBy": "SafeWalk AI Local Engine"
            }
            RECENT_EVENTS.insert(0, new_event)
            if len(RECENT_EVENTS) > 50:
                RECENT_EVENTS.pop()
            self._send_json({
                "success": True,
                "message": "Safety telemetry event recorded",
                "event": new_event
            })
            return
        elif url_path == '/api/safety/check-in':
            status = body.get("status", "safe")
            self._send_json({
                "success": True,
                "sessionId": body.get("sessionId", "session_default"),
                "status": status,
                "action": "RESET_TIMER" if status == "safe" else "TRIGGER_ESCALATION",
                "nextCheckInIntervalSeconds": 60,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "message": "Check-in verified: user confirmed safe status." if status == "safe" else "Emergency assistance requested via check-in."
            })
            return
        elif url_path == '/api/safety/escalate':
            self._send_json({
                "success": True,
                "escalation": "simulated",
                "priority": body.get("priority", "CRITICAL"),
                "reason": body.get("reason", "User unresponsive during critical risk state"),
                "location": body.get("location", {"lat": 37.7794, "lng": -122.4240}),
                "trustedContactNotified": True,
                "simulatedDispatch": {
                    "unit": "Campus Safety & Rapid Escort Unit #4",
                    "nearestSafeHaven": "Central Police Precinct #1 (850 Bryant St)",
                    "etaMinutes": 2,
                    "status": "En-Route (Simulated Demo)"
                },
                "disclaimer": "SafeWalk AI simulated escalation event for hackathon evaluation.",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            })
            return
        elif url_path == '/api/risk-zones':
            new_zone = {
                "id": f"rz_{int(time.time()*1000)}",
                "name": body.get("name", "Community Safety Report Area"),
                "category": body.get("category", "poor_lighting"),
                "categoryLabel": body.get("categoryLabel", "Community Report"),
                "riskLevel": body.get("riskLevel", "moderate"),
                "reports": 1,
                "coords": body.get("coords", [37.779, -122.424]),
                "radiusMeters": 140,
                "description": body.get("description", "Community reported hazard")
            }
            RISK_ZONES.insert(0, new_zone)
            self._send_json({"success": True, "riskZone": new_zone})
            return

        self._send_json({"error": "Endpoint not found"}, status_code=404)

def run_server(port=DEFAULT_PORT):
    for p in [port, 8080, 5000, 3000, 8001]:
        try:
            with socketserver.TCPServer(("", p), SafeWalkHTTPRequestHandler) as httpd:
                print("=" * 70)
                print(f" SAFEWALK AI v2.0 - PREDICTIVE SAFETY NET & INTELLIGENCE")
                print("=" * 70)
                print(f" Web application & REST APIs are live at:")
                print(f"   Web Interface:  http://localhost:{p}")
                print(f"   Health API:     http://localhost:{p}/api/health")
                print(f"   Status API:     http://localhost:{p}/api/safety/status")
                print(f"   Risk Zones API: http://localhost:{p}/api/risk-zones")
                print("=" * 70)
                print(" Features Active:")
                print("   * Real-time Predictive Risk Engine & AI Explainer")
                print("   * Smart Check-In & Auto-Escalation Simulator")
                print("   * Single-Tap / Spacebar Hands-Free SOS Activation")
                print("   * Offline Resilience & Local Event Queueing")
                print("   * Community Safety Zones & Institutional Campus Dashboard")
                print("=" * 70)
                print("Press Ctrl+C to stop the server.")
                httpd.serve_forever()
        except OSError:
            print(f"Port {p} is in use, attempting next port...")
            continue

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    try:
        run_server(port)
    except KeyboardInterrupt:
        print("\nSafeWalk AI server stopped.")
