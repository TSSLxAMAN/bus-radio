# Bus Radio

React (Vite) frontend + Python (FastAPI) backend.
Shows live "N online", plays a playlist with play/pause, previous/next and a seek bar.

## 1. Add your files

- Video -> `frontend/public/bus.mp4`
- Songs -> `frontend/public/songs/*.mp3`
- Then paste one line per song in `frontend/src/songs.js` (this is the only place songs live)
- Title and tagline -> `frontend/src/config.js` (and `<title>` in `frontend/index.html`)

## 2. Run (two terminals)

```bash
# terminal 1 – backend
cd backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# terminal 2 – frontend
cd frontend
npm install
npm run dev          # open http://localhost:5173
```

Open the site in two tabs: the number should become 2.

## 3. Deploy as one app

```bash
cd frontend && npm run build        # creates frontend/dist
cd ../backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

FastAPI serves `dist/` automatically when it exists.

Behind nginx, forward WebSocket upgrades for `/ws`:

```
location /ws { proxy_pass http://127.0.0.1:8000; proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_read_timeout 120s; }
```

## Notes

- The counter lives in memory, so run **one** uvicorn worker. For several workers/servers, keep the
  count in Redis instead (a set of connection ids with expiry, plus pub/sub to broadcast).
- One browser tab = one "online" user.
- Browsers block audio until the visitor taps once, so the first play must be a button press.
- Space bar = play/pause. Lock-screen and headset buttons work via the Media Session API.
