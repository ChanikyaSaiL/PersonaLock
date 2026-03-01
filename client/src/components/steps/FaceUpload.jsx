import React, { useState } from 'react';
import { Camera, CheckCircle, UploadCloud, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const REQUIRED_POSES = [
    { id: 'front', label: 'Front Face' },
    { id: 'left', label: 'Left Angle' },
    { id: 'right', label: 'Right Angle' },
    { id: 'neutral', label: 'Neutral Expression' },
    { id: 'smile', label: 'Smiling' },
];

export default function FaceUpload({ nextStep, prevStep, formData, updateFormData }) {
    const [previews, setPreviews] = useState(
        Object.keys(formData.faceImages).reduce((acc, key) => {
            acc[key] = URL.createObjectURL(formData.faceImages[key]);
            return acc;
        }, {})
    );

    const handleFileChange = (e, poseId) => {
        const file = e.target.files[0];
        if (file) {
            updateFormData('faceImages', { ...formData.faceImages, [poseId]: file });
            setPreviews((prev) => ({ ...prev, [poseId]: URL.createObjectURL(file) }));
        }
    };

    const progress = Object.keys(formData.faceImages).length;
    const isComplete = progress === REQUIRED_POSES.length;

    return (
        <div className="glass-panel p-8 w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-accent-500/40">
                    <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Face Image Upload</h2>
                <p className="text-gray-400 mt-2">Follow the instructions to upload 5 distinct images.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {REQUIRED_POSES.map((pose) => (
                    <div key={pose.id} className="bg-dark-700/50 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:bg-dark-700 transition-colors relative overflow-hidden">
                        {previews[pose.id] ? (
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 border-2 border-accent-500 shadow-xl shadow-accent-500/30 group-hover:scale-105 transition-all duration-300">
                                <img src={previews[pose.id]} alt={pose.label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors">
                                        <UploadCloud className="w-5 h-5 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, pose.id)}
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-accent-500 mb-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-dark-800/50 group-hover:bg-accent-500/10 group-hover:shadow-xl group-hover:shadow-accent-500/20">
                                <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-accent-400 mb-2 transition-colors" />
                                <span className="text-xs text-gray-400 font-medium group-hover:text-accent-300">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, pose.id)}
                                />
                            </label>
                        )}

                        <h4 className="font-medium text-sm text-gray-300">{pose.label}</h4>
                        <div className="mt-2 flex items-center justify-center">
                            {previews[pose.id] ? (
                                <span className="text-xs text-green-400 flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Uploaded</span>
                            ) : (
                                <span className="text-xs text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">Pending</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-dark-800 rounded-xl p-4 mb-8 border border-white/5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Progress: <span className="text-primary-400">{progress} / 5</span> Completed</span>
                <div className="w-1/2 bg-dark-900 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-primary-600 to-blue-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${(progress / 5) * 100}%` }}
                    />
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
                    onClick={nextStep}
                    disabled={!isComplete}
                    className="btn-primary flex items-center gap-2 group"
                >
                    Continue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
