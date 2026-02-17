import React, { useState, useRef, useLayoutEffect } from 'react';
import { Printer, Upload, Layout, Tag, Image as ImageIcon, Search, Sparkles, X, Grid, Move } from 'lucide-react';
import Grid2x2Canvas from '../components/Grid2x2Canvas';
import ImageAdjuster from '../components/ImageAdjuster';

const Grid2x2Flyer = () => {
    const viewportRef = useRef(null);
    const [viewScale, setViewScale] = useState(1);
    const [template, setTemplate] = useState('discount');
    const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
    const [logo, setLogo] = useState(null);
    const [branding, setBranding] = useState('SUPERMARKET FLYER HUB');
    const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isRemoving, setIsRemoving] = useState(false);
    const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY;

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('grid2x2-flyer-data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Parse error", e);
            }
        }
        return Array(4).fill(null).map((_, i) => ({
            productName: '',
            price: '',
            originalPrice: '',
            currency: 'AED',
            discount: '',
            images: [],
            id: i
        }));
    });

    const [activeProductIndex, setActiveProductIndex] = useState(0);

    // Auto-Save Effect
    React.useEffect(() => {
        localStorage.setItem('grid2x2-flyer-data', JSON.stringify(products));
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
                const newImage = {
                    url: readerEvent.target.result,
                    scale: 1,
                    x: 0,
                    y: 0,
                    id: Date.now()
                };
                const newProducts = [...products];
                newProducts[index].images = [newImage]; // For 2x2 grid, we might just use 1 image per block for simplicity, but could support multi here too.
                setProducts(newProducts);
                setIsAdjusterOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCanvasSelect = (prodIdx, imgIdx) => {
        setActiveProductIndex(prodIdx);
        setActiveImageIndex(imgIdx);
    };

    const handleCanvasUpdate = (prodIdx, imgIdx, updates) => {
        const newProducts = [...products];
        if (newProducts[prodIdx].images[imgIdx]) {
            newProducts[prodIdx].images[imgIdx] = {
                ...newProducts[prodIdx].images[imgIdx],
                ...updates
            };
            setProducts(newProducts);
        }
    };

    const handleRemoveBackground = async (index) => {
        const product = products[index];
        if (!product.images?.[0]) return;
        setIsRemoving(true);
        setActiveProductIndex(index);

        try {
            const base64Content = product.images[0].url.split(',')[1];
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
                const newProducts = [...products];
                newProducts[index].images[0].url = reader.result;
                setProducts(newProducts);
                setIsRemoving(false);
            };
            reader.readAsDataURL(resultBlob);

        } catch (error) {
            console.error('Background Removal Failed:', error);
            alert(`Failed to remove background: ${error.message}`);
            setIsRemoving(false);
        }
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

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleDownloadImage = async () => {
        const canvas = document.querySelector('.grid2x2-canvas');
        if (!canvas) return;

        // Temporarily hide selection highlight
        const prevActive = activeImageIndex;
        setActiveImageIndex(-1);

        try {
            await sleep(50);
            const dataUrl = await window.htmlToImage.toPng(canvas, {
                quality: 1,
                pixelRatio: 2
            });
            const link = document.createElement('a');
            link.download = `Grid2x2_Flyer.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to save image.');
        } finally {
            setActiveImageIndex(prevActive);
        }
    };

    return (
        <div className="studio-container">
            <header className="studio-header">
                <div className="header-left">
                    <div className="studio-logo">
                        <Grid size={20} className="text-secondary" />
                        <span>2X2<span className="text-secondary">GRID</span></span>
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
                        <Grid2x2Canvas
                            items={products}
                            template={template}
                            fontFamily={fontFamily}
                            logo={logo}
                            branding={branding}
                            activeProductIndex={activeProductIndex}
                            activeImageIndex={activeImageIndex}
                            onSelectImage={handleCanvasSelect}
                            onUpdateImage={handleCanvasUpdate}
                        />
                    </div>

                    <div className="template-dock">
                        <div className="dock-header">Themes</div>
                        <div className="dock-scroll">
                            {[
                                { id: 'discount', label: 'Discount', icon: '🏷️' },
                                { id: 'bold', label: 'Bold', icon: '🔥' },
                                { id: 'ramadan', label: 'Ramadan', icon: '🌙' },
                                { id: 'iftar', label: 'Iftar', icon: '✨' },
                                { id: 'suhoor', label: 'Suhoor', icon: '🕌' },
                                { id: 'bogo', label: 'BOGO', icon: '🎁' },
                                { id: 'organic', label: 'Organic', icon: '🍃' },
                                { id: 'clearance', label: 'Clearance', icon: '⚠️' },
                                { id: 'new', label: 'New', icon: '🆕' },
                                { id: 'manager', label: 'Choice', icon: '⭐' },
                                { id: 'flash', label: 'Flash', icon: '⚡' },
                                { id: 'healthy', label: 'Healthy', icon: '❤️' },
                                { id: 'member', label: 'VIP', icon: '👑' },
                                { id: 'minimal', label: 'Basic', icon: '📄' },
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
                            <span>BLOCKS (4 TOTAL)</span>
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
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#F4A261' }}>Block #{activeProductIndex + 1} Details</h4>

                            <div className="field-group">
                                <div className="field-label">Name</div>
                                <input
                                    type="text"
                                    value={products[activeProductIndex].productName}
                                    onChange={(e) => handleProductChange(activeProductIndex, 'productName', e.target.value)}
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
                                        <span>{products[activeProductIndex].images?.[0] ? 'CHANGE IMAGE' : 'UPLOAD IMAGE'}</span>
                                    </label>
                                    {products[activeProductIndex].images?.[0] && (
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
                                    {products[activeProductIndex].images?.[0] && (
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

                                {products[activeProductIndex].images?.[0] && (
                                    <div className="active-img-zoom mt-3">
                                        <div className="field-label flex justify-between" style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>
                                            <span>Scale: {Math.round(products[activeProductIndex].images[0].scale * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="4"
                                            step="0.01"
                                            value={products[activeProductIndex].images[0].scale}
                                            onChange={(e) => handleCanvasUpdate(activeProductIndex, 0, { scale: parseFloat(e.target.value) })}
                                            className="studio-range w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            <ImageAdjuster
                isOpen={isAdjusterOpen}
                onClose={() => setIsAdjusterOpen(false)}
                onApply={(adj) => handleCanvasUpdate(activeProductIndex, 0, adj)}
                image={products[activeProductIndex].images?.[0]?.url}
                initialScale={products[activeProductIndex].images?.[0]?.scale || 1}
                initialX={products[activeProductIndex].images?.[0]?.x || 0}
                initialY={products[activeProductIndex].images?.[0]?.y || 0}
            />
        </div>
    );
};

export default Grid2x2Flyer;
