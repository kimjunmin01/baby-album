// MemoSheet.jsx
// 그리드뷰 볼펜 버튼 클릭 시 올라오는 메모 편집 바텀시트

function MemoSheet({ images, editingIdx, memoText, hasMemo, onTextChange, onSave, onDelete, onClose }) {
  return (
    <div className="memo-sheet-overlay" onClick={onClose}>
      <div className="memo-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="memo-sheet-handle" />

        <div className="memo-sheet-header">
          <span className="memo-sheet-title">사진 메모</span>
          <div className="memo-sheet-actions">
            {hasMemo && (
              <button className="memo-delete-btn" onClick={onDelete}>삭제</button>
            )}
            <button className="memo-save-btn" onClick={onSave}>저장</button>
          </div>
        </div>

        <div className="memo-img-preview">
          <img src={images[editingIdx]} alt="" />
        </div>

        <textarea
          className="memo-textarea"
          value={memoText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="이 사진에 대한 이야기를 남겨보세요..."
          rows={4}
          maxLength={200}
          autoFocus
        />

        <div className="memo-char-count">{memoText.length} / 200</div>
      </div>
    </div>
  );
}

export default MemoSheet;