import { useState, useCallback, useRef } from 'react';

// --- Web Speech API Custom Type Definitions ---
// We define these manually to replace 'any' because the Web Speech API 
// is experimental and not fully typed in standard TS DOM libraries.
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onsoundstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onsoundend: (() => void) | null;
}

// Safely extending the Window object to include browser-specific speech constructors
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}
// ----------------------------------------------

interface SpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
  continuous?: boolean;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // FIXED: Replaced 'any' with our custom SpeechRecognition type
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const startListening = useCallback(() => {
    // FIXED: Cast window to our custom interface instead of 'any'
    const customWindow = window as unknown as WindowWithSpeech;
    const SpeechRecognitionConstructor = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = optionsRef.current.lang || 'en-IN';
    recognition.continuous = optionsRef.current.continuous || false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('Speech recognition: started');
      setIsListening(true);
      setError(null);
    };

    recognition.onsoundstart = () => console.log('Speech recognition: sound detected');
    recognition.onspeechstart = () => console.log('Speech recognition: speech detected');
    recognition.onspeechend = () => console.log('Speech recognition: speech ended');
    recognition.onsoundend = () => console.log('Speech recognition: sound ended');

    // FIXED: Typed the event as SpeechRecognitionEvent
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
      console.log('Speech result:', currentTranscript);
      
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal && optionsRef.current.onResult) {
        console.log('Final speech result:', currentTranscript);
        optionsRef.current.onResult(currentTranscript.trim());
      }
    };

    // FIXED: Typed the event as SpeechRecognitionErrorEvent
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition: ended');
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Recognition start failed:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    toggleListening
  };
};