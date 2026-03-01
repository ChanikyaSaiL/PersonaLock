import React, { useState, useRef } from 'react';
import { Mic, Square, Play, RotateCcw, ChevronLeft, ChevronRight, FileAudio } from 'lucide-react';

const SENTENCES = [
    "Hello world",
    "I am registering for the biometric system",
    "My voice is my password",
    "Authentication requires active consent",
    "Multimodal data improves accuracy",
    "Secure clouds store encrypted files",
    "Identity verification is crucial",
    "I am reading the eighth sentence",
    "Almost done with voice recording",
    "This is the final voice sample"
];

export default function VoiceRecord({ nextStep, prevStep, formData, updateFormData }) {
    const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

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
            const audio = new Audio(sample.url);
            audio.play();
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const progress = Object.keys(formData.voiceSamples).length;
    const isComplete = progress === SENTENCES.length;
    const currentSample = formData.voiceSamples[currentSentenceIdx];

    const handleNextSentence = () => {
        if (currentSentenceIdx < SENTENCES.length - 1) {
            setCurrentSentenceIdx(prev => prev + 1);
        }
    };

    const handlePrevSentence = () => {
        if (currentSentenceIdx > 0) {
            setCurrentSentenceIdx(prev => prev - 1);
        }
    };

    return (
        <div className="glass-panel p-8 w-full max-w-3xl mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-cyan-400/50">
                    <Mic className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Voice Recording ({currentSentenceIdx + 1} of 10)</h2>
            </div>

            <div className="bg-dark-700/50 rounded-3xl p-8 mb-8 border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-dark-900">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-400/80"
                        style={{ width: `${((currentSentenceIdx + 1) / SENTENCES.length) * 100}%` }}
                    />
                </div>

                <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Please read clearly:</p>
                <blockquote className="text-2xl font-medium text-white italic mb-10 px-4">
                    "{SENTENCES[currentSentenceIdx]}"
                </blockquote>

                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-4xl font-mono text-blue-400 font-light tracking-wider">
                        {formatTime(isRecording ? recordingDuration : 0)}
                    </div>

                    <div className={`h-16 w-full max-w-sm rounded-xl flex items-center justify-center space-x-1 ${isRecording ? 'opacity-100' : 'opacity-30'} transition-opacity`}>
                        {/* Simulated Waveform */}
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 rounded-full ${isRecording ? 'bg-gradient-to-t from-cyan-400 to-blue-500 shadow-md shadow-cyan-400/60' : 'bg-gray-600'}`}
                                style={{
                                    height: isRecording ? `${Math.random() * 80 + 20}%` : '20%',
                                    transition: 'height 0.1s ease, background 0.3s ease'
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        {!isRecording && !currentSample && (
                            <button onClick={startRecording} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 pr-6">
                                <div className="w-4 h-4 rounded-full bg-white animate-pulse" /> Start Recording
                            </button>
                        )}

                        {isRecording && (
                            <button onClick={stopRecording} className="bg-dark-800 hover:bg-dark-900 border border-white/10 text-white rounded-full p-4 transition-all flex items-center gap-2 pr-6">
                                <Square className="w-4 h-4 fill-white" /> Stop
                            </button>
                        )}

                        {!isRecording && currentSample && (
                            <>
                                <button onClick={playRecording} className="bg-blue-600 hover:bg-blue-500 border border-blue-500/50 text-white rounded-full p-4 transition-all flex items-center gap-2 pr-6 shadow-lg shadow-blue-500/20">
                                    <Play className="w-5 h-5 fill-white" /> Play
                                </button>
                                <button onClick={() => { updateFormData('voiceSamples', { ...formData.voiceSamples, [currentSentenceIdx]: null }); }} className="bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-full p-4 transition-all flex items-center gap-2 pr-6">
                                    <RotateCcw className="w-4 h-4" /> Re-record
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-4 mb-8 border border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-blue-400" />
                    Overall Progress: <span className="text-blue-400">{progress} / 10</span>
                </span>
                <div className="w-1/2 bg-dark-900 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-500 ease-out"
                        style={{ width: `${(progress / 10) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <button onClick={prevStep} className="btn-secondary text-sm px-4 py-2">
                    Main Back
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handlePrevSentence}
                        disabled={currentSentenceIdx === 0}
                        className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>

                    {currentSentenceIdx < SENTENCES.length - 1 ? (
                        <button
                            onClick={handleNextSentence}
                            disabled={!currentSample}
                            className="btn-primary bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            disabled={!isComplete}
                            className="btn-primary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Continue to Review <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
