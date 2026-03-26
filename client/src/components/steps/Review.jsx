import React, { useState, useMemo } from 'react';
import {
    ClipboardCheck, Check, ChevronLeft, Upload, Shield, Zap,
    Eye, Mic, ChevronDown, ChevronUp, Play, Image as ImageIcon
} from 'lucide-react';

const POSE_LABELS = {
    front:    'Front-Facing Neutral',
    left:     'Slight Left (~30°)',
    right:    'Slight Right (~30°)',
    smile:    'Smiling Expression',
    lighting: 'Lighting Variation',
};

const POSE_KEYS = Object.keys(POSE_LABELS);

export default function Review({ submitData, prevStep, formData }) {
    const faceImageKeys = Object.keys(formData.faceImages || {});
    const voiceSampleKeys = Object.keys(formData.voiceSamples || {});
    const isComplete = faceImageKeys.length === 5 && voiceSampleKeys.length === 10;

    const [previewOpen, setPreviewOpen] = useState(false);

    // Create stable object-URL previews for face images
    const facePreviews = useMemo(() => {
        const map = {};
        POSE_KEYS.forEach((key) => {
            if (formData.faceImages?.[key]) {
                map[key] = URL.createObjectURL(formData.faceImages[key]);
            }
        });
        return map;
    }, [formData.faceImages]);

    // Create stable object-URL previews for voice samples
    const voicePreviews = useMemo(() => {
        const map = {};
        for (let i = 0; i < 10; i++) {
            if (formData.voiceSamples?.[i]?.blob) {
                map[i] = URL.createObjectURL(formData.voiceSamples[i].blob);
            }
        }
        return map;
    }, [formData.voiceSamples]);

    return (
        <div className="glass-panel p-5 sm:p-8 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-600 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-400/50 relative z-10 animate-float">
                        <ClipboardCheck className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text text-center">Final Review</h2>
                <p className="text-gray-400 text-center text-sm">Verify all your collected assets before submission</p>
            </div>

            {/* Data Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Face Images checklist */}
                <div className="info-card">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-lg text-primary-400 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Face Images
                        </h3>
                        <span className="bg-linear-to-r from-primary-600 to-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            {faceImageKeys.length}/5
                        </span>
                    </div>
                    <ul className="space-y-2.5">
                        {POSE_KEYS.map((pose) => (
                            <li key={pose} className="flex items-center text-sm group transition-all hover:translate-x-1">
                                {formData.faceImages?.[pose] ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-400 mr-3 shrink-0 animate-bounce-gentle" />
                                        <span className="text-gray-200 font-medium">{POSE_LABELS[pose]}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 mr-3 shrink-0" />
                                        <span className="text-gray-500 line-through">{POSE_LABELS[pose]}</span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Voice Samples grid */}
                <div className="info-card">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-lg text-blue-400 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Voice Recordings
                        </h3>
                        <span className="bg-linear-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            {voiceSampleKeys.length}/10
                        </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                    formData.voiceSamples?.[i]
                                        ? 'bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/20'
                                        : 'bg-dark-900/50 border-gray-600/20'
                                }`}
                            >
                                {formData.voiceSamples?.[i] ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <div className="w-3 h-3 rounded-full border border-gray-600" />
                                )}
                                <span className="text-xs text-gray-400 mt-1 font-bold">{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Preview Toggle ── */}
            <button
                onClick={() => setPreviewOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 py-3.5 mb-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
            >
                <span className="flex items-center gap-2 font-semibold text-gray-200 group-hover:text-white">
                    <Eye className="w-4 h-4 text-accent-400" />
                    Preview Your Recordings &amp; Images
                </span>
                {previewOpen
                    ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-transform" />
                }
            </button>

            {/* ── Preview Panel ── */}
            {previewOpen && (
                <div className="mb-8 space-y-7 animate-slide-in-up">

                    {/* Face Image Thumbnails */}
                    <div>
                        <h4 className="text-sm font-bold text-primary-300 mb-3 flex items-center gap-2 uppercase tracking-widest">
                            <ImageIcon className="w-4 h-4" /> Face Images
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {POSE_KEYS.map((key) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-dark-900/60">
                                        {facePreviews[key] ? (
                                            <img
                                                src={facePreviews[key]}
                                                alt={POSE_LABELS[key]}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-gray-600" />
                                            </div>
                                        )}
                                        {facePreviews[key] && (
                                            <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center leading-tight">{POSE_LABELS[key]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Voice Sample Players */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2 uppercase tracking-widest">
                            <Mic className="w-4 h-4" /> Voice Recordings
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all ${
                                        voicePreviews[i]
                                            ? 'bg-blue-500/10 border-blue-500/30'
                                            : 'bg-white/5 border-white/10 opacity-50'
                                    }`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${voicePreviews[i] ? 'bg-blue-500/30' : 'bg-gray-700/50'}`}>
                                        {voicePreviews[i]
                                            ? <Mic className="w-3.5 h-3.5 text-blue-300" />
                                            : <span className="text-[10px] text-gray-500 font-bold">{i + 1}</span>
                                        }
                                    </div>
                                    <span className="text-xs text-gray-300 font-semibold shrink-0 w-16">Take {i + 1}</span>
                                    {voicePreviews[i] ? (
                                        <audio
                                            src={voicePreviews[i]}
                                            controls
                                            className="flex-1 h-7 accent-blue-400"
                                            style={{ minWidth: 0 }}
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-500 italic">Not recorded</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Card */}
            <div className="bg-linear-to-r from-primary-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-primary-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-gray-300 font-bold mb-2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-400" />
                            Submission Readiness
                        </h4>
                        <p className="text-gray-400 text-sm">
                            {isComplete
                                ? '✓ All assets collected successfully. Ready for submission!'
                                : `Collect ${5 - faceImageKeys.length} more face image(s) and ${10 - voiceSampleKeys.length} more voice sample(s)`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Files Count */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-linear-to-br from-primary-600/30 to-primary-500/10 rounded-2xl p-5 border border-primary-500/20 text-center">
                    <p className="text-gray-400 text-sm font-medium mb-2">Face Images</p>
                    <p className="text-4xl font-black gradient-text">{faceImageKeys.length}</p>
                </div>
                <div className="bg-linear-to-br from-blue-600/30 to-blue-500/10 rounded-2xl p-5 border border-blue-500/20 text-center">
                    <p className="text-gray-400 text-sm font-medium mb-2">Voice Recordings</p>
                    <p className="text-4xl font-black gradient-text">{voiceSampleKeys.length}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={prevStep}
                    className="btn-secondary flex items-center gap-2 group font-bold"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <button
                    onClick={submitData}
                    disabled={!isComplete}
                    className="btn-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none font-bold"
                >
                    <Upload className="w-4 h-4" />
                    Encrypt &amp; Submit
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
