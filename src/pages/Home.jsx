// Home.jsx — 탭 UI + 앨범 전환만 담당
// 앨범 데이터(이미지, 텍스트)는 data/albums.js에서 관리합니다.

import { useState, useEffect } from "react";
import Carousel from "../components/Carousel";
import { ALBUMS } from "../data/albums.jsx";
import "../styles/home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("wedding");
  const [isModal, setIsModal] = useState(false);
  const album = ALBUMS[activeTab];

  // 모달 열릴 때 홈 배경 스크롤 잠금
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isModal]);

  return (
    <div className="home">
      {/* 배경 데코 */}
      <div className="home-bg-deco">
        <div className="bg-circle c1" />
        <div className="bg-circle c2" />
        <div className="bg-circle c3" />
      </div>

      {/* 꽃잎 */}
      <div className="petals">
        {[...Array(7)].map((_, i) => (
          <span key={i} style={{
            "--i": i,
            "--left": `${(i * 13.7 + 5) % 100}%`,
            "--delay": `${i * 1.1}s`,
            "--duration": `${6 + i * 0.8}s`,
            "--size": `${8 + (i % 3) * 4}px`,
          }} />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="home-content">

        {/* 헤더 — 탭 전환 시 key로 애니메이션 리셋 */}
        <div className="home-header" key={activeTab}>
          <p className="home-label">{album.subtitle}</p>
          <h1 className="title">
            {album.isWedding
              ? <>배지홍 <span className="heart">♥</span> 김세란</>
              : album.title
            }
          </h1>
          <div className="header-divider">
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line r" />
          </div>
          <p className="desc">
            {album.descLines.map((line, i) => (
              <span key={i}>
                {i === album.descLines.length - 1 ? <em>{line}</em> : line}
                {i < album.descLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* 캐러셀 */}
        <Carousel images={album.images} albumId={activeTab} onModalChange={setIsModal} />

        {/* 푸터 */}
        <div className="footer">
          <div className="footer-divider">
            <div className="divider-line" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(196,163,90,0.5)">
              <path d="M12 21C6.37 15.46 1 10.7 1 7.19 1 3.34 4.07 1 7.5 1c1.9 0 3.8.75 5.5 2.32C14.7 1.75 16.6 1 18.5 1 21.93 1 25 3.34 25 7.19 25 10.7 19.63 15.46 14 21z" />
            </svg>
            <div className="divider-line r" />
          </div>
          <p className="footer-date">2026 · 03 · 30</p>
          <p className="footer-sub">POTTO ALBUM</p>
        </div>
      </div>

      {/* 하단 탭바 — 모달(상세보기/그리드) 열릴 때 숨김 */}
      {!isModal && (
        <nav className="tab-bar">
          {Object.values(ALBUMS).map((a) => {
            const isActive = activeTab === a.id;
            return (
              <button key={a.id}
                className={`tab-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(a.id)}
              >
                <span className="tab-icon"><a.Icon active={isActive} /></span>
                <span className="tab-label">{a.label}</span>
                {isActive && <span className="tab-indicator" />}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default Home;