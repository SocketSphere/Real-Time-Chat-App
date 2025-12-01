// frontend/src/pages/PaymentFailed.jsx
import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');
  const error = searchParams.get('error');

  useEffect(() => {
    console.log('Payment failed for transaction:', tx_ref);
    console.log('Error:', error);
  }, [tx_ref, error]);

  const errorMessages = {
    'verification_failed': 'Payment verification failed. Please contact support.',
    'payment_not_found': 'Payment record not found.',
    'default': 'Your payment could not be processed. Please try again.'
  };

  const getErrorMessage = () => {
    return errorMessages[error] || errorMessages.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Failed 😔
        </h1>
        
        <p className="text-gray-600 mb-4">
          {getErrorMessage()}
        </p>
        
        {tx_ref && (
          <p className="text-sm text-gray-500 mb-6">
            Transaction ID: <span className="font-mono">{tx_ref}</span>
          </p>
        )}
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-red-600 hover:bg-red-700">
            <Link to="/pricing" className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <a href="mailto:support@yourdomain.com">
              Contact Support
            </a>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Common reasons for payment failure:
          </p>
          <ul className="text-xs text-gray-500 mt-2 space-y-1 text-left">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Insufficient funds in your account
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Bank transaction declined
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Network connectivity issues
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Incorrect payment details
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;