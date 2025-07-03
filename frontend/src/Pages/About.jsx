import { Link } from 'react-router-dom';
import React from 'react';

function FeatureCard({ title, description }) {
  return (
    <div className="shadow-md rounded-xl p-6 text-center bg-white">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
}

function PrivacyCard({ title, description }) {
  return (
    <div className="shadow-md rounded-xl p-6 bg-white">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="w-full shadow-md rounded-xl py-10 px-8 md:px-16 bg-white">
        <h1 className="text-4xl font-bold text-gray-900">About House of Raw</h1>
        <p className="mt-4 text-lg max-w-3xl text-gray-700">
          <strong>House of Raw</strong> is a fashion-forward ecommerce brand dedicated to delivering premium clothing,
          timeless essentials, and bold statement pieces to style-conscious individuals. We believe in raw originality,
          ethical sourcing, and expressive design that empowers you to wear your confidence.
        </p>
      </section>

      {/* Mission & Origin */}
      <div className="w-full px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-3 text-gray-700">
            We aim to redefine modern style with authenticity. Our mission is to offer trend-driven fashion without
            compromising on quality or sustainability. Whether it's everyday essentials or limited edition collections,
            our pieces are crafted to complement your individuality.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">How We Started</h2>
          <p className="mt-3 text-gray-700">
            House of Raw was born out of a passion for bold aesthetics and a frustration with fast fashion. What started
            as a small design studio has evolved into a curated online store where craftsmanship meets culture, and
            every product tells a story.
          </p>
        </div>
      </div>

      {/* Features */}
      <section className="w-full px-8 md:px-16 py-10 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Why Shop With Us?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard title="🧵 Premium Quality" description="Our fabrics and finishes are hand-selected for comfort, durability, and aesthetics." />
          <FeatureCard title="🚚 Fast & Reliable Delivery" description="Swift nationwide shipping with order tracking and easy returns." />
          <FeatureCard title="💳 Secure Payments" description="Multiple payment options with industry-standard encryption and safety." />
          <FeatureCard title="🎁 Limited Drops" description="Stay ahead of the curve with exclusive seasonal and capsule collections." />
          <FeatureCard title="📞 Customer Support" description="Have a question? Our responsive team is here to help via email or WhatsApp." />
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="w-full px-8 md:px-16 py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <PrivacyCard title="🔐 Data Protection" description="We never share your personal data. All information is safely stored and encrypted." />
          <PrivacyCard title="🔒 Secure Checkout" description="Your transactions are protected with end-to-end SSL encryption." />
          <PrivacyCard title="📁 Order History" description="Track your orders and manage returns easily from your profile dashboard." />
          <PrivacyCard title="✅ Trusted by Customers" description="Our growing community trusts us for consistent quality and safe shopping." />
        </div>
      </section>

      {/* Contact Us */}
      <section className="w-full px-8 md:px-16 py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
        <p className="mt-3 text-gray-700">
          Have questions, feedback, or collaboration ideas? Reach out to us via{' '}
          <Link
            to="https://instagram.com/houseofraw" // replace with your real link
            target="_blank"
            className="text-blue-500 font-medium hover:underline"
          >
            Instagram
          </Link>{' '}
          or send us a message through the contact page.
        </p>
      </section>
    </div>
  );
}
