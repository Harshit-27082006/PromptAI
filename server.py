#!/usr/bin/env python3
"""
SafeWalk AI - Local Development & Demo Web Server
Provides instantaneous zero-configuration hosting for PromptWar hackathon judges.
"""

import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SafeWalkHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching headers and CORS for smooth local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server(port=DEFAULT_PORT):
    for p in [port, 8080, 5000, 3000, 8001]:
        try:
            with socketserver.TCPServer(("", p), SafeWalkHTTPRequestHandler) as httpd:
                print("=" * 70)
                print(" 🛡️  SAFEWALK AI — PREDICTIVE PERSONAL SAFETY COMPANION")
                print("=" * 70)
                print(f" 🚀 Web application is live and running at:")
                print(f"    👉 http://localhost:{p}")
                print(f"    👉 http://127.0.0.1:{p}")
                print("=" * 70)
                print(" 💡 Hackathon Evaluation Features:")
                print("    • Real-time Predictive Risk Engine (0-100 Score)")
                print("    • Smart Check-In & 5s Emergency Countdown")
                print("    • Single-Tap 'I Can't Talk' Silent SOS Mode")
                print("    • Verified Safe Zones & Community Hazard Reporting")
                print("    • Live-Synced Trusted Contact Dashboard")
                print("    • 1-Click Judge Scenario Suite in Demo Mode")
                print("=" * 70)
                print(" Press Ctrl+C to stop the server.")
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
