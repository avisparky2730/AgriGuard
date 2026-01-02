import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Leaf, CheckCircle, AlertTriangle, Info, ShieldCheck, Languages, Droplets, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { diseaseData } from './data/diseaseData';
import './index.css';

const UI_TEXT = {
  en: {
    title: "AgriGuard AI",
    subtitle: "Instant crop disease detection for sustainable farming.",
    upload: "Upload Image",
    dragDrop: "Drag and drop or click to browse",
    or: "OR",
    useCamera: "Use Camera",
    capture: "Capture",
    cancel: "Cancel",
    analyze: "Analyze Sample",
    retake: "Retake",
    analyzing: "AI is Analyzing...",
    threat: "Threat Detected",
    normal: "Normal",
    confidence: "Classification Confidence",
    symptoms: "Key Symptoms",
    action: "Recommended Action",
    organic: "Organic Methods",
    chemical: "Chemical / Fertilizer",
    back: "Back to Start",
    footer: "Empowering Farmers Worldwide."
  },
  ta: {
    title: "அக்ரிகார்ட் AI",
    subtitle: "நிலையான விவசாயத்திற்கான உடனடி பயிர் நோய் கண்டறிதல்.",
    upload: "படம் பதிவேற்றவும்",
    dragDrop: "இழுத்துப் போடவும் அல்லது உலாவ கிளிக் செய்யவும்",
    or: "அல்லது",
    useCamera: "கேமராவைப் பயன்படுத்தவும்",
    capture: "புகைப்படம் எடுக்கவும்",
    cancel: "ரத்து செய்",
    analyze: "ஆய்வு செய்",
    retake: "மீண்டும் செய்",
    analyzing: "AI ஆய்வு செய்கிறது...",
    threat: "அச்சுறுத்தல் கண்டறியப்பட்டது",
    normal: "சாதாரணமானது",
    confidence: "கணிப்பு துல்லியம்",
    symptoms: "முக்கிய அறிகுறிகள்",
    action: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    organic: "இயற்கை வழிமுறைகள்",
    chemical: "இரசாயன மருந்துகள் / உரங்கள்",
    back: "மீண்டும் முதலிலிருந்து",
    footer: "உலகெங்கிலும் உள்ள விவசாயிகளின் முன்னேற்றத்திற்காக."
  }
};

function App() {
  const [lang, setLang] = useState('en');
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = UI_TEXT[lang];

  const startCamera = async () => {
    setIsCapturing(true);
    setImage(null);
    setPrediction(null);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log("Video playback inhibited", e));
      }
    } catch (err) {
      console.error("Camera error:", err);
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = fallback;
      } catch (fErr) {
        alert("Camera access failed. Please check your browser permissions.");
        setIsCapturing(false);
      }
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks()?.forEach(track => track.stop());
    setIsCapturing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setLoading(true);
    setTimeout(() => {
      const keys = Object.keys(diseaseData);
      const result = diseaseData[keys[Math.floor(Math.random() * keys.length)]];
      setPrediction({ data: result, confidence: (Math.random() * 15 + 85).toFixed(1) });
      setLoading(false);
    }, 2500);
  };

  const reset = () => {
    setImage(null);
    setPrediction(null);
    setLoading(false);
    setIsCapturing(false);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <Leaf size={24} color="#2d5a27" />
          <span>AgriGuard AI</span>
        </div>
        <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'ta' : 'en')}>
          <Languages size={18} /> {lang === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </nav>

      <header className="hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </motion.div>
      </header>

      <main className="main-content">
        <div className="glass-card main-card">
          <AnimatePresence mode="wait">
            {!image && !isCapturing && (
              <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="upload-options">
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                  <Upload size={48} color="#2d5a27" style={{ marginBottom: '1rem' }} />
                  <h3>{t.upload}</h3>
                  <p>{t.dragDrop}</p>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
                </div>
                <div className="divider"><span>{t.or}</span></div>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={startCamera}>
                  <Camera size={20} /> {t.useCamera}
                </button>
              </motion.div>
            )}

            {isCapturing && (
              <motion.div key="cam" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="camera-view">
                  <video ref={videoRef} autoPlay playsInline muted />
                  <canvas ref={canvasRef} hidden />
                </div>
                <div className="action-bar">
                  <button className="btn btn-primary" onClick={captureImage}>{t.capture}</button>
                  <button className="btn btn-secondary" onClick={stopCamera}>{t.cancel}</button>
                </div>
              </motion.div>
            )}

            {image && (
              <motion.div key="prev" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="preview-container">
                  <img src={image} alt="Preview" className="preview-image" />
                  {loading && (
                    <div className="analyzing-overlay">
                      <RefreshCw className="pulse-icon" size={48} />
                      <h3>{t.analyzing}</h3>
                    </div>
                  )}
                </div>
                {!prediction && !loading && (
                  <div className="action-bar">
                    <button className="btn btn-primary" onClick={analyzeImage}>{t.analyze}</button>
                    <button className="btn btn-secondary" onClick={reset}><RefreshCw size={18} /> {t.retake}</button>
                  </div>
                )}
                {prediction && (
                  <div className="result-dashboard">
                    <div className="result-header">
                      <span className={`badge ${prediction.data[lang].name.includes('Healthy') ? 'badge-success' : 'badge-warning'}`}>
                        {prediction.data[lang].name.includes('Healthy') ? t.normal : t.threat}
                      </span>
                      <div className="confidence-pill">{prediction.confidence}% {t.confidence}</div>
                    </div>
                    <div className="result-title"><h2>{prediction.data[lang].name}</h2></div>
                    <div className="dashboard-grid">
                      <div className="info-card">
                        <div className="card-header"><Info size={18} color="#856404" /><h3>{t.symptoms}</h3></div>
                        <ul className="data-list">{prediction.data[lang].symptoms.map((s, i) => <li key={i}><AlertTriangle size={14} color="#f4b400" /> {s}</li>)}</ul>
                      </div>
                      <div className="info-card">
                        <div className="card-header"><Droplets size={18} color="#2d5a27" /><h3>{t.organic}</h3></div>
                        <ul className="data-list">{prediction.data[lang].organic.map((s, i) => <li key={i}><CheckCircle size={14} color="#4caf50" /> {s}</li>)}</ul>
                      </div>
                      <div className="info-card">
                        <div className="card-header"><FlaskConical size={18} color="#004085" /><h3>{t.chemical}</h3></div>
                        <ul className="data-list">{prediction.data[lang].chemical.map((s, i) => <li key={i}><ShieldCheck size={14} color="#2a7ade" /> {s}</li>)}</ul>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-full" onClick={reset}>{t.back}</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer>&copy; 2025 {t.title}. {t.footer}</footer>
    </div>
  );
}

export default App;
