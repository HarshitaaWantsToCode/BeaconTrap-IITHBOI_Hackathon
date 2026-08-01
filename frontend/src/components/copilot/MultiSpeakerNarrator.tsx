import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MultiSpeakerNarratorProps {
  textToRead?: string;
  langCode?: string;
}

// Map short codes to proper BCP-47 locale tags to ensure native OS voice engines are selected!
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

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleNarrator = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!textToRead) return;

    // Stop anything currently playing
    window.speechSynthesis.cancel();

    const plainText = textToRead.replace(/[#*`[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    
    // Explicitly enforce the native phonetic locale tag (fixes the American accent issue)
    const targetLangTag = browserLangMap[langCode] || "en-US";
    utterance.lang = targetLangTag;
    
    // Ensure we trigger the onEnd callback correctly
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={toggleNarrator}
      className={`p-2 rounded-full transition-all ${
        isPlaying
          ? "bg-primary/20 text-primary shadow-[0_0_15px_var(--primary-glow)] animate-pulse"
          : "bg-card border border-card-border text-text-muted hover:text-text-primary hover:border-primary/50"
      }`}
      title={isPlaying ? "Stop Narration" : "Read Full Report Loud"}
    >
      {isPlaying ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};
