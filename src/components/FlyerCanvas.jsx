import React from 'react';

const FlyerCanvas = ({ data, template, onFocusField }) => {
  const { productName, price, originalPrice, currency, discount, description, image, logo, branding, imageScale, imageX, imageY, fontFamily, paperSize } = data;

  const renderTemplate = () => {
    const commonImg = (className) => image && (
      <div className={`img-container-${className}`}>
        <img
          src={image}
          className={`product-img-${className}`}
          alt="Product"
          style={{ transform: `scale(${imageScale}) translate(${imageX}px, ${imageY}px)` }}
        />
      </div>
    );

    const renderLogo = (className, fallbackText) => {
      if (logo) {
        return <img src={logo} className={`logo-${className}`} alt="Logo" />;
      }
      return <div className={`branding-${className}`}>{fallbackText || branding || 'NATURAL FRESH EXPRESS'}</div>;
    };

    switch (template) {
      case 'discount':
        return (
          <div className="flyer-inner discount-template">
            <div className="discount-top-row">
              {renderLogo('mini-discount')}
              <div className="promo-badge-new">{discount || 'BIG DEAL'}</div>
            </div>

            <div className="discount-main" onClick={f('productName')}>
              <h1 className="prod-name-new-discount">{productName || 'PRODUCT NAME'}</h1>
              <p className="description-new">{description || 'Fresh quality selection'}</p>
            </div>

            {commonImg('standard')}

            <div className="content-box-new" onClick={f('price')}>
              <div className="price-tag-new">
                <span className="curr-new">{currency}</span>
                <span className="amt-new">{price || '0.00'}</span>
              </div>
              {originalPrice && <span className="old-price-new">{currency}{originalPrice}</span>}
            </div>
            <div className="branding-bar-new" onClick={f('branding')}>{logo ? <img src={logo} style={{ height: '30px', objectFit: 'contain' }} alt="Logo" /> : (branding || 'NATURAL FRESH EXPRESS')}</div>
          </div>
        );
      case 'bold':
        return (
          <div className="flyer-inner bold-template text-center">
            <div className="brand-header">{renderLogo('bold-header')}</div>
            <h1 className="prod-name-bold">{productName || 'PRODUCT NAME'}</h1>
            {commonImg('bold')}
            <div className="price-box-bold">
              <div className="price-main"><span className="curr-sm">{currency}</span>{price || '0.00'}</div>
              {discount && <div className="discount-banner">{discount}</div>}
            </div>
          </div>
        );
      case 'bogo':
        return (
          <div className="flyer-inner bogo-template text-center">
            <div className="bogo-header">BUY 1 GET 1 <span className="free-text">FREE</span></div>
            {commonImg('bogo')}
            <div className="bogo-content">
              <h2 className="prod-name-bogo">{productName || 'PRODUCT NAME'}</h2>
              <div className="bogo-price">
                <span className="curr-lg">{currency}</span>
                <span className="amt-lg">{price || '0.00'}</span>
              </div>
              <div className="bogo-footer">{renderLogo('bogo-footer', branding || 'NATURAL FRESH EXPRESS SPECIAL')}</div>
            </div>
          </div>
        );
      case 'organic':
        return (
          <div className="flyer-inner organic-template">
            <div className="organic-leaf">🍃 ORGANIC</div>
            {commonImg('organic')}
            <div className="organic-info">
              <h2 className="prod-name-org">{productName || 'Fresh Organic'}</h2>
              <p className="org-sub">Farm to Table Freshness</p>
              <div className="org-price-box">
                <span className="curr-org">{currency}</span>
                <span className="amt-org">{price || '0.00'}</span>
              </div>
            </div>
            <div className="organic-footer">NO PESTICIDES • {branding || 'PURE FRESH'}</div>
          </div>
        );
      case 'clearance':
        return (
          <div className="flyer-inner clearance-template">
            <div className="clearance-banner">CLEARANCE</div>
            {commonImg('clearance')}
            <div className="clearance-content">
              <h1 className="prod-name-clearance">{productName || 'MUST GO ITEM'}</h1>
              <div className="clearance-price-row">
                <div className="clearance-price">
                  <span className="curr-clear">{currency}</span>
                  <span className="amt-clear">{price || '0.00'}</span>
                </div>
                {discount && <div className="clearance-badge">{discount}</div>}
              </div>
            </div>
            <div className="clearance-footer">WHILE STOCKS LAST</div>
          </div>
        );
      case 'new':
        return (
          <div className="flyer-inner new-template">
            <div className="new-badge">NEW ITEM</div>
            {commonImg('new')}
            <div className="new-container">
              <h2 className="prod-name-new">{productName || 'LATEST ARRIVAL'}</h2>
              <div className="new-price-wrap">
                <span className="new-curr">{currency}</span>
                <span className="new-amt">{price || '0.00'}</span>
              </div>
              <div className="new-brand">{branding || 'NATURAL FRESH EXPRESS'}</div>
            </div>
          </div>
        );
      case 'manager':
        return (
          <div className="flyer-inner manager-template">
            <div className="manager-seal">MANAGER'S CHOICE ★★★</div>
            {commonImg('manager')}
            <div className="manager-content">
              <h3 className="manager-note">"I personally recommend this for its quality and value."</h3>
              <h2 className="prod-name-manager">{productName || 'Store Special'}</h2>
              <div className="manager-price">
                {currency} {price || '0.00'}
              </div>
            </div>
            <div className="manager-footer">{branding}</div>
          </div>
        );
      case 'flash':
        return (
          <div className="flyer-inner flash-template">
            <div className="flash-header">⚡ FLASH SALE ⚡</div>
            {commonImg('flash')}
            <div className="flash-body text-center">
              <h2 className="prod-name-flash">{productName || 'LIMITED TIME'}</h2>
              <div className="flash-timer">END IN 24 HOURS</div>
              <div className="flash-price">
                <span className="flash-curr">{currency}</span>
                {price || '0.00'}
              </div>
            </div>
          </div>
        );
      case 'healthy':
        return (
          <div className="flyer-inner healthy-template">
            <div className="healthy-heading">❤️ HEALTHY CHOICE</div>
            {commonImg('healthy')}
            <div className="healthy-info text-center">
              <h2 className="prod-name-healthy">{productName || 'Nutritious Item'}</h2>
              <div className="healthy-stats">LOW FAT • HIGH FIBER</div>
              <div className="healthy-price">
                {currency}{price || '0.00'}
              </div>
            </div>
            <div className="healthy-footer">{branding}</div>
          </div>
        );
      case 'ramadan':
        return (
          <div className="flyer-inner ramadan-template">
            <div className="ramadan-moon">🌙 Ramadan Kareem</div>
            {commonImg('ramadan')}
            <div className="ramadan-info text-center">
              <h2 className="prod-name-ramadan">{productName || 'RAMADAN SPECIAL'}</h2>
              <div className="ramadan-price">
                <span className="curr-ram">{currency}</span>
                <span className="amt-ram">{price || '0.00'}</span>
              </div>
            </div>
            <div className="ramadan-footer">{branding}</div>
          </div>
        );
      case 'iftar':
        return (
          <div className="flyer-inner iftar-template">
            <div className="iftar-header">✨ IFTAR SPECIAL ✨</div>
            {commonImg('iftar')}
            <div className="iftar-content">
              <h2 className="prod-name-iftar">{productName || 'Iftar Box / Dates'}</h2>
              <p className="iftar-sub">Break your fast with quality</p>
              <div className="iftar-price-box">
                <div className="iftar-label">SPECIAL PRICE</div>
                <div className="iftar-price">{currency} {price}</div>
              </div>
            </div>
            <div className="iftar-footer">{branding}</div>
          </div>
        );
      case 'suhoor':
        return (
          <div className="flyer-inner suhoor-template">
            <div className="suhoor-badge">SUHOOR ESSENTIALS</div>
            {commonImg('suhoor')}
            <div className="suhoor-body text-center">
              <h2 className="prod-name-suhoor">{productName || 'Fresh Milk / Yogurt'}</h2>
              <div className="suhoor-promo">{discount || 'Healthy Morning'}</div>
              <div className="suhoor-price">
                <span className="suh-curr">{currency}</span>
                {price}
              </div>
            </div>
            <div className="suhoor-footer">{branding}</div>
          </div>
        );
      case 'member':
        return (
          <div className="flyer-inner member-template">
            <div className="member-label">LOYALTY MEMBER ONLY</div>
            {commonImg('member')}
            <div className="member-box">
              <h2 className="prod-name-member">{productName || 'Exclusive Deal'}</h2>
              <div className="member-price-row">
                <div className="member-actual">
                  <span className="mem-curr">{currency}</span>
                  {price || '0.00'}
                </div>
                <div className="member-old">NON-MEMBER: {currency}{originalPrice || '0.00'}</div>
              </div>
            </div>
            <div className="member-footer">SCAN YOUR APP TO SAVE</div>
          </div>
        );
      default:
        return (
          <div className="flyer-inner minimal-template">
            <div className="minimal-header"><h3>{renderLogo('minimal-header')}</h3></div>
            {commonImg('minimal')}
            <div className="minimal-info text-center">
              <h1 className="prod-name">{productName || 'Product Name'}</h1>
              <div className="price-minimal">{currency}{price || '0.00'}</div>
              <p className="footer-note">Quality Guaranteed</p>
            </div>
          </div>
        );
    }
  };

  const f = (field) => (e) => {
    e.stopPropagation();
    if (onFocusField) onFocusField(field);
  };

  return (
    <div className={`flyer-canvas ${data.orientation} ${paperSize}`} style={{ fontFamily: fontFamily || 'Inter, sans-serif' }}>
      {renderTemplate()}
      <style>{`
        .flyer-canvas.a4 .flyer-inner { zoom: 2.06; }
        
        .flyer-inner { height: 100%; display: flex; flex-direction: column; padding: 1.5rem; color: #1a1a1a; overflow: hidden; position: relative; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .text-center { text-align: center; }

        /* General Image Containers */
        [class^="img-container-"] { width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin: 1rem 0; }
        [class^="product-img-"] { width: 100%; height: 100%; object-fit: contain; transition: transform 0.1s ease-out; }

        /* Template: Discount Redesigned */
        .discount-template { background: #fff; display: flex; flex-direction: column; }
        .discount-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin: -1.5rem -1.5rem 1rem -1.5rem; background: #f8f8f8; border-bottom: 2px solid #E63946; }
        .branding-mini { padding: 0.5rem 1rem; font-weight: 900; color: #2D5A27; font-size: 0.8rem; letter-spacing: 1px; }
        .promo-badge-new { background: #E63946; color: #fff; padding: 0.5rem 1rem; font-weight: 900; font-size: 1rem; border-bottom-left-radius: 10px; }
        
        .discount-main { padding: 0 0.5rem; }
        .prod-name-new-discount {
          font-size: 2rem;
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1.1;
          color: #2D5A27;
          margin: 0.5rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .description-new { font-size: 0.9rem; color: #666; margin-bottom: 0.5rem; }

        .content-box-new { margin-top: auto; padding: 1rem 0; border-top: 1px dashed #eee; }
        .price-tag-new { display: flex; align-items: flex-start; gap: 0.2rem; color: #E63946; }
        .curr-new { font-size: 1.5rem; font-weight: 700; margin-top: 5px; }
        .amt-new { font-size: 4rem; font-weight: 900; line-height: 0.8; }
        .old-price-new { text-decoration: line-through; color: #aaa; font-size: 1.2rem; margin-top: 0.5rem; display: block; }
        .branding-bar-new { background: #2D5A27; color: white; padding: 0.5rem; margin: 0 -1.5rem -1.5rem -1.5rem; text-align: center; font-weight: 700; font-size: 0.9rem; text-transform: uppercase; }

        /* Template: Bold */
        .bold-template { background: #F4A261; color: white; padding: 0; }
        .brand-header { background: #1a1a1a; padding: 0.8rem; font-weight: 900; letter-spacing: 1px; }
        .prod-name-bold { padding: 1rem; font-size: 2.2rem; line-height: 1; text-transform: uppercase; }
        .price-box-bold { margin-top: auto; padding: 1.5rem; background: #1a1a1a; }
        .price-main { font-size: 3.5rem; font-weight: 900; }
        .curr-sm { font-size: 1.2rem; vertical-align: top; }
        .discount-banner { background: #E63946; padding: 0.4rem; margin-top: 0.8rem; font-weight: 800; font-size: 1.1rem; border-radius: 4px; }

        /* Template: BOGO */
        .bogo-template { background: #FFD700; border: 8px solid #E63946; }
        .bogo-header { background: #E63946; color: white; padding: 0.5rem; font-weight: 900; font-size: 1.5rem; margin: -1.5rem -1.5rem 0.5rem -1.5rem; }
        .free-text { color: #FFD700; font-size: 2rem; display: block; }
        .prod-name-bogo {
          font-size: 1.8rem;
          font-weight: 900;
          color: #1a1a1a;
          line-height: 1.1;
          height: 4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .bogo-price { color: #E63946; margin: 1rem 0; }
        .curr-lg { font-size: 1.5rem; font-weight: 800; }
        .amt-lg { font-size: 4rem; font-weight: 900; line-height: 0.8; }
        .bogo-footer { font-weight: 800; font-size: 0.9rem; margin-top: auto; }

        /* Template: Organic */
        .organic-template { background: #fdfdf5; border: 4px solid #2D5A27; }
        .organic-leaf { background: #2D5A27; color: white; padding: 0.5rem; font-weight: 900; margin: -1.5rem -1.5rem 1rem -1.5rem; text-align: center; }
        .prod-name-org {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2D5A27;
          margin: 0.5rem 0;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .org-sub { font-size: 0.9rem; font-style: italic; color: #555; }
        .org-price-box { color: #2D5A27; margin-top: 1rem; }
        .amt-org { font-size: 3.5rem; font-weight: 900; }
        .organic-footer { background: #2D5A27; color: white; font-size: 0.7rem; padding: 0.4rem; margin: auto -1.5rem -1.5rem -1.5rem; text-align: center; font-weight: bold; }

        /* Template: Clearance */
        .clearance-template { background: #000; color: #FF0; border: 4px solid #FF0; }
        .clearance-banner { background: #FF0; color: #000; font-weight: 900; font-size: 1.5rem; text-align: center; padding: 0.5rem; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-clearance {
          font-size: 1.8rem;
          font-weight: 900;
          height: 4rem;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .clearance-price-row { display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .amt-clear { font-size: 3.5rem; font-weight: 900; }
        .clearance-badge { background: #FF0; color: #000; padding: 0.5rem; font-weight: 900; border-radius: 5px; }
        .clearance-footer { color: #FF0; font-weight: bold; margin-top: auto; text-align: center; border-top: 1px solid #FF0; padding-top: 0.5rem; }

        /* Template: New */
        .new-template { background: #F0F8FF; border: 4px solid #007BFF; }
        .new-badge { background: #007BFF; color: white; font-weight: 900; padding: 0.5rem; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-new {
          font-size: 1.8rem;
          color: #0056b3;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .new-amt { font-size: 3.5rem; font-weight: 900; color: #007BFF; }
        .new-brand { font-weight: bold; color: #555; margin-top: auto; }

        /* Template: Manager */
        .manager-template { background: #FFF8E1; border: 4px solid #795548; }
        .manager-seal { background: #795548; color: white; padding: 0.5rem; font-weight: bold; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .manager-note { font-style: italic; font-size: 1rem; margin-bottom: 1rem; color: #5D4037; }
        .prod-name-manager {
          font-size: 1.8rem;
          font-weight: 900;
          color: #1a1a1a;
          line-height: 1.1;
          margin-top: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .manager-price { font-size: 3.5rem; font-weight: 900; color: #E63946; }

        /* Template: Flash */
        .flash-template { background: #4A148C; color: #FFF; border: 4px solid #FFD600; }
        .flash-header { background: #FFD600; color: #4A148C; font-weight: 900; font-size: 1.4rem; padding: 0.5rem; margin: -1.5rem -1.5rem 1rem -1.5rem; text-align: center; }
        .prod-name-flash {
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .flash-timer { background: rgba(255,255,255,0.1); padding: 0.3rem; font-weight: bold; font-size: 0.9rem; margin: 0.5rem 0; }
        .flash-price { font-size: 3.5rem; font-weight: 900; color: #FFD600; }

        /* Template: Healthy */
        .healthy-template { background: #E8F5E9; border: 4px solid #43A047; }
        .healthy-heading { background: #43A047; color: white; font-weight: 900; padding: 0.5rem; margin: -1.5rem -1.5rem 1rem -1.5rem; text-align: center; }
        .prod-name-healthy {
          font-size: 1.8rem;
          color: #2E7D32;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .healthy-stats { font-size: 0.8rem; font-weight: bold; color: #666; margin-bottom: 1rem; }
        .healthy-price { font-size: 3.5rem; font-weight: 900; color: #1a1a1a; }

        /* Template: Member */
        .member-template { background: #212121; color: #FFD700; border: 4px solid #FFD700; }
        .member-label { background: #FFD700; color: #000; font-weight: 900; padding: 0.5rem; margin: -1.5rem -1.5rem 1rem -1.5rem; text-align: center; }
        .prod-name-member {
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1.1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .member-actual { font-size: 3.5rem; font-weight: 900; }
        .member-old { font-size: 0.9rem; color: #aaa; text-decoration: none; }
        .member-footer { border-top: 1px solid #FFD700; margin-top: auto; padding-top: 0.5rem; font-size: 0.8rem; font-weight: bold; }

        /* Template: Ramadan Kareem */
        .ramadan-template { background: #1a237e; color: #ffd700; border: 4px solid #ffd700; }
        .ramadan-moon { background: #ffd700; color: #1a237e; font-weight: 900; padding: 0.5rem; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; font-size: 1.2rem; }
        .prod-name-ramadan { font-size: 1.8rem; font-weight: 900; line-height: 1.1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.5rem; }
        .ramadan-price { color: #fff; margin-top: 1rem; }
        .curr-ram { font-size: 1.5rem; font-weight: bold; margin-right: 0.3rem; }
        .amt-ram { font-size: 4rem; font-weight: 900; }
        .ramadan-footer { margin-top: auto; text-align: center; font-weight: 800; font-size: 0.8rem; border-top: 1px solid rgba(255,215,0,0.3); padding-top: 0.5rem; }

        /* Template: Iftar Special */
        .iftar-template { background: #fff8e1; border: 4px solid #e64a19; }
        .iftar-header { background: #e64a19; color: #fff; font-weight: 900; padding: 0.6rem; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; letter-spacing: 1px; }
        .prod-name-iftar { font-size: 1.8rem; font-weight: 900; color: #e64a19; line-height: 1.1; height: 4rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .iftar-sub { font-size: 0.9rem; color: #5d4037; font-style: italic; }
        .iftar-price-box { background: #e64a19; color: #fff; margin-top: 1rem; padding: 1rem; border-radius: 10px; text-align: center; }
        .iftar-label { font-size: 0.7rem; font-weight: bold; opacity: 0.9; }
        .iftar-price { font-size: 2.5rem; font-weight: 900; }
        .iftar-footer { margin-top: auto; text-align: center; font-weight: bold; color: #e64a19; font-size: 0.8rem; }

        /* Template: Suhoor Essentials */
        .suhoor-template { background: #e1f5fe; border: 4px solid #0288d1; }
        .suhoor-badge { background: #0288d1; color: #fff; font-weight: 900; padding: 0.5rem; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-suhoor { font-size: 1.8rem; font-weight: 900; color: #01579b; line-height: 1.1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .suhoor-promo { background: #fff; color: #0288d1; display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: bold; font-size: 0.8rem; margin: 0.5rem 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .suhoor-price { font-size: 3.5rem; font-weight: 900; color: #e63946; margin-top: 0.5rem; }
        .suh-curr { font-size: 1.2rem; vertical-align: top; }
        .suhoor-footer { margin-top: auto; text-align: center; font-weight: 800; color: #0288d1; font-size: 0.8rem; }

        /* Basic Minimal */
        .minimal-template { background: #fff; border: 1px solid #ddd; }
        .minimal-header { border-bottom: 2px solid #2D5A27; padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
        .price-minimal { font-size: 3rem; font-weight: 800; color: #1a1a1a; margin: 0.5rem 0; }
        .footer-note { color: #999; font-style: italic; font-size: 0.8rem; margin-top: auto; }
      `}</style>
    </div>
  );
};

export default FlyerCanvas;
