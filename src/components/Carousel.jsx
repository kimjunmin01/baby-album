import { useRef, useState, useEffect } from "react";
import "../styles/carousel.css";

function Carousel({ images }) {
  const [active, setActive]           = useState(0);
  const [isModal, setIsModal]         = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isZoomed, setIsZoomed]       = useState(false);
  const [isGridView, setIsGridView]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // 💡 시원한 뷰를 위한 상태 추가
  const [dragY, setDragY]             = useState(0);
  const [previewIdx, setPreviewIdx]   = useState(null);

  const total          = images.length;
  const isDragging     = useRef(false);
  const dragStartX     = useRef(0);
  const thumbDragStart = useRef(0);
  const pressTimer     = useRef(null);
  const isLongPress    = useRef(false); 
  const imgRef         = useRef(null);
  let lastTap          = 0;

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const ZOOM_SCALE = 1.8; 

  const openModal = (index) => {
    setActive(index);
    setIsModal(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsZoomed(false);
    setIsGridView(false);
    setIsFullscreen(false); // 💡 닫을 때 풀스크린 초기화
    setPreviewIdx(null);
    setDragY(0);
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
      // 💡 시원한 뷰에서 X를 누르면 다시 그리드 창으로 복귀
      setIsFullscreen(false);
      setIsGridView(true);
    } else if (isGridView) {
      setIsGridView(false);
    } else {
      closeModal();
    }
  };

  const handleNext = (e) => { e?.stopPropagation(); setActive((prev) => (prev + 1) % total); };
  const handlePrev = (e) => { e?.stopPropagation(); setActive((prev) => (prev - 1 + total) % total); };

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
            </div>
          );
        })}
      </div>

      {isModal && (
        <div className={`modal ${modalVisible ? "modal-open" : ""}`} onClick={(e) => e.stopPropagation()}>
          {previewIdx === null && (
            <button className="modal-close-global" onClick={handleCloseBtn}>✕</button>
          )}

          {/* 💡 시원한 꽉 찬 뷰 (그리드에서 클릭 시) */}
          {isFullscreen ? (
            <div className="fullscreen-viewer" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img 
                 src={images[active]} 
                 alt="" 
                 style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
               />
            </div>
          ) : !isGridView ? (
            /* 기존 상세 보기 모달 (네비게이션, 썸네일 포함) */
            <div className={`modal-center ${isZoomed ? "zoomed-mode" : ""}`} onClick={(e) => e.stopPropagation()}>
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
                    if(isZoomed) {
                      startPos.current = { x: e.touches[0].clientX - lastPos.current.x, y: e.touches[0].clientY - lastPos.current.y };
                    }
                  }
                }}
                onTouchMove={handleZoomMove}
                onTouchEnd={() => { if(isZoomed) lastPos.current = { x: zoomPos.x, y: zoomPos.y }; }}
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
            </div>
          ) : (
            /* 그리드 뷰 */
            <div className="modal-grid-view" onClick={(e) => e.stopPropagation()}>
              <div className="grid-container">
                {images.map((img, i) => (
                  <div key={i} className={`grid-item ${i === active ? "active-grid" : ""}`}
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
                        // 💡 여기서 시원한 뷰(Fullscreen)로 진입!
                        setIsFullscreen(true);
                        setIsGridView(false); 
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      if (!isLongPress.current) {
                        setActive(i);
                        setIsFullscreen(true);
                        setIsGridView(false);
                      }
                    }}
                  >
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 롱프레스 프리뷰 */}
          {previewIdx !== null && (
            <div className="ios-preview-overlay" onClick={(e) => { e.stopPropagation(); setPreviewIdx(null); }}>
              <div className="ios-preview-card" onClick={(e) => e.stopPropagation()}>
                <img src={images[previewIdx]} alt="preview" />
              </div>
            </div>
          )}

          {/* 하단 썸네일 바: 상세보기 모드(상세 뷰)에서만 노출 */}
          {!isZoomed && !isGridView && !isFullscreen && (
            <div className="thumbnail-bar-wrap"
              onClick={(e) => e.stopPropagation()}
              style={{ transform: `translateY(${-dragY}px)`, transition: dragY === 0 ? '0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}
            >
              <div className="drag-handle-area"
                onTouchStart={(e) => { thumbDragStart.current = e.touches[0].clientY; }}
                onTouchMove={(e) => { if (!isGridView) { const d = thumbDragStart.current - e.touches[0].clientY; if (d > 0) setDragY(Math.min(d, 180)); } }}
                onTouchEnd={() => { if (dragY > 80) setIsGridView(true); setDragY(0); }}
              >
                <div className="drag-handle-line" />
              </div>
              <div className="thumbnail-bar">
                {images.map((img, i) => (
                  <div key={i} className={`thumb-card ${i === active ? "active-thumb" : ""}`} onClick={() => setActive(i)}>
                    <img src={img} alt="" />
                    {i === active && <div className="thumb-shine" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Carousel;