import React, { useState, useRef, useLayoutEffect } from 'react';
import { Printer, Upload, Layout, Type, DollarSign, Tag, Image as ImageIcon, Package } from 'lucide-react';
import FlyerCanvas from './components/FlyerCanvas';
import BulkManager from './components/BulkManager';
import './App.css';

function App() {
  const viewportRef = useRef(null);
  const [viewScale, setViewScale] = useState(1);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('flyer-studio-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Parse error", e);
      }
    }
    return {
      productName: 'Organic Fresh Avocados',
      price: '2.99',
      originalPrice: '4.50',
      currency: 'AED',
      discount: 'SAVE 30%',
      description: 'Perfectly ripe, creamy texture.',
      branding: 'NATURAL FRESH EXPRESS',
      orientation: 'portrait',
      image: null,
      logo: null,
      imageScale: 1,
      imageX: 0,
      imageY: 0,
      fontFamily: 'Inter, sans-serif',
      paperSize: 'shelf'
    };
  });

  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('flyer-studio-template') || 'discount';
  });

  // Auto-Save Effect
  React.useEffect(() => {
    localStorage.setItem('flyer-studio-data', JSON.stringify(data));
    localStorage.setItem('flyer-studio-template', template);
  }, [data, template]);

  // API Key for remove.bg (hidden from UI)
  const apiKey = 'oHHarfm2AaEHbjWrYUEzWFcj';
  const [isRemoving, setIsRemoving] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isBatchExporting, setIsBatchExporting] = useState(false);

  // Refs for focusing
  const inputRefs = {
    productName: useRef(null),
    price: useRef(null),
    originalPrice: useRef(null),
    currency: useRef(null),
    discount: useRef(null),
    description: useRef(null),
    branding: useRef(null)
  };

  const focusField = (field) => {
    if (inputRefs[field]?.current) {
      inputRefs[field].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRefs[field].current.focus();
      // Add a brief highlight flash
      const el = inputRefs[field].current;
      el.style.boxShadow = '0 0 0 4px rgba(45, 90, 39, 0.4)';
      el.style.borderColor = 'var(--primary)';
      setTimeout(() => {
        if (el) {
          el.style.boxShadow = '';
          el.style.borderColor = '';
        }
      }, 1000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setData(prev => ({ ...prev, image: readerEvent.target.result, imageScale: 1, imageX: 0, imageY: 0 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setData(prev => ({ ...prev, logo: readerEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!data.image) return;
    setIsRemoving(true);

    try {
      const base64Content = data.image.split(',')[1];
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

      if (!response.ok) throw new Error('Remove.bg API Error');

      const resultBlob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setData(prev => ({ ...prev, image: reader.result }));
        setIsRemoving(false);
      };
      reader.readAsDataURL(resultBlob);

    } catch (error) {
      console.error(error);
      alert('Failed to remove background. Check your API key or internet connection.');
      setIsRemoving(false);
    }
  };

  // Auto-scale preview to fit screen
  useLayoutEffect(() => {
    const updateScale = () => {
      if (!viewportRef.current) return;
      const v = viewportRef.current;
      const padding = 80;
      const vW = v.clientWidth - padding;
      const vH = v.clientHeight - padding;

      let targetW = data.paperSize === 'a4' ? 8.27 : 4;
      let targetH = data.paperSize === 'a4' ? 11.69 : 6;

      if (data.orientation === 'landscape') {
        [targetW, targetH] = [targetH, targetW];
      }

      const pixelW = targetW * 96;
      const pixelH = targetH * 96;

      const scale = Math.min(vW / pixelW, vH / pixelH);
      setViewScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [data.paperSize, data.orientation]);

  const handlePrint = () => {
    window.print();
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleDownloadAll = async (queue) => {
    if (isBatchExporting) return;
    setIsBatchExporting(true);
    setIsBulkOpen(false); // Close modal during processing

    try {
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (!item.img) continue;

        // 1. Apply the data
        setData(prev => ({
          ...prev,
          productName: item.displayName,
          price: item.price,
          discount: item.discount,
          description: item.description,
          image: item.img,
          imageScale: 1,
          imageX: 0,
          imageY: 0
        }));

        // 2. Wait for React to render and fonts to settle
        await sleep(800);

        // 3. Capture image
        const canvas = document.querySelector('.flyer-canvas');
        if (canvas) {
          const dataUrl = await window.htmlToImage.toPng(canvas, {
            quality: 1,
            pixelRatio: 2
          });
          const link = document.createElement('a');
          link.download = `Batch_${i + 1}_${item.displayName.replace(/\s+/g, '_')}.png`;
          link.href = dataUrl;
          link.click();
        }

        await sleep(200); // Small breeze between downloads
      }
    } catch (error) {
      console.error('Batch Export Error', error);
      alert('Batch export failed. Some images might not have downloaded.');
    }

    setIsBatchExporting(false);
  };

  const handleApplyBulkItem = (bulkItem) => {
    setData(prev => ({
      ...prev,
      productName: bulkItem.productName,
      price: bulkItem.price,
      discount: bulkItem.discount,
      description: bulkItem.description,
      image: bulkItem.image,
      imageScale: 1,
      imageX: 0,
      imageY: 0
    }));
  };

  const handleDownloadImage = async () => {
    const canvas = document.querySelector('.flyer-canvas');
    if (!canvas) return;

    try {
      // High quality export
      const dataUrl = await window.htmlToImage.toPng(canvas, {
        quality: 1,
        pixelRatio: 2
      });

      const link = document.createElement('a');
      link.download = `Flyer_${data.productName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to save image. Try printing to PDF instead.');
    }
  };

  return (
    <div className="studio-container">
      {/* 1. TOP HEADER */}
      <header className="studio-header">
        <div className="header-left">
          <div className="studio-logo">
            <Tag size={20} className="text-secondary" />
            <span>FLYER<span className="text-secondary">STUDIO</span></span>
          </div>
          <div className="header-divider" />
          <div className="template-indicator">
            {template.toUpperCase()} MODE
          </div>
          <button onClick={() => setIsBulkOpen(true)} className="studio-btn-bulk-toggle">
            <Package size={14} />
            BULK STUDIO
          </button>
        </div>

        <div className="header-right" style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={handleDownloadImage} className="studio-btn-primary" style={{ background: '#3b82f6' }}>
            <ImageIcon size={18} />
            SAVE AS IMAGE
          </button>
          <button onClick={handlePrint} className="studio-btn-primary">
            <Printer size={18} />
            PRINT FLYER
          </button>
        </div>
      </header>

      <main className="studio-main">
        {/* 2. CENTRAL WORKSPACE */}
        <section className="studio-workspace">
          <div className="canvas-viewport" ref={viewportRef}>
            <div className="canvas-preview-wrapper" style={{
              transform: `scale(${viewScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FlyerCanvas data={data} template={template} onFocusField={focusField} />
            </div>
          </div>

          {/* BOTTOM TEMPLATE DOCK */}
          <div className="template-dock">
            <div className="dock-header">Templates</div>
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

        {/* 3. RIGHT SETTINGS PANEL */}
        <aside className="settings-panel">
          <div className="panel-title">
            <Layout size={16} />
            <span>PROPERTIES</span>
          </div>

          <div className="panel-content">
            {/* PAPER SIZE */}
            <div className="control-group">
              <label>Paper Style</label>
              <div className="toggle-group">
                <button
                  className={`toggle-item ${data.paperSize === 'shelf' ? 'active' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, paperSize: 'shelf' }))}
                >
                  SHELF TALKER
                </button>
                <button
                  className={`toggle-item ${data.paperSize === 'a4' ? 'active' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, paperSize: 'a4' }))}
                >
                  FULL A4
                </button>
              </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="control-group">
              <label>Typography</label>
              <select name="fontFamily" value={data.fontFamily} onChange={handleChange} className="control-select">
                <option value="Inter, sans-serif">Modern (Inter)</option>
                <option value="'Playfair Display', serif">Elegant (Playfair)</option>
                <option value="'Oswald', sans-serif">Bold (Oswald)</option>
                <option value="'Lobster', cursive">Fun (Lobster)</option>
                <option value="'Montserrat', sans-serif">Clean (Montserrat)</option>
                <option value="'Roboto Condensed', sans-serif">Condensed (Roboto)</option>
                <option value="'Bevan', serif">Retro (Bevan)</option>
                <option value="'Pacifico', cursive">Script (Pacifico)</option>
                <option value="'Anton', sans-serif">Impact (Anton)</option>
                <option value="'Lora', serif">Classic (Lora)</option>
                <option value="'Caveat', cursive">Handwritten (Caveat)</option>
                <option value="'Archivo Black', sans-serif">Heavy (Archivo)</option>
                <option value="'Prompt', sans-serif">Tech (Prompt)</option>
                <option value="'Righteous', cursive">Display (Righteous)</option>
                <option value="'Libre Baskerville', serif">Newspaper (Baskerville)</option>
              </select>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="control-group">
              <label>Product Details</label>
              <div className="field-group">
                <div className="field-label">Product Name</div>
                <input name="productName" ref={inputRefs.productName} value={data.productName} onChange={handleChange} className="control-input" />
              </div>
              <div className="field-row">
                <div className="field-group flex-1">
                  <div className="field-label">Price</div>
                  <input name="price" ref={inputRefs.price} value={data.price} onChange={handleChange} className="control-input w-70" />
                </div>
                <div className="field-group w-70">
                  <div className="field-label">Curr</div>
                  <input name="currency" ref={inputRefs.currency} value={data.currency} onChange={handleChange} maxLength={4} className="control-input" />
                </div>
              </div>
              <div className="field-group">
                <div className="field-label">Discount Text</div>
                <input name="discount" ref={inputRefs.discount} value={data.discount} onChange={handleChange} className="control-input" />
              </div>
            </div>

            {/* IMAGE CONTROLS */}
            <div className="control-group">
              <label>Visuals</label>
              <div className="field-row gap-2">
                <label className="upload-trigger flex-1" htmlFor="file-upload" style={{ margin: 0 }}>
                  <Upload size={14} />
                  <span>{data.image ? 'CHANGE' : 'UPLOAD'}</span>
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {data.image && (
                  <button
                    className={`magic-btn flex-1 ${isRemoving ? 'loading' : ''}`}
                    onClick={handleRemoveBackground}
                    disabled={isRemoving}
                  >
                    {isRemoving ? 'WAIT...' : '✨ MAGIC BG'}
                  </button>
                )}
              </div>

              <div className="sliders">
                <div className="slider-box">
                  <div className="slider-info"><span>Scale</span> <span>{Math.round(data.imageScale * 100)}%</span></div>
                  <input type="range" name="imageScale" min="0.1" max="3" step="0.1" value={data.imageScale} onChange={handleChange} className="studio-range" />
                </div>
                <div className="slider-box">
                  <div className="slider-info"><span>X Axis</span> <span>{data.imageX}px</span></div>
                  <input type="range" name="imageX" min="-200" max="200" step="1" value={data.imageX} onChange={handleChange} className="studio-range" />
                </div>
                <div className="slider-box">
                  <div className="slider-info"><span>Y Axis</span> <span>{data.imageY}px</span></div>
                  <input type="range" name="imageY" min="-200" max="200" step="1" value={data.imageY} onChange={handleChange} className="studio-range" />
                </div>
              </div>
            </div>

            {/* BRANDING */}
            <div className="control-group">
              <label>Store Branding</label>
              <div className="field-row gap-2 mb-4">
                <label className="upload-trigger flex-1" htmlFor="logo-upload" style={{ margin: 0 }}>
                  <Upload size={14} />
                  <span>{data.logo ? 'Change Logo' : 'Upload Logo'}</span>
                </label>
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />

                {data.logo && (
                  <button
                    className="magic-btn"
                    onClick={() => setData(prev => ({ ...prev, logo: null }))}
                    title="Remove Logo"
                    style={{ background: '#ef4444', width: '44px', padding: 0 }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="field-group">
                <div className="field-label">Store Name (Fallback)</div>
                <input name="branding" ref={inputRefs.branding} value={data.branding} onChange={handleChange} className="control-input" />
              </div>
            </div>
          </div>
        </aside>
      </main>

      <BulkManager
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onApplyItem={handleApplyBulkItem}
        onDownloadAll={handleDownloadAll}
        apiKey={apiKey}
      />

      {isBatchExporting && (
        <div className="batch-overlay">
          <div className="batch-loader">
            <div className="spinner"></div>
            <h3>GENERATING BATCH...</h3>
            <p>Please don't close this tab while your flyers are downloading.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
