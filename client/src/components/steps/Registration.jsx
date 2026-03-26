import React, { useState } from 'react';
import { UserPlus, AlertCircle, Mail, Lock, User, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Registration({ nextStep, prevStep, formData, updateFormData }) {
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        if (!formData.firstName) newErrors.firstName = "First Name is required";
        if (!formData.rollNo) newErrors.rollNo = "Roll No is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

    return (
        <div className="glass-panel p-5 sm:p-8 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-linear-to-br from-primary-500 to-accent-500 rounded-full blur-[30px] opacity-50"></div>
                    <div className="w-24 h-24 bg-linear-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-primary-500/50 relative z-10 animate-float">
                        <UserPlus className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 gradient-text">User Registration</h2>
                <p className="text-gray-400 text-center text-sm">Complete your profile information</p>
            </div>

            <div className="space-y-6 mb-8">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-400" />
                            First Name *
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Rohit"
                            value={formData.firstName}
                            onChange={(e) => updateFormData('firstName', e.target.value)}
                        />
                        {errors.firstName && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-bounce-gentle"><AlertCircle className="w-3 h-3" />{errors.firstName}</p>}
                    </div>
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-400" />
                            Last Name (Optional)
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="sharma"
                            value={formData.lastName || ''}
                            onChange={(e) => updateFormData('lastName', e.target.value)}
                        />
                    </div>
                </div>

                {/* Roll No & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-accent-400" />
                            Roll No / Faculty ID *
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. 22071A6671 or FAC-001"
                            value={formData.rollNo}
                            onChange={(e) => updateFormData('rollNo', e.target.value)}
                        />
                        {errors.rollNo && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-bounce-gentle"><AlertCircle className="w-3 h-3" />{errors.rollNo}</p>}
                    </div>
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-accent-400" />
                            Gender *
                        </label>
                        <select
                            className="input-field"
                            value={formData.gender || ''}
                            onChange={(e) => updateFormData('gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-bounce-gentle"><AlertCircle className="w-3 h-3" />{errors.gender}</p>}
                    </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary-400" />
                            Email *
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="rohit.sharma@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-bounce-gentle"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                    </div>
                    <div className="group">
                        <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-accent-400" />
                            Password *
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-2 flex items-center gap-1 animate-bounce-gentle"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
                    </div>
                </div>

                {/* Age */}
                <div className="group">
                    <label className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary-400" />
                        Age (Optional)
                    </label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="20"
                        value={formData.age}
                        onChange={(e) => updateFormData('age', e.target.value)}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 pt-4">
                <button
                    onClick={prevStep}
                    className="btn-secondary flex items-center gap-2 group font-bold"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 group font-bold"
                >
                    Save & Continue
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
