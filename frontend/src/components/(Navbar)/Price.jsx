// src/components/(Navbar)/Price.jsx
import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const Price = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [loading, setLoading] = useState(false)
  
  // Get user from Redux store
  const { user, token } = useSelector((state) => state.auth)

  const plans = [
    {
      name: "Free",
      price: { monthly: "Br 0", yearly: "Br 0" },
      features: ["Basic messaging", "1 group chat", "Limited file sharing"],
      popular: false,
    },
    {
      name: "Advanced",
      price: { monthly: "Br 10", yearly: "Br 100" },
      priceValue: { monthly: 10, yearly: 100 },
      features: [
        "Unlimited messaging",
        "Unlimited groups",
        "File sharing up to 1GB",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Pro",
      price: { monthly: "Br 20", yearly: "Br 180" },
      priceValue: { monthly: 20, yearly: 180 },
      features: [
        "Everything in Advanced",
        "Custom themes",
        "Analytics dashboard",
        "24/7 support",
      ],
      popular: false,
    },
  ]

  // Function to handle subscription
  const handleSubscribe = async (plan) => {
    if (plan.name === "Free") {
      // Handle free plan signup
      toast.success("Free plan activated! You can now enjoy our basic features.")
      return
    }
    
    if (!user || !token) {
      toast.error("Please log in to subscribe to a plan.")
      return;
    }

    setLoading(true)

    try {
      // Call backend to initialize payment
      const response = await fetch('http://localhost:5000/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: plan.priceValue[billingCycle],
          planName: plan.name,
          billingCycle: billingCycle,
          currency: 'ETB',
        }),
      })

      const paymentData = await response.json()

      if (paymentData.success && paymentData.data.checkout_url) {
        // Redirect to Chapa payment page
        toast.loading("Redirecting to payment page...")
        window.location.href = paymentData.data.checkout_url
      } else {
        throw new Error(paymentData.message || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pricing">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-slate-400 to-red-300 rounded-md p-2 px-2 dark:from-gray-200 dark:to-gray-100">
          Subscription Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Choose a plan that fits your needs
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              billingCycle === "monthly"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              billingCycle === "yearly"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            Yearly{" "}
            <span className="ml-1 text-green-500 font-semibold">Save 20%</span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3 w-full max-w-6xl">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between border-2 ${
                plan.popular ? "border-blue-500 shadow-lg" : "border-gray-200"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge className="bg-blue-500">Popular</Badge>}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">
                  {plan.price[billingCycle]}
                  <span className="text-base font-medium text-gray-500">
                    /{billingCycle}
                  </span>
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="text-gray-700 dark:text-gray-300 text-sm"
                    >
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""
                  }`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading}
                >
                  {loading ? "Processing..." : plan.name === "Free" ? "Get Started" : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Price