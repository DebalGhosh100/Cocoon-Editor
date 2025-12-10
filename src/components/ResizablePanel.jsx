import React, { useState, useRef, useEffect } from 'react';
import './ResizablePanel.css';

const ResizablePanel = ({ left, right, minLeftWidth = 200, minRightWidth = 400 }) => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;

      const maxLeftWidth = containerRect.width - minRightWidth;

      if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, minLeftWidth, minRightWidth]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className="resizable-panel-container" ref={containerRef}>
      <div className="resizable-panel-left" style={{ width: `${leftWidth}px` }}>
        {left}
      </div>
      <div
        className={`resizable-divider ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizable-divider-handle" />
      </div>
      <div className="resizable-panel-right" style={{ width: `calc(100% - ${leftWidth}px - 4px)` }}>
        {right}
      </div>
    </div>
  );
};

export default ResizablePanel;
