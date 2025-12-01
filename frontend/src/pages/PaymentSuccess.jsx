// frontend/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const tx_ref = searchParams.get('tx_ref');
  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  const billingCycle = searchParams.get('billingCycle');

  useEffect(() => {
    console.log('Payment success page loaded with:', {
      tx_ref,
      plan,
      amount,
      currency,
      billingCycle
    });

    // If we have data from URL params, use it
    if (tx_ref && plan && amount) {
      setPaymentData({
        transactionId: tx_ref,
        plan: plan,
        amount: `${amount} ${currency || 'ETB'}`,
        billingCycle: billingCycle || 'monthly',
        date: new Date().toLocaleDateString(),
      });
      setLoading(false);
    } else {
      // If no data in URL, try to fetch it
      fetchPaymentDetails();
    }
  }, [tx_ref, plan, amount, currency, billingCycle]);

  const fetchPaymentDetails = async () => {
    if (!tx_ref) {
      toast.error('No transaction reference found');
      navigate('/pricing');
      return;
    }

    try {
      setVerifying(true);
      
      // You could also call your backend to verify
      // const response = await fetch(`http://localhost:5000/api/payments/verify-details?tx_ref=${tx_ref}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // For now, use URL params or show loading
      setTimeout(() => {
        setPaymentData({
          transactionId: tx_ref,
          plan: plan || 'Subscription Plan',
          amount: amount ? `${amount} ${currency || 'ETB'}` : 'Processing...',
          billingCycle: billingCycle || 'monthly',
          date: new Date().toLocaleDateString(),
        });
        setLoading(false);
        setVerifying(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to load payment details');
      setLoading(false);
      setVerifying(false);
    }
  };

  const verifyPaymentManually = async () => {
    if (!tx_ref) return;
    
    try {
      setVerifying(true);
      const response = await fetch(`http://localhost:5000/api/payments/verify-manual?tx_ref=${tx_ref}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Payment verified successfully!');
        setPaymentData(data.payment);
      } else {
        toast.error('Payment verification failed');
      }
    // Option 2: Keep error but prefix with underscore
    } catch (_error) {
      console.error('Error fetching payment details:', _error);
      toast.error('Failed to load payment details');
      setLoading(false);
      setVerifying(false);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading payment details...</p>
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
          Thank you for your payment. Your {paymentData?.plan?.toLowerCase()} plan has been activated successfully.
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
                <span className="text-gray-500">Billing Cycle:</span>
                <span className="ml-2 text-gray-800 capitalize">{paymentData.billingCycle}</span>
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
          <Button 
            onClick={verifyPaymentManually} 
            disabled={verifying}
            variant="outline" 
            className="w-full"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Payment Again'
            )}
          </Button>
          
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
          <br />
          Your subscription is now active!
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;