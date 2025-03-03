import React, { useState, useTransition } from "react";
import { CreditCard, Lock, Calendar, CheckCircle } from "lucide-react";
import { createPayment } from "@/action/payment";

function FakePaymentUi({ price }: { price: number }) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    };
    let isValid = true;

    // Card number validation (16 digits, spaces allowed)
    if (!formData.cardNumber.replace(/\s/g, "").match(/^[0-9]{16}$/)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
      isValid = false;
    }

    // Card holder validation (not empty)
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Please enter the cardholder name";
      isValid = false;
    }

    // Expiry date validation (MM/YY format)
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      isValid = false;
    } else {
      // Check if card is not expired
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(
        2000 + parseInt(year),
        parseInt(month) - 1,
        1
      );
      const today = new Date();
      if (expiryDate < today) {
        newErrors.expiryDate = "Card has expired";
        isValid = false;
      }
    }

    // CVV validation (3 or 4 digits)
    if (!formData.cvv.match(/^[0-9]{3,4}$/)) {
      newErrors.cvv = "Please enter a valid CVV (3-4 digits)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    startTransition(() => {
      createPayment({ price })
        .then((res) => {
          if (res.success) {
            setIsSuccess(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div className=" bg-gradient-to-br flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSuccess ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 animate-progress"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                Complete Your Payment
              </h2>
              <p className="text-orange-100 mt-1">
                Enter your card details to proceed
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    disabled={isPending}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition`}
                  />
                  <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cardHolder"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="John Smith"
                  disabled={isPending}
                  className={`w-full px-4 py-3 border ${
                    errors.cardHolder ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition`}
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardHolder}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      disabled={isPending}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.expiryDate ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition`}
                    />
                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition`}
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium rounded-lg shadow-md hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition ${
                    isPending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                <Lock className="h-4 w-4 mr-1" />
                <span>Your payment information is secure</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default FakePaymentUi;
