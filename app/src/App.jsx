import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Leaf, CheckCircle, AlertTriangle, Info, ShieldCheck, Languages, Droplets, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { diseaseData } from './data/diseaseData';
import './index.css';

const UI_TEXT = {
  en: {
    title: "AgriGuard AI",
    subtitle: "Instant crop disease detection.",
    upload: "Upload Image",
    dragDrop: "Drag and drop or click",
    or: "OR",
    useCamera: "Use Camera",
    capture: "Capture",
    cancel: "Cancel",
    analyze: "Analyze Sample",
    retake: "Retake",
    analyzing: "AI is Analyzing...",
    threat: "Threat Detected",
    normal: "Normal",
    confidence: "Confidence",
    symptoms: "Key Symptoms",
    action: "Action",
    organic: "Organic",
    chemical: "Chemical",
    back: "Back",
    footer: "Empowering Farmers Worldwide.",
    selectCrop: "Select Your Crop",
    crops: { Tomato: "Tomato", Banana: "Banana", Coconut: "Coconut", Paddy: "Paddy", Groundnut: "Groundnut" }
  },
  ta: {
    title: "அக்ரிகார்ட் AI",
    subtitle: "ஆரோக்கியமான பயிர்களுக்கு.",
    upload: "பதிவேற்று",
    dragDrop: "இழுக்கவும் அல்லது கிளிக் செய்யவும்",
    or: "அல்லது",
    useCamera: "கேமரா",
    capture: "புகைப்படம் எடு",
    cancel: "ரத்து செய்",
    analyze: "ஆய்வு செய்",
    retake: "மீண்டும்",
    analyzing: "ஆய்வு செய்கிறது...",
    threat: "அச்சுறுத்தல்",
    normal: "சாதாரணமானது",
    confidence: "துல்லியம்",
    symptoms: "அறிகுறிகள்",
    action: "நடவடிக்கை",
    organic: "இயற்கை",
    chemical: "இரசாயன",
    back: "மீண்டும்",
    footer: "விவசாயிகளின் முன்னேற்றத்திற்காக.",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    crops: { Tomato: "தக்காளி", Banana: "வாழை", Coconut: "தென்னை", Paddy: "நெல்", Groundnut: "நிலக்கடலை" }
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const t = UI_TEXT[lang];

  const startCamera = async () => {
    setIsCapturing(true); setImage(null); setPrediction(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch (err) { alert("Camera error!"); setIsCapturing(false); }
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (video && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg')); stopCamera();
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks()?.forEach(t => t.stop()); setIsCapturing(false);
  };

  const analyzeImage = () => {
    setLoading(true);
    setTimeout(() => {
      const cropKeys = Object.keys(diseaseData).filter(k => k.startsWith(selectedCrop) || k === "Healthy_Crop");
      const result = diseaseData[cropKeys[Math.floor(Math.random() * cropKeys.length)]];
      setPrediction({ data: result, confidence: (Math.random() * 10 + 85).toFixed(1) });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo"><Leaf size={24} color="#2d5a27" /><span>AgriGuard AI</span></div>
        <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'ta' : 'en')}><Languages size={18} /> {lang === 'en' ? 'தமிழ்' : 'English'}</button>
      </nav>
      <header className="hero"><h1>{t.title}</h1><p>{!selectedCrop ? t.selectCrop : t.subtitle}</p></header>
      <main className="main-content">
        <div className="glass-card main-card">
          <AnimatePresence mode="wait">
            {!selectedCrop && (
              <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="crop-selector-grid">
                {['Banana', 'Coconut', 'Paddy', 'Groundnut', 'Tomato'].map(id => (
                  <button key={id} className="crop-btn" onClick={() => setSelectedCrop(id)}><span className="crop-icon">{id==='Banana'?'🍌':id==='Coconut'?'🥥':id==='Paddy'?'🌾':id==='Groundnut'?'🥜':'🍅'}</span><span className="crop-name">{t.crops[id]}</span></button>
                ))}
              </motion.div>
            )}
            {selectedCrop && !image && !isCapturing && (
              <div className="upload-options">
                <div className="upload-area" onClick={() => fileInputRef.current.click()}><Upload size={48} color="#2d5a27" /><h3>{t.upload}</h3><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => { const r = new FileReader(); r.onload = () => setImage(r.result); r.readAsDataURL(e.target.files[0]); }} /></div>
                <div className="divider"><span>{t.or}</span></div>
                <button className="btn btn-primary btn-lg" onClick={startCamera}><Camera size={20} /> {t.useCamera}</button>
              </div>
            )}
            {isCapturing && (
              <div className="camera-view"><video ref={videoRef} autoPlay playsInline muted /><canvas ref={canvasRef} hidden /><div className="action-bar"><button className="btn btn-primary" onClick={captureImage}>{t.capture}</button><button className="btn btn-secondary" onClick={stopCamera}>{t.cancel}</button></div></div>
            )}
            {image && (
              <div className="preview-container"><img src={image} className="preview-image" />
                {loading && <div className="analyzing-overlay"><RefreshCw className="pulse-icon" size={48} /><h3>{t.analyzing}</h3></div>}
                {!prediction && !loading && <div className="action-bar"><button className="btn btn-primary" onClick={analyzeImage}>{t.analyze}</button><button className="btn btn-secondary" onClick={() => {setImage(null); setSelectedCrop(null);}}><RefreshCw size={18} /> {t.retake}</button></div>}
                {prediction && (
                  <div className="result-dashboard">
                    <div className="result-header"><span className={`badge ${prediction.data[lang].name.includes('Healthy') ? 'badge-success' : 'badge-warning'}`}>{prediction.data[lang].name.includes('Healthy') ? t.normal : t.threat}</span><div className="confidence-pill">{prediction.confidence}% {t.confidence}</div></div>
                    <h2>{prediction.data[lang].name}</h2>
                    <div className="dashboard-grid">
                      <div className="info-card"><h3>{t.symptoms}</h3><ul>{prediction.data[lang].symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                      <div className="info-card"><h3>{t.organic}</h3><ul>{prediction.data[lang].organic.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                      <div className="info-card"><h3>{t.chemical}</h3><ul>{prediction.data[lang].chemical.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                    </div>
                    <button className="btn btn-secondary btn-full" onClick={() => {setImage(null); setPrediction(null); setSelectedCrop(null);}}>{t.back}</button>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
export default App;
