import React from 'react';
import FlyerCanvas from './FlyerCanvas';

const Grid2x2Canvas = ({ items, template, branding, logo, fontFamily }) => {
    return (
        <div className="grid2x2-canvas" style={{
            width: '8.27in',
            height: '11.69in',
            background: 'white',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            padding: '0.2in',
            gap: '0.2in',
            boxSizing: 'border-box'
        }}>
            {items.map((item, idx) => (
                <div key={idx} className="grid-item-wrapper" style={{
                    border: '1px dashed #ccc',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <FlyerCanvas
                        data={{
                            ...item,
                            branding,
                            logo,
                            fontFamily,
                            paperSize: 'a4' // Miniaturized within the grid
                        }}
                        template={template}
                    />
                </div>
            ))}
            <style>{`
        .grid2x2-canvas .flyer-canvas {
          width: 100% !important;
          height: 100% !important;
          box-shadow: none !important;
          margin: 0 !important;
        }
        .grid2x2-canvas .flyer-inner {
          zoom: 1 !important; /* Scale down handled by container size if needed, but FlyerCanvas has internal zoom for A4 */
        }
        @media print {
          .grid2x2-canvas { transform: none !important; }
        }
      `}</style>
        </div>
    );
};

export default Grid2x2Canvas;
