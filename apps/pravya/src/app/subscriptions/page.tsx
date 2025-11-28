"use client";

import { getUserSubscription } from "@/actions/subscription";
import { BackButton } from "@/components/BackButton";
import Loader from "@/components/loader/loader";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CancelSubscriptionDialog({ open, setOpen }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to cancel subscription");
        return;
      }

      toast.success("Subscription cancelled successfully");
      setOpen(false);

      // Refresh UI
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      toast.error("Network error");
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          max-w-md
          rounded-2xl 
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-neutral-900/70 
          backdrop-blur-xl 
          shadow-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Cancel Subscription?
          </DialogTitle>

          <DialogDescription className="text-black/70 dark:text-white/70 mt-2">
            Are you sure you want to cancel your subscription?  
            You will still have access until the end of your billing cycle, 
            but renewal will stop immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
          <p className="text-black/80 dark:text-white/80 text-sm leading-relaxed">
            • Your existing benefits remain active until your current period ends.  
            <br />• You can reactivate anytime.
          </p>
        </div>

        <DialogFooter className="mt-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => setOpen(false)}
            className="border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
          >
            Keep Subscription
          </Button>

          <Button
            disabled={loading}
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out AI-powered mock interviews.",
    features: [
      "3 AI voice interviews per month",
      "3 resume uploads per month",
      "Unlimited Learning Hub access",
      "Chat with your resume (RAG)",
      "Basic AI Response",
    ],
    popular: false,
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 24,
    description: "For serious learners preparing for top roles.",
    features: [
      "Unlimited AI voice interviews",
      "Unlimited resume uploads",
      "Unlimited Learning Hub access",
      "Chat with your resume (RAG)",
      "Advanced analytics & insights",
      "Priority Mock Feedback",
      "Early access to beta features.",
    ],
    popular: true,
    cta: "Buy Now",
  },
];

const mockSubscriptionData = {
  planName: "Pro",
  status: "Active",
  billingAmount: 29,
  billingCycle: "monthly",
  startDate: "2024-11-01",
  endDate: "2024-12-01",
  renewalDate: "2024-12-01",
  features: [
    "Unlimited AI voice interviews",
    "Unlimited resume uploads",
    "Unlimited Learning Hub access",
    "Chat with your resume (RAG)",
    "Advanced analytics & insights",
    "Priority Mock Feedback",
    "Early access to beta features.",
  ],
};

