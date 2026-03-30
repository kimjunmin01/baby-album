import { useEffect } from "react";
import "../styles/intro.css";

function Intro({ onFinish }) {
  useEffect(() => {
    // 3.8초 후 메인 페이지로 전환 (애니메이션 종료 타이밍)
    const timer = setTimeout(() => onFinish(), 3800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro">
      {/* 1. 배경 파티클: 꽃잎이 사방으로 퍼지며 몰입감 증대 */}
      <div className="intro-particles">
      </div>

      {/* 2. 앨범 씬: 줌인 효과의 핵심 */}
      <div className="album-scene">
        {/* 뒷 페이지 (앨범 내부 문구 포함) */}
        <div className="album-page-back">
           <div className="inner-light" />
           {/* 앨범이 열리면 나타나는 안내 문구 */}
           <div className="album-inner-text">
             <p>우리의 소중한</p>
             <p>기록이 시작됩니다</p>
           </div>
        </div>

        {/* 앞 커버: 3D 회전하며 오픈 */}
        <div className="album-cover">
          <div className="cover-inner">
            <div className="corner tl" /><div className="corner tr" />
            <div className="corner bl" /><div className="corner br" />

            <div className="cover-emblem">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <path
                  d="M18 4C12 4 7 9 7 15C7 24 18 32 18 32C18 32 29 24 29 15C29 9 24 4 18 4Z"
                  fill="rgba(212,175,55,0.3)"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="0.8"
                />
                <circle cx="18" cy="15" r="4" fill="rgba(255,255,255,0.5)" />
              </svg>
            </div>

            <h2 className="cover-title">Wedding Album</h2>
            <div className="cover-divider" />
            <p className="cover-names">JiHong ♥ SeRan</p>
            <p className="cover-date">2026 · 03 · 30</p>
          </div>
        </div>
      </div>

      {/* 3. 하단 문구 */}
      <p className="intro-footer">Opening your memories…</p>
    </div>
  );
}

export default Intro;