import React, { useState } from 'react';
import {
    Camera, CheckCircle, UploadCloud, ChevronLeft, ChevronRight, Check,
    Image as ImageIcon, Info, Sun, XCircle, ArrowRight, Eye
} from 'lucide-react';

// Import local images
import doLighting from '../../assets/do-lighting.jpg';
import doBackground from '../../assets/do-background.jpg';
import doClearFace from '../../assets/do-clear-face.jpg';
import doFrame from '../../assets/do-frame.jpg';
import doResolution from '../../assets/do-resolution.jpg';
import dontFilters from '../../assets/dont-filters-new.png';
import dontShadows from '../../assets/dont-shadows.jpg';
import dontBlurry from '../../assets/dont-blurry.jpg';
import dontTilted from '../../assets/dont-tilted.jpg';
import dontObjects from '../../assets/dont-objects.jpg';

// Import pose reference images
import poseFrontNeutral from '../../assets/pose-front-neutral.png';
import poseLeftTurn from '../../assets/pose-left-turn.png';
import poseRightTurn from '../../assets/pose-right-turn.png';
import poseSmiling from '../../assets/pose-smiling.png';
import poseLightingVariation from '../../assets/pose-lighting-variation.png';

const REQUIRED_POSES = [
    {
        id: 'front',
        label: 'Front-Facing Neutral',
        icon: '🧑',
        image: poseFrontNeutral,
        description: 'Look directly into the camera with your face centered.',
        tip: 'Keep your head straight — no tilt left or right.',
        example: 'Chin level, eyes open, both ears visible.',
        instruction: 'Look straight into the camera with a neutral expression. Ensure your face is clearly visible and well-lit.',
    },
    {
        id: 'left',
        label: 'Slight Left Turn (~30°)',
        icon: '↙️',
        image: poseLeftTurn,
        description: 'Turn your face about 30° to the LEFT of the camera.',
        tip: 'Your left cheek should be more prominent.',
        example: 'Left ear fully visible, right ear barely visible.',
        instruction: 'Turn your face slightly to the left (around 30 degrees). Keep both eyes visible and face clearly in frame.',
    },
    {
        id: 'right',
        label: 'Slight Right Turn (~30°)',
        icon: '↘️',
        image: poseRightTurn,
        description: 'Turn your face about 30° to the RIGHT of the camera.',
        tip: 'Your right cheek should be more prominent.',
        example: 'Right ear fully visible, left ear barely visible.',
        instruction: 'Turn your face slightly to the right (around 30 degrees). Ensure full face visibility.',
    },
    {
        id: 'smile',
        label: 'Smiling Expression',
        icon: '😊',
        image: poseSmiling,
        description: 'Front-facing shot with a natural, genuine smile.',
        tip: 'A broad smile showing teeth works best.',
        example: 'Both cheeks raised, no exaggerated expression.',
        instruction: 'Look at the camera and smile naturally. Avoid exaggerated expressions.',
    },
    {
        id: 'lighting',
        label: 'Lighting Variation (Well-Lit)',
        icon: '☀️',
        image: poseLightingVariation,
        description: 'Photo with different lighting — indoor warm or side lighting.',
        tip: 'Face must be well-lit; expression can be smiling or neutral.',
        example: 'Warm indoor light or side lighting, face clearly visible.',
        instruction: 'Capture a photo with slightly different lighting (e.g., indoor warm light or side lighting). The face must remain clearly visible and well-lit. The person may be smiling or neutral — focus is on lighting variation, not expression.',
    },
];

const DOS = [
    { 
        text: 'Ensure bright, even lighting — face the light source', 
        image: doLighting
    },
    { 
        text: 'Use a plain, light-coloured background', 
        image: doBackground
    },
    { 
        text: 'Keep face clear - remove glasses and masks', 
        image: doClearFace
    },
    { 
        text: 'Keep your entire face within the frame', 
        image: doFrame
    },
    { 
        text: 'Use a high-resolution, in-focus photo', 
        image: doResolution
    },
];

