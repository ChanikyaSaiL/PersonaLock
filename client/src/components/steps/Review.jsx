import React from 'react';
import { ClipboardCheck, Check, ChevronLeft, Upload } from 'lucide-react';

export default function Review({ submitData, prevStep, formData }) {
    const faceImageKeys = Object.keys(formData.faceImages || {});
    const voiceSampleKeys = Object.keys(formData.voiceSamples || {});

    return (
        <div className="glass-panel p-8 w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-emerald-400/40">
                    <ClipboardCheck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Final Review</h2>
                <p className="text-gray-400 mt-2">Please confirm all your collected assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Face Images Review */}
                <div className="bg-dark-700/30 rounded-xl p-5 border border-white/5">
                    <h3 className="font-semibold text-lg mb-4 text-primary-400 flex items-center gap-2">
                        Face Images ({faceImageKeys.length}/5)
                    </h3>
                    <ul className="space-y-2">
                        {['front', 'left', 'right', 'neutral', 'smile'].map(pose => (
                            <li key={pose} className="flex items-center text-sm">
                                {formData.faceImages[pose] ? (
                                    <Check className="w-4 h-4 text-green-400 mr-2" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-600 mr-2" />
                                )}
                                <span className={formData.faceImages[pose] ? 'text-gray-200 capitalize' : 'text-gray-500 capitalize line-through'}>{pose}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Voice Samples Review */}
                <div className="bg-dark-700/30 rounded-xl p-5 border border-white/5">
                    <h3 className="font-semibold text-lg mb-4 text-blue-400 flex items-center gap-2">
                        Voice Recordings ({voiceSampleKeys.length}/10)
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                        {[...Array(10)].map((_, i) => (
                            <li key={i} className="flex items-center text-sm">
                                {formData.voiceSamples[i] ? (
                                    <Check className="w-4 h-4 text-green-400 mr-1" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-600 mr-1" />
                                )}
                                <span className={formData.voiceSamples[i] ? 'text-gray-200' : 'text-gray-500'}>Sent. {i + 1}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-white/10 mb-8 flex flex-col items-center justify-center text-center">
                <h4 className="text-gray-300 font-medium mb-2">Total Files Ready for Upload</h4>
                <div className="flex gap-4">
                    <div className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-lg font-semibold border border-primary-500/20">
                        {faceImageKeys.length} Images
                    </div>
                    <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg font-semibold border border-blue-500/20">
                        {voiceSampleKeys.length} Audio Files
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    className="btn-secondary flex items-center gap-2 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <button
                    onClick={submitData}
                    className="btn-primary flex items-center gap-2 group shadow-green-500/20 bg-green-600 hover:bg-green-500"
                >
                    <Upload className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    Submit Dataset
                </button>
            </div>
        </div>
    );
}
