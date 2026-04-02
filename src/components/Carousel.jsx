import { useRef, useState, useEffect, useCallback } from "react";
import "../styles/carousel.css";

function Carousel({ images, albumId }) {
  const [active, setActive] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [previewIdx, setPreviewIdx] = useState(null);

  // 메모 상태
  const [memoMap, setMemoMap] = useState({});
  const [editingIdx, setEditingIdx] = useState(null);
  const [memoText, setMemoText] = useState("");
  const [isMemoOpen, setIsMemoOpen] = useState(false); // 단일뷰 메모 팝오버

  const total = images.length;
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const thumbDragStart = useRef(0);
  const pressTimer = useRef(null);
  const isLongPress = useRef(false);
  const imgRef = useRef(null);
  let lastTap = 0;

  const thumbBarRef = useRef(null);
  const activeThumbRef = useRef(null);
  const memoInputRef = useRef(null);

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const ZOOM_SCALE = 1.8;

  // albumId 바뀌면 모든 상태 완전 초기화
  useEffect(() => {
    setActive(0);
    setIsModal(false);
    setModalVisible(false);
    setIsGridView(false);
    setIsFullscreen(false);
    setIsZoomed(false);
    setPreviewIdx(null);
    setDragY(0);
    setZoomPos({ x: 0, y: 0 });
    lastPos.current = { x: 0, y: 0 };
    isLongPress.current = false;
    clearTimeout(pressTimer.current);
  }, [albumId]);

  // 메모 로드/저장 (localStorage 활용)
  const memoKey = useCallback((idx) => `memo-${albumId}-${idx}`, [albumId]);

  useEffect(() => {
    const map = {};
    images.forEach((_, i) => {
      const saved = localStorage.getItem(memoKey(i));
      if (saved) map[memoKey(i)] = saved;
    });
    setMemoMap(map);
  }, [albumId, images, memoKey]);

  const saveMemo = () => {
    const key = memoKey(editingIdx);
    const updated = { ...memoMap, [key]: memoText };
    setMemoMap(updated);
    localStorage.setItem(key, memoText);
    setEditingIdx(null);
    setMemoText("");
  };

  const openMemo = (e, idx) => {
    e.stopPropagation();
    const existing = memoMap[memoKey(idx)] || "";
    setMemoText(existing);
    setEditingIdx(idx);
    setTimeout(() => memoInputRef.current?.focus(), 100);
  };

  const deleteMemo = (idx) => {
    const key = memoKey(idx);
    const updated = { ...memoMap };
    delete updated[key];
    setMemoMap(updated);
    localStorage.removeItem(key);
  };

  useEffect(() => {
    if (isModal && !isGridView && activeThumbRef.current && thumbBarRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active, isModal, isGridView]);

  const openModal = (index) => {
    setActive(index);
    setIsFullscreen(false);  // 항상 상세보기(단일뷰)로 시작
    setIsGridView(false);
    setIsZoomed(false);
    setDragY(0);
    setZoomPos({ x: 0, y: 0 });
    lastPos.current = { x: 0, y: 0 };
    setIsModal(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsZoomed(false);
    setIsGridView(false);
    setIsFullscreen(false);
    setPreviewIdx(null);
    setDragY(0);
    setIsMemoOpen(false);
    setZoomPos({ x: 0, y: 0 });
    lastPos.current = { x: 0, y: 0 };
    setTimeout(() => setIsModal(false), 320);
  };

  const handleCloseBtn = (e) => {
    e.stopPropagation();
    if (isZoomed) {
      setIsZoomed(false);
      setZoomPos({ x: 0, y: 0 });
      lastPos.current = { x: 0, y: 0 };
    } else if (isFullscreen) {
      setIsFullscreen(false);
      setIsGridView(true);
    } else if (isGridView) {
      setIsGridView(false);
    } else {
      closeModal();
    }
  };

  const handleNext = (e) => { e?.stopPropagation(); setIsMemoOpen(false); setActive((prev) => (prev + 1) % total); };
  const handlePrev = (e) => { e?.stopPropagation(); setIsMemoOpen(false); setActive((prev) => (prev - 1 + total) % total); };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (isZoomed) {
        setZoomPos({ x: 0, y: 0 });
        lastPos.current = { x: 0, y: 0 };
      }
      setIsZoomed(!isZoomed);
    }
    lastTap = now;
  };

  const handleZoomMove = (e) => {
    if (!isZoomed || e.touches.length > 1 || !imgRef.current) return;
    let newX = e.touches[0].clientX - startPos.current.x;
    let newY = e.touches[0].clientY - startPos.current.y;
    const rect = imgRef.current.getBoundingClientRect();
    const zoomedWidth = rect.width;
    const zoomedHeight = rect.height;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const limitX = zoomedWidth > viewWidth ? (zoomedWidth - viewWidth) / 2 : 0;
    const limitY = zoomedHeight > viewHeight ? (zoomedHeight - viewHeight) / 2 : 0;
    newX = Math.max(-limitX, Math.min(limitX, newX));
    newY = Math.max(-limitY, Math.min(limitY, newY));
    setZoomPos({ x: newX, y: newY });
  };

  useEffect(() => {
    if (isModal) return;
    const id = setInterval(() => {
      if (!isDragging.current) setActive((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(id);
  }, [isModal, total]);

  return (
    <>
      <div className="carousel"
        onMouseDown={(e) => { if (isModal) return; isDragging.current = true; dragStartX.current = e.clientX; }}
        onMouseMove={(e) => {
          if (!isDragging.current || isModal) return;
          const diff = e.clientX - dragStartX.current;
          if (Math.abs(diff) > 50) { setActive((prev) => diff < 0 ? (prev + 1) % total : (prev - 1 + total) % total); isDragging.current = false; }
        }}
        onMouseUp={() => isDragging.current = false}
        onTouchStart={(e) => { if (isModal) return; isDragging.current = true; dragStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => {
          if (!isDragging.current || isModal) return;
          const diff = e.touches[0].clientX - dragStartX.current;
          if (Math.abs(diff) > 50) { setActive((prev) => diff < 0 ? (prev + 1) % total : (prev - 1 + total) % total); isDragging.current = false; }
        }}
        onTouchEnd={() => isDragging.current = false}
      >
        {images.map((img, index) => {
          let offset = index - active;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const isHidden = Math.abs(offset) > 3;
          return (
            <div key={index} className={`carousel-item ${index === active ? "active" : ""}`}
              style={{ "--offset": offset, opacity: isHidden ? 0 : 1, visibility: isHidden ? "hidden" : "visible" }}
              onClick={() => openModal(index)}
            >
              <img src={img} alt="" draggable={false} />
              {index === active && <div className="card-badge">{index + 1}</div>}
              {memoMap[memoKey(index)] && (
                <div className="card-memo-dot" />
              )}
            </div>
          );
        })}
      </div>

      {isModal && (
        <div className={`modal ${modalVisible ? "modal-open" : ""}`} onClick={(e) => e.stopPropagation()}>
          {previewIdx === null && (
            <button className="modal-close-global" onClick={handleCloseBtn}>✕</button>
          )}

          {isFullscreen ? (
            <div className="fullscreen-viewer" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
              <img
                src={images[active]}
                alt=""
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : !isGridView ? (
            <div
              className={`modal-center ${isZoomed ? "zoomed-mode" : ""}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${1 - (dragY / 1000)}) translateY(${-dragY / 10}px)`,
                opacity: 1 - (dragY / 500),
                transition: dragY === 0 ? '0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
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
                style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handleDoubleTap();
                    if (isZoomed) {
                      startPos.current = { x: e.touches[0].clientX - lastPos.current.x, y: e.touches[0].clientY - lastPos.current.y };
                    }
                  }
                }}
                onTouchMove={handleZoomMove}
                onTouchEnd={() => { if (isZoomed) lastPos.current = { x: zoomPos.x, y: zoomPos.y }; }}
              >
                <img
                  ref={imgRef}
                  className="modal-image"
                  src={images[active]}
                  alt=""
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: isZoomed ? `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(${ZOOM_SCALE})` : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    touchAction: isZoomed ? 'none' : 'auto'
                  }}
                />
              </div>

              {/* 메모장 버튼 (단일뷰 상단, 메모 있을 때만) */}
              {!isZoomed && memoMap[memoKey(active)] && (
                <button
                  className={`memo-toggle-btn ${isMemoOpen ? "memo-toggle-btn--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setIsMemoOpen((v) => !v); }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  메모장
                </button>
              )}

              {/* 블러 오버레이 + 메모 팝오버 */}
              {!isZoomed && isMemoOpen && memoMap[memoKey(active)] && (
                <div
                  className="memo-blur-overlay"
                  onClick={(e) => { e.stopPropagation(); setIsMemoOpen(false); }}
                >
                  <div className="memo-popover" onClick={(e) => e.stopPropagation()}>
                    <div className="memo-popover-arrow" />
                    <div className="memo-popover-inner">
                      <p className="memo-popover-date">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5}}>
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        나의 메모
                      </p>
                      <p className="memo-popover-text">{memoMap[memoKey(active)]}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─── 그리드 뷰 ─── */
            <div className="modal-grid-view" onClick={(e) => e.stopPropagation()}
              style={{ visibility: previewIdx !== null ? 'hidden' : 'visible' }}
            >
              <div className="grid-container">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`grid-item ${i === active ? "active-grid" : ""}`}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      isLongPress.current = false;
                      pressTimer.current = setTimeout(() => {
                        isLongPress.current = true;
                        setPreviewIdx(i);
                      }, 1000);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      clearTimeout(pressTimer.current);
                      if (!isLongPress.current && previewIdx === null) {
                        setActive(i);
                        setIsFullscreen(true);
                        setIsGridView(false);
                      }
                      // 롱프레스 후 손 뗄 때 플래그 초기화 (딜레이 후)
                      setTimeout(() => { isLongPress.current = false; }, 50);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // 롱프레스 플래그 또는 팝업 열린 상태면 클릭 무시
                      if (isLongPress.current || previewIdx !== null) return;
                      setActive(i);
                      setIsFullscreen(true);
                      setIsGridView(false);
                    }}
                  >
                    <img src={img} alt="" />

                    {/* 메모 아이콘 버튼 */}
                    <button
                      className={`grid-memo-btn ${memoMap[memoKey(i)] ? "has-memo" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openMemo(e, i);
                      }}
                      onTouchStart={(e) => {
                        // 메모 버튼 터치 시작 시 롱프레스 타이머 즉시 취소
                        e.stopPropagation();
                        clearTimeout(pressTimer.current);
                        isLongPress.current = false;
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        clearTimeout(pressTimer.current);
                        isLongPress.current = false;
                        openMemo(e, i);
                      }}
                    >
                      {memoMap[memoKey(i)] ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                      )}
                    </button>

                    {/* 메모 미리보기 dot */}
                    {memoMap[memoKey(i)] && (
                      <div className="grid-memo-preview">
                        <span>{memoMap[memoKey(i)]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewIdx !== null && (
            <div className="ios-preview-overlay" onClick={(e) => {
              e.stopPropagation();
              setPreviewIdx(null);
              isLongPress.current = false;  // 팝업 닫힌 후 다음 탭이 정상 동작하도록
            }}>
              <div className="ios-preview-card" onClick={(e) => e.stopPropagation()}>
                <img src={images[previewIdx]} alt="preview" />
              </div>
            </div>
          )}

          {!isZoomed && !isGridView && !isFullscreen && (
            <div className="thumbnail-bar-wrap"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `translateY(${-dragY}px)`,
                backgroundColor: `rgba(255, 255, 255, ${dragY / 250})`,
                backdropFilter: `blur(${dragY / 15}px)`,
                transition: dragY === 0 ? '0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
              }}
            >
              <div className="drag-handle-area"
                onTouchStart={(e) => { thumbDragStart.current = e.touches[0].clientY; }}
                onTouchMove={(e) => {
                  if (!isGridView) {
                    const d = thumbDragStart.current - e.touches[0].clientY;
                    if (d > 0) setDragY(Math.min(d, 220));
                  }
                }}
                onTouchEnd={() => {
                  if (dragY > 100) setIsGridView(true);
                  setDragY(0);
                }}
              >
                <div className="drag-handle-line" />
              </div>
              <div className="thumbnail-bar" ref={thumbBarRef}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    ref={i === active ? activeThumbRef : null}
                    className={`thumb-card ${i === active ? "active-thumb" : ""}`}
                    onClick={() => setActive(i)}
                  >
                    <img src={img} alt="" />
                    {i === active && <div className="thumb-shine" />}
                    {memoMap[memoKey(i)] && <div className="thumb-memo-dot" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 메모 편집 시트 ─── */}
      {editingIdx !== null && (
        <div className="memo-sheet-overlay" onClick={() => { setEditingIdx(null); setMemoText(""); }}>
          <div className="memo-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="memo-sheet-handle" />
            <div className="memo-sheet-header">
              <span className="memo-sheet-title">사진 메모</span>
              <div className="memo-sheet-actions">
                {memoMap[memoKey(editingIdx)] && (
                  <button className="memo-delete-btn" onClick={() => { deleteMemo(editingIdx); setEditingIdx(null); setMemoText(""); }}>
                    삭제
                  </button>
                )}
                <button className="memo-save-btn" onClick={saveMemo}>저장</button>
              </div>
            </div>
            <div className="memo-img-preview">
              <img src={images[editingIdx]} alt="" />
            </div>
            <textarea
              ref={memoInputRef}
              className="memo-textarea"
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="이 사진에 대한 이야기를 남겨보세요..."
              rows={4}
              maxLength={200}
            />
            <div className="memo-char-count">{memoText.length} / 200</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Carousel;