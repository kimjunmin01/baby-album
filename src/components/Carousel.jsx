// Carousel.jsx — 상태 관리 전담
// UI는 하위 컴포넌트에 위임합니다.
//
// 📂 관련 파일
//   GridView.jsx      — 3열 그리드뷰
//   ThumbnailBar.jsx  — 하단 썸네일바
//   MemoSheet.jsx     — 메모 편집 바텀시트
//   MemoPopover.jsx   — 단일뷰 메모 팝오버
//   data/albums.js    — 앨범별 이미지/텍스트 데이터

import { useRef, useState, useEffect, useCallback } from "react";
import GridView from "./GridView";
import ThumbnailBar from "./ThumbnailBar";
import MemoSheet from "./MemoSheet";
import { MemoToggleBtn, MemoPopover } from "./MemoPopover";
import "../styles/carousel.css";

function Carousel({ images, albumId, onModalChange }) {
  // ── 뷰 상태 ──────────────────────────────────────────────
  const [active, setActive]             = useState(0);
  const [isModal, setIsModal]           = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGridView, setIsGridView]     = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed]         = useState(false);
  const [dragY, setDragY]               = useState(0);
  const [previewIdx, setPreviewIdx]     = useState(null);

  // ── 메모 상태 ────────────────────────────────────────────
  const [memoMap, setMemoMap]         = useState({});
  const [editingIdx, setEditingIdx]   = useState(null);
  const [memoText, setMemoText]       = useState("");
  const [isMemoOpen, setIsMemoOpen]   = useState(false);
  const [isFlipped, setIsFlipped]     = useState(false); // 꽉찬뷰 카드 플립

  // ── Refs ─────────────────────────────────────────────────
  const total       = images.length;
  const isDragging  = useRef(false);
  const dragStartX  = useRef(0);
  const pressTimer  = useRef(null);
  const isLongPress = useRef(false);
  const imgRef      = useRef(null);
  const lastPos     = useRef({ x: 0, y: 0 });
  const startPos    = useRef({ x: 0, y: 0 });
  let lastTap       = 0;

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const ZOOM_SCALE = 1.8;

  // ── 탭 전환 시 전체 초기화 ───────────────────────────────
  useEffect(() => {
    setActive(0); setIsModal(false); setModalVisible(false);
    setIsGridView(false); setIsFullscreen(false); setIsZoomed(false);
    setPreviewIdx(null); setDragY(0); setIsMemoOpen(false); setIsFlipped(false);
    setZoomPos({ x: 0, y: 0 });
    lastPos.current = { x: 0, y: 0 };
    isLongPress.current = false;
    clearTimeout(pressTimer.current);
    onModalChange?.(false);
  }, [albumId]);

  // ── 메모 로드 ────────────────────────────────────────────
  const memoKey = useCallback((idx) => `memo-${albumId}-${idx}`, [albumId]);

  useEffect(() => {
    const map = {};
    images.forEach((_, i) => {
      const saved = localStorage.getItem(memoKey(i));
      if (saved) map[memoKey(i)] = saved;
    });
    setMemoMap(map);
  }, [albumId, images, memoKey]);

  // ── 메모 저장/삭제 ───────────────────────────────────────
  const saveMemo = () => {
    const key = memoKey(editingIdx);
    setMemoMap((prev) => ({ ...prev, [key]: memoText }));
    localStorage.setItem(key, memoText);
    setEditingIdx(null); setMemoText("");
  };

  const deleteMemo = () => {
    const key = memoKey(editingIdx);
    setMemoMap((prev) => { const next = { ...prev }; delete next[key]; return next; });
    localStorage.removeItem(key);
    setEditingIdx(null); setMemoText("");
  };

  const openMemo = (e, idx) => {
    e.stopPropagation();
    setMemoText(memoMap[memoKey(idx)] || "");
    setEditingIdx(idx);
  };

  // ── 모달 열기/닫기 ───────────────────────────────────────
  const openModal = (index) => {
    setActive(index);
    setIsFullscreen(false); setIsGridView(false); setIsZoomed(false);
    setDragY(0); setZoomPos({ x: 0, y: 0 });
    lastPos.current = { x: 0, y: 0 };
    setIsModal(true);
    onModalChange?.(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsZoomed(false); setIsGridView(false); setIsFullscreen(false);
    setPreviewIdx(null); setDragY(0); setIsMemoOpen(false); setIsFlipped(false);
    setZoomPos({ x: 0, y: 0 }); lastPos.current = { x: 0, y: 0 };
    onModalChange?.(false);
    setTimeout(() => setIsModal(false), 320);
  };

  // ── ✕ 버튼 계층 ─────────────────────────────────────────
  const handleCloseBtn = (e) => {
    e.stopPropagation();
    if (isZoomed)      { setIsZoomed(false); setZoomPos({ x: 0, y: 0 }); lastPos.current = { x: 0, y: 0 }; }
    else if (isFullscreen) { setIsFullscreen(false); setIsGridView(true); }
    else if (isGridView)   { setIsGridView(false); }
    else                   { closeModal(); }
  };

  // ── 이전/다음 ────────────────────────────────────────────
  const handleNext = (e) => { e?.stopPropagation(); setIsMemoOpen(false); setActive((p) => (p + 1) % total); };
  const handlePrev = (e) => { e?.stopPropagation(); setIsMemoOpen(false); setActive((p) => (p - 1 + total) % total); };

  // ── 더블탭 줌 ───────────────────────────────────────────
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (isZoomed) { setZoomPos({ x: 0, y: 0 }); lastPos.current = { x: 0, y: 0 }; }
      setIsZoomed(!isZoomed);
    }
    lastTap = now;
  };

  // ── 줌 이동 ─────────────────────────────────────────────
  const handleZoomMove = (e) => {
    if (!isZoomed || e.touches.length > 1 || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const limitX = rect.width  > window.innerWidth  ? (rect.width  - window.innerWidth)  / 2 : 0;
    const limitY = rect.height > window.innerHeight ? (rect.height - window.innerHeight) / 2 : 0;
    setZoomPos({
      x: Math.max(-limitX, Math.min(limitX, e.touches[0].clientX - startPos.current.x)),
      y: Math.max(-limitY, Math.min(limitY, e.touches[0].clientY - startPos.current.y)),
    });
  };

  // ── 자동 슬라이드 ────────────────────────────────────────
  useEffect(() => {
    if (isModal) return;
    const id = setInterval(() => {
      if (!isDragging.current) setActive((p) => (p + 1) % total);
    }, 3000);
    return () => clearInterval(id);
  }, [isModal, total]);

  // ── 썸네일바 스와이프 콜백 ───────────────────────────────
  const handleThumbSwipe = (dy, isEnd) => {
    if (isEnd) { if (dragY > 100) setIsGridView(true); setDragY(0); }
    else setDragY(dy);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* 홈 캐러셀 */}
      <div className="carousel"
        onMouseDown={(e) => { if (isModal) return; isDragging.current = true; dragStartX.current = e.clientX; }}
        onMouseMove={(e) => {
          if (!isDragging.current || isModal) return;
          const diff = e.clientX - dragStartX.current;
          if (Math.abs(diff) > 50) { setActive((p) => diff < 0 ? (p + 1) % total : (p - 1 + total) % total); isDragging.current = false; }
        }}
        onMouseUp={() => { isDragging.current = false; }}
        onTouchStart={(e) => { if (isModal) return; isDragging.current = true; dragStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => {
          if (!isDragging.current || isModal) return;
          const diff = e.touches[0].clientX - dragStartX.current;
          if (Math.abs(diff) > 50) { setActive((p) => diff < 0 ? (p + 1) % total : (p - 1 + total) % total); isDragging.current = false; }
        }}
        onTouchEnd={() => { isDragging.current = false; }}
      >
        {images.map((img, index) => {
          let offset = index - active;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const isHidden = Math.abs(offset) > 3;
          return (
            <div key={index}
              className={`carousel-item ${index === active ? "active" : ""}`}
              style={{ "--offset": offset, opacity: isHidden ? 0 : 1, visibility: isHidden ? "hidden" : "visible" }}
              onClick={() => openModal(index)}
            >
              <img src={img} alt="" draggable={false} />
              {index === active && <div className="card-badge">{index + 1}</div>}
              {memoMap[memoKey(index)] && <div className="card-memo-dot" />}
            </div>
          );
        })}
      </div>

      {/* 모달 */}
      {isModal && (
        <div className={`modal ${modalVisible ? "modal-open" : ""}`} onClick={(e) => e.stopPropagation()}>

          {previewIdx === null && (
            <button className="modal-close-global" onClick={handleCloseBtn}>✕</button>
          )}

          {/* 꽉찬뷰 — 카드 플립 */}
          {isFullscreen ? (
            <div className="fullscreen-wrap" onClick={(e) => e.stopPropagation()}>

              {/* Tad 버튼 */}
              <button
                className={`tad-btn ${isFlipped ? "tad-btn--active" : ""}`}
                onClick={() => setIsFlipped((v) => !v)}
              >
                {isFlipped ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    사진 보기
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Tad
                  </>
                )}
              </button>

              {/* 카드 플립 */}
              <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
                <div className="flip-card-inner">

                  {/* 앞면: 이미지 */}
                  <div className="flip-front">
                    <img src={images[active]} alt="" />
                  </div>

                  {/* 뒷면: 같은 이미지 흐릿 + 메모 오버레이 */}
                  <div className="flip-back">
                    <img className="flip-back-img" src={images[active]} alt="" />
                    <div className="flip-back-overlay">
                      {memoMap[memoKey(active)] ? (
                        <>
                          <div className="flip-memo-deco">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(196,163,90,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                          <p className="flip-memo-label">나의 메모</p>
                          <div className="flip-memo-divider" />
                          <p className="flip-memo-text">{memoMap[memoKey(active)]}</p>
                        </>
                      ) : (
                        <div className="flip-memo-empty">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,248,235,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                          <p>아직 메모가 없어요</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          /* 단일 상세뷰 */
          ) : !isGridView ? (
            <div
              className={`modal-center ${isZoomed ? "zoomed-mode" : ""}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${1 - dragY / 1000}) translateY(${-dragY / 10}px)`,
                opacity: 1 - dragY / 500,
                transition: dragY === 0 ? "0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
              }}
            >
              {!isZoomed && <div className="modal-top-counter">{active + 1} / {total}</div>}
              {!isZoomed && (
                <>
                  <button className="modal-nav-btn prev" onClick={handlePrev}>〈</button>
                  <button className="modal-nav-btn next" onClick={handleNext}>〉</button>
                </>
              )}

              <div className="modal-frame"
                style={{ width:"100vw", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handleDoubleTap();
                    if (isZoomed) startPos.current = { x: e.touches[0].clientX - lastPos.current.x, y: e.touches[0].clientY - lastPos.current.y };
                  }
                }}
                onTouchMove={handleZoomMove}
                onTouchEnd={() => { if (isZoomed) lastPos.current = { x: zoomPos.x, y: zoomPos.y }; }}
              >
                <img ref={imgRef} className="modal-image" src={images[active]} alt=""
                  style={{
                    maxWidth:"100%", maxHeight:"100%", objectFit:"contain",
                    transform: isZoomed ? `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(${ZOOM_SCALE})` : "scale(1)",
                    transition: isZoomed ? "none" : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    touchAction: isZoomed ? "none" : "auto",
                  }}
                />
              </div>

              {!isZoomed && memoMap[memoKey(active)] && (
                <MemoToggleBtn isOpen={isMemoOpen} onClick={(e) => { e.stopPropagation(); setIsMemoOpen((v) => !v); }} />
              )}

              {!isZoomed && isMemoOpen && memoMap[memoKey(active)] && (
                <MemoPopover text={memoMap[memoKey(active)]} onClose={(e) => { e.stopPropagation(); setIsMemoOpen(false); }} />
              )}
            </div>

          /* 그리드뷰 */
          ) : (
            <GridView
              images={images} active={active}
              memoKey={memoKey} memoMap={memoMap}
              previewIdx={previewIdx}
              pressTimer={pressTimer} isLongPress={isLongPress}
              onImageClick={(i) => { setActive(i); setIsFullscreen(true); setIsGridView(false); }}
              onLongPress={(i) => setPreviewIdx(i)}
              onMemoClick={openMemo}
            />
          )}

          {/* 롱프레스 프리뷰 팝업 */}
          {previewIdx !== null && (
            <div className="ios-preview-overlay" onClick={(e) => { e.stopPropagation(); setPreviewIdx(null); isLongPress.current = false; }}>
              <div className="ios-preview-card" onClick={(e) => e.stopPropagation()}>
                <img src={images[previewIdx]} alt="preview" />
              </div>
            </div>
          )}

          {/* 하단 썸네일바 */}
          {!isZoomed && !isGridView && !isFullscreen && (
            <ThumbnailBar
              images={images} active={active}
              memoKey={memoKey} memoMap={memoMap}
              dragY={dragY}
              onThumbClick={(i) => setActive(i)}
              onSwipeUp={handleThumbSwipe}
            />
          )}
        </div>
      )}

      {/* 메모 편집 바텀시트 */}
      {editingIdx !== null && (
        <MemoSheet
          images={images} editingIdx={editingIdx}
          memoText={memoText} hasMemo={!!memoMap[memoKey(editingIdx)]}
          onTextChange={setMemoText}
          onSave={saveMemo} onDelete={deleteMemo}
          onClose={() => { setEditingIdx(null); setMemoText(""); }}
        />
      )}
    </>
  );
}

export default Carousel;