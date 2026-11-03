import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const ScratchpadCanvas = ({ height = 300 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const { showToast } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set display size matching container width
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Default background grid lines (subtle math grid)
    drawMathGrid(ctx, rect.width, height);
  }, [height]);

  const drawMathGrid = (ctx, w, h) => {
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = 25;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.strokeStyle = tool === 'eraser' ? '#040711' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    drawMathGrid(ctx, rect.width, height);
    showToast('تم مسح المسودة بنجاح', 'info');
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid var(--border-card)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(0, 0, 0, 0.4)',
        borderBottom: '1px solid var(--border-card)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-heading)' }}>
            ✏️ مسودة الحل والرسم البياني
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            (اكتب بيدك أو ارسم الأشكال)
          </span>
        </div>

        {/* Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setTool('pen')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: tool === 'pen' ? '#4f46e5' : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            قلم
          </button>
          <button
            onClick={() => setTool('eraser')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: tool === 'eraser' ? '#ef4444' : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ممحاة
          </button>

          {/* Color Palettes */}
          {tool === 'pen' && (
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#38bdf8', '#10b981', '#fbbf24', '#f43f5e', '#ffffff'].map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    border: color === c ? '2px solid #fff' : '1px solid rgba(0,0,0,0.5)',
                    transform: color === c ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={clearCanvas}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            مسح الكل 🗑️
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};
