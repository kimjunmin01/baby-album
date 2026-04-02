// MemoPopover.jsx
// 단일뷰 상단 [메모장] 버튼 + 클릭 시 블러 오버레이 & 팝오버

export function MemoToggleBtn({ isOpen, onClick }) {
  return (
    <button
      className={`memo-toggle-btn ${isOpen ? "memo-toggle-btn--active" : ""}`}
      onClick={onClick}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      메모장
    </button>
  );
}

export function MemoPopover({ text, onClose }) {
  return (
    <div className="memo-blur-overlay" onClick={onClose}>
      <div className="memo-popover" onClick={(e) => e.stopPropagation()}>
        <div className="memo-popover-arrow" />
        <div className="memo-popover-inner">
          <p className="memo-popover-date">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ marginRight: 5 }}>
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            나의 메모
          </p>
          <p className="memo-popover-text">{text}</p>
        </div>
      </div>
    </div>
  );
}