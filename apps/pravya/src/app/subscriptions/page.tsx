"use client";

import Loader from "@/components/loader/loader";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out AI-powered mock interviews.",
    features: [
      "2 AI voice interviews per week",
      "Basic performance feedback",
      "Access to community support",
      "Resume upload & basic insights",
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
      "Detailed feedback & score breakdown",
      "Chat with your resume (RAG)",
      "Role-based & level-specific interviews",
      "Advanced analytics & insights",
      "Priority AI feedback & support",
    ],
    popular: true,
    cta: "Buy Now",
  },
];

export default function PricingSection() {
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

  if(isLoading) {
    return (
      <Loader title="" />
    )
  }

  return (
    <section className="relative py-10 px-4 bg-white dark:bg-neutral-950 transition-colors duration-300">
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
            Start building beautiful components today. Upgrade anytime as your
            needs grow.
          </p>

          {/* Monthly/Annual Toggle */}
          <motion.div
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
          </motion.div>
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
                onClick={plan.popular ? handleSubmit : undefined}
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
