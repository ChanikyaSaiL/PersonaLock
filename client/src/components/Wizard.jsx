import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Consent from './steps/Consent';
import Registration from './steps/Registration';
import FaceUpload from './steps/FaceUpload';
import VoiceRecord from './steps/VoiceRecord';
import Review from './steps/Review';
import Success from './steps/Success';

export default function Wizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        rollNo: '',
        branch: '',
        email: '',
        age: '',
        password: '',
        consent: false,
        faceImages: {}, // e.g. { front: file, left: file, ... }
        voiceSamples: {}, // e.g. { 1: url/file, 2: url/file ...}
    });

    const [subjectId, setSubjectId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const resetToRegistration = () => {
        setFormData({
            fullName: '',
            rollNo: '',
            branch: '',
            email: '',
            age: '',
            password: '',
            consent: true, // Keep consent if they are continuing
            faceImages: {},
            voiceSamples: {},
        });
        setSubjectId('');
        setSubmitError('');
        setStep(2); // Bypass consent
    };

    const updateFormData = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const submitData = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('rollNo', formData.rollNo);
            data.append('branch', formData.branch);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('consent', formData.consent.toString());
            if (formData.age) data.append('age', formData.age);

            // Append face images
            Object.keys(formData.faceImages).forEach(key => {
                data.append('images', formData.faceImages[key]);
            });

            // Append voice samples
            Object.keys(formData.voiceSamples).forEach(key => {
                if (formData.voiceSamples[key]) {
                    data.append('audio', formData.voiceSamples[key].blob, `voice_${key}.webm`);
                }
            });

            const response = await axios.post('http://localhost:5000/api/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Assuming backend succeeds
            setSubjectId('AIML_' + new Date().getFullYear() + '_' + Math.floor(Math.random() * 10000));
            nextStep();
        } catch (error) {
            console.error(error);
            setSubmitError(error.response?.data?.error || 'An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Consent nextStep={nextStep} formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <Registration nextStep={nextStep} formData={formData} updateFormData={updateFormData} />;
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
                                <p className="text-primary-400 font-medium animate-pulse">Encrypting & Storing Data Securely...</p>
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
                return <Success subjectId={subjectId} resetToRegistration={resetToRegistration} />;
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
