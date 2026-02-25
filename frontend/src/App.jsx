import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  Search,
  Cpu,
  Activity,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Zap
} from 'lucide-react';

const API_URL = "https://email-threat-intel-6o1u.onrender.com/predict";

const App = () => {
  const [message, setMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${response.status})`);
      }

      const data = await response.json();

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        signals: {
          keywordScore: data.signals.keywordScore,
          urlRisk: data.signals.urlRisk,
          capRatio: data.signals.capRatio,
          entropy: data.signals.entropy,
        }
      });
    } catch (err) {
      console.error("Prediction failed:", err);
      setError(err.message || "Failed to connect to the backend server.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle Ctrl+Enter / Cmd+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-slate-200 font-sans selection:bg-cyber-blue selection:text-black">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 242, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, transparent 50%, rgba(10,10,32,0.5))'
        }}
      />

      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* ════════════════════════════════════════
            HEADER SECTION
           ════════════════════════════════════════ */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full border"
              style={{
                background: 'rgba(0,242,255,0.1)',
                borderColor: 'rgba(0,242,255,0.2)',
              }}
            >
              <Shield className="w-10 h-10 text-cyber-blue animate-pulse-slow" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-white">
              SMART <span className="text-cyber-blue neon-text-blue">SPAM DETECTION</span> ENGINE
            </h1>
            <p className="font-mono text-sm tracking-widest uppercase"
              style={{ color: 'rgba(0,242,255,0.5)' }}
            >
              AI-Powered Threat Intelligence System // v2.0.42
            </p>
          </motion.div>
        </header>

        {/* ════════════════════════════════════════
            INPUT SECTION
           ════════════════════════════════════════ */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="cyber-panel rounded-2xl overflow-hidden"
            style={{ padding: '2px' }}
          >
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste suspicious message content here for deep analysis..."
                className="w-full p-6 rounded-xl outline-none resize-none text-lg"
                style={{
                  background: 'rgba(5,5,16,0.8)',
                  minHeight: '200px',
                  color: '#e2e8f0',
                }}
              />
            </div>

            <div className="p-4 flex items-center justify-between"
              style={{
                background: 'rgba(10,10,32,0.4)',
                borderTop: '1px solid rgba(0,242,255,0.1)',
              }}
            >
              <div className="flex gap-4 text-xs font-mono" style={{ color: 'rgba(0,242,255,0.4)' }}>
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> TF-IDF VECTORIZER
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" /> REAL-TIME ANALYSIS
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || !message.trim()}
                className="relative px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all overflow-hidden"
                style={{
                  background: analyzing || !message.trim() ? '#1e293b' : '#00f2ff',
                  color: analyzing || !message.trim() ? '#64748b' : '#000',
                  cursor: analyzing || !message.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: analyzing || !message.trim() ? 'none' : '0 0 20px rgba(0,242,255,0.4)',
                }}
              >
                {analyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#000' }}
                    />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" /> Analyze Threat
                  </div>
                )}
              </button>
            </div>
          </motion.div>

          {/* Keyboard hint */}
          <p className="text-center mt-3 text-xs font-mono" style={{ color: 'rgba(0,242,255,0.25)' }}>
            Press Ctrl + Enter to analyze
          </p>
        </div>

        {/* ════════════════════════════════════════
            ERROR DISPLAY
           ════════════════════════════════════════ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-xl flex items-center gap-3"
              style={{
                background: 'rgba(255,0,85,0.1)',
                border: '1px solid rgba(255,0,85,0.3)',
              }}
            >
              <AlertTriangle className="w-5 h-5 text-cyber-red shrink-0" />
              <div>
                <p className="font-bold text-cyber-red text-sm">Connection Error</p>
                <p className="text-sm" style={{ color: 'rgba(255,0,85,0.7)' }}>{error}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,0,85,0.5)' }}>
                  Make sure the backend is running: <code>python api.py</code>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            OUTPUT / RESULT SECTION
           ════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <div className="cyber-panel p-8 rounded-2xl relative overflow-hidden"
                style={{
                  borderColor: result.prediction === 'SPAM' ? 'rgba(255,0,85,0.5)' : 'rgba(0,255,159,0.5)',
                  background: result.prediction === 'SPAM' ? 'rgba(255,0,85,0.05)' : 'rgba(0,255,159,0.05)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="p-5 rounded-2xl"
                      style={{
                        background: result.prediction === 'SPAM' ? 'rgba(255,0,85,0.2)' : 'rgba(0,255,159,0.2)',
                      }}
                    >
                      {result.prediction === 'SPAM' ? (
                        <ShieldAlert className="w-16 h-16 text-cyber-red" />
                      ) : (
                        <CheckCircle2 className="w-16 h-16 text-cyber-green" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-mono text-slate-400 mb-1 tracking-widest uppercase">
                        Scan Result
                      </h3>
                      <div className="text-5xl font-black tracking-tighter"
                        style={{ color: result.prediction === 'SPAM' ? '#ff0055' : '#00ff9f' }}
                      >
                        {result.prediction === 'SPAM' ? 'THREAT DETECTED' : 'SYSTEM SECURE'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-mono text-slate-400 mb-1 uppercase tracking-widest">
                      Confidence Score
                    </span>
                    <div className="text-6xl font-black"
                      style={{ color: result.prediction === 'SPAM' ? '#ff0055' : '#00ff9f' }}
                    >
                      {(result.confidence * 100).toFixed(0)}
                      <span className="text-2xl" style={{ opacity: 0.5 }}>%</span>
                    </div>
                  </div>
                </div>

                {/* Animated Status Bar */}
                <div className="mt-8 h-1 w-full rounded-full overflow-hidden"
                  style={{ background: 'rgba(30,41,59,0.5)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full"
                    style={{
                      background: result.prediction === 'SPAM' ? '#ff0055' : '#00ff9f',
                    }}
                  />
                </div>
              </div>

              {/* ════════════════════════════════════════
                  ADVANCED SECTION (Collapsible)
                 ════════════════════════════════════════ */}
              <div className="cyber-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full p-4 flex items-center justify-between transition-colors"
                  style={{ background: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2 font-bold tracking-widest text-xs uppercase text-cyber-blue">
                    <Activity className="w-4 h-4" /> Advanced Signal Breakdown
                  </div>
                  {showAdvanced
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />
                  }
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 grid md:grid-cols-2 gap-8"
                        style={{
                          background: 'rgba(10,10,32,0.2)',
                          borderTop: '1px solid rgba(0,242,255,0.1)',
                        }}
                      >
                        <SignalBar label="Suspicious Keyword Score" value={result.signals.keywordScore} color="#bc13fe" />
                        <SignalBar label="URL Risk Coefficient" value={result.signals.urlRisk} color="#ff0055" />
                        <SignalBar label="Capitalization Ratio" value={result.signals.capRatio} color="#00f2ff" />
                        <SignalBar label="Message Entropy (Sh)" value={result.signals.entropy} max={8} color="#00ff9f" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            FOOTER
           ════════════════════════════════════════ */}
        <footer className="mt-24 pt-12 text-center"
          style={{ borderTop: '1px solid rgba(0,242,255,0.1)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Zap className="w-4 h-4 text-cyber-blue" />
            <span className="text-xs font-mono tracking-widest uppercase mt-1"
              style={{ color: 'rgba(0,242,255,0.5)', letterSpacing: '0.3em' }}
            >
              Powered by Advanced Machine Learning
            </span>
          </div>
          <div className="flex justify-center gap-8 mb-8" style={{ opacity: 0.4 }}>
            <Lock className="w-5 h-5 cursor-pointer transition-colors hover:text-cyber-blue" />
            <Terminal className="w-5 h-5 cursor-pointer transition-colors hover:text-cyber-blue" />
            <ExternalLink className="w-5 h-5 cursor-pointer transition-colors hover:text-cyber-blue" />
          </div>
        </footer>
      </main>
    </div>
  );
};


/* ════════════════════════════════════════════════
   Signal Bar Sub-Component
   ════════════════════════════════════════════════ */
const SignalBar = ({ label, value, color, max = 100 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div className="flex justify-between text-xs font-mono tracking-widest uppercase">
      <span className="text-slate-500">{label}</span>
      <span style={{ color }}>{value}{max === 100 ? '%' : ''}</span>
    </div>
    <div className="h-1 w-full rounded-full overflow-hidden"
      style={{ background: 'rgba(30,41,59,0.5)' }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full"
        style={{ background: color }}
      />
    </div>
  </div>
);


export default App;
