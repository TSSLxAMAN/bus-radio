import { useCallback, useEffect, useRef, useState } from "react";

// All audio logic lives here: play/pause, next/previous, seeking, volume.
export function usePlayer(songs) {
  const audioRef = useRef(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  // Jump to song i (wraps around at both ends) and start playing it.
  const select = useCallback(
    (i, autoplay = true) => {
      const a = audioRef.current;
      if (!a || !songs.length) return;
      const n = (i + songs.length) % songs.length;
      indexRef.current = n;
      setIndex(n);
      setTime(0);
      setDuration(0);
      setError(false);
      a.src = songs[n].src;
      if (autoplay) a.play().catch(() => {});
    },
    [songs]
  );

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    audioRef.current = a;
    if (songs.length) a.src = songs[0].src;

    const updateDuration = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const handlers = {
      timeupdate: () => setTime(a.currentTime),
      loadedmetadata: updateDuration,
      durationchange: updateDuration,
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      ended: () => select(indexRef.current + 1, true), // auto-advance
      error: () => {
        setError(true);
        setPlaying(false);
      },
    };
    Object.entries(handlers).forEach(([name, fn]) => a.addEventListener(name, fn));

    return () => {
      Object.entries(handlers).forEach(([name, fn]) => a.removeEventListener(name, fn));
      a.pause();
      a.removeAttribute("src");
      a.load();
    };
  }, [songs, select]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !songs.length) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, [songs]);

  const next = useCallback(() => select(indexRef.current + 1), [select]);

  // Like most players: if the song is past 3 seconds, "previous" restarts it.
  const prev = useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      return;
    }
    select(indexRef.current - 1);
  }, [select]);

  const seek = useCallback((seconds) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    setTime(seconds);
  }, []);

  // Lock-screen / headset controls and "now playing" info.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !songs[index]) return;
    const s = songs[index];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: s.title,
      artist: s.artist || "",
      artwork: s.cover ? [{ src: s.cover }] : [],
    });
  }, [index, songs]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (action, fn) => {
      try {
        ms.setActionHandler(action, fn);
      } catch {
        /* action not supported in this browser */
      }
    };
    set("play", () => audioRef.current?.play());
    set("pause", () => audioRef.current?.pause());
    set("previoustrack", prev);
    set("nexttrack", next);
    set("seekto", (d) => seek(d.seekTime));
    return () => ["play", "pause", "previoustrack", "nexttrack", "seekto"].forEach((a) => set(a, null));
  }, [prev, next, seek]);

  return {
    song: songs[index],
    index,
    total: songs.length,
    playing,
    time,
    duration,
    volume,
    muted,
    error,
    toggle,
    next,
    prev,
    seek,
    select,
    setVolume,
    toggleMute: () => setMuted((m) => !m),
  };
}
