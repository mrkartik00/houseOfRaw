import React from 'react';

const Features = () => {
  const features = [
    'Sustainable, high-quality fabrics',
    'Bold, seasonal collections',
    'Personalized shopping experience',
    'Wishlist & smart recommendations',
    'Secure checkout with UPI, Cards, COD',
    'Fast delivery & seamless returns',
  ];

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Features</h1>
      <ul className="grid sm:grid-cols-2 gap-4 list-disc list-inside">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default Features;
