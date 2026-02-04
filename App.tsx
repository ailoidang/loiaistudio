
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Icons, CINEMATIC_ANGLES } from './constants';
import { StyleType, AspectRatio, Quality, UserImage, GeneratedResult } from './types';
import { generateAIImage } from './services/gemini';

const App: React.FC = () => {
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(StyleType.TET_MAI);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [selectedQuality, setSelectedQuality] = useState<Quality>(Quality.FOUR_K);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedViewImage, setSelectedViewImage] = useState<string | null>(null);

  const angleHistoryRef = useRef<string[]>([]);
  const lastGeneratedBase64Ref = useRef<string | undefined>(undefined);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const getNextAngle = (): string => {
    const lastTwo = angleHistoryRef.current.slice(-2);
    const available = CINEMATIC_ANGLES.filter(angle => !lastTwo.includes(angle));
    const chosen = available[Math.floor(Math.random() * available.length)];
    angleHistoryRef.current.push(chosen);
    return chosen;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: UserImage[] = (Array.from(files) as File[]).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        file: file,
        name: file.name
      }));
      setUserImages(prev => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const clearAllUploads = () => {
    userImages.forEach(img => URL.revokeObjectURL(img.url));
    setUserImages([]);
    setError(null);
  };

  const clearGallery = () => {
    if (window.confirm("Xóa toàn bộ lịch sử ảnh đã tạo?")) setResults([]);
  };

  const removeUserImage = (id: string) => {
    setUserImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(img => img.id !== id);
    });
  };

  const generateSingleImage = async (image: UserImage, style: StyleType, ratio: AspectRatio, quality: Quality) => {
    const angle = getNextAngle();
    const resultId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newResult: GeneratedResult = {
      id: resultId,
      sourceImageId: image.id,
      url: '',
      style,
      ratio,
      quality,
      timestamp: Date.now(),
      cameraAngle: angle,
      status: 'pending'
    };
    
    setResults(prev => [newResult, ...prev]);

    try {
      const base64 = await fileToBase64(image.file);
      const generatedUrl = await generateAIImage(
        base64, 
        image.file.type || 'image/png', 
        style, 
        ratio, 
        quality, 
        angle, 
        lastGeneratedBase64Ref.current
      );
      
      lastGeneratedBase64Ref.current = generatedUrl.split(',')[1];
      setResults(prev => prev.map(r => r.id === resultId ? { ...r, url: generatedUrl, status: 'completed' } : r));
      return true;
    } catch (err: any) {
      setResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'error' } : r));
      const errMsg = err.message === 'quota' 
        ? "Hệ thống đang bận. Vui lòng đợi 10 giây và thử lại." 
        : (err.message || "Lỗi kết nối AI.");
      setError(errMsg);
      return false;
    }
  };

  const handleGenerateAll = async () => {
    if (userImages.length === 0 || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    angleHistoryRef.current = [];
    lastGeneratedBase64Ref.current = undefined;
    
    for (let i = 0; i < userImages.length; i++) {
      const success = await generateSingleImage(userImages[i], selectedStyle, selectedRatio, selectedQuality);
      if (!success) break;
      if (i < userImages.length - 1) await new Promise(res => setTimeout(res, 1200));
    }
    
    setIsGenerating(false);
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `LoiAI_Studio_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    results.filter(r => r.status === 'completed').reverse().forEach((res, idx) => {
      setTimeout(() => downloadImage(res.url), idx * 600);
    });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Header />
      <main className="flex-grow flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-6 py-10 gap-10">
        
        {/* THANH ĐIỀU KHIỂN */}
        <aside className="lg:w-[420px] flex flex-col gap-6 lg:overflow-y-auto scrollbar-hide">
          <div className="bg-[#0c162d]/60 backdrop-blur-3xl border border-blue-500/10 rounded-[3rem] p-8 shadow-2xl space-y-8 ring-1 ring-blue-400/5">
            
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-white">01</span>
                  TẢI ẢNH CHÂN DUNG
                </h3>
                {userImages.length > 0 && (
                  <button onClick={clearAllUploads} className="text-[10px] font-bold text-red-400 uppercase tracking-widest transition-opacity hover:opacity-70">Xóa hết</button>
                )}
              </div>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-500/20 rounded-[2.5rem] cursor-pointer bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-400/40 transition-all group relative overflow-hidden">
                <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-300 mb-3 group-hover:scale-110 transition-transform">
                    <Icons.Upload />
                  </div>
                  <p className="text-sm font-bold text-white opacity-80">Click hoặc kéo thả ảnh</p>
                  <p className="text-[9px] text-blue-400/60 mt-1 uppercase tracking-widest font-black">Unlimited Images • Pro Studio</p>
                </div>
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} />
              </label>
              
              {userImages.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {userImages.map(img => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden border border-blue-400/20 group shadow-lg ring-1 ring-white/5">
                      <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={() => removeUserImage(img.id)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Icons.Trash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-white">02</span>
                CHỌN PHONG CÁCH
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-hide">
                {Object.values(StyleType).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStyle(s)}
                    className={`w-full text-left p-4 rounded-[1.25rem] border transition-all flex items-center justify-between group ${
                      selectedStyle === s 
                      ? 'bg-blue-600 border-blue-300 text-white shadow-lg' 
                      : 'bg-blue-950/30 border-blue-500/10 text-blue-200/60 hover:bg-blue-900/40 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-tight">{s}</span>
                    {selectedStyle === s && <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-white">03</span>
                ĐỊNH DẠNG ĐẦU RA
              </h3>
              <div className="flex gap-2">
                 {Object.values(AspectRatio).map(r => (
                   <button key={r} onClick={() => setSelectedRatio(r)} className={`flex-1 py-3.5 rounded-2xl border text-[10px] font-black transition-all ${selectedRatio === r ? 'bg-white text-[#050a1a] border-white shadow-xl' : 'bg-blue-900/20 border-blue-500/5 text-blue-400 hover:text-blue-100'}`}>{r}</button>
                 ))}
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {Object.values(Quality).map(q => (
                   <button 
                     key={q} 
                     onClick={() => setSelectedQuality(q)} 
                     className={`w-full py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                       selectedQuality === q 
                       ? 'bg-gradient-to-r from-blue-600 to-sky-400 border-blue-300 text-white shadow-lg' 
                       : 'bg-blue-900/20 border-blue-500/5 text-blue-400 hover:text-blue-100'
                     }`}
                   >
                     {q}
                   </button>
                 ))}
              </div>
            </section>

            <button
              onClick={handleGenerateAll}
              disabled={isGenerating || userImages.length === 0}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 ${isGenerating || userImages.length === 0 ? 'bg-blue-900/10 text-blue-700/40 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700 bg-[length:200%_auto] hover:bg-right text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:scale-[0.98] border border-blue-400/20'}`}
            >
              {isGenerating ? 'ĐANG BIÊN TẬP...' : `XUẤT BẢN ${userImages.length > 0 ? `(${userImages.length})` : ''} HÌNH ẢNH`}
            </button>
            
            {error && (
              <div className="p-5 rounded-[2rem] bg-red-950/30 border border-red-500/20 text-red-200 animate-in slide-in-from-bottom-2">
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-center">{error}</p>
                <button onClick={() => setError(null)} className="w-full mt-3 text-[9px] font-bold text-red-400/60 uppercase tracking-widest">Đóng</button>
              </div>
            )}
          </div>
        </aside>

        {/* GALLERY HIỂN THỊ */}
        <section className="flex-grow flex flex-col gap-8 h-full min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
             <div className="space-y-1">
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic">Gallery</h2>
               <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Professional Output • Full Frame Mode</p>
             </div>
             <div className="flex gap-3">
               {results.length > 0 && (
                 <button onClick={clearGallery} className="bg-red-500/5 hover:bg-red-500/10 text-red-400/80 border border-red-500/10 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Xóa Gallery</button>
               )}
               {results.some(r => r.status === 'completed') && (
                 <button onClick={handleDownloadAll} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-100 border border-blue-400/20 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl backdrop-blur-md">Tải về tất cả</button>
               )}
             </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
            {results.length === 0 && !isGenerating ? (
              <div className="h-full min-h-[550px] flex flex-col items-center justify-center border-2 border-dashed border-blue-500/10 rounded-[4rem] text-blue-900/20 bg-blue-500/[0.01]">
                <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/5 flex items-center justify-center mb-6 border border-blue-500/10">
                  <Icons.Eye />
                </div>
                <p className="font-black text-[11px] uppercase tracking-[0.5em]">Hệ thống đã sẵn sàng</p>
                <p className="text-[9px] uppercase tracking-widest mt-2 opacity-40">Tải ảnh lên để bắt đầu kết xuất nghệ thuật</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-32">
                {results.map((res, idx) => (
                  <div key={res.id} className="bg-[#0c162d]/40 rounded-[3.5rem] border border-blue-500/10 overflow-hidden shadow-2xl flex flex-col group transition-all duration-700 hover:border-blue-400/40 hover:-translate-y-2 ring-1 ring-white/5">
                    <div className={`relative ${res.ratio === AspectRatio.PORTRAIT ? 'aspect-[9/16]' : (res.ratio === AspectRatio.LANDSCAPE ? 'aspect-[16/9]' : 'aspect-square')} bg-[#050a1a]`}>
                      {res.status === 'pending' ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                          <div className="relative">
                            <div className="w-20 h-20 border-2 border-blue-500/10 border-t-blue-400 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-b-sky-300 rounded-full animate-spin [animation-duration:2s]"></div>
                          </div>
                          <p className="text-[10px] font-black text-blue-300/60 uppercase tracking-[0.3em] animate-pulse">Đang kết xuất #{(results.length - idx).toString().padStart(2, '0')}</p>
                        </div>
                      ) : res.status === 'error' ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-red-950/10">
                           <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mb-6"><Icons.Trash /></div>
                           <p className="text-[10px] font-black text-red-300 uppercase tracking-widest leading-relaxed">Kết xuất thất bại<br/><span className="opacity-50 text-[8px]">Vui lòng thử lại sau vài giây</span></p>
                        </div>
                      ) : (
                        <>
                          <img src={res.url} className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-105" alt="Portrait" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050a1a] via-[#050a1a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12">
                            <div className="flex gap-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                              <button onClick={() => setSelectedViewImage(res.url)} className="flex-1 bg-white text-[#050a1a] py-5 rounded-[1.25rem] font-black text-[11px] uppercase tracking-widest shadow-2xl transition-colors hover:bg-blue-50">Xem chi tiết</button>
                              <button onClick={() => downloadImage(res.url)} className="w-16 h-16 bg-blue-600/20 hover:bg-blue-600 text-white rounded-[1.25rem] flex items-center justify-center backdrop-blur-xl transition-all border border-white/10 shadow-2xl"><Icons.Download /></button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-10 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-[13px] font-black text-white uppercase tracking-widest">PHÂN CẢNH {(results.length - idx).toString().padStart(2, '0')}</span>
                           <span className="text-[8px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">Loi AI Studio Masterpiece</span>
                        </div>
                        <div className="px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-400/10">
                          <span className="text-[9px] text-blue-300 font-black uppercase tracking-widest">{res.quality.split(' ')[2] || 'HD'}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-blue-200/30 font-medium italic border-l-2 border-blue-500/30 pl-4 py-1 line-clamp-2">{res.cameraAngle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      {selectedViewImage && (
        <div className="fixed inset-0 z-[100] bg-[#050a1a]/98 flex items-center justify-center p-4 md:p-12 cursor-zoom-out backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setSelectedViewImage(null)}>
          <div className="relative group max-w-full max-h-full animate-in zoom-in-95 duration-500">
            <img src={selectedViewImage} className="max-w-full max-h-[90vh] rounded-[3rem] shadow-[0_0_120px_rgba(37,99,235,0.2)] border border-white/10 object-contain ring-1 ring-white/5" alt="Full Preview" />
            <div className="absolute top-8 right-8 flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); downloadImage(selectedViewImage); }} 
                className="w-14 h-14 rounded-2xl bg-white text-[#050a1a] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
              >
                <Icons.Download />
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