export default function PricingSection() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getSubDetails = async () => {
      try {
        setIsLoading(true);
        const sub = await getUserSubscription();

        if (!sub) {
          setIsSubscribed(false);
          toast.error("Failed to Fetch");
          return;
        }

        setIsSubscribed(sub?.hasSubscription);
        // setIsSubscribed(false);
        mockSubscriptionData.startDate =
          sub?.subscription?.startDate?.toISOString() ?? "";
        mockSubscriptionData.endDate =
          sub?.subscription?.endDate?.toISOString() ?? "";
        mockSubscriptionData.renewalDate =
          sub?.subscription?.nextBillingDate?.toISOString() ?? "";
        mockSubscriptionData.status = sub?.subscription?.status ?? "";
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getSubDetails();
  }, []);

  if (isLoading) {
    return <Loader title="" />;
  }

  if (isSubscribed) {
    return (
      <>
      <section className="relative py-10 px-4 bg-white dark:bg-neutral-950 transition-colors duration-300 min-h-screen">
        <div className="ml-12">
          <BackButton />
        </div>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm mb-6"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-black/70 dark:text-white/80">
                Subscription Active
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-black to-black/60 dark:from-white dark:via-white dark:to-white/60 bg-clip-text text-transparent mb-4">
              Your Subscription
            </h2>

            <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              Manage your pro membership and unlock unlimited interview practice
            </p>
          </motion.div>

          {/* Subscription Details Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Main Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-2 rounded-2xl p-8 backdrop-blur-sm border bg-gradient-to-br from-black/2 to-black/0 dark:from-white/10 dark:to-white/5 border-black/10 dark:border-white/20"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                    {mockSubscriptionData.planName} Plan
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-black/70 dark:text-white/70 font-medium">
                      {mockSubscriptionData.status}
                    </span>
                  </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-black/60 dark:text-white/60 text-sm mb-1">
                    Billing Amount
                  </p>
                  <p className="text-4xl font-bold text-black dark:text-white">
                    ${mockSubscriptionData.billingAmount}
                    <span className="text-xl text-black/60 dark:text-white/60 ml-1">
                      /{mockSubscriptionData.billingCycle}
                    </span>
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="border-t border-black/10 dark:border-white/10 pt-8">
                <h4 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wide mb-4">
                  Included Features
                </h4>
                <ul className="grid md:grid-cols-2 gap-3">
                  {mockSubscriptionData.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-black/80 dark:text-white/80 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Dates Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-6 backdrop-blur-sm border bg-black/2 dark:bg-white/5 border-black/10 dark:border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-black/60 dark:text-white/60" />
                <h4 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wide">
                  Billing Dates
                </h4>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50 mb-1">
                    Current Period Start
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {new Date(
                      mockSubscriptionData.startDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-black/50 dark:text-white/50 mb-1">
                    Current Period End
                  </p>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {new Date(mockSubscriptionData.endDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Renewal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl p-6 backdrop-blur-sm border bg-black/2 dark:bg-white/5 border-black/10 dark:border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-black/60 dark:text-white/60" />
                <h4 className="text-sm font-semibold text-black/60 dark:text-white/60 uppercase tracking-wide">
                  Next Renewal
                </h4>
              </div>
              <div>
                <p className="text-xs text-black/50 dark:text-white/50 mb-1">
                  Your subscription renews on
                </p>
                <p className="text-lg font-semibold text-black dark:text-white mb-4">
                  {new Date(
                    mockSubscriptionData.renewalDate
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-black/60 dark:text-white/60">
                  You can manage or cancel your subscription anytime without
                  penalty.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <button  onClick={() => setOpenDialog(true)} className="px-8 py-3 rounded-lg font-medium transition-all duration-200 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-md">
              Manage Subscription
            </button>
          </motion.div>
        </div>
      </section>
      <CancelSubscriptionDialog open={openDialog} setOpen={setOpenDialog} />

      </>
    );
  }

  return (
    <section className="relative py-10 px-4 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="ml-12">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-black dark:text-white" />
            <span className="text-sm font-medium text-black/70 dark:text-white/80">
              Pricing
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black via-black to-black/60 dark:from-white dark:via-white dark:to-white/60 bg-clip-text text-transparent mb-4">
            Choose Your Path to Interview Confidence
          </h2>

          <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto mb-8">
            Unlock unlimited practice, detailed AI insights, and resume-powered
            guidance Everything you need to build real interview confidence.
          </p>

          {/* Monthly/Annual Toggle */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4 p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-sm w-fit mx-auto"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
                isAnnual
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                  : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div> */}
        </motion.div>

        {/* Pricing Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative flex flex-col justify-between rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${
                plan.popular
                  ? "bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/30 shadow-lg"
                  : "bg-black/2 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white dark:bg-white dark:text-black text-sm font-medium px-4 py-2 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex flex-col flex-grow">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    {plan.price ? (
                      <span className="text-4xl font-bold text-black dark:text-white">
                        {plan.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-black dark:text-white">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-black/60 dark:text-white/60 text-lg">
                          {isAnnual ? "/year" : "/month"}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-black/60 dark:text-white/60 text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-black dark:text-white flex-shrink-0" />
                      <span className="text-black/80 dark:text-white/80 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmit()}
                disabled={isLoading && plan.popular}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 mt-auto ${
                  plan.popular
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md hover:opacity-90"
                    : "bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/20"
                }`}
              >
                {plan.popular && isLoading ? "Processing..." : plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-black/60 dark:text:white/60 mb-4">
            Need a custom solution? We're here to help.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-black dark:text:white hover:opacity-80 font-medium transition-colors"
          >
            Contact our sales team →
          </motion.button>
        </motion.div>
      </div>
    </section>
    
  );
}
