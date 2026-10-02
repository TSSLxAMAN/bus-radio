import { formatTime } from "../utils";
import { MuteIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from "./Icons";

const fill = (value, max) => `${max > 0 ? (value / max) * 100 : 0}%`;

export default function PlayerBar({ p }) {
  const { song } = p;

  if (!song) {
    return (
      <section className="player empty">
        <p>No songs yet. Add them in <code>src/songs.js</code>.</p>
      </section>
    );
  }

  return (
    <section className="player" aria-label="Music player">
      {song.cover ? (
        <img className="cover" src={song.cover} alt="" />
      ) : (
        <div className="cover" aria-hidden="true">♪</div>
      )}

      <div className="meta">
        <p className="title">{song.title}</p>
        <p className="credits">{p.error ? "This song could not be loaded" : song.artist}</p>
      </div>

      <div className="controls">
        <button className="ctl" onClick={p.prev} aria-label="Previous song"><PrevIcon /></button>
        <button className="ctl play" onClick={p.toggle} aria-label={p.playing ? "Pause" : "Play"}>
          {p.playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="ctl" onClick={p.next} aria-label="Next song"><NextIcon /></button>
        <button className="ctl vol-btn" onClick={p.toggleMute} aria-label={p.muted ? "Unmute" : "Mute"}>
          {p.muted ? <MuteIcon /> : <VolumeIcon />}
        </button>
        <input
          className="range vol"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={p.muted ? 0 : p.volume}
          style={{ "--fill": fill(p.muted ? 0 : p.volume, 1) }}
          onChange={(e) => {
            p.setVolume(+e.target.value);
            if (p.muted && +e.target.value > 0) p.toggleMute();
          }}
          aria-label="Volume"
        />
      </div>

      <div className="seekrow">
        <span className="time">{formatTime(p.time)}</span>
        <input
          className="range"
          type="range"
          min="0"
          max={p.duration || 0}
          step="0.1"
          value={Math.min(p.time, p.duration || 0)}
          style={{ "--fill": fill(p.time, p.duration) }}
          onChange={(e) => p.seek(+e.target.value)}
          disabled={!p.duration}
          aria-label="Seek"
        />
        <span className="time">{formatTime(p.duration)}</span>
      </div>
    </section>
  );
}
