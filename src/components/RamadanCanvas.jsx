import React from 'react';
import { motion } from 'framer-motion';

const RamadanCanvas = ({ data, template, activeImageIndex, onSelectImage, onUpdateImage }) => {
    const { productName, price, currency, discount, branding, logo, bgColor } = data;

    const renderImages = (className) => (data.images || []).map((img, idx) => {
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

    const templates = {
        'lantern_glow': (
            <div className="ramadan-template lantern-glow" style={{ backgroundColor: bgColor || '#1a237e' }}>
                <div className="lantern-top">🪔 RAMADAN KAREEM 🪔</div>
                {renderImages('ramadan')}
                <div className="ramadan-content">
                    <h1 className="prod-name-ramadan">{productName}</h1>
                    <div className="price-ramadan">{currency} {price}</div>
                </div>
                <div className="ramadan-footer">{branding}</div>
            </div>
        ),
        'moroccan_nights': (
            <div className="ramadan-template moroccan-nights" style={{ backgroundColor: bgColor || '#0d47a1' }}>
                <div className="pattern-overlay"></div>
                <div className="moroccan-header">ELEGANT RAMADAN</div>
                {renderImages('ramadan')}
                <div className="moroccan-footer">
                    <h2 className="prod-name-moroccan">{productName}</h2>
                    <div className="price-moroccan">{currency} {price}</div>
                </div>
            </div>
        ),
        'desert_sunset': (
            <div className="ramadan-template desert-sunset" style={{ background: bgColor || 'linear-gradient(to bottom, #ff9800, #e65100)' }}>
                <div className="camel-silhouette">🐫🐫🐫</div>
                {renderImages('ramadan')}
                <div className="sunset-info">
                    <h2 className="prod-name-sunset">{productName}</h2>
                    <div className="price-sunset">{currency} {price}</div>
                    <div className="discount-sunset">{discount}</div>
                </div>
            </div>
        ),
        'modern_arabesque': (
            <div className="ramadan-template modern-arabesque" style={{ backgroundColor: bgColor || '#ffffff' }}>
                <div className="arabesque-border"></div>
                <div className="modern-header">RAMADAN SPECIAL</div>
                {renderImages('ramadan')}
                <div className="modern-details">
                    <h2 className="prod-name-modern">{productName}</h2>
                    <div className="price-modern">{currency} {price}</div>
                </div>
            </div>
        ),
        'calligraphy_gold': (
            <div className="ramadan-template calligraphy-gold" style={{ backgroundColor: bgColor || '#000000' }}>
                <div className="calligraphy-bg">رمضان</div>
                <div className="gold-text">PREMIUM SELECTION</div>
                {renderImages('ramadan')}
                <div className="gold-details">
                    <h2 className="prod-name-gold">{productName}</h2>
                    <div className="price-gold">{currency} {price}</div>
                </div>
            </div>
        ),
        'mosque_silhouette': (
            <div className="ramadan-template mosque-silhouette" style={{ backgroundColor: bgColor || '#263238' }}>
                <div className="stars">✨ ✨ ✨</div>
                <div className="mosque-shape">🕌</div>
                {renderImages('ramadan')}
                <div className="mosque-info">
                    <h2 className="prod-name-mosque">{productName}</h2>
                    <div className="price-mosque">{currency} {price}</div>
                </div>
            </div>
        ),
        'floral_ramadan': (
            <div className="ramadan-template floral-ramadan" style={{ backgroundColor: bgColor || '#fce4ec' }}>
                <div className="floral-top">🌸 🌙 🌸</div>
                {renderImages('ramadan')}
                <div className="floral-content">
                    <h2 className="prod-name-floral">{productName}</h2>
                    <div className="price-floral">{currency} {price}</div>
                    <div className="store-floral">{branding}</div>
                </div>
            </div>
        ),
        'ramadan_gift': (
            <div className="ramadan-template ramadan-gift" style={{ backgroundColor: bgColor || '#4caf50' }}>
                <div className="gift-bow">🎀</div>
                <div className="gift-header">RAMADAN GIFT BOX</div>
                {renderImages('ramadan')}
                <div className="gift-info">
                    <h2 className="prod-name-gift">{productName}</h2>
                    <div className="price-gift">{currency} {price}</div>
                </div>
            </div>
        ),
        'crescent_star': (
            <div className="ramadan-template crescent-star" style={{ backgroundColor: bgColor || '#ffd54f' }}>
                <div className="crescent-icon">🌙</div>
                <div className="star-icon">★</div>
                {renderImages('ramadan')}
                <div className="crescent-content">
                    <h2 className="prod-name-crescent">{productName}</h2>
                    <div className="price-crescent">{currency} {price}</div>
                </div>
            </div>
        ),
        'iftar_feast': (
            <div className="ramadan-template iftar-feast" style={{ backgroundColor: bgColor || '#bf360c' }}>
                <div className="feast-header">DELICIOUS IFTAR</div>
                {renderImages('ramadan')}
                <div className="feast-details">
                    <h2 className="prod-name-feast">{productName}</h2>
                    <div className="price-feast">{currency} {price}</div>
                    <div className="feast-msg">BREAK YOUR FAST WITH US</div>
                </div>
            </div>
        ),
        'spiritual_blue': (
            <div className="ramadan-template spiritual-blue" style={{ backgroundColor: bgColor || '#e3f2fd' }}>
                <div className="blue-calm">PEACE & BLESSINGS</div>
                {renderImages('ramadan')}
                <div className="blue-content">
                    <h2 className="prod-name-blue">{productName}</h2>
                    <div className="price-blue">{currency} {price}</div>
                </div>
            </div>
        ),
        'luxury_gold': (
            <div className="ramadan-template luxury-gold" style={{ backgroundColor: bgColor || '#121212' }}>
                <div className="luxury-border"></div>
                <div className="luxury-header">ROYAL RAMADAN</div>
                {renderImages('ramadan')}
                <div className="luxury-info">
                    <h2 className="prod-name-luxury">{productName}</h2>
                    <div className="price-luxury">{currency} {price}</div>
                </div>
            </div>
        ),
        'ramadan_traditional': (
            <div className="ramadan-template ramadan-traditional" style={{ backgroundColor: bgColor || '#2e7d32' }}>
                <div className="trad-header">RAMADAN KAREEM</div>
                {renderImages('ramadan')}
                <div className="trad-content">
                    <h2 className="prod-name-trad">{productName}</h2>
                    <div className="price-trad">{currency} {price}</div>
                </div>
            </div>
        ),
        'pink_blossom': (
            <div className="ramadan-template pink-blossom" style={{ backgroundColor: bgColor || '#f8bbd0' }}>
                <div className="blossom-top">💮</div>
                {renderImages('ramadan')}
                <div className="blossom-content">
                    <h2 className="prod-name-blossom">{productName}</h2>
                    <div className="price-blossom">{currency} {price}</div>
                    <div className="blossom-footer">MODERN RAMADAN</div>
                </div>
            </div>
        ),
        'midnight_prayer': (
            <div className="ramadan-template midnight-prayer" style={{ backgroundColor: bgColor || '#000033' }}>
                <div className="moon-glow"></div>
                {renderImages('ramadan')}
                <div className="midnight-content">
                    <h2 className="prod-name-midnight">{productName}</h2>
                    <div className="price-midnight">{currency} {price}</div>
                    <div className="midnight-msg">SUHOOR SPECIAL</div>
                </div>
            </div>
        )
    };

    return (
        <div className="ramadan-canvas-wrapper">
            {templates[template] || templates['lantern_glow']}
            <style>{`
        .ramadan-template {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        /* Lantern Glow */
        .lantern-glow { color: #ffd700; text-align: center; }
        .lantern-top { font-size: 1.2rem; font-weight: 900; margin-bottom: 1rem; }
        .price-ramadan { font-size: 3rem; font-weight: 900; }

        /* Moroccan Nights */
        .moroccan-nights { border: 10px double #ffd700; }
        .pattern-overlay { position: absolute; top:0; left:0; right:0; bottom:0; opacity: 0.1; background-image: radial-gradient(#ffd700 1px, transparent 0); background-size: 20px 20px; }
        .moroccan-header { text-align: center; font-weight: bold; border-bottom: 2px solid #ffd700; padding-bottom: 0.5rem; }
        .prod-name-moroccan { font-size: 1.5rem; }
        .price-moroccan { font-size: 3rem; color: #ffd700; font-weight: 900; }

        /* Desert Sunset */
        .desert-sunset { align-items: center; color: white; }
        .camel-silhouette { font-size: 2rem; opacity: 0.7; margin-bottom: 0.5rem; }
        .sunset-info { text-align: center; margin-top: auto; }
        .price-sunset { font-size: 3.5rem; font-weight: 900; }

        /* Modern Arabesque */
        .modern-arabesque { color: #2D5A27; border: 4px solid #2D5A27; }
        .arabesque-border { position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid #2D5A27; opacity: 0.3; }
        .modern-header { font-weight: 900; text-align: center; }
        .price-modern { font-size: 3rem; font-weight: 900; }

        /* Calligraphy Gold */
        .calligraphy-bg { position: absolute; top: 10%; left: 0; right: 0; font-size: 8rem; opacity: 0.15; color: #ffd700; text-align: center; font-family: 'serif'; pointer-events: none; }
        .gold-text { color: #ffd700; font-weight: 700; text-align: center; letter-spacing: 2px; }
        .prod-name-gold { color: white; text-align: center; margin-top: auto; }
        .price-gold { color: #ffd700; font-size: 3.5rem; font-weight: 900; text-align: center; }

        /* Mosque Silhouette */
        .stars { position: absolute; top: 5%; left: 0; right: 0; text-align: center; font-size: 1.5rem; color: #ffd700; opacity: 0.6; }
        .mosque-shape { position: absolute; bottom: -20px; right: -20px; font-size: 10rem; opacity: 0.2; color: #ffd700; pointer-events: none; }
        .mosque-info { margin-top: auto; }
        .price-mosque { font-size: 3rem; font-weight: 900; color: #ffd700; }

        /* Floral Ramadan */
        .floral-ramadan { color: #ad1457; text-align: center; }
        .floral-top { font-size: 2rem; margin-bottom: 1rem; }
        .price-floral { font-size: 3.5rem; font-weight: 900; }

        /* Ramadan Gift */
        .ramadan-gift { border: 5px solid #ffd700; }
        .gift-bow { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 3rem; }
        .gift-header { text-align: center; font-weight: 900; margin-top: 1rem; color: #fff; }
        .price-gift { font-size: 3.5rem; font-weight: 900; color: #ffd700; }

        /* Crescent Star */
        .crescent-star { color: #333; text-align: center; }
        .crescent-icon { font-size: 5rem; color: #444; }
        .star-icon { position: absolute; top: 40px; right: 60px; font-size: 2rem; color: #fff; }
        .price-crescent { font-size: 4rem; font-weight: 900; color: #d32f2f; }

        /* Iftar Feast */
        .iftar-feast { text-align: center; justify-content: center; }
        .feast-header { font-size: 1.5rem; font-weight: 900; background: rgba(255,255,255,0.2); padding: 0.5rem; margin-bottom: 1rem; }
        .price-feast { font-size: 4rem; font-weight: 900; }
        .feast-msg { font-size: 0.8rem; font-weight: bold; margin-top: 1rem; }

        /* Spiritual Blue */
        .spiritual-blue { color: #1565c0; text-align: center; }
        .blue-calm { font-style: italic; font-weight: bold; margin-bottom: 2rem; }
        .price-blue { font-size: 3.5rem; font-weight: 900; }

        /* Luxury Gold */
        .luxury-gold { border: 2px solid #ffd700; }
        .luxury-border { position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 1px solid #ffd700; opacity: 0.5; }
        .luxury-header { color: #ffd700; text-align: center; letter-spacing: 5px; font-weight: 300; }
        .price-luxury { color: #ffd700; font-size: 3.5rem; font-weight: 900; text-align: center; margin-top: auto; }

        /* Traditional */
        .ramadan-traditional { border-left: 20px solid #ffd700; }
        .trad-header { font-weight: 900; font-size: 1.2rem; }
        .trad-content { margin-top: auto; }
        .price-trad { font-size: 4rem; font-weight: 900; color: #ffd700; }

        /* Pink Blossom */
        .pink-blossom { color: #880e4f; }
        .blossom-top { font-size: 3rem; }
        .blossom-content { margin-top: auto; text-align: right; }
        .price-blossom { font-size: 3rem; font-weight: 900; }

        /* Midnight Prayer */
        .midnight-prayer { justify-content: space-between; }
        .moon-glow { position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); }
        .price-midnight { font-size: 3.5rem; font-weight: 900; color: #ffd700; }

        /* Generic styles copied from FlyerCanvas */
        [class^="img-container-"] { width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin: 1rem 0; z-index: 5; }
        [class^="product-img-"] { width: 100%; height: 100%; object-fit: contain; }
        .active-selection { outline: 2px dashed #ffd700; outline-offset: -2px; }
      `}</style>
        </div>
    );
};

export default RamadanCanvas;
