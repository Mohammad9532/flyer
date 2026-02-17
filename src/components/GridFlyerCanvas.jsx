import React from 'react';

const GridFlyerCanvas = ({ products, template, fontFamily, logo, branding }) => {
  const renderProduct = (product, index) => {
    const { name, price, originalPrice, currency, discount, image, imageScale, imageX, imageY } = product;

    return (
      <div key={index} className="grid-item">
        <div className="grid-item-inner">
          {discount && <div className="grid-discount">{discount}</div>}
          <div className="grid-img-container">
            {image && (
              <img
                src={image}
                alt={name}
                style={{ transform: `scale(${imageScale || 1}) translate(${imageX || 0}px, ${imageY || 0}px)` }}
              />
            )}
          </div>
          <div className="grid-info">
            <h3 className="grid-prod-name">{name || 'Product ' + (index + 1)}</h3>
            <div className="grid-price-row">
              <div className="grid-price">
                <span className="grid-curr">{currency || 'AED'}</span>
                <span className="grid-amt">{price || '0.00'}</span>
              </div>
              {originalPrice && <span className="grid-old-price">{originalPrice}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`grid-flyer-canvas ${template}`} style={{ fontFamily }}>
      <div className="grid-header">
        {logo ? <img src={logo} alt="Logo" className="grid-logo" /> : <div className="grid-branding">{branding || 'SUPERMARKET'}</div>}
        {template.startsWith('ramadan') && <div className="ramadan-title">RAMADAN KAREEM</div>}
      </div>

      <div className="grid-container">
        {products.map((p, i) => renderProduct(p, i))}
      </div>

      <div className="grid-footer">
        {template.startsWith('ramadan') && <span>Special Ramadan Offers - Quality You Can Trust</span>}
        {template === 'luxury' && <span style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '2px' }}>EXCLUSIVELY CRAFTED FOR YOU</span>}
        {template === 'organic' && <span>FARM FRESH • SUSTAINABLE • 100% NATURAL</span>}
        {template === 'flash' && <span style={{ fontWeight: 900 }}>⚡ HURRY! LIMITED TIME OFFERS ⚡</span>}
        {(!template || template === 'standard' || template === 'minimal') && <span>Quality You Can Trust</span>}
      </div>

      <style>{`
        .grid-flyer-canvas {
          width: 8.27in;
          height: 11.69in;
          background: white;
          padding: 0.5in;
          display: flex;
          flex-direction: column;
          position: relative;
          box-sizing: border-box;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .grid-header {
          height: 1in;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #eee;
          margin-bottom: 0.2in;
        }

        .grid-logo {
          height: 0.6in;
          object-fit: contain;
        }

        .grid-branding {
          font-size: 1.5rem;
          font-weight: 900;
          color: #2D5A27;
          text-transform: uppercase;
        }

        .grid-container {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 0.15in;
        }

        .grid-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 0.1in;
          display: flex;
          flex-direction: column;
          position: relative;
          background: #fff;
          transition: all 0.2s;
        }

        .grid-item-inner {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .grid-discount {
          position: absolute;
          top: 0;
          right: 0;
          background: #E63946;
          color: white;
          padding: 2px 6px;
          font-size: 0.6rem;
          font-weight: 900;
          border-bottom-left-radius: 6px;
          z-index: 5;
        }

        .grid-img-container {
          height: 1.25in;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.1in;
          position: relative;
        }

        .grid-img-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .grid-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .grid-prod-name {
          font-size: 0.75rem;
          font-weight: 800;
          color: #333;
          line-height: 1.2;
          height: 0.3in;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .grid-price-row {
          margin-top: auto;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .grid-price {
          color: #E63946;
          display: flex;
          align-items: flex-start;
          gap: 1px;
        }

        .grid-curr {
          font-size: 0.5rem;
          font-weight: 700;
          margin-top: 2px;
        }

        .grid-amt {
          font-size: 1.2rem;
          font-weight: 900;
          line-height: 1;
        }

        .grid-old-price {
          font-size: 0.6rem;
          color: #999;
          text-decoration: line-through;
        }

        .grid-footer {
          height: 0.3in;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #666;
          border-top: 1px solid #eee;
          margin-top: 0.1in;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* --------------------------------- 
           VARIETY TEMPLATES 
           --------------------------------- */

        /* 1. Ramadan Theme (Boxed) */
        [class*="grid-flyer-canvas ramadan"] { background: #1a237e; border: 8px solid #ffd700; }
        [class*="grid-flyer-canvas ramadan"] .grid-header { border-bottom-color: #ffd700; color: #ffd700; }
        [class*="grid-flyer-canvas ramadan"] .grid-branding { color: #ffd700; }
        [class*="grid-flyer-canvas ramadan"] .ramadan-title { font-size: 1.2rem; font-weight: 900; letter-spacing: 2px; }
        [class*="grid-flyer-canvas ramadan"] .grid-item { background: rgba(255, 255, 255, 0.95); border-color: #ffd700; }
        [class*="grid-flyer-canvas ramadan"] .grid-footer { border-top-color: #ffd700; color: #ffd700; }

        /* 2. Minimal Theme (BOX-LESS) */
        .grid-flyer-canvas.minimal { background: #fff; padding: 0.7in; }
        .grid-flyer-canvas.minimal .grid-item { border: none; background: transparent; padding: 0; }
        .grid-flyer-canvas.minimal .grid-container { gap: 0.4in; }
        .grid-flyer-canvas.minimal .grid-prod-name { color: #000; font-weight: 400; text-align: center; }
        .grid-flyer-canvas.minimal .grid-price-row { justify-content: center; }
        .grid-flyer-canvas.minimal .grid-header { border-bottom: 1px solid #000; margin-bottom: 0.4in; }
        .grid-flyer-canvas.minimal .grid-footer { border-top: 1px solid #000; font-weight: 300; }

        /* 3. Modern Theme (Shadow Boxes) */
        .grid-flyer-canvas.modern { background: #f8fafc; }
        .grid-flyer-canvas.modern .grid-item { border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-radius: 12px; }
        .grid-flyer-canvas.modern .grid-header { background: linear-gradient(90deg, #1e293b, #334155); color: white; padding: 0 0.5in; margin: -0.5in -0.5in 0.3in -0.5in; height: 1.2in; border: none; }
        .grid-flyer-canvas.modern .grid-branding { color: white; }

        /* 4. Flash Sale (High Contrast) */
        .grid-flyer-canvas.flash { background: #000; }
        .grid-flyer-canvas.flash .grid-item { background: #ffff00; border: 2px solid #ff0000; border-radius: 0; }
        .grid-flyer-canvas.flash .grid-prod-name { color: #000; font-weight: 900; }
        .grid-flyer-canvas.flash .grid-price { color: #ff0000; }
        .grid-flyer-canvas.flash .grid-header { background: #ff0000; color: #fff; border: none; margin: -0.5in -0.5in 0.2in -0.5in; padding: 0 0.5in; }
        .grid-flyer-canvas.flash .grid-branding { color: #fff; }
        .grid-flyer-canvas.flash .grid-footer { background: #ff0000; color: #fff; margin-bottom: -0.5in; border: none; }

        /* 5. Organic Theme */
        .grid-flyer-canvas.organic { background: #fdfdf5; border: 1px solid #dcfce7; }
        .grid-flyer-canvas.organic .grid-item { border: 2px solid #2D5A27; border-radius: 20px; background: #fff; }
        .grid-flyer-canvas.organic .grid-branding { color: #166534; font-family: 'Playfair Display', serif; }
        .grid-flyer-canvas.organic .grid-amt { color: #15803d; }

        /* 6. Discount Theme */
        .grid-flyer-canvas.discount { background: #fff; }
        .grid-flyer-canvas.discount .grid-item { border: 2px solid #fee2e2; }
        .grid-flyer-canvas.discount .grid-discount { background: #ef4444; width: 100%; border-radius: 0; position: relative; text-align: center; margin-bottom: 5px; }
        .grid-flyer-canvas.discount .grid-amt { color: #dc2626; font-size: 1.5rem; }

        /* 7. Bold Theme (BOX-LESS) */
        .grid-flyer-canvas.bold { background: #fff; }
        .grid-flyer-canvas.bold .grid-item { border: none; background: transparent; text-align: center; }
        .grid-flyer-canvas.bold .grid-prod-name { font-size: 1rem; font-weight: 900; text-transform: uppercase; }
        .grid-flyer-canvas.bold .grid-price-row { justify-content: center; }
        .grid-flyer-canvas.bold .grid-amt { font-size: 1.8rem; }

        /* 8. Luxury Theme */
        .grid-flyer-canvas.luxury { background: #121212; color: #d4af37; border: 10px double #d4af37; }
        .grid-flyer-canvas.luxury .grid-item { background: #1a1a1a; border: 1px solid #d4af37; border-radius: 0; }
        .grid-flyer-canvas.luxury .grid-branding { color: #d4af37; font-family: 'Playfair Display', serif; }
        .grid-flyer-canvas.luxury .grid-prod-name { color: #fff; font-family: 'Playfair Display', serif; }
        .grid-flyer-canvas.luxury .grid-price { color: #d4af37; }
        .grid-flyer-canvas.luxury .grid-logo { filter: brightness(0) saturate(100%) invert(74%) sepia(43%) saturate(452%) hue-rotate(11deg) brightness(97%) contrast(89%); }

        /* 9. Fresh Theme (BOX-LESS) */
        .grid-flyer-canvas.fresh { background: #f0fdf4; }
        .grid-flyer-canvas.fresh .grid-item { border: none; background: transparent; }
        .grid-flyer-canvas.fresh .grid-img-container { background: #fff; border-radius: 50%; width: 1.5in; height: 1.5in; margin: 0 auto 0.1in; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        /* 10. Super Store */
        .grid-flyer-canvas.superstore { background: #fff; }
        .grid-flyer-canvas.superstore .grid-header { background: #1d4ed8; color: #fff; padding: 0 0.5in; margin: -0.5in -0.5in 0.2in -0.5in; }
        .grid-flyer-canvas.superstore .grid-branding { color: #fff; }
        .grid-flyer-canvas.superstore .grid-item { border-radius: 0; border: 3px solid #1d4ed8; }
        .grid-flyer-canvas.superstore .grid-price { background: #fbbf24; color: #1e3a8a; padding: 2px 8px; border-radius: 4px; }

        /* 11. BOGO Theme */
        .grid-flyer-canvas.bogo .grid-item { border: 2px solid #db2777; }
        .grid-flyer-canvas.bogo .grid-discount { background: #db2777; font-size: 0.8rem; padding: 4px 10px; }
        .grid-flyer-canvas.bogo .grid-amt { color: #be185d; }

        /* 12. Dark Mode */
        .grid-flyer-canvas.dark { background: #1f2937; color: #f3f4f6; }
        .grid-flyer-canvas.dark .grid-item { background: #374151; border-color: #4b5563; }
        .grid-flyer-canvas.dark .grid-prod-name { color: #fff; }
        .grid-flyer-canvas.dark .grid-amt { color: #10b981; }
        .grid-flyer-canvas.dark .grid-header { border-bottom-color: #4b5563; }
        .grid-flyer-canvas.dark .grid-branding { color: #10b981; }

        /* 13. Elegant (BOX-LESS) */
        .grid-flyer-canvas.elegant { background: #fff; }
        .grid-flyer-canvas.elegant .grid-item { border: none; border-bottom: 1px solid #f3f4f6; border-radius: 0; padding: 0.2in 0; }
        .grid-flyer-canvas.elegant .grid-prod-name { font-family: 'Playfair Display', serif; font-size: 0.9rem; font-style: italic; }
        .grid-flyer-canvas.elegant .grid-amt { color: #000; font-weight: 300; }

        /* 14. Clearance */
        .grid-flyer-canvas.clearance { background: #fffbeb; }
        .grid-flyer-canvas.clearance .grid-header { background: #f59e0b; color: white; border: none; padding: 0 0.5in; margin: -0.5in -0.5in 0.2in -0.5in; }
        .grid-flyer-canvas.clearance .grid-branding { color: white; }
        .grid-flyer-canvas.clearance .grid-item { border: 2px solid #d97706; border-style: dashed; }
        .grid-flyer-canvas.clearance .grid-amt { color: #b45309; }

        /* 15. Neon Night */
        .grid-flyer-canvas.neon { background: #000; }
        .grid-flyer-canvas.neon .grid-item { background: #000; border: 1px solid #0ff; box-shadow: 0 0 10px #0ff; }
        .grid-flyer-canvas.neon .grid-prod-name { color: #fff; text-shadow: 0 0 5px #0ff; }
        .grid-flyer-canvas.neon .grid-amt { color: #f0f; text-shadow: 0 0 5px #f0f; }
        .grid-flyer-canvas.neon .grid-header { border-bottom: 2px solid #f0f; box-shadow: 0 5px 15px #f0f; }
        .grid-flyer-canvas.neon .grid-branding { color: #0ff; text-shadow: 0 0 10px #0ff; }

        @media print {
          .grid-flyer-canvas {
            box-shadow: none;
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default GridFlyerCanvas;
