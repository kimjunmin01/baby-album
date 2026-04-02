import { useState } from "react";
import Carousel from "../components/Carousel";
import "../styles/home.css";

const ALBUMS = {
  wedding: {
    id: "wedding",
    label: "결혼앨범",
    emoji: "💍",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
    title: "배지홍 ♥ 김세란",
    subtitle: "WEDDING ALBUM",
    desc: <>우연히 시작되어 필연이 된 우리의 인연이<br />이제는 세상에서 가장 단단한 사랑이 되었습니다.<br /><em>지홍과 세란, 두 사람의 첫 페이지를 이곳에 펼칩니다.</em></>,
    images: [
      "/images/bjh.webp",
      "/images/img1.webp",
      "/images/img2.webp",
      "/images/img3.webp",
      "/images/img4.webp",
      "/images/ksr.webp",
    ],
  },
  baby: {
    id: "baby",
    label: "애기앨범",
    emoji: "🍼",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 5.5V16h6v-2.5c1.5-1 3-3 3-5.5 0-3.5-2.5-6-6-6z"/>
        <path d="M9 16v4a1 1 0 001 1h4a1 1 0 001-1v-4"/>
        <circle cx="9.5" cy="8.5" r="0.5" fill="currentColor"/>
        <circle cx="14.5" cy="8.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
    title: "우리 아기",
    subtitle: "BABY ALBUM",
    desc: <>세상에서 가장 작고 소중한 존재<br />너의 모든 순간이 기적이야.<br /><em>하루하루 자라는 너의 이야기를 담아.</em></>,
    images: [
      "/images/baby.jpg",
      "/images/img1.webp",
      "/images/img2.webp",
      "/images/img3.webp",
    ],
  },
  ultrasound: {
    id: "ultrasound",
    label: "초음파앨범",
    emoji: "🫀",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-5 3 10 2-8 2 3h4"/>
        <rect x="2" y="3" width="20" height="18" rx="2"/>
      </svg>
    ),
    title: "처음 만난 날",
    subtitle: "ULTRASOUND ALBUM",
    desc: <>작은 심장이 뛰는 소리를 처음 들었을 때<br />세상이 달라 보였어.<br /><em>태동의 순간순간을 기억하며.</em></>,
    images: [
      "/images/1ju.jpg",
      "/images/2ju.jpg",
      "/images/3ju.jpg",
    ],
  },
};

function Home() {
  const [activeTab, setActiveTab] = useState("wedding");
  const album = ALBUMS[activeTab];

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
          <span
            key={i}
            style={{
              "--i": i,
              "--left": `${(i * 13.7 + 5) % 100}%`,
              "--delay": `${i * 1.1}s`,
              "--duration": `${6 + i * 0.8}s`,
              "--size": `${8 + (i % 3) * 4}px`,
            }}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 (탭바 높이만큼 패딩) */}
      <div className="home-content">
        {/* 헤더 */}
        <div className="home-header" key={activeTab}>
          <p className="home-label">{album.subtitle}</p>
          <h1 className="title">
            {activeTab === "wedding" ? (
              <>배지홍 <span className="heart">♥</span> 김세란</>
            ) : (
              album.title
            )}
          </h1>

          <div className="header-divider">
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line r" />
          </div>

          <p className="desc">{album.desc}</p>
        </div>

        {/* 캐러셀 */}
        <Carousel images={album.images} albumId={activeTab} />

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

      {/* 하단 탭바 */}
      <nav className="tab-bar">
        {Object.values(ALBUMS).map((a) => (
          <button
            key={a.id}
            className={`tab-item ${activeTab === a.id ? "active" : ""}`}
            onClick={() => setActiveTab(a.id)}
          >
            <span className="tab-icon">{a.icon(activeTab === a.id)}</span>
            <span className="tab-label">{a.label}</span>
            {activeTab === a.id && <span className="tab-indicator" />}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Home;