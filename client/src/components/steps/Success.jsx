import React, { useState } from 'react';
import { CheckCircle, Shield, Star, Send, LogOut, ThumbsUp, MessageSquare } from 'lucide-react';

function FeedbackForm({ subjectId, onDone }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        // Simulate a brief async submission
        await new Promise((r) => setTimeout(r, 900));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center gap-4 py-6 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center shadow-xl shadow-accent-500/40 animate-float">
                    <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Thank you for your feedback!</h3>
                <p className="text-gray-400 text-sm text-center max-w-xs">
                    Your input helps us improve PersonaLock for everyone.
                </p>
                <button
                    onClick={onDone}
                    className="btn-secondary flex items-center gap-2 mt-2 font-bold group"
                >
                    <LogOut className="w-4 h-4" />
                    Finish &amp; Exit
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Star Rating */}
            <p className="text-gray-400 text-sm mb-3 font-medium">How was your experience?</p>
            <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform duration-150 hover:scale-125 focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                    >
                        <Star
                            className={`w-9 h-9 transition-colors duration-150 ${
                                star <= (hovered || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                            }`}
                        />
                    </button>
                ))}
            </div>
            {(hovered || rating) > 0 && (
                <p className="text-yellow-400 text-xs font-semibold mb-4 text-center tracking-wide">
                    {ratingLabels[hovered || rating]}
                </p>
            )}

            {/* Comment Box */}
            <div className="relative mt-3 mb-5">
                <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-gray-500 pointer-events-none" />
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share any comments or suggestions (optional)…"
                    rows={3}
                    className="w-full bg-dark-800/70 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-accent-500/60 focus:ring-1 focus:ring-accent-500/30 transition-all"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {submitting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting…
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Submit Feedback
                    </>
                )}
            </button>
            <p className="text-gray-600 text-xs mt-2 text-center">Select a star rating to submit</p>
        </div>
    );
}

export default function Success({ subjectId, onFinish }) {
    const [feedbackDone, setFeedbackDone] = useState(false);

    const handleFinish = () => {
        // Clear persisted session and reload to landing
        sessionStorage.removeItem('plWizardStep');
        sessionStorage.removeItem('plWizardData');
        if (onFinish) onFinish();
        else window.location.reload();
    };

    return (
        <div className="glass-panel p-5 sm:p-10 w-full max-w-2xl mx-auto text-center border-green-500/30">
            {/* Success Icon */}
            <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full blur-[50px] animate-pulse shadow-2xl shadow-emerald-500/50"></div>
                <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/60 relative z-10 animate-float">
                    <CheckCircle className="w-14 h-14 text-white" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 gradient-text">Submission Success!</h2>
            <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                Your biometric data has been successfully encrypted and securely submitted to our database.
            </p>

            {/* Subject ID Card */}
            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 mb-8 shadow-2xl">
                <p className="text-gray-400 uppercase tracking-widest mb-3 text-xs font-bold">Your Subject ID</p>
                <p className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 tracking-wider break-all">
                    {subjectId}
                </p>
                <p className="text-gray-500 text-sm mt-3">Keep this ID for future reference and data access</p>
            </div>

            {/* Confirmation */}
            <div className="bg-dark-800/50 border border-green-500/20 rounded-xl p-5 mb-8 flex items-center gap-3 justify-center">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">✓ Data stored securely in compliance with your consent preferences</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="info-card text-center">
                    <p className="text-gray-400 text-sm mb-2">Face Images</p>
                    <p className="text-3xl font-bold text-primary-400">5</p>
                </div>
                <div className="info-card text-center">
                    <p className="text-gray-400 text-sm mb-2">Voice Samples</p>
                    <p className="text-3xl font-bold text-blue-400">10</p>
                </div>
                <div className="info-card text-center">
                    <p className="text-gray-400 text-sm mb-2">Encryption</p>
                    <p className="text-3xl font-bold text-emerald-400">AES</p>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-gradient-to-br from-accent-900/30 to-primary-900/20 border border-accent-500/20 rounded-2xl p-7 mb-8">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    Share Your Feedback
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    Help us improve the PersonaLock experience.
                </p>
                <FeedbackForm subjectId={subjectId} onDone={handleFinish} />
            </div>

            {/* Skip feedback */}
            {!feedbackDone && (
                <button
                    onClick={handleFinish}
                    className="text-gray-500 hover:text-gray-300 text-sm transition-colors underline underline-offset-2"
                >
                    Skip &amp; Exit
                </button>
            )}

            {/* Footer */}
            <p className="text-gray-600 text-xs mt-8">
                © 2026 PersonaLock Biometric System. All data is protected under encryption standards.
            </p>
        </div>
    );
}
