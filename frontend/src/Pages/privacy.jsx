import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Your privacy matters. Learn how we protect and use your information at HouseOfRaw.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-gray-700 text-lg">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">1. Information We Collect</h2>
          <p>
            We collect information such as your name, email address, phone number, and payment details to process your orders and improve your experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">2. How We Use Your Data</h2>
          <p>
            Your data helps us fulfill orders, personalize recommendations, send updates, and improve our website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">3. Data Protection</h2>
          <p>
            We use SSL encryption and secure storage practices to protect your personal information from unauthorized access or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">4. Third-Party Services</h2>
          <p>
            We may use third-party services for analytics and payment processing. These services are contractually obligated to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. Contact us at support@houseofraw.com for assistance.
          </p>
        </section>
      </div>
    </div>
  );
}
