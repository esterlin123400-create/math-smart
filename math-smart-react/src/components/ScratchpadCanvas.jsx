import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const ScratchpadCanvas = ({ height = 300 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38bdf8');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const { showToast } = useApp();

  const drawMathGrid = useCallback((ctx, w, h) => {
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
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
  }, []);

  const setupCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;

    const dpr = window.devicePixelRatio || 1;
    const nextW = Math.round(rect.width * dpr);
    const nextH = Math.round(height * dpr);
    if (canvas.width === nextW && canvas.height === nextH) return;

    const prevSnapshot = canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL() : null;
    canvas.width = nextW;
    canvas.height = nextH;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMathGrid(ctx, rect.width, height);

    if (prevSnapshot) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, height);
      };
      img.src = prevSnapshot;
    }
  }, [height, drawMathGrid]);

  useEffect(() => {
    setupCanvasSize();
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      setupCanvasSize();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [setupCanvasSize]);

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
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3.5 : lineWidth;
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
      background: 'var(--bg-card)',
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
        background: 'var(--bg-inset)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setTool('pen')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: tool === 'pen' ? '#4f46e5' : 'var(--bg-subtle)',
              color: tool === 'pen' ? '#fff' : 'var(--text-body)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-ar)'
            }}
          >
            قلم
          </button>
          <button
            type="button"
            onClick={() => setTool('eraser')}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: 'none',
              background: tool === 'eraser' ? '#ef4444' : 'var(--bg-subtle)',
              color: tool === 'eraser' ? '#fff' : 'var(--text-body)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-ar)'
            }}
          >
            ممحاة
          </button>

          {/* Line thickness */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
            {[2, 4, 7].map((w) => (
              <button
                type="button"
                key={w}
                onClick={() => setLineWidth(w)}
                title={`سمك الخط ${w}px`}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: lineWidth === w ? '1px solid #38bdf8' : '1px solid var(--border-card)',
                  background: lineWidth === w ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ width: `${w + 3}px`, height: `${w + 3}px`, borderRadius: '50%', background: 'var(--text-heading)' }} />
              </button>
            ))}
          </div>

          {/* Color Palettes */}
          {tool === 'pen' && (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {['#38bdf8', '#10b981', '#fbbf24', '#f43f5e', '#ffffff'].map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`لون ${c}`}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    border: color === c ? '2px solid #818cf8' : '1px solid rgba(0,0,0,0.5)',
                    transform: color === c ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={clearCanvas}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-card)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-ar)'
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
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
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
