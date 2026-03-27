import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, ChevronLeft, ChevronRight, FileAudio } from 'lucide-react';

const SENTENCES = [
    "Hello, welcome to PersonaLock secure authentication system.",
    "I am [your name], registering for biometric system.",
    "The quick brown fox jumps over the lazy dog.",
    "My registration number is one two three four five.",
    "Please verify my identity using voice authentication.",
    "Today is a great day to learn something new and exciting.",
    "I am feeling happy and confident about this system.",
    "Artificial intelligence is transforming modern authentication systems rapidly.",
    "Ok Jyothi.",
    "This system uses both facial recognition and voice biometrics to enhance security."
];

const SENTENCE_IDX_KEY = 'plVoiceSentenceIdx';

export default function VoiceRecord({ nextStep, prevStep, formData, updateFormData }) {
    const [currentSentenceIdx, setCurrentSentenceIdx] = useState(() => {
        try {
            const v = sessionStorage.getItem(SENTENCE_IDX_KEY);
            const n = v !== null ? parseInt(v, 10) : 0;
            return isNaN(n) ? 0 : Math.max(0, Math.min(n, SENTENCES.length - 1));
        } catch { return 0; }
    });
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioPlayerRef = useRef(null);
    const timerRef = useRef(null);
    const playbackTimerRef = useRef(null);

    // Persist active sentence index so it survives a page reload
    useEffect(() => {
        try { sessionStorage.setItem(SENTENCE_IDX_KEY, String(currentSentenceIdx)); }
        catch { /* ignore */ }
    }, [currentSentenceIdx]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                updateFormData('voiceSamples', {
                    ...formData.voiceSamples,
                    [currentSentenceIdx]: { blob: audioBlob, url }
                });
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingDuration(0);

            timerRef.current = setInterval(() => {
                setRecordingDuration((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const playRecording = () => {
        const sample = formData.voiceSamples[currentSentenceIdx];
        if (sample && sample.url) {
            // Always create a fresh Audio object for the current sentence's URL.
            // The old ref may still point to a previous sentence's blob URL.
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.onloadedmetadata = null;
                audioPlayerRef.current.ontimeupdate = null;
                audioPlayerRef.current.onended = null;
            }
            audioPlayerRef.current = new Audio(sample.url);

            audioPlayerRef.current.onloadedmetadata = () => {
                setTotalDuration(Math.floor(audioPlayerRef.current.duration));
            };

            audioPlayerRef.current.ontimeupdate = () => {
                setPlaybackDuration(Math.floor(audioPlayerRef.current.currentTime));
            };

            audioPlayerRef.current.onended = () => {
                setIsPlaying(false);
                setPlaybackDuration(0);
                clearInterval(playbackTimerRef.current);
            };

            audioPlayerRef.current.play();
            setIsPlaying(true);
        }
    };

    const stopPlayback = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
            setIsPlaying(false);
            setPlaybackDuration(0);
            clearInterval(playbackTimerRef.current);
        }
    };

    const handleReRecord = () => {
        stopPlayback();
        audioPlayerRef.current = null;
        setPlaybackDuration(0);
        setTotalDuration(0);
        updateFormData('voiceSamples', { ...formData.voiceSamples, [currentSentenceIdx]: null });
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = Object.values(formData.voiceSamples).filter(Boolean).length;
    const isComplete = progress === SENTENCES.length;
    const currentSample = formData.voiceSamples[currentSentenceIdx];

    const switchSentence = (newIdx) => {
        // Stop any active playback before switching
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.onloadedmetadata = null;
            audioPlayerRef.current.ontimeupdate = null;
            audioPlayerRef.current.onended = null;
            audioPlayerRef.current = null;
        }
        setIsPlaying(false);
        setPlaybackDuration(0);
        setTotalDuration(0);
        setCurrentSentenceIdx(newIdx);
    };

    const handleNextSentence = () => {
        if (currentSentenceIdx < SENTENCES.length - 1) {
            switchSentence(currentSentenceIdx + 1);
        }
    };

    const handlePrevSentence = () => {
        if (currentSentenceIdx > 0) {
            switchSentence(currentSentenceIdx - 1);
        }
    };

    return (
        <div className="glass-panel p-5 sm:p-8 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 relative z-10 animate-float">
                        <Mic className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text text-center">Voice Recording</h2>
                <p className="text-gray-400 text-center text-sm">Sample {currentSentenceIdx + 1} of 10</p>
            </div>

            {/* Sentence Card */}
            <div className="info-card rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600" 
                    style={{ width: `${((currentSentenceIdx + 1) / SENTENCES.length) * 100}%` }} 
                />
                
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-bold">Please read this sentence clearly:</p>
                <blockquote className="text-lg sm:text-2xl md:text-3xl font-semibold text-white italic mb-6 px-2 sm:px-4 leading-relaxed">
                    "{SENTENCES[currentSentenceIdx]}"
                </blockquote>

                <div className="flex flex-col items-center justify-center space-y-8">
                    {/* Timer */}
                    <div className="text-5xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-light tracking-wider font-bold">
                        {formatTime(isRecording ? recordingDuration : 0)}
                    </div>

                    {/* Waveform Visualizer */}
                    <div className={`h-20 w-full max-w-sm rounded-2xl flex items-center justify-center space-x-1.5 px-4 py-6 ${isRecording ? 'opacity-100 bg-blue-600/10' : 'opacity-30 bg-dark-800/30'} transition-all duration-300 backdrop-blur-sm rounded-xl border border-white/10`}>
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2.5 rounded-full transition-all duration-100 ${isRecording ? 'bg-gradient-to-t from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/60' : 'bg-gray-600'}`}
                                style={{
                                    height: isRecording ? `${Math.random() * 85 + 15}%` : '25%',
                                }}
                            />
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {!isRecording && !currentSample && (
                            <button onClick={startRecording} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full p-4 transition-all shadow-lg shadow-red-500/40 flex items-center gap-2 pr-7 font-bold hover:scale-105">
                                <div className="w-4 h-4 rounded-full bg-white animate-pulse" /> Start Recording
                            </button>
                        )}

                        {isRecording && (
                            <button onClick={stopRecording} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-4 transition-all shadow-lg shadow-orange-500/40 flex items-center gap-2 pr-7 font-bold hover:scale-105 border border-orange-400/50">
                                <Square className="w-5 h-5 fill-white" /> Stop Recording
                            </button>
                        )}

                        {!isRecording && currentSample && (
                            <>
                                <button 
                                    onClick={isPlaying ? stopPlayback : playRecording} 
                                    className={`rounded-full p-4 transition-all flex items-center gap-2 pr-7 shadow-lg font-bold hover:scale-105 border ${
                                        isPlaying 
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/40 border-red-500/50' 
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/40 border-blue-500/50'
                                    } text-white`}
                                >
                                    {isPlaying ? (
                                        <>
                                            <Square className="w-5 h-5 fill-white" /> Stop Preview
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 fill-white" /> Preview Voice
                                        </>
                                    )}
                                </button>
                                <button onClick={handleReRecord} className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-gray-200 rounded-full p-4 transition-all flex items-center gap-2 pr-7 font-bold hover:scale-105 border border-gray-600/50 shadow-lg shadow-gray-900/40">
                                    <RotateCcw className="w-4 h-4" /> Re-record
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Playback Section */}
            {!isRecording && currentSample && (
                <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-500/30">
                    <p className="text-sm font-bold text-blue-300 mb-4 flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Recording Playback
                    </p>
                    <p className="text-xs text-gray-400 mb-4">Listen to verify your recording quality</p>
                    
                    {isPlaying && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-1.5 h-14 bg-dark-900/50 rounded-xl p-4">
                                {[...Array(32)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-blue-500 shadow-md shadow-cyan-400/50"
                                        style={{
                                            height: `${Math.sin((i + playbackDuration * 5) * 0.3) * 45 + 55}%`,
                                            transition: 'height 0.05s ease'
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-300">
                                <span className="font-mono text-cyan-400 font-bold">{formatTime(playbackDuration)}</span>
                                <div className="flex-1 mx-4 bg-dark-900 rounded-full h-2 overflow-hidden border border-white/10">
                                    <div
                                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all shadow-lg shadow-cyan-400/50"
                                        style={{ width: totalDuration > 0 ? `${(playbackDuration / totalDuration) * 100}%` : '0%' }}
                                    />
                                </div>
                                <span className="font-mono text-gray-500 font-bold">{formatTime(totalDuration)}</span>
                            </div>
                        </div>
                    )}
                    
                    {!isPlaying && (
                        <div className="bg-dark-800/50 rounded-lg p-4 text-center border border-white/5">
                            <p className="text-sm text-gray-400">Click "Preview Voice" to listen to your recording</p>
                        </div>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-5 mb-8 border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <FileAudio className="w-4 h-4 text-blue-400" />
                        Overall Progress
                    </span>
                    <span className="text-sm font-bold text-blue-400 bg-dark-800/80 px-3 py-1 rounded-full">{progress} / 10</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(progress / 10) * 100}%` }}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <button onClick={prevStep} className="btn-secondary text-sm px-6 py-2 font-bold">
                    ← Back
                </button>

                <div className="flex gap-3 flex-wrap justify-center">
                    <button
                        onClick={handlePrevSentence}
                        disabled={currentSentenceIdx === 0}
                        className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev Sentence
                    </button>

                    {currentSentenceIdx < SENTENCES.length - 1 ? (
                        <button
                            onClick={handleNextSentence}
                            disabled={!currentSample}
                            className="btn-primary bg-gradient-to-r from-blue-600 to-blue-700 shadow-blue-500/40 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                        >
                            Next Sentence <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={!isComplete}
                            className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                        >
                            Review & Continue <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
