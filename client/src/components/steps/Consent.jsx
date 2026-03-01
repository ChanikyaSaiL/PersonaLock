import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Consent({ nextStep, formData, updateFormData }) {
    return (
        <div className="glass-panel p-8 w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-accent-500/50">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Data Collection System</h1>
                <p className="text-gray-400 text-center uppercase tracking-widest text-sm">Multimodal Biometric Dataset</p>
            </div>

            <div className="bg-dark-700/30 rounded-xl p-6 mb-8 border border-white/5">
                <h3 className="font-semibold text-lg mb-4 text-primary-400">We will collect:</h3>
                <ul className="space-y-3 mb-6 list-disc list-inside text-gray-300">
                    <li>5 Face Images (Various angles and expressions)</li>
                    <li>10 Voice Recordings (Short sentences)</li>
                </ul>

                <h3 className="font-semibold text-lg mb-2 text-primary-400">Purpose:</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                    This data will be used strictly for research and model training purposes.
                    Your identity will be protected and data securely encrypted.
                </p>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer group mb-8 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="relative flex items-center mt-1">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.consent}
                        onChange={(e) => updateFormData('consent', e.target.checked)}
                    />
                    <div className="w-6 h-6 rounded border-2 border-primary-500 bg-transparent peer-checked:bg-primary-500 flex items-center justify-center transition-all">
                        {formData.consent && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
                <span className="text-gray-200 select-none group-hover:text-white transition-colors">
                    I agree to the data collection and consent to the use of my data for research.
                </span>
            </label>

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
