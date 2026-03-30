function AlbumCard({ img, onClick }) {
  return (
    <div className="insta-card" onClick={onClick}>
      <img src={img} alt="" />

      {/* 오버레이 효과 */}
      <div className="overlay">
        <span>❤️ 좋아요</span>
      </div>
    </div>
  );
}

export default AlbumCard;