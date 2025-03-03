/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useUser } from "@/lib/user-client";
import Modal from "@/components/modal";
import FakePaymentUi from "@/components/fake-payment";

const pricingPlans = [
  {
    name: "Basic",
    price: "9",
    priceId: "price_1PyFKGBibz3ZDixDAaJ3HO74",
    features: [
      "100 AI-generated posts per month",
      "Twitter thread generation",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: "29",
    priceId: "price_1PyFN0Bibz3ZDixDqm9eYL8W",
    features: [
      "500 AI-generated posts per month",
      "Twitter, Instagram, and LinkedIn content",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceId: null,
    features: [
      "Unlimited AI-generated posts",
      "All social media platforms",
      "Custom AI model training",
      "Dedicated account manager",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 text-orange-500">
      <main className="container mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center text-orange-500">
          Pricing Plans
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="p-8 rounded-lg border border-gray-800 flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-4 text-orange-500">
                {plan.name}
              </h2>
              <p className="text-4xl font-bold mb-6 text-orange-500">
                ${plan.price}
                <span className="text-lg font-normal text-orange-500">
                  /month
                </span>
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center mb-3 text-gray-900"
                  >
                    <CheckIcon className="w-5 h-5 mr-2 text-orange-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Modal>
                <Modal.Open opens="choose-plan">
                  <Button>Choose Plan</Button>
                </Modal.Open>
                <Modal.Window name="choose-plan">
                  <FakePaymentUi price={Number(plan.price)} />
                </Modal.Window>
              </Modal>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
