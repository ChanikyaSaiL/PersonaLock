import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

export default function Success({ subjectId, resetToRegistration }) {
    return (
        <div className="glass-panel p-10 w-full max-w-lg mx-auto text-center border-green-500/30">
            <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full blur-[40px] animate-pulse shadow-2xl shadow-emerald-500/50"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/60 relative z-10">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-500">Submission Success</h2>
            <p className="text-gray-300 mb-8">
                Your biometric data has been securely encrypted and submitted.
            </p>

            <div className="bg-dark-800 border border-white/5 rounded-xl p-6 mb-8 inline-block shadow-inner w-full">
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Subject ID</p>
                <p className="text-2xl font-mono text-primary-400 font-bold tracking-wider">{subjectId || 'AIML_2026_0045'}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-10">
                <Shield className="w-4 h-4" /> Data stored securely in compliance with consent
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={resetToRegistration}
                    className="btn-primary w-full sm:w-auto"
                >
                    Submit Another Subject
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary w-full sm:w-auto"
                >
                    Finish & Logout
                </button>
            </div>
        </div>
    );
}
