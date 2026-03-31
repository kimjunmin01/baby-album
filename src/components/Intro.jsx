import { useEffect } from "react";
import "../styles/intro.css";

function Intro({ onFinish }) {
  useEffect(() => {
    // 3D 애니메이션과 Zoom-in 연출이 완전히 끝나는 타이밍 (4.2초)
    const timer = setTimeout(() => {
      onFinish();
    }, 4200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro">

      {/* 2. 앨범 씬 */}
      <div className="album-scene">
        {/* 앨범 전체를 감싸는 본체 (두께감 포함) */}
        <div className="album-body">
          
          {/* 책등: 왼쪽 옆면 입체감 */}
          <div className="album-spine" />

          {/* 속지/내부: 커버가 열리면 보이는 부분 */}
          <div className="album-page-back">
            <div className="inner-light" />
            <div className="album-inner-text">
              <p>우리의 소중한</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>앨범</p>
              <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '15px' }}>Chapter 01. 기록의 시작</p>
            </div>
          </div>

          {/* 앞 커버 (새 디자인 적용) */}
          <div className="album-cover">
            <div className="cover-inner">
              {/* 금속 코너 장식 */}
              <div className="corner tl" /><div className="corner tr" />
              <div className="corner bl" /><div className="corner br" />

              {/* 📸 수정된 엠블럼: 폴라로이드 사진 아이콘 */}
              <div className="cover-emblem">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect 
                    x="8" y="6" width="24" height="28" rx="1.5" 
                    fill="rgba(255, 255, 255, 0.15)" 
                    stroke="rgba(255, 255, 255, 0.7)" 
                    strokeWidth="1"
                  />
                  <rect x="11" y="9" width="18" height="20" fill="rgba(255, 255, 255, 0.4)" />
                  <circle cx="20" cy="19" r="3.5" fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.8"/>
                </svg>
              </div>

              <h2 className="cover-title">ALBUM</h2>
              <div className="cover-divider" />
              <p className="cover-names">JiHong ♥ SeRan</p>
              <p className="cover-date">2026 · 03 · 30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;