// ─── 앨범 데이터 ───────────────────────────────────────────
// 새 앨범을 추가하려면 이 파일에만 항목을 추가하면 됩니다.

const WeddingIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
  </svg>
);

const BabyIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 5.5V16h6v-2.5c1.5-1 3-3 3-5.5 0-3.5-2.5-6-6-6z"/>
    <path d="M9 16v4a1 1 0 001 1h4a1 1 0 001-1v-4"/>
    <circle cx="9.5" cy="8.5" r="0.5" fill="currentColor"/>
    <circle cx="14.5" cy="8.5" r="0.5" fill="currentColor"/>
  </svg>
);

const UltrasoundIcon = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#c4a35a" : "#9a8060"} strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h3l2-5 3 10 2-8 2 3h4"/>
    <rect x="2" y="3" width="20" height="18" rx="2"/>
  </svg>
);

export const ALBUMS = {
  wedding: {
    id: "wedding",
    label: "결혼앨범",
    Icon: WeddingIcon,
    title: "배지홍 ♥ 김세란",
    subtitle: "WEDDING ALBUM",
    descLines: [
      "우연히 시작되어 필연이 된 우리의 인연이",
      "이제는 세상에서 가장 단단한 사랑이 되었습니다.",
      "지홍과 세란, 두 사람의 첫 페이지를 이곳에 펼칩니다.",
    ],
    isWedding: true, // 타이틀에 하트 표시
    images: [
      "/images/test1.JPG",
      "/images/test2.JPG",
      "/images/test3.JPG",
      "/images/test4.JPG",
      "/images/test5.JPG",
      "/images/test6.JPG",
      "/images/test7.JPG",

    ],
  },

  baby: {
    id: "baby",
    label: "애기앨범",
    Icon: BabyIcon,
    title: "우리 아기",
    subtitle: "BABY ALBUM",
    descLines: [
      "세상에서 가장 작고 소중한 존재",
      "너의 모든 순간이 기적이야.",
      "하루하루 자라는 너의 이야기를 담아.",
    ],
    images: [
      "/images/baby1.JPG",
      "/images/baby2.JPG",
      "/images/baby3.JPG",
      "/images/baby4.JPG",
      "/images/baby5.JPG",
      "/images/baby6.JPG",
      "/images/baby7.JPG",

    ],
  },

  ultrasound: {
    id: "ultrasound",
    label: "초음파앨범",
    Icon: UltrasoundIcon,
    title: "처음 만난 날",
    subtitle: "ULTRASOUND ALBUM",
    descLines: [
      "작은 심장이 뛰는 소리를 처음 들었을 때",
      "세상이 달라 보였어.",
      "태동의 순간순간을 기억하며.",
    ],
    images: [
      "/images/co1.JPG",
      "/images/co2.JPG",
      "/images/co3.JPG",
      "/images/co4.JPG",
      "/images/co5.JPG",
      "/images/co6.JPG",
      "/images/co7.JPG",
      "/images/co8.JPG",
      "/images/co9.JPG",
      "/images/co10.JPG",

    ],
  },
};