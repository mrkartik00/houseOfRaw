import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'sonner';
import { EMAIL, CONTACTNUMBER } from '../Components/Constants/constants';

export default function ContactUsPage() {
    const [inputs, setInputs] = useState({ email: '', feedback: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const submitFeedback = (e) => {
        e.preventDefault();
        setInputs({ email: '', feedback: '' });
        toast.success('Feedback Submitted Successfully 🤗');
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(EMAIL);
        toast.success('Email Copied to Clipboard 📋');
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Hero Section */}
            <section className="w-full shadow-md rounded-xl py-10 px-8 md:px-16 bg-white">
                <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
                <p className="mt-4 text-lg max-w-3xl text-gray-700">
                    Need help or have a suggestion? Whether it's about your order, our products, or feedback —
                    we’re here to help you!
                </p>
            </section>

            {/* Grid Layout */}
            <div className="w-full px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Section */}
                <div className="flex flex-col gap-8">
                    {/* Support */}
                    <div className="shadow-md p-6 rounded-xl bg-white">
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">🛠️ Customer Support</h2>
                        <p className="text-gray-700">
                            Need help with your{' '}
                            <Link to="/profile" className="text-blue-600 font-semibold hover:underline">
                                House of Raw
                            </Link>{' '}
                            account or facing issues? Drop us a message on our{' '}
                            <Link to="#" className="text-blue-600 font-semibold hover:underline">
                                email
                            </Link>{' '}
                            for answers and troubleshooting help.
                        </p>
                    </div>

                    {/* FAQs */}
                    <div className="shadow-md p-6 rounded-xl bg-white">
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">📚 FAQs</h2>
                        <p className="text-gray-700">
                            Looking for instant help? Browse our{' '}
                            <Link to="/faqs" className="text-blue-600 font-semibold hover:underline">
                                FAQ section
                            </Link>{' '}
                            to get answers to common questions.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="shadow-md p-6 rounded-xl bg-white">
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">📞 Contact Information</h2>
                        <div className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">{EMAIL}</span>
                                <button
                                    onClick={copyEmail}
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Copy
                                </button>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center">
                                <span className="text-gray-700">{CONTACTNUMBER}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Feedback Form */}
                <div>
                    <div className="shadow-md p-6 rounded-xl bg-white">
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">🌟 Feedback & Suggestions</h2>
                        <p className="text-gray-700">
                            Have ideas on how we can improve? We'd love to hear from you!
                        </p>
                    </div>

                    <form
                        onSubmit={submitFeedback}
                        className="mt-6 px-6 py-5 pt-2 rounded-xl shadow-md bg-white"
                    >
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                <span className="text-red-500">*</span> Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={inputs.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-md p-3 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Feedback Textarea */}
                        <div className="mb-4">
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                <span className="text-red-500">*</span> Feedback / Suggestion
                            </label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                value={inputs.feedback}
                                onChange={handleChange}
                                placeholder="Let us know what you think!"
                                rows="4"
                                className="w-full border border-gray-300 rounded-md p-3 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300 hover:scale-105"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
