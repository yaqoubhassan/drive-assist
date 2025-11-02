import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Volume2,
  VolumeX,
  Pause,
  Play,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceTranscript?: (transcript: string) => void;
  error?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  showVoiceInput?: boolean;
  showTextToSpeech?: boolean;
}

export default function DescriptionInput({
  value,
  onChange,
  onVoiceTranscript,
  error,
  minLength = 20,
  maxLength = 700,
  placeholder = 'Describe what\'s happening with your vehicle in detail...',
  showVoiceInput = true,
  showTextToSpeech = true,
}: DescriptionInputProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTranscript, setRecordingTranscript] = useState('');
  const [textToSpeechSupported, setTextToSpeechSupported] = useState(true);
  const [voiceInputSupported, setVoiceInputSupported] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support on mount
  useEffect(() => {
    // Check Text-to-Speech support
    if (!('speechSynthesis' in window)) {
      setTextToSpeechSupported(false);
    }

    // Check Voice Input support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceInputSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          setRecordingTranscript((prev) => prev + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech Functions
  const handleReadAloud = () => {
    if (!textToSpeechSupported || !value.trim()) return;

    if (isSpeaking) {
      // If already speaking, stop
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(value);
    speechSynthesisRef.current = utterance;

    // Configure utterance
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (!isSpeaking) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Voice Input Functions
  const handleStartRecording = () => {
    if (!voiceInputSupported || !recognitionRef.current) return;

    setRecordingTranscript('');
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsRecording(false);

    // Append transcript to existing text
    if (recordingTranscript.trim()) {
      const newValue = value
        ? `${value.trim()} ${recordingTranscript.trim()}`
        : recordingTranscript.trim();

      onChange(newValue);

      if (onVoiceTranscript) {
        onVoiceTranscript(recordingTranscript.trim());
      }

      setRecordingTranscript('');
    }
  };

  const handleClearText = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Character count
  const charCount = value.length;
  const charCountColor =
    charCount < minLength ? 'text-red-500' :
      charCount > maxLength * 0.9 ? 'text-amber-500' :
        'text-green-500';

  const hasMinLength = charCount >= minLength;
  const hasMaxLength = charCount <= maxLength;

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3
            bg-white dark:bg-gray-800
            border-2 rounded-xl
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            resize-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${error
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />

        {/* Character Counter */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          <span className={`text-xs font-medium ${charCountColor}`}>
            {charCount}/{maxLength}
          </span>

          {hasMinLength && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>

      {/* Validation Messages */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          {/* Min Length Indicator */}
          {charCount > 0 && charCount < minLength && (
            <span className="text-red-500">
              {minLength - charCount} more characters needed
            </span>
          )}

          {/* Max Length Warning */}
          {charCount > maxLength * 0.9 && hasMaxLength && (
            <span className="text-amber-500">
              {maxLength - charCount} characters remaining
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between">
        {/* Left Side: Text-to-Speech Controls */}
        <div className="flex items-center space-x-2">
          {showTextToSpeech && textToSpeechSupported && value.trim() && (
            <AnimatePresence mode="wait">
              {isSpeaking ? (
                <motion.div
                  key="speaking-controls"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-2"
                >
                  {/* Pause/Resume Button */}
                  <motion.button
                    type="button"
                    onClick={handlePauseResume}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    )}
                  </motion.button>

                  {/* Stop Button */}
                  <motion.button
                    type="button"
                    onClick={handleStopSpeaking}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop</span>
                  </motion.button>

                  {/* Speaking Indicator */}
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-sm">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.div>
                    <span>{isPaused ? 'Paused' : 'Speaking...'}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="read-aloud-button"
                  type="button"
                  onClick={handleReadAloud}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Read Aloud</span>
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Right Side: Voice Input & Clear */}
        <div className="flex items-center space-x-2">
          {/* Clear Button */}
          {value.trim() && (
            <motion.button
              type="button"
              onClick={handleClearText}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear</span>
            </motion.button>
          )}

          {/* Voice Input Button */}
          {showVoiceInput && voiceInputSupported && (
            <motion.button
              type="button"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? 'Stop Recording' : 'Voice Input'}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Recording Transcript Preview */}
      <AnimatePresence>
        {isRecording && recordingTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" />
              <p className="text-sm text-blue-900 dark:text-blue-100 italic">
                "{recordingTranscript}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Support Messages */}
      {(!textToSpeechSupported || !voiceInputSupported) && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800 dark:text-yellow-200">
              {!textToSpeechSupported && !voiceInputSupported && (
                <p>Voice features are not supported in your browser. Please use Chrome, Safari, or Edge.</p>
              )}
              {!textToSpeechSupported && voiceInputSupported && (
                <p>Text-to-speech is not supported in your browser.</p>
              )}
              {textToSpeechSupported && !voiceInputSupported && (
                <p>Voice input is not supported in your browser.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}