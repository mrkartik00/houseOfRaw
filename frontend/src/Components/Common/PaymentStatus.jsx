import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, CreditCard } from 'lucide-react';

const PaymentStatusBadge = ({ status, amount, showAmount = true }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'success':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-700 border-green-200',
          text: 'Paid',
          color: 'text-green-600'
        };
      case 'pending':
      case 'processing':
        return {
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          text: 'Pending',
          color: 'text-yellow-600'
        };
      case 'failed':
      case 'declined':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-700 border-red-200',
          text: 'Failed',
          color: 'text-red-600'
        };
      case 'refunded':
        return {
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-700 border-orange-200',
          text: 'Refunded',
          color: 'text-orange-600'
        };
      case 'unpaid':
      case 'cod':
        return {
          icon: CreditCard,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          text: 'COD',
          color: 'text-gray-600'
        };
      default:
        return {
          icon: Clock,
          className: 'bg-gray-100 text-gray-700 border-gray-200',
          text: status || 'Unknown',
          color: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${config.className}`}>
      <IconComponent className="h-4 w-4 mr-1.5" />
      <span>{config.text}</span>
      {showAmount && amount && (
        <span className="ml-2 font-semibold">
          ₹{Number(amount).toLocaleString('en-IN')}
        </span>
      )}
    </div>
  );
};

const PaymentMethodIcon = ({ method, className = "h-5 w-5" }) => {
  const getMethodConfig = (method) => {
    switch (method?.toLowerCase()) {
      case 'razorpay':
      case 'online payment':
      case 'card':
      case 'upi':
        return {
          icon: CreditCard,
          color: 'text-blue-600',
          label: 'Online Payment'
        };
      case 'cod':
      case 'cash on delivery':
        return {
          icon: Clock,
          color: 'text-orange-600',
          label: 'Cash on Delivery'
        };
      default:
        return {
          icon: CreditCard,
          color: 'text-gray-600',
          label: method || 'Unknown'
        };
    }
  };

  const config = getMethodConfig(method);
  const IconComponent = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <IconComponent className={`${className} ${config.color}`} />
      <span className="text-sm text-gray-700">{config.label}</span>
    </div>
  );
};

export { PaymentStatusBadge, PaymentMethodIcon };
