import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function FAQpage() {
    const [expanded, setExpanded] = useState(null);
    const faqs = [
        {
            question: 'What is HouseOfRaw?',
            answer: 'HouseOfRaw is your go-to destination for curated fashion and lifestyle products, offering high-quality collections for all styles and occasions. We pride ourselves on bringing you the latest trends and timeless classics.',
            icon: '🏠'
        },
        {
            question: 'How can I track my order?',
            answer: 'After placing an order, you\'ll receive a tracking link via email within 24 hours. You can also check your order status in real-time by logging into your account and visiting "My Orders" section.',
            icon: '📦'
        },
        {
            question: 'Can I return or exchange items?',
            answer: 'Yes! We offer a hassle-free 7-day return and exchange policy on most items. Items must be in original condition with tags attached. Visit our Return Policy page for complete details and exclusions.',
            icon: '🔄'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI payments, Net Banking, and popular digital wallets like Paytm, PhonePe, and Google Pay.',
            icon: '💳'
        },
        {
            question: 'Do you offer COD (Cash on Delivery)?',
            answer: 'Yes, we offer COD on eligible orders above ₹500. This option will be available during checkout if your location is serviceable. COD charges may apply for orders below ₹1000.',
            icon: '💰'
        },
        {
            question: 'Is my personal information secure?',
            answer: 'Absolutely! We use industry-standard SSL encryption and follow strict data protection protocols. Your information is never shared with third parties and is stored securely on our encrypted servers.',
            icon: '🔒'
        },
        {
            question: 'How can I contact customer support?',
            answer: 'You can reach our friendly support team via our Contact Us page, email us at support@houseofraw.com, or call our helpline at +91-XXXXXXXXX (available 9 AM to 9 PM, Monday to Saturday).',
            icon: '📞'
        },
        {
            question: 'Do you offer gift packaging?',
            answer: 'Yes! We offer premium gift packaging options including elegant gift boxes, custom wrapping paper, and personalized messages. Add gift packaging during checkout for just ₹99.',
            icon: '🎁'
        },
        {
            question: 'What are your shipping charges?',
            answer: 'We offer free shipping on orders above ₹999. For orders below ₹999, shipping charges are ₹99 for standard delivery and ₹199 for express delivery (1-2 days).',
            icon: '🚚'
        },
        {
            question: 'How long does delivery take?',
            answer: 'Standard delivery takes 3-7 business days, while express delivery takes 1-2 business days. Delivery times may vary based on your location and product availability.',
            icon: '⏰'
        },
        {
            question: 'How can I apply discount codes?',
            answer: 'Enter your discount code in the "Promo Code" field during checkout. The discount will be automatically applied to your order total. Only one discount code can be used per order.',
            icon: '🎫'
        },
    ];

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Everything you need to know about shopping at HouseOfRaw. 
                            Can't find what you're looking for? We're here to help!
                        </p>
                        <div className="mt-8">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* FAQ Grid */}
                <div className="grid gap-6 md:gap-8">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-300"
                        >
                            <div
                                onClick={() => toggleExpand(index)}
                                className="p-8 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                            {faq.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-300">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            expanded === index
                                                ? 'bg-black text-white rotate-45'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-black'
                                        }`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`mt-6 transition-all duration-500 ease-in-out ${
                                    expanded === index 
                                        ? 'max-h-96 opacity-100' 
                                        : 'max-h-0 opacity-0 overflow-hidden'
                                }`}>
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions Section */}
                <div className="mt-20 bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Our customer support team is here to help you 24/7. 
                            Get in touch and we'll get back to you as soon as possible.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                📧 Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}