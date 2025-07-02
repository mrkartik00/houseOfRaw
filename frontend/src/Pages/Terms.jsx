import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Understand your rights and responsibilities when shopping at HouseOfRaw.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-gray-700 text-lg">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">2. Product Information</h2>
          <p>
            We strive for accuracy in our product descriptions and pricing. However, we do not guarantee that all information is error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">3. Orders & Payments</h2>
          <p>
            Once an order is placed, it cannot be modified or canceled after 2 hours. We reserve the right to reject or cancel orders due to stock issues or fraud detection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">4. Returns & Refunds</h2>
          <p>
            Returns are accepted within 7 days of delivery if items are unused and in original condition. Refunds are processed to the original payment method within 5-7 business days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-black">5. Intellectual Property</h2>
          <p>
            All content including logos, images, and text is the property of HouseOfRaw and protected by intellectual property laws.
          </p>
        </section>
      </div>
    </div>
  );
}
