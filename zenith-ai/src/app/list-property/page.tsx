"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
    MapPin, Home, Camera, DollarSign,
    ChevronRight, ChevronLeft, Check, Upload,
    Building2, Bed, Bath, Square, Calendar
} from "lucide-react";

export default function ListPropertyPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        zip: "",
        propertyType: "SFR",
        beds: "",
        baths: "",
        sqft: "",
        yearBuilt: "",
        condition: "Good",
        description: "",
        askingPrice: "",
        photos: [] as string[],
    });

    const totalSteps = 4;

    const steps = [
        { number: 1, title: "Property Address", icon: MapPin },
        { number: 2, title: "Property Details", icon: Home },
        { number: 3, title: "Photos & Description", icon: Camera },
        { number: 4, title: "Pricing", icon: DollarSign },
    ];

    const propertyTypes = [
        { value: "SFR", label: "Single Family", icon: Home },
        { value: "MF", label: "Multi-Family", icon: Building2 },
        { value: "CONDO", label: "Condo/Townhouse", icon: Building2 },
        { value: "LAND", label: "Land/Lot", icon: MapPin },
    ];

    const conditions = ["Excellent", "Good", "Fair", "Needs Work", "Fixer-Upper"];

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        // In a real app, this would submit to the API
        alert("Your listing has been submitted for review! We'll notify you once it's live.");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        List Your Property
                    </h1>
                    <p className="text-gray-600">
                        Create your listing in minutes. It's free to post.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center">
                            <div
                                className={`flex items-center gap-2 ${step >= s.number ? "text-[var(--zenith-blue)]" : "text-gray-400"
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step > s.number
                                            ? "bg-[var(--zenith-blue)] text-white"
                                            : step === s.number
                                                ? "bg-[var(--zenith-blue)] text-white"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                                </div>
                                <span className="hidden md:block text-sm font-medium">{s.title}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-8 md:w-16 h-0.5 mx-2 ${step > s.number ? "bg-[var(--zenith-blue)]" : "bg-gray-200"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                    layout
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Where is your property located?
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="123 Main Street"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Miami"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="FL"
                                                maxLength={2}
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="33101"
                                                maxLength={5}
                                                value={formData.zip}
                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Property Details */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Tell us about your property
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Property Type
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {propertyTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    onClick={() => setFormData({ ...formData, propertyType: type.value })}
                                                    className={`p-4 rounded-xl border-2 text-center transition-all ${formData.propertyType === type.value
                                                            ? "border-[var(--zenith-blue)] bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${formData.propertyType === type.value ? "text-[var(--zenith-blue)]" : "text-gray-400"
                                                        }`} />
                                                    <span className={`text-sm font-medium ${formData.propertyType === type.value ? "text-[var(--zenith-blue)]" : "text-gray-700"
                                                        }`}>
                                                        {type.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Bed className="w-4 h-4 inline mr-1" /> Beds
                                            </label>
                                            <input
                                                type="number"
                                                className="input"
                                                placeholder="3"
                                                value={formData.beds}
                                                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Bath className="w-4 h-4 inline mr-1" /> Baths
                                            </label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                className="input"
                                                placeholder="2"
                                                value={formData.baths}
                                                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Square className="w-4 h-4 inline mr-1" /> Sq Ft
                                            </label>
                                            <input
                                                type="number"
                                                className="input"
                                                placeholder="1,500"
                                                value={formData.sqft}
                                                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-1" /> Year Built
                                            </label>
                                            <input
                                                type="number"
                                                className="input"
                                                placeholder="1995"
                                                value={formData.yearBuilt}
                                                onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Property Condition
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {conditions.map((cond) => (
                                                <button
                                                    key={cond}
                                                    onClick={() => setFormData({ ...formData, condition: cond })}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.condition === cond
                                                            ? "bg-[var(--zenith-blue)] text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {cond}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Photos & Description */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Add photos and description
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Photos
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[var(--zenith-blue)] transition-colors cursor-pointer">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                                            <p className="text-sm text-gray-400">PNG, JPG up to 10MB each</p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Add at least 5 photos. Listings with more photos get 3x more inquiries.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Property Description
                                        </label>
                                        <textarea
                                            className="input min-h-[150px] resize-none"
                                            placeholder="Describe your property. What makes it special? Recent upgrades? Great location features?"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        <p className="text-sm text-gray-500 mt-2">
                                            {formData.description.length}/500 characters
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Pricing */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Set your asking price
                                </h2>

                                <div className="space-y-6">
                                    {/* ZenEstimate Card */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--zenith-blue)] text-white flex items-center justify-center">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">ZenEstimate™</p>
                                                <p className="text-2xl font-bold text-gray-900">$425,000</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Based on recent sales and market data for your area. Use this as a starting point.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Asking Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                                            <input
                                                type="text"
                                                className="input pl-8 text-2xl font-semibold"
                                                placeholder="450,000"
                                                value={formData.askingPrice}
                                                onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Commission Savings */}
                                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                        <h3 className="font-semibold text-green-800 mb-2">Your Estimated Savings</h3>
                                        <p className="text-3xl font-bold text-green-600 mb-2">
                                            ${parseInt(formData.askingPrice?.replace(/,/g, "") || "450000") * 0.06 | 0 || "27,000"}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            By selling directly on Zenith, you avoid the typical 6% agent commission.
                                        </p>
                                    </div>

                                    {/* Legal Notice */}
                                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                        <p>
                                            By listing your property, you agree to our <Link href="/terms" className="text-[var(--zenith-blue)] hover:underline">Terms of Service</Link> and
                                            confirm you are the owner or authorized to sell this property.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`btn btn-secondary ${step === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {step < totalSteps ? (
                            <button onClick={handleNext} className="btn btn-primary">
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Submit Listing
                                <Check className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Benefits */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                    {[
                        { title: "Free to List", desc: "No upfront costs or hidden fees" },
                        { title: "You're in Control", desc: "Set your price, respond to inquiries" },
                        { title: "Save Thousands", desc: "No 6% agent commission" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
