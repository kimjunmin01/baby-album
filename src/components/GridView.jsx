// GridView.jsx
// 그리드뷰: 3열 이미지 목록 + 롱프레스 프리뷰 + 볼펜 메모 버튼

const PenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const EditedPenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

function GridView({
  images, active, memoKey, memoMap,
  previewIdx, pressTimer, isLongPress,
  onImageClick, onLongPress, onMemoClick,
}) {
  return (
    <div
      className="modal-grid-view"
      onClick={(e) => e.stopPropagation()}
      style={{ visibility: previewIdx !== null ? "hidden" : "visible" }}
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
                onLongPress(i);
              }, 1000);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              clearTimeout(pressTimer.current);
              if (!isLongPress.current && previewIdx === null) onImageClick(i);
              setTimeout(() => { isLongPress.current = false; }, 50);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isLongPress.current || previewIdx !== null) return;
              onImageClick(i);
            }}
          >
            <img src={img} alt="" />

            <button
              className={`grid-memo-btn ${memoMap[memoKey(i)] ? "has-memo" : ""}`}
              onClick={(e) => { e.stopPropagation(); onMemoClick(e, i); }}
              onTouchStart={(e) => {
                e.stopPropagation();
                clearTimeout(pressTimer.current);
                isLongPress.current = false;
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                clearTimeout(pressTimer.current);
                isLongPress.current = false;
                onMemoClick(e, i);
              }}
            >
              {memoMap[memoKey(i)] ? <EditedPenIcon /> : <PenIcon />}
            </button>

            
            {/* 클로드가 남긴 코드
                {memoMap[memoKey(i)] && (
                    <div className="grid-memo-preview">
                    <span>{memoMap[memoKey(i)]}</span>
                </div>
                )}
            */}

                {memoMap[memoKey(i)] && (
                    <div 
                        className="grid-memo-preview"
                        style={{
                        position: 'absolute',
                        left: `${memoMap[memoKey(i)].x}%`, // 저장된 x 좌표 사용
                        top: `${memoMap[memoKey(i)].y}%`,  // 저장된 y 좌표 사용
                        transform: 'translate(-50%, -50%)', // 중심점 맞추기
                        pointerEvents: 'none' // 클릭 방해 금지
                    }}
                >
                    {/* 화면에 보여줄 '글자'는 객체 내부의 text 속성만! */}
                    <span>{memoMap[memoKey(i)].text}</span>
                    </div>
                )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default GridView;