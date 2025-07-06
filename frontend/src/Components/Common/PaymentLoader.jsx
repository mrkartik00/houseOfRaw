import React from 'react';
import { CreditCard, Shield, CheckCircle2 } from 'lucide-react';

const PaymentLoader = ({ message = "Processing your payment..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        {/* Animated Icons */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="animate-bounce delay-0">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <div className="animate-bounce delay-150">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <div className="animate-bounce delay-300">
            <CheckCircle2 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Secure Payment Processing
        </h3>
        <p className="text-gray-600 mb-4">
          {message}
        </p>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
            <Shield className="h-4 w-4" />
            <span className="font-medium">256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLoader;
