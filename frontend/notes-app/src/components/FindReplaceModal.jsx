import React, { useState, useRef } from "react";

const FindReplaceModal = ({ onClose, onFindReplace }) => {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleReplace = () => {
    if (!findText) {
      alert("Please enter text to find");
      return;
    }
    onFindReplace(findText, replaceText);
    onClose();
  };

  return (
    <div
      className="find-replace-backdrop"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        background: "rgba(15, 18, 32, 0.3)", // transparent backdrop
      }}
    >
      <div
        ref={modalRef}
        className="find-replace-modal"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          cursor: dragging ? "grabbing" : "default",
        }}
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop dragging
      >
        {/* Drag handle */}
        <div
          className="modal-header"
          onMouseDown={handleMouseDown}
          style={{ cursor: "grab", fontWeight: "bold", marginBottom: "10px" }}
        >
          Find & Replace
        </div>

        <input
          type="text"
          placeholder="Find..."
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Replace with..."
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
        />
        <div className="find-replace-buttons">
          <button onClick={handleReplace}>Replace All</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FindReplaceModal;
