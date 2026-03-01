import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Registration({ nextStep, formData, updateFormData }) {
    const [errors, setErrors] = useState({});

    const validate = () => {
        let newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.rollNo) newErrors.rollNo = "Roll No is required";
        if (!formData.branch) newErrors.branch = "Branch is required";
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
        <div className="glass-panel p-8 w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-primary-500/50">
                    <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">User Registration</h2>
            </div>

            <div className="space-y-5 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                    />
                    {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Roll No / Employee ID *</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. AIML2023"
                            value={formData.rollNo}
                            onChange={(e) => updateFormData('rollNo', e.target.value)}
                        />
                        {errors.rollNo && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.rollNo}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Department / Branch *</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. CSE-AIML"
                            value={formData.branch}
                            onChange={(e) => updateFormData('branch', e.target.value)}
                        />
                        {errors.branch && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.branch}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Age (Optional)</label>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="20"
                        value={formData.age}
                        onChange={(e) => updateFormData('age', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group"
                >
                    Save & Continue
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
