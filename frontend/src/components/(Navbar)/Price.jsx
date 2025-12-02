import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

const Price = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [loadingPlan, setLoadingPlan] = useState(null) // Track which plan is loading
  
  // Get user from Redux store
  const { user, token } = useSelector((state) => state.auth)

  const plans = [
    {
      id: "free", // Add unique ID for each plan
      name: "Free",
      price: { monthly: "Br 0", yearly: "Br 0" },
      features: ["Basic messaging", "1 group chat", "Limited file sharing"],
      popular: false,
    },
    {
      id: "advanced",
      name: "Advanced",
      price: { monthly: "Br 10", yearly: "Br 96" },
      priceValue: { monthly: 10, yearly: 96 },
      features: [
        "Unlimited messaging",
        "Unlimited groups",
        "File sharing up to 1GB",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "pro",
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

    // Set loading for this specific plan
    setLoadingPlan(plan.id)

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
      // Clear loading for this plan
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Select a subscription that matches your needs. All plans include our core features with flexible billing options.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-4 mb-12 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-gray-900 dark:bg-blue-600 text-white shadow-lg"
                : "bg-transparent text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-gray-900 dark:bg-blue-600 text-white shadow-lg"
                : "bg-transparent text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Yearly Billing
            <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-3 w-full max-w-6xl">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                plan.popular 
                  ? "border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-blue-900/30 relative" 
                  : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price[billingCycle]}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mt-1">
                    per {billingCycle === "monthly" ? "month" : "year"}
                  </div>
                  {plan.name !== "Free" && billingCycle === "yearly" && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Equivalent to Br {plan.priceValue[billingCycle]/12}/month
                    </div>
                  )}
                </div>
                
                <div className="flex-grow mb-8">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Features include:
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-gray-700 dark:text-gray-300 flex items-start"
                      >
                        <span className="text-green-500 dark:text-green-400 mr-2 mt-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700" 
                      : plan.name === "Free" 
                        ? "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                        : "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                  }`}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : plan.name === "Free" ? (
                    "Get Started For Free"
                  ) : (
                    `Subscribe Now`
                  )}
                </Button>
                
                {plan.name !== "Free" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    Cancel anytime. No hidden fees.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {[
              { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade at any time." },
              { q: "Is there a free trial?", a: "The Free plan is always free. Paid plans start immediately." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards and mobile payments." },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Price