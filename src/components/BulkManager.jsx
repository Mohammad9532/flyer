import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Play, Download, Wand2, Package, Image as ImageIcon } from 'lucide-react';

const BulkManager = ({ isOpen, onClose, onApplyItem, onDownloadAll, apiKey }) => {
    const [csvData, setCsvData] = useState([]);
    const [images, setImages] = useState({});
    const [queue, setQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    // Handle CSV Upload
    const handleCsvUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n').filter(row => row.trim());
            const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

            const parsed = rows.slice(1).map(row => {
                const values = row.split(',').map(v => v.trim());
                const item = {};
                headers.forEach((h, i) => {
                    item[h] = values[i] || '';
                });
                return item;
            });
            setCsvData(parsed);
        };
        reader.readAsText(file);
    };

    // Handle Multiple Image Upload
    const handleImagesUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const name = file.name.split('.')[0].toLowerCase();
                setImages(prev => ({ ...prev, [name]: event.target.result }));
            };
            reader.readAsDataURL(file);
        });
    };

    // Auto-Match logic
    useEffect(() => {
        if (csvData.length > 0) {
            const newQueue = csvData.map(item => {
                const itemName = (item.name || item['product name'] || '').toLowerCase();
                const matchedImage = images[itemName] || null;
                return {
                    ...item,
                    displayName: item.name || item['product name'] || 'Untitled',
                    img: matchedImage,
                    status: matchedImage ? 'ready' : 'missing-img',
                    id: Math.random().toString(36).substr(2, 9)
                };
            });
            setQueue(newQueue);
        }
    }, [csvData, images]);

    const handleBulkMagicRemove = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setProgress({ current: 0, total: queue.filter(q => q.img).length });

        const newQueue = [...queue];
        for (let i = 0; i < newQueue.length; i++) {
            const item = newQueue[i];
            if (!item.img || item.status === 'cleaned') continue;

            try {
                const base64Content = item.img.split(',')[1];
                const blob = await (await fetch(item.img)).blob();

                const formData = new FormData();
                formData.append('image_file', blob);
                formData.append('size', 'auto');

                const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                    method: 'POST',
                    headers: { 'X-Api-Key': apiKey },
                    body: formData
                });

                if (response.ok) {
                    const resultBlob = await response.blob();
                    const reader = new FileReader();
                    await new Promise(resolve => {
                        reader.onload = () => {
                            newQueue[i].img = reader.result;
                            newQueue[i].status = 'cleaned';
                            resolve();
                        };
                        reader.readAsDataURL(resultBlob);
                    });
                }
            } catch (e) {
                console.error("Bulk Magic Error", e);
            }
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));
            setQueue([...newQueue]);
        }
        setIsProcessing(false);
    };

    const handleApply = (item) => {
        onApplyItem({
            productName: item.displayName,
            price: item.price || '0.00',
            discount: item.discount || '',
            description: item.description || '',
            image: item.img
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="bulk-modal-overlay">
            <div className="bulk-modal">
                <div className="bulk-header">
                    <div className="flex items-center gap-2">
                        <Package size={20} className="text-secondary" />
                        <h2>Bulk Export Studio</h2>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="bulk-content">
                    {/* STEP 1: UPLOADS */}
                    <div className="bulk-step">
                        <div className="step-title">1. Upload your data and photos</div>
                        <div className="field-row gap-4">
                            <label className="bulk-upload-box flex-1">
                                <Upload size={24} />
                                <span>Upload CSV / Excel</span>
                                <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                                {csvData.length > 0 && <div className="badge">{csvData.length} Items Found</div>}
                            </label>

                            <label className="bulk-upload-box flex-1">
                                <Upload size={24} />
                                <span>Upload Photos (Folder)</span>
                                <input type="file" multiple accept="image/*" onChange={handleImagesUpload} className="hidden" />
                                {Object.keys(images).length > 0 && <div className="badge">{Object.keys(images).length} Photos Matched</div>}
                            </label>
                        </div>
                    </div>

                    {/* STEP 2: QUEUE */}
                    <div className="bulk-step flex-1 overflow-hidden flex flex-col">
                        <div className="step-title flex justify-between">
                            <span>2. Review Batch & Magic Remove</span>
                            {queue.length > 0 && (
                                <button
                                    className={`magic-btn-bulk ${isProcessing ? 'loading' : ''}`}
                                    onClick={handleBulkMagicRemove}
                                    disabled={isProcessing}
                                >
                                    <Wand2 size={14} />
                                    {isProcessing ? `Cleaning (${progress.current}/${progress.total})...` : 'Magic Remove All'}
                                </button>
                            )}
                        </div>

                        <div className="bulk-queue-scroll">
                            {queue.length === 0 ? (
                                <div className="empty-queue">Your products will appear here...</div>
                            ) : (
                                queue.map((item, idx) => (
                                    <div key={item.id} className={`queue-item ${item.status}`}>
                                        <div className="item-preview">
                                            {item.img ? <img src={item.img} alt="" /> : <ImageIcon size={20} />}
                                            {item.status === 'cleaned' && <div className="clean-badge"><Check size={8} /></div>}
                                        </div>
                                        <div className="item-info flex-1">
                                            <div className="item-name">{item.displayName}</div>
                                            <div className="item-price">{item.price} - {item.discount}</div>
                                        </div>
                                        <button className="apply-btn" onClick={() => handleApply(item)}>Edit This</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="bulk-footer">
                    <p className="text-secondary text-xs">Note: Magic Remove All will use 1 credit per photo automatically.</p>
                    <div className="flex gap-2">
                        <button className="studio-btn-primary" onClick={onClose} style={{ background: '#444' }}>Close</button>
                        {queue.filter(q => q.img).length > 0 && (
                            <button
                                className="studio-btn-primary"
                                style={{ background: '#3b82f6' }}
                                onClick={() => onDownloadAll(queue.filter(q => q.img))}
                            >
                                <Download size={16} />
                                DOWNLOAD ALL ({queue.filter(q => q.img).length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .bulk-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }
        .bulk-modal {
          background: #121212;
          width: 900px;
          height: 650px;
          border-radius: 20px;
          border: 1px solid #333;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }
        .bulk-header { padding: 1.5rem; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .bulk-header h2 { font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: 1px; }
        .close-btn { background: none; border: none; color: #666; cursor: pointer; }
        .close-btn:hover { color: #fff; }

        .bulk-content { flex: 1; padding: 2rem; overflow: hidden; display: flex; flex-direction: column; gap: 2rem; }
        .step-title { font-size: 0.75rem; font-weight: 900; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        
        .bulk-upload-box {
          background: #1a1a1a;
          border: 2px dashed #333;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .bulk-upload-box:hover { border-color: var(--primary); background: #1e251e; }
        .bulk-upload-box span { font-size: 0.8rem; font-weight: 700; color: #888; }
        .bulk-upload-box .badge { position: absolute; top: 10px; right: 10px; background: var(--primary); color: #fff; font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; font-weight: 900; }

        .bulk-queue-scroll {
          flex: 1;
          background: #0a0a0a;
          border-radius: 12px;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: #333 transparent;
        }
        .empty-queue { height: 100%; display: flex; align-items: center; justify-content: center; color: #333; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; }

        .queue-item {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 0.8rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid transparent;
        }
        .queue-item.missing-img { opacity: 0.6; }
        .queue-item:hover { border-color: #444; background: #222; }
        
        .item-preview { width: 45px; height: 45px; background: #000; border-radius: 6px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }
        .item-preview img { width: 100%; height: 100%; object-fit: contain; }
        .clean-badge { position: absolute; top: 2px; right: 2px; background: #2D5A27; color: #fff; border-radius: 50%; padding: 2px; }

        .item-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
        .item-price { font-size: 0.65rem; color: #666; font-weight: 600; }
        
        .apply-btn { background: #333; color: #eee; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.7rem; font-weight: 800; cursor: pointer; }
        .apply-btn:hover { background: var(--secondary); color: #000; }

        .magic-btn-bulk {
          background: #7c3aed;
          color: white;
          border: none;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        .magic-btn-bulk:hover:not(:disabled) { background: #6d28d9; }
        .magic-btn-bulk:disabled { opacity: 0.5; cursor: not-allowed; }

        .bulk-footer { padding: 1.5rem; border-top: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
      `}</style>
        </div>
    );
};

export default BulkManager;
