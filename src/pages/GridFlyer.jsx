import React, { useState, useRef, useLayoutEffect } from 'react';
import { Printer, Upload, Layout, Tag, Image as ImageIcon, Search, Sparkles, X, Grid3X3, Move } from 'lucide-react';
import GridFlyerCanvas from '../components/GridFlyerCanvas';
import ImageAdjuster from '../components/ImageAdjuster';

const GridFlyer = () => {
    const viewportRef = useRef(null);
    const [viewScale, setViewScale] = useState(1);
    const [template, setTemplate] = useState('ramadan');
    const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
    const [logo, setLogo] = useState(null);
    const [branding, setBranding] = useState('SUPERMARKET FLYER HUB');
    const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY;

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('grid-flyer-data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Parse error", e);
            }
        }
        return Array(12).fill(null).map((_, i) => ({
            name: '',
            price: '',
            originalPrice: '',
            currency: 'AED',
            discount: '',
            image: null,
            imageScale: 1,
            imageX: 0,
            imageY: 0
        }));
    });

    const [activeProductIndex, setActiveProductIndex] = useState(0);

    // Auto-Save Effect
    React.useEffect(() => {
        localStorage.setItem('grid-flyer-data', JSON.stringify(products));
    }, [products]);

    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setProducts(newProducts);
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                handleProductChange(index, 'image', readerEvent.target.result);
                setIsAdjusterOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyAdjustment = (adj) => {
        const newProducts = [...products];
        newProducts[activeProductIndex] = {
            ...newProducts[activeProductIndex],
            imageScale: adj.scale,
            imageX: adj.x,
            imageY: adj.y
        };
        setProducts(newProducts);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                setLogo(readerEvent.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBackground = async (index) => {
        const product = products[index];
        if (!product.image) return;
        setIsRemoving(true);
        setActiveProductIndex(index);

        try {
            const base64Content = product.image.split(',')[1];
            const byteCharacters = atob(base64Content);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            const formData = new FormData();
            formData.append('size', 'auto');
            formData.append('image_file', blob);

            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: { 'X-Api-Key': apiKey },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Remove.bg API Error';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.errors?.[0]?.title || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const resultBlob = await response.blob();
            const reader = new FileReader();
            reader.onload = () => {
                handleProductChange(index, 'image', reader.result);
                setIsRemoving(false);
            };
            reader.readAsDataURL(resultBlob);

        } catch (error) {
            console.error('Background Removal Failed:', error);
            alert(`Failed to remove background: ${error.message}`);
            setIsRemoving(false);
        }
    };

    // Auto-scale preview
    useLayoutEffect(() => {
        const updateScale = () => {
            if (!viewportRef.current) return;
            const v = viewportRef.current;
            const padding = 60;
            const vW = v.clientWidth - padding;
            const vH = v.clientHeight - padding;
            const pixelW = 8.27 * 96;
            const pixelH = 11.69 * 96;
            const scale = Math.min(vW / pixelW, vH / pixelH);
            setViewScale(scale);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const handleDownloadImage = async () => {
        const canvas = document.querySelector('.grid-flyer-canvas');
        if (!canvas) return;
        try {
            const dataUrl = await window.htmlToImage.toPng(canvas, {
                quality: 1,
                pixelRatio: 2
            });
            const link = document.createElement('a');
            link.download = `GridFlyer_Ramadan.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to save image.');
        }
    };

    return (
        <div className="studio-container">
            <header className="studio-header">
                <div className="header-left">
                    <div className="studio-logo">
                        <Grid3X3 size={20} className="text-secondary" />
                        <span>GRID<span className="text-secondary">STUDIO</span></span>
                    </div>
                    <div className="header-divider" />
                    <div className="template-indicator">
                        {template.toUpperCase()} MODE
                    </div>
                </div>

                <div className="header-right" style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={handleDownloadImage} className="studio-btn-primary" style={{ background: '#3b82f6' }}>
                        <ImageIcon size={18} />
                        SAVE AS IMAGE
                    </button>
                    <button onClick={() => window.print()} className="studio-btn-primary">
                        <Printer size={18} />
                        PRINT
                    </button>
                </div>
            </header>

            <main className="studio-main">
                <section className="studio-workspace">
                    <div className="canvas-viewport" ref={viewportRef}>
                        <div className="canvas-preview-wrapper" style={{ transform: `scale(${viewScale})` }}>
                            <GridFlyerCanvas
                                products={products}
                                template={template}
                                fontFamily={fontFamily}
                                logo={logo}
                                branding={branding}
                            />
                        </div>
                    </div>

                    <div className="template-dock">
                        <div className="dock-header">Themes</div>
                        <div className="dock-scroll">
                            {[
                                { id: 'ramadan-gold', label: 'R-Gold', icon: '✨' },
                                { id: 'ramadan-night', label: 'R-Night', icon: '🌃' },
                                { id: 'ramadan-lantern', label: 'R-Lantern', icon: '🪔' },
                                { id: 'ramadan-pattern', label: 'R-Pattern', icon: '💠' },
                                { id: 'ramadan-classic', label: 'R-Classic', icon: '🕋' },
                                { id: 'ramadan-modern', label: 'R-Modern', icon: '☪️' },
                                { id: 'ramadan-royal', label: 'R-Royal', icon: '💎' },
                                { id: 'ramadan-floral', label: 'R-Floral', icon: '🌸' },
                                { id: 'ramadan-moonlight', label: 'R-Moon', icon: '🌜' },
                                { id: 'ramadan-sunset', label: 'R-Sunset', icon: '🌇' },
                                { id: 'ramadan-oasis', label: 'R-Oasis', icon: '🌴' },
                                { id: 'ramadan-mosque', label: 'R-Mosque', icon: '🕌' },
                                { id: 'ramadan-stars', label: 'R-Stars', icon: '⭐' },
                                { id: 'ramadan-kareem', label: 'R-Kareem', icon: '✉️' },
                                { id: 'ramadan-mubarak', label: 'R-Mubarak', icon: '🏮' },
                                { id: 'standard', label: 'Standard', icon: '📄' },
                                { id: 'ramadan', label: 'Ramadan', icon: '🌙' },
                                { id: 'minimal', label: 'Minimal', icon: '✨' },
                                { id: 'modern', label: 'Modern', icon: '🏢' },
                                { id: 'flash', label: 'Flash', icon: '⚡' },
                                { id: 'organic', label: 'Organic', icon: '🍃' },
                                { id: 'discount', label: 'Discount', icon: '🏷️' },
                                { id: 'bold', label: 'Bold', icon: '🔥' },
                                { id: 'luxury', label: 'Luxury', icon: '👑' },
                                { id: 'fresh', label: 'Fresh', icon: '🍎' },
                                { id: 'superstore', label: 'SuperStore', icon: '🛒' },
                                { id: 'bogo', label: 'BOGO', icon: '🎁' },
                                { id: 'dark', label: 'Dark Mode', icon: '🌑' },
                                { id: 'elegant', label: 'Elegant', icon: '🖋️' },
                                { id: 'clearance', label: 'Clearance', icon: '⚠️' },
                                { id: 'neon', label: 'Neon Night', icon: '🌈' },
                            ].map(item => (
                                <div
                                    key={item.id}
                                    className={`dock-item ${template === item.id ? 'active' : ''}`}
                                    onClick={() => setTemplate(item.id)}
                                >
                                    <div className="item-icon">{item.icon}</div>
                                    <span className="item-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="settings-panel" style={{ width: '400px' }}>
                    <div className="panel-title">
                        <Layout size={16} />
                        <span>PROJECT PROPERTIES</span>
                    </div>

                    <div className="panel-content">
                        <div className="control-group">
                            <label>Branding</label>
                            <input
                                type="text"
                                value={branding}
                                onChange={(e) => setBranding(e.target.value)}
                                className="control-input mb-2"
                                placeholder="Store Name"
                            />
                            <label className="upload-trigger" htmlFor="logo-upload">
                                <Upload size={14} />
                                <span>{logo ? 'CHANGE LOGO' : 'UPLOAD LOGO'}</span>
                            </label>
                            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </div>

                        <div className="divider" style={{ height: '1px', background: '#333', margin: '1rem 0' }} />

                        <div className="panel-title" style={{ padding: '0.5rem 0', border: 'none' }}>
                            <ImageIcon size={16} />
                            <span>PRODUCTS ({products.filter(p => p.name).length}/12)</span>
                        </div>

                        <div className="product-grid-selector" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            {products.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveProductIndex(i)}
                                    style={{
                                        padding: '8px',
                                        background: activeProductIndex === i ? 'var(--primary)' : '#1a1a1a',
                                        border: '1px solid #333',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    #{i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="active-product-editor" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#F4A261' }}>Product #{activeProductIndex + 1} Details</h4>

                            <div className="field-group">
                                <div className="field-label">Name</div>
                                <input
                                    type="text"
                                    value={products[activeProductIndex].name}
                                    onChange={(e) => handleProductChange(activeProductIndex, 'name', e.target.value)}
                                    className="control-input"
                                />
                            </div>

                            <div className="field-row">
                                <div className="field-group flex-1">
                                    <div className="field-label">Price</div>
                                    <input
                                        type="text"
                                        value={products[activeProductIndex].price}
                                        onChange={(e) => handleProductChange(activeProductIndex, 'price', e.target.value)}
                                        className="control-input"
                                    />
                                </div>
                                <div className="field-group w-70">
                                    <div className="field-label">Discount</div>
                                    <input
                                        type="text"
                                        value={products[activeProductIndex].discount}
                                        onChange={(e) => handleProductChange(activeProductIndex, 'discount', e.target.value)}
                                        className="control-input"
                                    />
                                </div>
                            </div>

                            <div className="control-group">
                                <div className="field-row gap-2">
                                    <label className="upload-trigger flex-1" htmlFor="prod-image-upload">
                                        <Upload size={14} />
                                        <span>{products[activeProductIndex].image ? 'CHANGE IMAGE' : 'UPLOAD IMAGE'}</span>
                                    </label>
                                    {products[activeProductIndex].image && (
                                        <button
                                            className="studio-btn-adjust"
                                            onClick={() => setIsAdjusterOpen(true)}
                                            style={{
                                                background: '#2d5a27',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '0 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <Move size={14} />
                                            ADJUST
                                        </button>
                                    )}
                                    {products[activeProductIndex].image && (
                                        <button
                                            className={`magic-btn ${isRemoving ? 'loading' : ''}`}
                                            onClick={() => handleRemoveBackground(activeProductIndex)}
                                            disabled={isRemoving}
                                            style={{
                                                background: '#7c3aed',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '0 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <Sparkles size={14} />
                                            {isRemoving ? '...' : 'MAGIC BG'}
                                        </button>
                                    )}
                                </div>
                                <input
                                    id="prod-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(activeProductIndex, e)}
                                    className="hidden"
                                />
                            </div>

                            {products[activeProductIndex].image && (
                                <div className="sliders mt-4" style={{ display: 'none' }}>
                                    {/* Keep sliders in DOM but hidden as adjuster is better */}
                                    <div className="slider-box">
                                        <div className="slider-info"><span>Scale</span></div>
                                        <input
                                            type="range"
                                            min="0.1" max="2" step="0.1"
                                            value={products[activeProductIndex].imageScale}
                                            onChange={(e) => handleProductChange(activeProductIndex, 'imageScale', parseFloat(e.target.value))}
                                            className="studio-range"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </main>

            <ImageAdjuster
                isOpen={isAdjusterOpen}
                onClose={() => setIsAdjusterOpen(false)}
                onApply={handleApplyAdjustment}
                image={products[activeProductIndex].image}
                initialScale={products[activeProductIndex].imageScale}
                initialX={products[activeProductIndex].imageX}
                initialY={products[activeProductIndex].imageY}
            />
        </div >
    );
};

export default GridFlyer;
