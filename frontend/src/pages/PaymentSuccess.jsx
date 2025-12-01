// frontend/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    // You could verify payment here if needed
    console.log('Payment successful for transaction:', tx_ref);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setPaymentData({
        transactionId: tx_ref,
        date: new Date().toLocaleDateString(),
        amount: '10 ETB',
        plan: 'Advanced Plan'
      });
    }, 1500);
  }, [tx_ref]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your subscription has been activated successfully.
        </p>
        
        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="ml-2 font-mono text-gray-800">{paymentData.transactionId}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Plan:</span>
                <span className="ml-2 text-gray-800">{paymentData.plan}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 text-gray-800">{paymentData.amount}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 text-gray-800">{paymentData.date}</span>
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/pricing">
              View Other Plans
            </Link>
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;