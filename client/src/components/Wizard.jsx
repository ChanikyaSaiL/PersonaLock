import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Consent from './steps/Consent';
import Registration from './steps/Registration';
import FaceUpload from './steps/FaceUpload';
import VoiceRecord from './steps/VoiceRecord';
import Review from './steps/Review';
import Success from './steps/Success';
import { loadAllFiles, loadAllAudio, saveFile, saveAudio, deleteFile, deleteAudio, clearAll } from '../utils/idbStore';

// ─── Session storage keys ───────────────────────────────────────────────────
const STEP_KEY = 'plWizardStep';
const DATA_KEY = 'plWizardData';
const SUBJECT_KEY = 'plSubjectId';

// Fields that can be safely serialized to sessionStorage (no File/Blob objects)
const SERIALIZABLE_FIELDS = ['firstName', 'lastName', 'rollNo', 'gender', 'email', 'age', 'password', 'consent'];

function loadPersistedStep() {
    try {
        const s = sessionStorage.getItem(STEP_KEY);
        const v = s ? parseInt(s, 10) : NaN;
        return isNaN(v) ? 1 : Math.max(1, Math.min(v, 6));
    } catch { return 1; }
}

function loadPersistedData() {
    try {
        const raw = sessionStorage.getItem(DATA_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function loadPersistedSubjectId() {
    try { return sessionStorage.getItem(SUBJECT_KEY) || ''; }
    catch { return ''; }
}

// ───────────────────────────────────────────────────────────────────────────

export default function Wizard() {
    const [step, setStep] = useState(() => loadPersistedStep());
    const [idbReady, setIdbReady] = useState(false); // gate render until IDB loads

    const [formData, setFormData] = useState(() => {
        const persisted = loadPersistedData();
        return {
            firstName: persisted?.firstName || '',
            lastName: persisted?.lastName || '',
            rollNo: persisted?.rollNo || '',
            gender: persisted?.gender || '',
            email: persisted?.email || '',
            age: persisted?.age || '',
            password: persisted?.password || '',
            consent: persisted?.consent ?? false,
            faceImages: {},      // restored from IDB below
            voiceSamples: {},    // restored from IDB below
        };
    });

    const [subjectId, setSubjectId] = useState(() => loadPersistedSubjectId());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // ── Rehydrate binary data from IndexedDB on first mount ──
    useEffect(() => {
        async function rehydrate() {
            try {
                const [files, audio] = await Promise.all([loadAllFiles(), loadAllAudio()]);
                setFormData((prev) => ({
                    ...prev,
                    faceImages: Object.keys(files).length > 0 ? files : prev.faceImages,
                    voiceSamples: Object.keys(audio).length > 0 ? audio : prev.voiceSamples,
                }));
            } catch (err) {
                console.warn('IDB rehydration failed:', err);
            } finally {
                setIdbReady(true);
            }
        }
        rehydrate();
    }, []);

    // ── Persist step whenever it changes ──
    useEffect(() => {
        try { sessionStorage.setItem(STEP_KEY, String(step)); }
        catch { /* storage unavailable */ }
    }, [step]);

    // ── Persist serializable form fields whenever formData changes ──
    useEffect(() => {
        try {
            const toSave = {};
            SERIALIZABLE_FIELDS.forEach((k) => { toSave[k] = formData[k]; });
            sessionStorage.setItem(DATA_KEY, JSON.stringify(toSave));
        } catch { /* storage unavailable */ }
    }, [formData]);

    // ── Persist subjectId ──
    useEffect(() => {
        try {
            if (subjectId) sessionStorage.setItem(SUBJECT_KEY, subjectId);
        } catch { /* storage unavailable */ }
    }, [subjectId]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const clearSession = () => {
        try {
            sessionStorage.removeItem(STEP_KEY);
            sessionStorage.removeItem(DATA_KEY);
            sessionStorage.removeItem(SUBJECT_KEY);
            sessionStorage.removeItem('plVoiceSentenceIdx');
            sessionStorage.removeItem('plFaceUploadView');
        } catch { /* ignore */ }
        clearAll().catch(() => {});
    };

    const resetToRegistration = () => {
        setFormData({
            firstName: '',
            lastName: '',
            rollNo: '',
            gender: '',
            email: '',
            age: '',
            password: '',
            consent: true,
            faceImages: {},
            voiceSamples: {},
        });
        setSubjectId('');
        setSubmitError('');
        setStep(2);
        clearSession();
    };

    const handleFinish = () => {
        clearSession();
        window.location.reload();
    };

    /**
     * updateFormData with automatic IDB persistence for binary fields.
     * For 'faceImages': persist each File entry; delete entries set to null.
     * For 'voiceSamples': persist each Blob entry; delete entries set to null.
     */
    const updateFormData = (key, value) => {
        setFormData((prev) => {
            const next = { ...prev, [key]: value };

            if (key === 'faceImages' && value && typeof value === 'object') {
                Object.entries(value).forEach(([poseId, file]) => {
                    if (file) {
                        saveFile(poseId, file).catch(() => {});
                    } else {
                        deleteFile(poseId).catch(() => {});
                    }
                });
            }

            if (key === 'voiceSamples' && value && typeof value === 'object') {
                Object.entries(value).forEach(([idx, sample]) => {
                    const numIdx = Number(idx);
                    if (sample && sample.blob) {
                        saveAudio(numIdx, sample.blob).catch(() => {});
                    } else {
                        deleteAudio(numIdx).catch(() => {});
                    }
                });
            }

            return next;
        });
    };

    const submitData = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const data = new FormData();
            data.append('firstName', formData.firstName);
            if (formData.lastName) data.append('lastName', formData.lastName);
            data.append('rollNo', formData.rollNo);
            data.append('gender', formData.gender);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('consent', formData.consent.toString());
            if (formData.age) data.append('age', formData.age);

            Object.keys(formData.faceImages).forEach((key) => {
                data.append('images', formData.faceImages[key]);
            });

            Object.keys(formData.voiceSamples).forEach((key) => {
                if (formData.voiceSamples[key]) {
                    data.append('audio', formData.voiceSamples[key].blob, `voice_${key}.webm`);
                }
            });

            await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const id = formData.rollNo + '_' + Math.floor(1000 + Math.random() * 9000);
            setSubjectId(id);
            nextStep();
        } catch (error) {
            console.error(error);
            setSubmitError(error.response?.data?.error || 'An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show a minimal loading state while IDB data is being restored
    if (!idbReady) {
        return (
            <div className="w-full flex items-center justify-center min-h-[200px]">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Consent nextStep={nextStep} formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <Registration nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case 3:
                return <FaceUpload nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case 4:
                return <VoiceRecord nextStep={nextStep} prevStep={prevStep} formData={formData} updateFormData={updateFormData} />;
            case 5:
                return (
                    <div className="relative">
                        <Review submitData={submitData} prevStep={prevStep} formData={formData} />
                        {isSubmitting && (
                            <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm z-50 rounded-xl flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-primary-400 font-medium animate-pulse">Encrypting &amp; Storing Data Securely...</p>
                                <p className="text-gray-400 text-sm mt-2">This may take a moment.</p>
                            </div>
                        )}
                        {submitError && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-xl shadow-lg">
                                {submitError}
                            </div>
                        )}
                    </div>
                );
            case 6:
                return <Success subjectId={subjectId} onFinish={handleFinish} />;
            default:
                return <Consent nextStep={nextStep} formData={formData} updateFormData={updateFormData} />;
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
