import { useRef, useState, useEffect } from "react";
import "../styles/carousel.css";

function Carousel({ images }) {
  const [active, setActive]         = useState(0);
  const [isModal, setIsModal]       = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const total          = images.length;
  const isDragging     = useRef(false);
  const dragStartX     = useRef(0);

  /* 확대/핀치 */
  const position          = useRef({ x: 0, y: 0 });
  const scale             = useRef(1);
  const start             = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef(0);
  const imgRef            = useRef(null);
  let   lastTap           = 0;

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const clampPosition = () => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width  - window.innerWidth)  / 2);
    const maxY = Math.max(0, (rect.height - window.innerHeight) / 2);
    position.current.x = Math.max(-maxX, Math.min(position.current.x, maxX));
    position.current.y = Math.max(-maxY, Math.min(position.current.y, maxY));
  };

  const updateTransform = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transform =
      `translate(${position.current.x}px, ${position.current.y}px) scale(${scale.current})`;
  };

  const reset = () => {
    scale.current    = 1;
    position.current = { x: 0, y: 0 };
    updateTransform();
  };

  /* 캐러셀 드래그 */
  const handleCarouselStart = (e) => {
    if (isModal) return;
    isDragging.current = true;
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleCarouselMove = (e) => {
    if (!isDragging.current || isModal) return;
    const cur = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = cur - dragStartX.current;
    if (Math.abs(diff) > 50) {
      setActive((prev) => diff < 0 ? (prev + 1) % total : (prev - 1 + total) % total);
      isDragging.current = false;
    }
  };
  const handleCarouselEnd = () => { isDragging.current = false; };

  /* 모달 터치 */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      start.current = {
        x: e.touches[0].clientX - position.current.x,
        y: e.touches[0].clientY - position.current.y,
      };
    }
    if (e.touches.length === 2) lastTouchDistance.current = getDistance(e.touches);
  };
  const handleTouchMove = (e) => {
    if (!imgRef.current) return;
    if (e.touches.length === 1 && scale.current > 1) {
      position.current = {
        x: e.touches[0].clientX - start.current.x,
        y: e.touches[0].clientY - start.current.y,
      };
    }
    if (e.touches.length === 2) {
      const newDist = getDistance(e.touches);
      scale.current += (newDist - lastTouchDistance.current) * 0.005;
      scale.current  = Math.max(1, Math.min(scale.current, 4));
      lastTouchDistance.current = newDist;
    }
    clampPosition();
    updateTransform();
  };
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      scale.current    = scale.current > 1 ? 1 : 2;
      position.current = { x: 0, y: 0 };
      updateTransform();
    }
    lastTap = now;
  };

  /* 모달 열기 / 닫기 */
  const openModal = (index) => {
    setActive(index);
    setIsModal(true);
    requestAnimationFrame(() => setModalVisible(true));
  };
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setIsModal(false), 320);
  };

  useEffect(() => { if (isModal) reset(); }, [active, isModal]);

  /* 자동 슬라이드 */
  useEffect(() => {
    if (isModal) return;
    const id = setInterval(() => {
      if (!isDragging.current) setActive((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(id);
  }, [isModal, total]);

  return (
    <>
      {/* 캐러셀 */}
      <div
        className="carousel"
        onMouseDown={handleCarouselStart}
        onMouseMove={handleCarouselMove}
        onMouseUp={handleCarouselEnd}
        onTouchStart={handleCarouselStart}
        onTouchMove={handleCarouselMove}
        onTouchEnd={handleCarouselEnd}
      >
        {images.map((img, index) => {
          let offset = index - active;
          if (offset >  total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const isHidden = Math.abs(offset) > 2;

          return (
            <div
              key={index}
              className={`carousel-item ${index === active ? "active" : ""}`}
              style={{
                "--offset":    offset,
                opacity:       isHidden ? 0      : undefined,
                pointerEvents: isHidden ? "none" : "auto",
              }}
              onClick={() => openModal(index)}
            >
              <img src={img} alt="" draggable={false} />
              {index === active && <div className="card-badge">{index + 1}</div>}
            </div>
          );
        })}

        {/* 도트 인디케이터 */}
        <div className="indicator-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === active ? "dot-active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
            />
          ))}
        </div>
      </div>

      {/* 모달 */}
      {isModal && (
        <div
          className={`modal ${modalVisible ? "modal-open" : ""}`}
          onClick={closeModal}
        >
          {/* 닫기 */}
          <button className="modal-close" onClick={closeModal}>✕</button>

          {/* 카운터 (상단) */}
          <div className="modal-top-counter">{active + 1} / {total}</div>

          {/* 좌우 화살표 */}
          <button
            className="modal-arrow modal-prev"
            onClick={(e) => { e.stopPropagation(); setActive((p) => (p - 1 + total) % total); }}
          >‹</button>
          <button
            className="modal-arrow modal-next"
            onClick={(e) => { e.stopPropagation(); setActive((p) => (p + 1) % total); }}
          >›</button>

          {/* 메인 이미지 */}
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-frame">
              <img
                ref={imgRef}
                className="modal-image"
                src={images[active]}
                alt=""
                draggable={false}
                onTouchStart={(e) => { handleTouchStart(e); handleDoubleTap(); }}
                onTouchMove={handleTouchMove}
              />
            </div>
          </div>

          {/* 썸네일 바 */}
          <div className="thumbnail-bar" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <div
                key={i}
                className={`thumb-card ${i === active ? "active-thumb" : ""}`}
                onClick={() => setActive(i)}
              >
                <img src={img} alt="" draggable={false} />
                {i === active && <div className="thumb-shine" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Carousel;