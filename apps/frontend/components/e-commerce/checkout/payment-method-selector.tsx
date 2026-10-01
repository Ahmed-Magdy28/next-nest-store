"use client";

import { Banknote, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { CreateOrderDto } from "@repo/shared/dtos/e-commerce";
import { useLocalized } from "../../../i18n/use-localized";

interface PaymentMethodSelectorProps {
  register: UseFormRegister<CreateOrderDto>;
  selectedMethod: string;
}

export function PaymentMethodSelector({
  register,
  selectedMethod,
}: PaymentMethodSelectorProps) {
  const { t } = useLocalized();

  const methods = [
    {
      id: "CASH_ON_DELIVERY",
      title: t({ name: "Cash on Delivery", arName: "الدفع عند الاستلام" }),
      desc: t({
        name: "Pay with cash upon delivery",
        arName: "ادفع نقداً عند استلام طلبك",
      }),
      icon: Banknote,
    },
    {
      id: "CREDIT_CARD",
      title: t({ name: "Credit / Debit Card", arName: "بطاقة دفع إلكتروني" }),
      desc: t({
        name: "Visa, Mastercard, etc.",
        arName: "فيزا، ماستركارد، وغيرها",
      }),
      icon: CreditCard,
    },
    {
      id: "PAYPAL",
      title: "PayPal",
      desc: t({
        name: "Fast & secure payment",
        arName: "دفع سريع وآمن عبر بايبال",
      }),
      icon: ShieldCheck,
    },
    {
      id: "WALLET",
      title: t({ name: "E-Wallet", arName: "محفظة إلكترونية" }),
      desc: t({
        name: "Vodafone Cash, InstaPay, etc.",
        arName: "فودافون كاش، إنستاباي، إلخ",
      }),
      icon: Wallet,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {t({ name: "3. Payment Method", arName: "3. طريقة الدفع" })}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/30"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
              }`}
            >
              <input
                type="radio"
                value={method.id}
                {...register("paymentMethod")}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {method.title}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {method.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
