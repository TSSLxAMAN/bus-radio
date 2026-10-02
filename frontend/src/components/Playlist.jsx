import { CloseIcon } from "./Icons";

export default function Playlist({ p, songs, open, onClose }) {
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-label="All songs">
        <header className="drawer-head">
          <h2>सारे गाने</h2>
          <button className="ctl" onClick={onClose} aria-label="Close song list"><CloseIcon /></button>
        </header>
        <ol className="list">
          {songs.map((s, i) => {
            const active = i === p.index;
            return (
              <li key={s.src}>
                <button className={`track ${active ? "active" : ""}`} onClick={() => { p.select(i); onClose(); }}>
                  <span className="num">
                    {active && p.playing ? (
                      <span className="bars" aria-label="Playing"><i /><i /><i /></span>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="info">
                    <span className="t">{s.title}</span>
                    <span className="a">{s.artist}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </>
  );
}
