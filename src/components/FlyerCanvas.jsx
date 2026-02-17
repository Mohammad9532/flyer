import React from 'react';
import { motion } from 'framer-motion';

const FlyerCanvas = ({ data, template, onFocusField, activeImageIndex, onSelectImage, onUpdateImage }) => {
  const { productName, price, originalPrice, currency, discount, description, images, logo, branding, fontFamily, paperSize } = data;

  const renderTemplate = () => {
    const renderImages = (className) => (images || []).map((img, idx) => {
      const isActive = activeImageIndex === idx;
      const isInteractive = !!onUpdateImage;

      return (
        <motion.div
          key={img.id || idx}
          className={`img-container-${className} ${isActive && isInteractive ? 'active-selection' : ''}`}
          style={{
            position: idx === 0 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            x: img.x,
            y: img.y,
            zIndex: idx,
            cursor: isInteractive ? 'move' : 'default',
          }}
          drag={isActive && isInteractive}
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={(e, info) => {
            if (isActive && onUpdateImage) {
              onUpdateImage(idx, {
                x: img.x + info.offset.x,
                y: img.y + info.offset.y
              });
            }
          }}
          onClick={(e) => {
            if (isInteractive) {
              e.stopPropagation();
              onSelectImage?.(idx);
            }
          }}
        >
          <img
            src={img.url}
            className={`product-img-${className}`}
            alt="Product"
            style={{
              transform: `scale(${img.scale})`,
              pointerEvents: 'none',
              transformOrigin: 'center center'
            }}
          />
        </motion.div>
      );
    });

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

            {renderImages('standard')}

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
            {renderImages('bold')}
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
            {renderImages('bogo')}
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
            {renderImages('organic')}
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
            {renderImages('clearance')}
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
            {renderImages('new')}
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
            {renderImages('manager')}
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
            {renderImages('flash')}
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
            {renderImages('healthy')}
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
            {renderImages('ramadan')}
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
      case 'ramadan-gold':
        return (
          <div className="flyer-inner r-gold-template">
            <div className="r-gold-pattern"></div>
            <div className="r-gold-header">✨ RAMADAN EXCLUSIVE ✨</div>
            {renderImages('r-gold')}
            <div className="r-gold-content">
              <h2 className="prod-name-r-gold">{productName}</h2>
              <div className="r-gold-price-tag">
                <div className="r-gold-curr">{currency}</div>
                <div className="r-gold-amt">{price}</div>
              </div>
            </div>
            <div className="r-gold-footer">{branding} • ELEGANCE IN EVERY BITE</div>
          </div>
        );
      case 'ramadan-night':
        return (
          <div className="flyer-inner r-night-template">
            <div className="r-night-stars"></div>
            <div className="r-night-moon">🌙</div>
            <div className="r-night-header">NIGHTLY SPECIALS</div>
            {renderImages('r-night')}
            <div className="r-night-container">
              <h2 className="prod-name-r-night">{productName}</h2>
              <div className="r-night-price-box">
                <span className="r-night-amt">{currency} {price}</span>
              </div>
            </div>
            <div className="r-night-footer">{branding}</div>
          </div>
        );
      case 'ramadan-lantern':
        return (
          <div className="flyer-inner r-lantern-template">
            <div className="r-lantern-icon">🪔</div>
            <div className="r-lantern-header">RAMADAN LIGHTS</div>
            {renderImages('r-lantern')}
            <div className="r-lantern-body">
              <h2 className="prod-name-r-lantern">{productName}</h2>
              <div className="r-lantern-price-circle">
                <div className="r-lantern-price-val">{price}</div>
                <div className="r-lantern-price-curr">{currency}</div>
              </div>
            </div>
            <div className="r-lantern-footer">{branding}</div>
          </div>
        );
      case 'ramadan-pattern':
        return (
          <div className="flyer-inner r-pattern-template">
            <div className="r-pattern-overlay"></div>
            <div className="r-pattern-header">TRADITIONAL SAVINGS</div>
            {renderImages('r-pattern')}
            <div className="r-pattern-info">
              <h2 className="prod-name-r-pattern">{productName}</h2>
              <div className="r-pattern-price-wrap">
                <span className="r-pattern-price">{currency} {price}</span>
              </div>
            </div>
            <div className="r-pattern-footer">{branding}</div>
          </div>
        );
      case 'ramadan-classic':
        return (
          <div className="flyer-inner r-classic-template">
            <div className="r-classic-top">RAMADAN KAREEM</div>
            {renderImages('r-classic')}
            <div className="r-classic-main">
              <h2 className="prod-name-r-classic">{productName}</h2>
              <div className="r-classic-price">
                <span className="r-cl-curr">{currency}</span>
                <span className="r-cl-amt">{price}</span>
              </div>
            </div>
            <div className="r-classic-bottom">{branding}</div>
          </div>
        );
      case 'ramadan-modern':
        return (
          <div className="flyer-inner r-modern-template">
            <div className="r-modern-side"></div>
            <div className="r-modern-header">Ramadan Modern</div>
            {renderImages('r-modern')}
            <div className="r-modern-content">
              <h2 className="prod-name-r-modern">{productName}</h2>
              <div className="r-modern-price">
                <span className="r-modern-symbol">{currency}</span>
                {price}
              </div>
            </div>
            <div className="r-modern-footer">#RAMADAN2024 • {branding}</div>
          </div>
        );
      case 'ramadan-royal':
        return (
          <div className="flyer-inner r-royal-template">
            <div className="r-royal-border"></div>
            <div className="r-royal-header">ROYAL RAMADAN</div>
            {renderImages('r-royal')}
            <div className="r-royal-details">
              <h2 className="prod-name-r-royal">{productName}</h2>
              <div className="r-royal-price-box">
                <div className="r-royal-label">Value Price</div>
                <div className="r-royal-value">{currency} {price}</div>
              </div>
            </div>
            <div className="r-royal-footer">{branding}</div>
          </div>
        );
      case 'ramadan-floral':
        return (
          <div className="flyer-inner r-floral-template">
            <div className="r-floral-bg"></div>
            <div className="r-floral-header">BLOOMING RAMADAN</div>
            {renderImages('r-floral')}
            <div className="r-floral-info">
              <h2 className="prod-name-r-floral">{productName}</h2>
              <div className="r-floral-price">{currency}{price}</div>
            </div>
            <div className="r-floral-footer">{branding}</div>
          </div>
        );
      case 'ramadan-moonlight':
        return (
          <div className="flyer-inner r-moonlight-template">
            <div className="r-moon-glow"></div>
            <div className="r-moon-header">MOONLIGHT DEALS</div>
            {renderImages('r-moon')}
            <div className="r-moon-content text-center">
              <h2 className="prod-name-r-moon">{productName}</h2>
              <div className="r-moon-price-tag">{currency} {price}</div>
            </div>
            <div className="r-moon-footer">{branding}</div>
          </div>
        );
      case 'ramadan-sunset':
        return (
          <div className="flyer-inner r-sunset-template">
            <div className="r-sunset-gradient"></div>
            <div className="r-sunset-header">AWAKENING FLAVORS</div>
            {renderImages('r-sunset')}
            <div className="r-sunset-info text-center">
              <h2 className="prod-name-r-sunset">{productName}</h2>
              <div className="r-sunset-price">
                <span className="r-sunset-curr">{currency}</span>
                {price}
              </div>
            </div>
            <div className="r-sunset-footer">{branding}</div>
          </div>
        );
      case 'ramadan-oasis':
        return (
          <div className="flyer-inner r-oasis-template">
            <div className="r-oasis-palms">🌴🌴🌴</div>
            <div className="r-oasis-header">OASIS REFRESHMENTS</div>
            {renderImages('r-oasis')}
            <div className="r-oasis-content">
              <h2 className="prod-name-r-oasis">{productName || 'Fresh Organic Dates'}</h2>
              <div className="r-oasis-price-box">
                <span className="r-oasis-price">{currency} {price}</span>
              </div>
            </div>
            <div className="r-oasis-footer">PURE & NATURAL • {branding}</div>
          </div>
        );
      case 'ramadan-mosque':
        return (
          <div className="flyer-inner r-mosque-template">
            <div className="r-mosque-silhouette"></div>
            <div className="r-mosque-header">BLESSED SAVINGS</div>
            {renderImages('r-mosque')}
            <div className="r-mosque-info">
              <h2 className="prod-name-r-mosque">{productName}</h2>
              <div className="r-mosque-price">{currency} {price}</div>
            </div>
            <div className="r-mosque-footer">{branding}</div>
          </div>
        );
      case 'ramadan-stars':
        return (
          <div className="flyer-inner r-stars-template">
            <div className="r-stars-container"></div>
            <div className="r-stars-header">STARRY RAMADAN</div>
            {renderImages('r-stars')}
            <div className="r-stars-body">
              <h2 className="prod-name-r-stars">{productName}</h2>
              <div className="r-stars-price-badge">
                <span className="r-stars-price">{currency} {price}</span>
              </div>
            </div>
            <div className="r-stars-footer">{branding}</div>
          </div>
        );
      case 'ramadan-kareem':
        return (
          <div className="flyer-inner r-kareem-template">
            <div className="r-kareem-badge">RARE OFFER</div>
            <div className="r-kareem-title">Ramadan Kareem</div>
            {renderImages('r-kareem')}
            <div className="r-kareem-info">
              <h2 className="prod-name-r-kareem">{productName}</h2>
              <div className="r-kareem-price">{currency} {price}</div>
            </div>
            <div className="r-kareem-footer">{branding}</div>
          </div>
        );
      case 'ramadan-mubarak':
        return (
          <div className="flyer-inner r-mubarak-template">
            <div className="r-mubarak-header">Eid Mubarak Deals</div>
            {renderImages('r-mubarak')}
            <div className="r-mubarak-content text-center">
              <h2 className="prod-name-r-mubarak">{productName}</h2>
              <div className="r-mubarak-price-wrap">
                <span className="r-mubarak-label">SPECIAL MUBARAK PRICE</span>
                <div className="r-mubarak-price">{currency} {price}</div>
              </div>
            </div>
            <div className="r-mubarak-footer">{branding}</div>
          </div>
        );
      case 'iftar':
        return (
          <div className="flyer-inner iftar-template">
            <div className="iftar-header">✨ IFTAR SPECIAL ✨</div>
            {renderImages('iftar')}
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
            {renderImages('suhoor')}
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
            {renderImages('member')}
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
            {renderImages('minimal')}
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

        /* Ramadan Gold */
        .r-gold-template { background: #1a1a1a; color: #d4af37; border: 4px solid #d4af37; }
        .r-gold-pattern { position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0.1; background-image: radial-gradient(#d4af37 1px, transparent 1px); background-size: 20px 20px; }
        .r-gold-header { background: #d4af37; color: #000; padding: 0.5rem; text-align: center; font-weight: 900; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-r-gold { font-size: 1.8rem; font-weight: 900; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .r-gold-price-tag { background: #d4af37; color: #000; padding: 1rem; border-radius: 5px; margin-top: 1rem; transform: rotate(-2deg); display: inline-block; }
        .r-gold-curr { font-size: 0.8rem; font-weight: bold; }
        .r-gold-amt { font-size: 2.5rem; font-weight: 900; }
        .r-gold-footer { margin-top: auto; text-align: center; border-top: 1px solid #d4af37; padding-top: 0.5rem; font-size: 0.7rem; font-weight: 700; }

        /* Ramadan Night */
        .r-night-template { background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; }
        .r-night-stars { position: absolute; inset:0; background-image: radial-gradient(white 1px, transparent 0); background-size: 50px 50px; opacity: 0.3; }
        .r-night-moon { position: absolute; top: 20px; right: 20px; font-size: 3rem; opacity: 0.2; }
        .r-night-header { text-align: center; font-weight: 900; letter-spacing: 4px; border-bottom: 2px solid #38bdf8; padding-bottom: 5px; margin-bottom: 1rem; }
        .prod-name-r-night { font-size: 1.8rem; font-weight: 900; color: #38bdf8; }
        .r-night-price-box { margin-top: 1rem; background: rgba(56, 189, 248, 0.2); padding: 0.8rem; border-radius: 12px; border: 1px solid #38bdf8; display: inline-block; }
        .r-night-amt { font-size: 2.2rem; font-weight: 900; }
        .r-night-footer { margin-top: auto; font-weight: bold; opacity: 0.8; }

        /* Ramadan Lantern */
        .r-lantern-template { background: #fff; border: 6px solid #f97316; }
        .r-lantern-icon { position: absolute; top: -10px; right: 20px; font-size: 4rem; z-index: 10; transform: translateY(10px); }
        .r-lantern-header { background: #f97316; color: #fff; padding: 0.8rem; margin: -1.5rem -1.5rem 1rem -1.5rem; font-weight: 900; font-size: 1.2rem; }
        .prod-name-r-lantern { font-size: 1.8rem; font-weight: 800; color: #7c2d12; margin-top: 0.5rem; }
        .r-lantern-price-circle { width: 100px; height: 100px; background: #ea580c; color: #fff; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 1rem auto; box-shadow: 0 5px 15px rgba(234, 88, 12, 0.4); }
        .r-lantern-price-val { font-size: 2rem; font-weight: 900; line-height: 1; }
        .r-lantern-price-curr { font-size: 0.7rem; font-weight: bold; }
        .r-lantern-footer { margin-top: auto; font-weight: 900; color: #f97316; }

        /* Ramadan Pattern */
        .r-pattern-template { background: #fefce8; }
        .r-pattern-overlay { position: absolute; inset:0; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZjVkYjY3IiBmaWxsLW9wYWNpdHk9IjAuNSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMjAgMTAuOWw2LjYtNC44IDguMSA0LjQtNi42IDQuOC04LjEtNC40ek0xMy40IDYuMWw2LjYgNC44LTguMSA0LjQtNi42LTQuOCA4LjEtNC40em0wIDI3LjhsNi42LTQuOC04LjEgNC40LTYuNi00LjggOC4xLTQuNHpNMjAgMjkuMWw2LjYgNC44IDguMS00LjQtNi42LTQuOC04LjEtNC40eiIvPjwvZz48L3N2Zz4='); opacity: 0.2; }
        .r-pattern-header { position: relative; border-bottom: 2px solid #854d0e; font-weight: 900; font-size: 1.4rem; color: #854d0e; padding-bottom: 5px; margin-bottom: 1rem; }
        .prod-name-r-pattern { position: relative; font-size: 1.8rem; font-weight: 800; color: #422006; }
        .r-pattern-price-wrap { position: relative; margin-top: 1rem; }
        .r-pattern-price { font-size: 3rem; font-weight: 900; color: #b45309; }
        .r-pattern-footer { position: relative; margin-top: auto; font-style: italic; color: #713f12; }

        /* Ramadan Classic */
        .r-classic-template { background: #064e3b; color: #fde68a; border: 5px double #fde68a; }
        .r-classic-top { border-bottom: 1px solid #fde68a; font-weight: 800; padding: 0.5rem; letter-spacing: 2px; }
        .prod-name-r-classic { font-size: 1.8rem; font-weight: 700; color: #fff; margin-top: 1rem; }
        .r-cl-curr { font-size: 1.2rem; margin-right: 5px; opacity: 0.8; }
        .r-cl-amt { font-size: 3.5rem; font-weight: 900; }
        .r-classic-bottom { margin-top: auto; padding: 0.5rem; background: rgba(253, 230, 138, 0.1); }

        /* Ramadan Modern */
        .r-modern-template { background: #fff; }
        .r-modern-side { position: absolute; left: 0; top: 0; bottom: 0; width: 10px; background: #6366f1; }
        .r-modern-header { text-align: right; color: #6366f1; font-weight: 300; font-size: 1.5rem; letter-spacing: -1px; }
        .prod-name-r-modern { font-size: 2.2rem; font-weight: 900; color: #1e1b4b; text-align: left; line-height: 1; }
        .r-modern-price { font-size: 3.5rem; font-weight: 900; color: #6366f1; text-align: left; }
        .r-modern-symbol { font-size: 1.5rem; vertical-align: top; }
        .r-modern-footer { margin-top: auto; font-size: 0.6rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; text-align: left; }

        /* Ramadan Royal */
        .r-royal-template { background: #4c1d95; color: #fff; }
        .r-royal-border { position: absolute; inset: 10px; border: 1px solid rgba(245, 158, 11, 0.5); }
        .r-royal-header { font-size: 1.4rem; font-weight: 900; color: #fbbf24; text-align: center; margin: 0 0 1rem 0; padding: 10px; border-bottom: 1px solid #fbbf24; }
        .prod-name-r-royal { font-size: 1.8rem; font-weight: 800; color: #fff; }
        .r-royal-price-box { background: #fbbf24; color: #4c1d95; padding: 10px; border-radius: 0 20px 0 20px; display: inline-block; margin-top: 1rem; }
        .r-royal-label { font-size: 0.6rem; font-weight: bold; text-transform: uppercase; }
        .r-royal-value { font-size: 2.2rem; font-weight: 900; }
        .r-royal-footer { margin-top: auto; font-size: 0.8rem; color: #f59e0b; }

        /* Ramadan Floral */
        .r-floral-template { background: #fff1f2; }
        .r-floral-bg { position: absolute; inset:0; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjYmJlMWVmIiBmaWxsLW9wYWNpdHk9IjAuNCI+PHBhdGggZD0iTTEwIDlsMSAxLTEgMS0xLTF6bTUgNWwxIDEtMSAxLTEtMXpNNSA1bDEgMS0xIDEtMS0xeiIvPjwvZz48L3N2Zz4='); opacity: 0.5; }
        .r-floral-header { position: relative; color: #be123c; font-weight: 900; font-size: 1.4rem; border-bottom: 2px dashed #fb7185; }
        .prod-name-r-floral { position: relative; font-size: 1.8rem; font-weight: 800; color: #881337; margin: 0.5rem 0; }
        .r-floral-price { position: relative; font-size: 3.5rem; font-weight: 900; color: #e11d48; }
        .r-floral-footer { position: relative; margin-top: auto; color: #9f1239; font-weight: bold; }

        /* Ramadan Moonlight */
        .r-moonlight-template { background: #0c0a09; color: #e7e5e4; }
        .r-moon-glow { position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); }
        .r-moon-header { font-weight: 900; color: #fff; letter-spacing: 5px; opacity: 0.9; margin-bottom: 2rem; }
        .prod-name-r-moon { font-size: 1.8rem; font-weight: 300; letter-spacing: 1px; color: #fff; }
        .r-moon-price-tag { font-size: 3rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); margin-top: 1rem; }
        .r-moon-footer { margin-top: auto; border-top: 1px solid #292524; padding-top: 1rem; opacity: 0.5; }

        /* Ramadan Sunset */
        .r-sunset-template { background: #7c2d12; color: #fde68a; }
        .r-sunset-gradient { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(234, 88, 12, 0.4) 0%, transparent 100%); }
        .r-sunset-header { position: relative; font-weight: 800; font-size: 1.2rem; background: #ea580c; color: #fff; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        .prod-name-r-sunset { position: relative; font-size: 1.8rem; font-weight: 900; color: #fff; margin-top: 1rem; }
        .r-sunset-price { position: relative; font-size: 4rem; font-weight: 900; }
        .r-sunset-curr { font-size: 1.5rem; vertical-align: top; }
        .r-sunset-footer { position: relative; margin-top: auto; font-weight: bold; }

        /* Ramadan Oasis */
        .r-oasis-template { background: #ecfdf5; border: 8px solid #065f46; }
        .r-oasis-palms { position: absolute; bottom: 10px; right: 10px; font-size: 3rem; opacity: 0.1; }
        .r-oasis-header { background: #065f46; color: #fff; padding: 0.5rem; font-weight: 900; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-r-oasis { font-size: 1.8rem; font-weight: 800; color: #064e3b; }
        .r-oasis-price-box { border-bottom: 4px solid #10b981; display: inline-block; padding: 0.5rem 1rem; }
        .r-oasis-price { font-size: 3rem; font-weight: 900; color: #065f46; }
        .r-oasis-footer { margin-top: auto; color: #065f46; font-weight: bold; }

        /* Ramadan Mosque */
        .r-mosque-template { background: #1e1b4b; color: #a5b4fc; }
        .r-mosque-silhouette { position: absolute; bottom:0; left:0; width:100%; height:100px; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjAwIDUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDUwIFY0MCBDMTAgNDAgMjAgMzAgMjAgMzAgQzIwIDMwIDMwIDIwIDMwIDEwIEMzMCAxMCA0MCAwIDQwIDAgQzQwIDAgNTAgMTAgNTAgMTAgQzUwIDEwIDYwIDMwIDYwIDMwIEM2MCAzMCA3MCA0MCA4MCA0MCBWNTAgSDAgeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg=='); background-repeat: repeat-x; background-position: bottom; }
        .r-mosque-header { font-weight: 900; font-size: 1.4rem; padding: 1rem; border: 1px solid rgba(165, 180, 252, 0.3); }
        .prod-name-r-mosque { font-size: 1.8rem; font-weight: 700; color: #fff; margin-top: 1rem; }
        .r-mosque-price { font-size: 3.5rem; font-weight: 900; color: #818cf8; }
        .r-mosque-footer { margin-top: auto; font-size: 0.8rem; opacity: 0.6; }

        /* Ramadan Stars */
        .r-stars-template { background: #000; color: #fff; }
        .r-stars-container { position: absolute; inset:0; background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)); background-repeat: repeat; background-size: 200px 200px; }
        .r-stars-header { background: linear-gradient(90deg, #ffd700, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-size: 1.5rem; padding: 1rem 0; }
        .prod-name-r-stars { font-size: 1.8rem; font-weight: 800; }
        .r-stars-price-badge { border: 2px solid #ffd700; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); padding: 5px 20px; border-radius: 50px; display: inline-block; margin-top: 1rem; }
        .r-stars-price { font-size: 2.5rem; font-weight: 900; color: #ffd700; }
        .r-stars-footer { margin-top: auto; color: #aaa; }

        /* Ramadan Kareem Badge */
        .r-kareem-template { background: #fdfdfd; border: 1px solid #ccc; }
        .r-kareem-badge { position: absolute; top: 10px; left: 10px; background: #d42027; color: #fff; font-size: 0.6rem; font-weight: 900; padding: 2px 8px; transform: rotate(-5deg); box-shadow: 2px 2px 0 #000; }
        .r-kareem-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #064e3b; margin-top: 2rem; }
        .prod-name-r-kareem { font-size: 1.5rem; font-weight: 400; color: #333; }
        .r-kareem-price { font-size: 3.5rem; font-weight: 900; color: #d42027; }
        .r-kareem-footer { margin-top: auto; border-top: 2px solid #064e3b; padding-top: 5px; font-weight: 800; }

        /* Ramadan Mubarak */
        .r-mubarak-template { background: #fff8e1; border: 8px solid #3e2723; }
        .r-mubarak-header { background: #3e2723; color: #fff; padding: 0.5rem; font-weight: 900; margin: -1.5rem -1.5rem 1rem -1.5rem; }
        .prod-name-r-mubarak { font-size: 1.8rem; font-weight: 800; color: #3e2723; }
        .r-mubarak-price-wrap { border: 2px solid #3e2723; padding: 1rem; margin-top: 1rem; }
        .r-mubarak-label { font-size: 0.6rem; font-weight: bold; color: #5d4037; }
        .r-mubarak-price { font-size: 2.5rem; font-weight: 900; color: #e64a19; }
        .r-mubarak-footer { margin-top: auto; font-weight: 900; }

        /* Basic Minimal */
        .minimal-template { background: #fff; border: 1px solid #ddd; }
        .minimal-header { border-bottom: 2px solid #2D5A27; padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
        .price-minimal { font-size: 3rem; font-weight: 800; color: #1a1a1a; margin: 0.5rem 0; }
        .footer-note { color: #999; font-style: italic; font-size: 0.8rem; margin-top: auto; }
      `}</style>
      <style>{`
        .active-selection {
          outline: 2px dashed var(--secondary, #F4A261);
          outline-offset: -2px;
        }
        @media print {
          .active-selection {
            outline: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FlyerCanvas;
