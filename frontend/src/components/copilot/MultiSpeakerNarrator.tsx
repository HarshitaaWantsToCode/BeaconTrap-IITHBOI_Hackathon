import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MultiSpeakerNarratorProps {
  textToRead?: string;
  langCode?: string;
}

const browserLangMap: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  kn: "kn-IN",
  ta: "ta-IN",
  te: "te-IN"
};

export const MultiSpeakerNarrator: React.FC<MultiSpeakerNarratorProps> = ({ 
  textToRead = "", 
  langCode = "en" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Pre-warm voice synthesis engine
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleNarrator = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Text to speech is not supported in this browser environment.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const contentToSpeak = textToRead.trim() || 
      "BeaconTrap AI Threat Intelligence: Monitoring active Android malware campaigns, APK vulnerabilities, and credential interception risks.";

    // Cancel active synthesis
    window.speechSynthesis.cancel();

    const plainText = contentToSpeak.replace(/[#*`[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utteranceRef.current = utterance; // Retain reference to prevent GC!

    const targetLangTag = browserLangMap[langCode] || "en-US";
    utterance.lang = targetLangTag;
    
    // Attempt matching native OS voice for selected language tag
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(langCode.toLowerCase())) ||
                         voices.find(v => v.lang.toLowerCase().includes(targetLangTag.toLowerCase()));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (err) => {
      console.warn("TTS Playback issue:", err);
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={toggleNarrator}
      className={`p-2 rounded-full transition-all cursor-pointer ${
        isPlaying
          ? "bg-primary/20 text-primary shadow-[0_0_15px_var(--primary-glow)] animate-pulse"
          : "bg-card border border-card-border text-text-muted hover:text-text-primary hover:border-primary/50"
      }`}
      title={isPlaying ? "Stop Narration" : "Read Summary Aloud (Text to Speech)"}
    >
      {isPlaying ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};

