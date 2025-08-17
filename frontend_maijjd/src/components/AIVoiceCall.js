import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  User, 
  Clock, 
  Signal,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Headphones,
  Speaker,
  MessageCircle,
  Video,
  VideoOff,
  MoreVertical,
  X
} from 'lucide-react';
import apiService from '../services/api';

const AIVoiceCall = ({ 
  isOpen, 
  onClose, 
  software, 
  onCallStart, 
  onCallEnd,
  initialCallType = 'audio' // 'audio' or 'video'
}) => {
  const [callState, setCallState] = useState('idle'); // idle, connecting, connected, ended
  const [callType, setCallType] = useState(initialCallType);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialCallType === 'video');
  const [isRecording, setIsRecording] = useState(false);
  const [callQuality, setCallQuality] = useState('excellent');
  const [networkStatus, setNetworkStatus] = useState('good');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    autoTranscribe: true,
    saveCallHistory: true,
    noiseReduction: true,
    echoCancellation: true
  });

  // Refs for media streams and audio context
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const callTimerRef = useRef(null);
  const transcriptionRef = useRef(null);
  const aiProcessingRef = useRef(null);

  // Initialize call when component mounts
  useEffect(() => {
    if (isOpen) {
      initializeCall();
      startNetworkMonitoring();
      startBatteryMonitoring();
    }

    return () => {
      cleanupCall();
    };
  }, [isOpen]);

  // Call timer effect
  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState]);

  // Initialize call setup
  const initializeCall = async () => {
    try {
      setCallState('connecting');
      
      // Request media permissions
      const constraints = {
        audio: {
          echoCancellation: userPreferences.echoCancellation,
          noiseSuppression: userPreferences.noiseReduction,
          autoGainControl: true
        },
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Set up local video/audio
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      // Initialize audio context for processing
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Simulate connection delay
      setTimeout(() => {
        setCallState('connected');
        if (onCallStart) onCallStart();
        startVoiceProcessing();
      }, 2000);

    } catch (error) {
      console.error('Error initializing call:', error);
      setCallState('idle');
      handleCallError(error);
    }
  };

  // Start voice processing for AI interaction
  const startVoiceProcessing = () => {
    if (!userPreferences.autoTranscribe) return;

    // Set up continuous voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscription(prev => prev + ' ' + finalTranscript);
          processWithAI(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
      transcriptionRef.current = recognition;
    }
  };

  // Process voice input with AI
  const processWithAI = async (text) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const response = await apiService.post('/ai/voice', {
        audioData: null, // In real implementation, send actual audio data
        format: 'wav',
        software: software?.name,
        context: {
          callType: callType,
          callDuration: callDuration,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      if (response.data?.success) {
        setAiResponse(response.data.content);
        
        // Speak the AI response if speaker is on
        if (isSpeakerOn && !isMuted) {
          speakText(response.data.content);
        }

        // Add to call history
        addToCallHistory('ai', response.data.content);
      }

    } catch (error) {
      console.error('AI processing error:', error);
      setAiResponse('I apologize, but I encountered an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = isSpeakerOn ? 1 : 0;
      
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      // Start new speech
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start call
  const startCall = async () => {
    if (callState === 'idle') {
      await initializeCall();
    }
  };

  // End call
  const endCall = () => {
    setCallState('ended');
    cleanupCall();
    
    if (onCallEnd) {
      onCallEnd({
        duration: callDuration,
        type: callType,
        software: software?.name,
        timestamp: new Date().toISOString()
      });
    }

    // Save call to history if enabled
    if (userPreferences.saveCallHistory) {
      saveCallToHistory();
    }

    // Reset state
    setTimeout(() => {
      setCallState('idle');
      setCallDuration(0);
      setTranscription('');
      setAiResponse('');
      onClose();
    }, 2000);
  };

  // Cleanup call resources
  const cleanupCall = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (transcriptionRef.current) {
      transcriptionRef.current.stop();
      transcriptionRef.current = null;
    }

    if (aiProcessingRef.current) {
      clearTimeout(aiProcessingRef.current);
    }
  };

  // Handle call errors
  const handleCallError = (error) => {
    console.error('Call error:', error);
    
    let errorMessage = 'An unexpected error occurred during the call.';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Microphone access denied. Please allow microphone permissions.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No microphone found. Please check your audio devices.';
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Microphone is already in use by another application.';
    }

    setAiResponse(errorMessage);
    setTimeout(() => {
      endCall();
    }, 3000);
  };

  // Add entry to call history
  const addToCallHistory = (type, content) => {
    const entry = {
      id: Date.now(),
      type, // 'user', 'ai', 'system'
      content,
      timestamp: new Date().toISOString(),
      callDuration
    };
    
    setCallHistory(prev => [...prev, entry]);
  };

  // Save call to persistent history
  const saveCallToHistory = () => {
    try {
      const callRecord = {
        id: Date.now(),
        software: software?.name,
        type: callType,
        duration: callDuration,
        timestamp: new Date().toISOString(),
        history: callHistory,
        quality: callQuality,
        networkStatus
      };

      const existingHistory = JSON.parse(localStorage.getItem('maijjd_call_history') || '[]');
      const updatedHistory = [...existingHistory, callRecord].slice(-50); // Keep last 50 calls
      localStorage.setItem('maijjd_call_history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error('Error saving call history:', error);
    }
  };

  // Network monitoring
  const startNetworkMonitoring = () => {
    if ('connection' in navigator) {
      const updateNetworkStatus = () => {
        const connection = navigator.connection;
        if (connection.effectiveType === '4g') {
          setNetworkStatus('excellent');
        } else if (connection.effectiveType === '3g') {
          setNetworkStatus('good');
        } else {
          setNetworkStatus('poor');
        }
      };

      navigator.connection.addEventListener('change', updateNetworkStatus);
      updateNetworkStatus();
    }
  };

  // Battery monitoring
  const startBatteryMonitoring = () => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };

        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        updateBatteryInfo();
      });
    }
  };

  // Format call duration
  const formatCallDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get call quality indicator
  const getCallQualityIndicator = () => {
    switch (callQuality) {
      case 'excellent':
        return <Signal className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Signal className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <Signal className="h-4 w-4 text-red-500" />;
      default:
        return <Signal className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Voice Call</h2>
                <p className="text-blue-100">
                  {software ? `Getting help with ${software.name}` : 'AI Assistant Support'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Call Status Indicators */}
              <div className="flex items-center space-x-2 text-sm">
                {getCallQualityIndicator()}
                <span className="text-blue-100">Call Quality: {callQuality}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                {networkStatus === 'good' ? (
                  <Wifi className="h-4 w-4 text-green-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-400" />
                )}
                <span className="text-blue-100">Network: {networkStatus}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                {isCharging ? (
                  <BatteryCharging className="h-4 w-4 text-green-400" />
                ) : (
                  <Battery className="h-4 w-4 text-blue-400" />
                )}
                <span className="text-blue-100">{batteryLevel}%</span>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Call Content */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-200px)]">
          {/* Video Area */}
          <div className="flex-1 p-6 bg-gray-900">
            {callType === 'video' ? (
              <div className="relative h-full">
                {/* Remote Video */}
                <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                  {callState === 'connected' ? (
                    <video
                      ref={remoteVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Phone className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">
                          {callState === 'connecting' ? 'Connecting...' : 'Call ended'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Local Video */}
                {callState === 'connected' && (
                  <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                    <video
                      ref={localVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <Phone className="h-24 w-24 mx-auto mb-6 text-blue-400" />
                  <h3 className="text-2xl font-bold mb-2">Voice Call</h3>
                  <p className="text-gray-300">
                    {callState === 'connecting' ? 'Connecting to AI Assistant...' : 
                     callState === 'connected' ? 'Connected - Speak naturally' : 
                     'Call ended'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls and Chat */}
          <div className="w-full lg:w-96 bg-gray-50 p-6 flex flex-col">
            {/* Call Duration and Status */}
            <div className="text-center mb-6">
              <div className="text-3xl font-mono font-bold text-gray-800 mb-2">
                {formatCallDuration(callDuration)}
              </div>
              <div className="text-sm text-gray-600">
                {callState === 'connected' ? 'Connected' : 
                 callState === 'connecting' ? 'Connecting...' : 'Call ended'}
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              {callState === 'idle' ? (
                <button
                  onClick={startCall}
                  className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-colors"
                >
                  <Phone className="h-6 w-6" />
                </button>
              ) : callState === 'connected' ? (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-colors ${
                      isMuted ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </button>
                  
                  <button
                    onClick={endCall}
                    className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-4 rounded-full transition-colors ${
                      isSpeakerOn ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {isSpeakerOn ? <Speaker className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                  </button>
                </>
              ) : null}
            </div>

            {/* Transcription and AI Response */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* User Speech */}
              {transcription && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">You said:</span>
                  </div>
                  <p className="text-blue-900 text-sm">{transcription}</p>
                </div>
              )}

              {/* AI Response */}
              {aiResponse && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-sm font-medium text-green-800">AI Assistant:</span>
                  </div>
                  <p className="text-green-900 text-sm">{aiResponse}</p>
                </div>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-yellow-800">AI is processing your request...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Call History Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCallHistory(prev => prev.length > 0 ? [] : callHistory)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {callHistory.length > 0 ? 'Hide Call History' : 'Show Call History'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceCall;
