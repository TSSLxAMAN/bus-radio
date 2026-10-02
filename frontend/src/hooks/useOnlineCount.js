import { useEffect, useState } from "react";

// Keeps one WebSocket open to the Python server and returns the live head-count.
// Reconnects automatically (1s, 2s, 4s ... up to 15s) if the connection drops.
export function useOnlineCount() {
  const [online, setOnline] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url =
      import.meta.env.VITE_WS_URL ||
      `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`;
    let ws;
    let retryTimer;
    let pingTimer;
    let attempt = 0;
    let stopped = false;

    const connect = () => {
      ws = new WebSocket(url);
      ws.onopen = () => {
        attempt = 0;
        setConnected(true);
        pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
        }, 25000);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.online === "number") setOnline(data.online);
        } catch {
          /* ignore malformed messages */
        }
      };
      ws.onclose = () => {
        clearInterval(pingTimer);
        setConnected(false);
        if (!stopped) {
          retryTimer = setTimeout(connect, Math.min(1000 * 2 ** attempt++, 15000));
        }
      };
    };

    connect();
    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      clearInterval(pingTimer);
      ws?.close();
    };
  }, []);

  return { online, connected };
}
