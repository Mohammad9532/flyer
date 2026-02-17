import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut, Move } from 'lucide-react';

const ImageAdjuster = ({ isOpen, onClose, onApply, image, initialScale = 1, initialX = 0, initialY = 0 }) => {
  const [scale, setScale] = useState(initialScale);
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setScale(initialScale);
      x.set(initialX);
      y.set(initialY);
    }
  }, [isOpen, initialScale, initialX, initialY]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      scale,
      x: x.get(),
      y: y.get()
    });
    onClose();
  };

  return (
    <div className="adjuster-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="adjuster-modal"
      >
        <div className="adjuster-header">
          <h3><Move size={18} /> ADJUST IMAGE</h3>
          <button onClick={onClose} className="adjuster-close"><X size={20} /></button>
        </div>

        <div className="adjuster-content">
          <div className="adjuster-viewport-wrapper">
            <div className="adjuster-viewport" ref={containerRef}>
              <motion.div
                drag
                dragElastic={0}
                dragMomentum={false}
                style={{ x, y, scale }}
                className="adjuster-img-container"
              >
                <img src={image} alt="Crop preview" draggable="false" />
              </motion.div>

              {/* Visual Guidelines */}
              <div className="guideline guideline-h" />
              <div className="guideline guideline-v" />
              <div className="corner-tl" />
              <div className="corner-tr" />
              <div className="corner-bl" />
              <div className="corner-br" />
            </div>
          </div>

          <div className="adjuster-controls">
            <div className="control-row">
              <ZoomOut size={16} />
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="studio-range"
              />
              <ZoomIn size={16} />
              <span className="scale-val">{Math.round(scale * 100)}%</span>
            </div>

            <div className="control-hints">
              <p>Drag the image to position it. Use the slider to zoom.</p>
            </div>
          </div>
        </div>

        <div className="adjuster-footer">
          <button onClick={onClose} className="adjuster-btn-secondary">CANCEL</button>
          <button onClick={handleApply} className="adjuster-btn-primary">
            <Check size={18} />
            APPLY CHANGES
          </button>
        </div>
      </motion.div>

      <style>{`
        .adjuster-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(8px);
        }

        .adjuster-modal {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .adjuster-header {
          padding: 1.2rem;
          background: #121212;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adjuster-header h3 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #eee;
        }

        .adjuster-close {
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
        }

        .adjuster-close:hover {
          color: #fff;
        }

        .adjuster-content {
          padding: 1.5rem;
        }

        .adjuster-viewport-wrapper {
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 2px solid #333;
          aspect-ratio: 1;
          position: relative;
        }

        .adjuster-viewport {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: move;
        }

        .adjuster-img-container {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .adjuster-img-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        /* Guidelines */
        .guideline {
          position: absolute;
          background: rgba(45, 90, 39, 0.3);
          pointer-events: none;
        }
        .guideline-h { width: 100%; height: 1px; top: 50%; left: 0; }
        .guideline-v { width: 1px; height: 100%; top: 0; left: 50%; }

        [class^="corner-"] {
          position: absolute;
          width: 15px;
          height: 15px;
          border: 2px solid var(--secondary, #F4A261);
          pointer-events: none;
        }
        .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

        .adjuster-controls {
          background: #252525;
          padding: 1rem;
          border-radius: 12px;
        }

        .control-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
        }

        .scale-val {
          min-width: 45px;
          font-weight: 900;
          color: var(--secondary, #F4A261);
          font-size: 0.8rem;
        }

        .control-hints {
          margin-top: 0.8rem;
          font-size: 0.7rem;
          color: #666;
          text-align: center;
        }

        .adjuster-footer {
          padding: 1.2rem;
          background: #121212;
          border-top: 1px solid #333;
          display: flex;
          gap: 1rem;
        }

        .adjuster-btn-primary {
          flex: 1;
          background: var(--secondary, #F4A261);
          color: #000;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s;
        }

        .adjuster-btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .adjuster-btn-secondary {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid #333;
          color: #888;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .adjuster-btn-secondary:hover {
          background: #333;
          color: #fff;
        }

        .studio-range {
          flex: 1;
          height: 6px;
          background: #111;
          border-radius: 10px;
          appearance: none;
          outline: none;
        }

        .studio-range::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default ImageAdjuster;
