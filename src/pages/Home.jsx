import Carousel from "../components/Carousel";
import "../styles/home.css";

function Home() {
  const images = [
    "/images/bjh.webp",
    "/images/img1.webp",
    "/images/img2.webp",
    "/images/img3.webp",
    "/images/img4.webp",
    "/images/ksr.webp",
  ];

  return (
    <div className="home">
      {/* ─── 1. 배경 은은한 원형 데코 ─── */}
      <div className="home-bg-deco">
        <div className="bg-circle c1" />
        <div className="bg-circle c2" />
        <div className="bg-circle c3" />
      </div>

      {/* ─── 2. 흩날리는 꽃잎 (애니메이션 포인트) ─── */}
      <div className="petals">
        {[...Array(7)].map((_, i) => (
          <span 
            key={i} 
            style={{ 
              "--i": i,
              "--left": `${Math.random() * 100}%`,
              "--delay": `${Math.random() * 8}s`,
              "--duration": `${6 + Math.random() * 6}s`,
              "--size": `${8 + Math.random() * 10}px`,
            }} 
          />
        ))}
      </div>

      {/* ─── 3. 메인 타이틀 섹션 ─── */}
      <div className="home-header">
        <p className="home-label">Wedding Album</p>
        <h1 className="title">
          배지홍 <span className="heart">♥</span> 김세란
        </h1>
        <p className="subtitle">Our Memories</p>
        
        <div className="header-divider">
          <div className="divider-line" />
          <div className="divider-dot" />
          <div className="divider-line r" />
        </div>

        <p className="desc">
          서로의 시간을 함께 걸어온 두 사람이<br />
          하나의 이야기가 되는 순간<br />
          <em>이 앨범에 우리의 가장 소중한 기억을 담았습니다.</em>
        </p>
      </div>

      {/* ─── 4. 사진 캐러셀 ─── */}
      <Carousel images={images} />

      {/* ─── 5. 푸터 (날짜 및 문구) ─── */}
      <div className="footer">
        <div className="footer-divider">
          <div className="divider-line" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(196,163,90,0.5)">
            <path d="M12 21C6.37 15.46 1 10.7 1 7.19 1 3.34 4.07 1 7.5 1c1.9 0 3.8.75 5.5 2.32C14.7 1.75 16.6 1 18.5 1 21.93 1 25 3.34 25 7.19 25 10.7 19.63 15.46 14 21z" />
          </svg>
          <div className="divider-line r" />
        </div>
        <p className="footer-date">2026 · 03 · 30</p>
        <p className="footer-sub">Forever Together</p>
      </div>
    </div>
  );
}

export default Home;