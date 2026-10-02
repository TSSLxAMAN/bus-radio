import { useEffect, useRef, useState } from "react";
import { SITE } from "./config";
import { SONGS } from "./songs";
import { useOnlineCount } from "./hooks/useOnlineCount";
import { usePlayer } from "./hooks/usePlayer";
import PlayerBar from "./components/PlayerBar";
import Playlist from "./components/Playlist";
import { ListIcon } from "./components/Icons";

export default function App() {
  const { online, connected } = useOnlineCount();
  const player = usePlayer(SONGS);
  const [listOpen, setListOpen] = useState(false);
  const videoRef = useRef(null);

  // People who ask their device to reduce motion get a still frame instead of the looping video.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) videoRef.current?.pause();
  }, []);

  // Space = play/pause, Esc = close the song list.
  const { toggle } = player;
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setListOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <main className="stage">
      <video ref={videoRef} className="bg" src={SITE.video} autoPlay loop muted playsInline preload="auto" />
      <div className="shade" />

      <header className="top">
        <div className="pill" role="status">
          <span className={`dot ${connected ? "live" : ""}`} />
          <span>{connected && online !== null ? `${online} online` : "connecting…"}</span>
        </div>
        <button className="pill" onClick={() => setListOpen(true)} aria-expanded={listOpen}>
          <ListIcon /> Songs
        </button>
      </header>

      <section className="hero">
        <h1>
          {SITE.titleLines.map((line, i) => (
            <span key={i} className="line">{line}</span>
          ))}
        </h1>
        <p className="tagline">{SITE.tagline}</p>
      </section>

      <PlayerBar p={player} />
      <Playlist p={player} songs={SONGS} open={listOpen} onClose={() => setListOpen(false)} />
    </main>
  );
}