const DONTS = [
    { 
        text: 'No heavy filters, makeup, or face paint', 
        image: dontFilters
    },
    { 
        text: 'No shadows across your face - ensure even lighting', 
        image: dontShadows
    },
    { 
        text: 'Avoid blurry or low-quality images', 
        image: dontBlurry
    },
    { 
        text: 'Do not tilt your head more', 
        image: dontTilted
    },
    { 
        text: 'No other people or objects in the frame', 
        image: dontObjects
    },
];

/* ─── Guidelines Screen ────────────────────────────────────────────── */
function PhotoGuide({ onContinue, onBack }) {
    return (
        <div className="glass-panel p-5 sm:p-8 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-primary-600 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-primary-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 relative z-10 animate-float">
                        <Info className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text text-center">Photo Upload Guide</h2>
                <p className="text-gray-400 mt-2 text-center max-w-lg leading-relaxed">
                    Please read the guidelines carefully before uploading. High-quality, correctly posed images are essential for accurate biometric recognition.
                </p>
            </div>

            {/* Required Poses */}
            <div className="mb-10">
                {/* Section Header */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-accent-400" />
                        Upload Images as per Required Poses
                    </h3>
                    <p className="text-gray-400 text-sm ml-7">
                        Follow the examples below to ensure high-quality biometric data.
                    </p>
                </div>

                {/* Pose Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {REQUIRED_POSES.map((pose, idx) => (
                        <div
                            key={pose.id}
                            className="group relative bg-dark-800/60 border border-white/10 rounded-2xl overflow-hidden hover:border-accent-500/50 hover:shadow-xl hover:shadow-accent-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            {/* Badge */}
                            <div className="absolute top-2.5 left-2.5 z-10 bg-accent-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest shadow">
                                Photo {idx + 1}
                            </div>

                            {/* Reference Image */}
                            <div className="relative w-full aspect-square overflow-hidden bg-dark-900">
                                <img
                                    src={pose.image}
                                    alt={pose.label}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Subtle gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-white text-sm mb-2 leading-snug">{pose.label}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed flex-1">{pose.instruction}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dos & Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* Dos */}
                <div className="bg-linear-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6">
                    <h3 className="font-bold text-green-400 mb-5 flex items-center gap-2 text-lg">
                        <Sun className="w-5 h-5" /> ✓ Do's
                    </h3>
                    <div className="space-y-3">
                        {DOS.map((item, i) => (
                            <div key={i} className="bg-green-500/10 hover:bg-green-500/20 rounded-lg overflow-hidden transition-all duration-200 border border-green-500/20 group hover:shadow-lg hover:shadow-green-500/20">
                                <div className="flex gap-3 p-3">
                                    <div className="shrink-0">
                                        <img 
                                            src={item.image} 
                                            alt={item.text}
                                            className="w-20 h-20 rounded-lg object-cover border border-green-400/30"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Don'ts */}
                <div className="bg-linear-to-br from-red-900/30 to-pink-900/20 border border-red-500/30 rounded-2xl p-6">
                    <h3 className="font-bold text-red-400 mb-5 flex items-center gap-2 text-lg">
                        <XCircle className="w-5 h-5" /> ✗ Don'ts
                    </h3>
                    <div className="space-y-3">
                        {DONTS.map((item, i) => (
                            <div key={i} className="bg-red-500/10 hover:bg-red-500/20 rounded-lg overflow-hidden transition-all duration-200 border border-red-500/20 group hover:shadow-lg hover:shadow-red-500/20">
                                <div className="flex gap-3 p-3">
                                    <div className="shrink-0">
                                        <img 
                                            src={item.image} 
                                            alt={item.text}
                                            className="w-20 h-20 rounded-lg object-cover border border-red-400/30 opacity-75"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pro Tip Banner */}
            <div className="bg-linear-to-r from-accent-600/20 to-primary-600/20 border border-accent-500/30 rounded-2xl p-6 mb-10 flex items-start gap-4">
                <div className="p-3 bg-accent-500/30 rounded-full shrink-0">
                    <Camera className="w-6 h-6 text-accent-300" />
                </div>
                <div>
                    <p className="text-accent-300 font-semibold mb-1">💡 Pro Tip</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Sit near a window in daylight for the best natural lighting. Make sure your camera is at eye-level for a straight front-facing shot. The lighting should be even across your face with no harsh shadows.
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="btn-secondary flex items-center gap-2 group font-bold"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <button
                    onClick={onContinue}
                    className="btn-primary flex items-center gap-2 group font-bold"
                >
                    Start Uploading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

/* ─── Upload Screen ─────────────────────────────────────────────────── */
function PhotoUpload({ nextStep, prevStep, formData, updateFormData, onShowGuide }) {
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
        <div className="glass-panel p-5 sm:p-8 w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-linear-to-br from-accent-500 to-primary-600 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-linear-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center shadow-2xl shadow-accent-500/50 relative z-10 animate-float">
                        <Camera className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text text-center">Face Image Upload</h2>
                <p className="text-gray-400 mt-2 text-center text-sm">
                    Upload 5 distinct photos as per the guide.{' '}
                    <button
                        onClick={onShowGuide}
                        className="text-accent-400 font-bold underline underline-offset-2 hover:text-accent-300 transition-colors"
                    >
                        View upload guide
                    </button>
                </p>
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {REQUIRED_POSES.map((pose) => (
                    <div
                        key={pose.id}
                        className="group"
                    >
                        {previews[pose.id] ? (
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-accent-500 shadow-xl shadow-accent-500/30 hover:shadow-2xl hover:shadow-accent-500/50 transition-all duration-300 hover:scale-105 transform">
                                <img src={previews[pose.id]} alt={pose.label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacityacity">
                                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110">
                                        <UploadCloud className="w-6 h-6 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, pose.id)}
                                        />
                                    </label>
                                    <span className="text-xs text-white mt-2 font-bold">{pose.label}</span>
                                </div>
                                <div className="absolute top-2 right-2 bg-linear-to-r from-green-500 to-emerald-600 rounded-full p-1.5 shadow-lg">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        ) : (
                            <label className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-600 hover:border-accent-500 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 bg-linear-to-br from-dark-800/50 to-dark-900/50 group-hover:from-accent-500/10 group-hover:to-accent-600/10 group-hover:shadow-xl group-hover:shadow-accent-500/20 shadow-md">
                                <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-accent-400 mb-2 transition-colors" />
                                <span className="text-xs text-gray-400 font-bold text-center group-hover:text-accent-300 px-2 leading-tight">{pose.label}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, pose.id)}
                                />
                            </label>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="bg-linear-to-r from-primary-600/15 to-accent-600/15 backdrop-blur-sm rounded-2xl p-5 mb-8 border border-primary-500/20">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-primary-400" />
                        Upload Progress
                    </span>
                    <span className="text-sm font-bold text-primary-400 bg-dark-800/80 px-4 py-1 rounded-full">{progress} / 5</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(progress / 5) * 100}%` }}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
                <button onClick={prevStep} className="btn-secondary flex items-center gap-2 group font-bold">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!isComplete}
                    className="btn-primary flex items-center gap-2 group font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

/* ─── Main Exported Component ───────────────────────────────────────── */
export default function FaceUpload({ nextStep, prevStep, formData, updateFormData }) {
    // 'guide' shows first; 'upload' shows after user clicks "Start Uploading"
    const [view, setView] = useState('guide');

    if (view === 'guide') {
        return (
            <PhotoGuide
                onContinue={() => setView('upload')}
                onBack={prevStep}
            />
        );
    }

    return (
        <PhotoUpload
            nextStep={nextStep}
            prevStep={() => setView('guide')}
            formData={formData}
            updateFormData={updateFormData}
            onShowGuide={() => setView('guide')}
        />
    );
}
