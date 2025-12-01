// src/components/PaymentSuccess.jsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const txRef = searchParams.get('tx_ref')

  useEffect(() => {
    // You can verify payment here or show success message
    console.log('Payment successful for:', txRef)
  }, [txRef])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h2>
        <p>Your subscription has been activated successfully.</p>
      </div>
    </div>
  )
}

export default PaymentSuccess