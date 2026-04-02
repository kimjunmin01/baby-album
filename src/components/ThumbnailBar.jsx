// ThumbnailBar.jsx
// 단일뷰 하단 썸네일바 + 위로 스와이프 → 그리드뷰 전환

import { useRef, useEffect } from "react";

function ThumbnailBar({ images, active, memoKey, memoMap, dragY, onThumbClick, onSwipeUp }) {
  const thumbBarRef = useRef(null);
  const activeThumbRef = useRef(null);
  const thumbDragStart = useRef(0);

  useEffect(() => {
    if (activeThumbRef.current && thumbBarRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth", block: "nearest", inline: "center",
      });
    }
  }, [active]);

  return (
    <div
      className="thumbnail-bar-wrap"
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: `translateY(${-dragY}px)`,
        backgroundColor: `rgba(255, 255, 255, ${dragY / 250})`,
        backdropFilter: `blur(${dragY / 15}px)`,
        transition: dragY === 0 ? "0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
      }}
    >
      <div
        className="drag-handle-area"
        onTouchStart={(e) => { thumbDragStart.current = e.touches[0].clientY; }}
        onTouchMove={(e) => {
          const d = thumbDragStart.current - e.touches[0].clientY;
          if (d > 0) onSwipeUp(Math.min(d, 220), false);
        }}
        onTouchEnd={() => onSwipeUp(0, true)}
      >
        <div className="drag-handle-line" />
      </div>

      <div className="thumbnail-bar" ref={thumbBarRef}>
        {images.map((img, i) => (
          <div
            key={i}
            ref={i === active ? activeThumbRef : null}
            className={`thumb-card ${i === active ? "active-thumb" : ""}`}
            onClick={() => onThumbClick(i)}
          >
            <img src={img} alt="" />
            {i === active && <div className="thumb-shine" />}
            {memoMap[memoKey(i)] && <div className="thumb-memo-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThumbnailBar;