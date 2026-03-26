import React from 'react';
import { ShieldCheck, Lock, Eye, Zap } from 'lucide-react';

export default function Consent({ nextStep, formData, updateFormData }) {
    return (
        <div className="glass-panel p-5 sm:p-8 w-full max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-2xl shadow-accent-500/50 relative z-10 animate-float">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text text-center">Data Collection System</h1>
                <p className="text-gray-300 text-center uppercase tracking-widest text-xs sm:text-sm font-medium">Multimodal Biometric Dataset Collection</p>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="info-card">
                    <div className="flex items-start gap-3">
                        <Eye className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-bold mb-1">5 Face Images</h4>
                            <p className="text-gray-200 text-sm">Various angles and natural expressions</p>
                        </div>
                    </div>
                </div>
                <div className="info-card">
                    <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-accent-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-bold mb-1">10 Voice Samples</h4>
                            <p className="text-gray-200 text-sm">Clear voice recordings for accuracy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purpose Section */}
            <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-primary-400/20">
                <h3 className="font-bold text-lg mb-3 text-primary-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Purpose & Security
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                    This data will be used strictly for <span className="text-primary-300 font-semibold">research and model training</span> purposes. Your identity will be <span className="text-primary-300 font-semibold">protected</span> and all data will be <span className="text-primary-300 font-semibold">securely encrypted</span> in compliance with data protection regulations.
                </p>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start space-x-4 cursor-pointer group mb-8 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/20 neon-border">
                <div className="relative flex items-center mt-1 flex-shrink-0">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.consent}
                        onChange={(e) => updateFormData('consent', e.target.checked)}
                    />
                    <div className="w-6 h-6 rounded border-2 border-primary-500 bg-transparent peer-checked:bg-gradient-to-br peer-checked:from-primary-500 peer-checked:to-accent-500 flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary-500/20">
                        {formData.consent && (
                            <svg className="w-4 h-4 text-white animate-bounce-gentle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
                <span className="text-gray-200 select-none group-hover:text-white transition-colors font-medium">
                    I agree to the data collection and give my consent for the use of my biometric data for research and model training purposes
                </span>
            </label>

            {/* Navigation Button */}
            <div className="flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={!formData.consent}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group"
                >
                    Continue
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
