/**
 * SafeWalk AI - Resilient Network API Client & Offline Event Queue
 * Seamlessly communicates with /api endpoints and ensures 100% offline resilience.
 * Never crashes when network is absent; queues events locally and retries upon reconnection.
 */

window.SAFEWALK_API_CLIENT = (function() {
  const QUEUE_STORAGE_KEY = "safewalk_offline_event_queue";
  let isOnline = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
  const connectivityListeners = new Set();

  function getOfflineQueue() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const q = localStorage.getItem(QUEUE_STORAGE_KEY);
      return q ? JSON.parse(q) : [];
    } catch (e) {
      return [];
    }
  }

  function saveOfflineQueue(queue) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn("Error saving offline queue:", e);
    }
  }

  function queueEvent(endpoint, method, payload) {
    const queue = getOfflineQueue();
    queue.push({
      id: "q_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      endpoint,
      method,
      payload,
      queuedAt: new Date().toISOString()
    });
    // Keep max 100 queued items
    if (queue.length > 100) queue.shift();
    saveOfflineQueue(queue);
  }

  async function flushOfflineQueue() {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    const remaining = [];
    for (const item of queue) {
      try {
        const response = await fetch(item.endpoint, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload)
        });
        if (!response.ok) {
          remaining.push(item);
        }
      } catch (e) {
        remaining.push(item);
      }
    }
    saveOfflineQueue(remaining);
  }

  // Network Event Listeners
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      isOnline = true;
      notifyConnectivity(true);
      flushOfflineQueue();
    });

    window.addEventListener('offline', () => {
      isOnline = false;
      notifyConnectivity(false);
    });
  }

  function notifyConnectivity(status) {
    connectivityListeners.forEach(cb => {
      try { cb(status); } catch (err) {}
    });
  }

  function subscribeConnectivity(cb) {
    connectivityListeners.add(cb);
    cb(isOnline);
    return () => connectivityListeners.delete(cb);
  }

  /**
   * Safe fetch with fallback and offline queueing
   */
  async function safeRequest(endpoint, method = "GET", body = null) {
    if (!isOnline) {
      if (method !== "GET" && body) {
        queueEvent(endpoint, method, body);
      }
      return { success: false, offline: true, message: "Operating in Local Safety Mode (Offline)" };
    }

    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body && method !== "GET") {
        opts.body = JSON.stringify(body);
      }

      const res = await fetch(endpoint, opts);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      // If network request failed, queue if state-changing
      if (method !== "GET" && body) {
        queueEvent(endpoint, method, body);
      }
      return { success: false, offline: true, error: err.message, message: "Local safety state continues. Event queued." };
    }
  }

  return {
    isOnline: () => isOnline,
    subscribeConnectivity,
    getOfflineQueueCount: () => getOfflineQueue().length,
    flushOfflineQueue,

    // API methods
    getHealth: () => safeRequest('/api/health', 'GET'),
    getSafetyStatus: () => safeRequest('/api/safety/status', 'GET'),
    updateSafetyStatus: (data) => safeRequest('/api/safety/status', 'POST', data),
    postSafetyEvent: (event) => safeRequest('/api/safety/event', 'POST', event),
    postCheckIn: (status, sessionId = "session_default") => safeRequest('/api/safety/check-in', 'POST', { status, sessionId }),
    postEscalate: (reason, location, priority = "CRITICAL") => safeRequest('/api/safety/escalate', 'POST', { reason, location, priority }),
    getRiskZones: () => safeRequest('/api/risk-zones', 'GET'),
    postRiskZone: (zone) => safeRequest('/api/risk-zones', 'POST', zone)
  };
})();
