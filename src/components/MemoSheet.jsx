// MemoSheet.jsx
// 인스타그램 스토리 스타일 — 이미지 위에 직접 텍스트 편집

import { useState, useRef, useEffect } from "react";

function MemoSheet({ images, editingIdx, memoText, hasMemo, onTextChange, onSave, onDelete, onClose }) {
  // 텍스트 위치 (화면 비율 0~1)
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  // 처음 열릴 때 textarea 포커스
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 120);
  }, []);

  // 텍스트 드래그 시작
  const onDragStart = (e) => {
    if (e.target === textareaRef.current) return; // 편집 중엔 드래그 안 함
    e.preventDefault();
    dragging.current = true;
    const touch = e.touches?.[0] || e;
    const rect = containerRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - (textRect.left + textRect.width / 2 - rect.left),
      y: touch.clientY - (textRect.top + textRect.height / 2 - rect.top),
    };
  };

  const onDragMove = (e) => {
    if (!dragging.current) return;
    const touch = e.touches?.[0] || e;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (touch.clientX - dragOffset.current.x - rect.left) / rect.width;
    const y = (touch.clientY - dragOffset.current.y - rect.top) / rect.height;
    setPos({ x: Math.max(0.05, Math.min(0.95, x)), y: Math.max(0.05, Math.min(0.95, y)) });
  };

  const onDragEnd = () => { dragging.current = false; };

  return (
    <div className="story-editor-overlay" onClick={onClose}>

      {/* 상단 툴바 */}
      <div className="story-toolbar" onClick={(e) => e.stopPropagation()}>
        <button className="story-close-btn" onClick={onClose}>✕</button>
        <span className="story-hint">드래그로 위치 이동</span>
        <div style={{ display: "flex", gap: 8 }}>
          {hasMemo && (
            <button className="story-delete-btn" onClick={onDelete}>삭제</button>
          )}
          <button className="story-save-btn" onClick={(e) => { e.stopPropagation(); onSave(pos); }}>저장</button>
        </div>
      </div>

      {/* 이미지 + 텍스트 편집 영역 */}
      <div
        ref={containerRef}
        className="story-canvas"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        {/* 배경 이미지 */}
        <img src={images[editingIdx]} alt="" className="story-bg-img" />
        {/* 살짝 어둡게 */}
        <div className="story-bg-dim" />

        {/* 드래그 가능한 텍스트 블록 */}
        <div
          ref={textRef}
          className="story-text-block"
          style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <textarea
            ref={textareaRef}
            className="story-textarea"
            value={memoText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="여기에 메모를 입력하세요..."
            maxLength={200}
            rows={1}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          />
          {/* 글자 수 */}
          {memoText.length > 0 && (
            <div className="story-char-count">{memoText.length}/200</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoSheet;