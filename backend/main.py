"""Bus Radio backend: tells every open browser tab how many people are online.

Each browser opens one WebSocket to /ws. The server keeps the set of open
sockets, so "online" is simply len(sockets). Whenever someone joins or leaves,
the new number is pushed to everybody.

Run:  uvicorn main:app --reload --port 8000
"""
import json
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Bus Radio API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)


class Hub:
    def __init__(self) -> None:
        self.sockets: set[WebSocket] = set()

    @property
    def count(self) -> int:
        return len(self.sockets)

    async def join(self, ws: WebSocket) -> None:
        await ws.accept()
        self.sockets.add(ws)
        await self.broadcast()

    async def leave(self, ws: WebSocket) -> None:
        self.sockets.discard(ws)
        await self.broadcast()

    async def broadcast(self) -> None:
        # Drop sockets that fail to receive, then re-send if the count changed.
        while True:
            message = json.dumps({"online": self.count})
            dead = []
            for ws in list(self.sockets):
                try:
                    await ws.send_text(message)
                except Exception:
                    dead.append(ws)
            if not dead:
                return
            self.sockets.difference_update(dead)


hub = Hub()


@app.websocket("/ws")
async def online_socket(ws: WebSocket) -> None:
    await hub.join(ws)
    try:
        while True:
            await ws.receive_text()  # the browser sends "ping" every 25s to stay alive
    except WebSocketDisconnect:
        pass
    finally:
        await hub.leave(ws)


@app.get("/api/online")
def online() -> dict:
    return {"online": hub.count}


# After `npm run build`, FastAPI can serve the finished site too (one process).
DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if DIST.exists():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="site")
