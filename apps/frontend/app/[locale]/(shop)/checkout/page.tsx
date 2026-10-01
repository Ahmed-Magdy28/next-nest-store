"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "../../../../i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft, MapPin } from "lucide-react";

import { createOrderSchema } from "@repo/shared/schemas/e-commerce/orders";
import type { CreateOrderDto } from "@repo/shared/dtos/e-commerce";

import { useCart } from "../../../../hooks/use-cart";
import { useCreateOrder } from "../../../../hooks/use-orders";
import { useAddresses } from "../../../../hooks/use-addresses";
import { useMe } from "../../../../hooks/use-auth";
import { validateCoupon } from "../../../../lib/api/e-commerce/coupons";
import { useLocalized } from "../../../../i18n/use-localized";
import { PaymentMethodSelector } from "../../../../components/e-commerce/checkout/payment-method-selector";
import { CheckoutOrderSummary } from "../../../../components/e-commerce/checkout/checkout-order-summary";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: user } = useMe();
  const { data: savedAddresses = [] } = useAddresses();
  const createOrder = useCreateOrder();
  const { t } = useLocalized();

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const shippingCost = Number(process.env.NEXT_PUBLIC_SHIPPING_COST || 5);
  const freeThreshold = Number(
    process.env.NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD || 100,
  );
  const taxRate = Number(
    process.env.NEXT_PUBLIC_TAX_RATE_IN_PERCENTAGE || 12,
  );

  const subtotal = cart?.subtotal ?? 0;
  const isFreeShipping = subtotal >= freeThreshold;
  const shipping = isFreeShipping ? 0 : shippingCost;
  const discount = appliedCoupon?.discountAmount ?? 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = (taxable * taxRate) / 100;
  const total = taxable + shipping + tax;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateOrderDto>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      paymentMethod: "CASH_ON_DELIVERY",
      shippingAddress: {
        country: "Egypt",
        city: "",
        area: "",
        street: "",
        building: "",
        apartment: "",
        postalCode: "",
      },
      notes: "",
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      if (user.username) setValue("customerName", user.username);
      if (user.email) setValue("customerEmail", user.email);
    }
  }, [user, setValue]);

  // Handle address auto-fill
  const handleSelectSavedAddress = (addressId: string) => {
    const address = savedAddresses.find((a) => a.id === addressId);
    if (!address) return;

    setValue("shippingAddress.country", address.country);
    setValue("shippingAddress.city", address.city);
    setValue("shippingAddress.area", address.area || "");
    setValue("shippingAddress.street", address.street);
    setValue("shippingAddress.building", address.building || "");
    setValue("shippingAddress.apartment", address.apartment || "");
    setValue("shippingAddress.postalCode", address.postalCode || "");
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const res = await validateCoupon({
        code: couponInput.trim().toUpperCase(),
        subtotal,
      });

      if (res.valid && res.discountAmount) {
        setAppliedCoupon({
          code: couponInput.trim().toUpperCase(),
          discountAmount: res.discountAmount,
        });
        toast.success(
          t({
            name: `Coupon applied! Saved $${res.discountAmount.toFixed(2)}`,
            arName: `تم تطبيق الخصم! وفرت $${res.discountAmount.toFixed(2)}`,
          }),
        );
      } else {
        toast.error(
          res.message ||
            t({ name: "Invalid coupon code", arName: "كود الخصم غير صحيح" }),
        );
      }
    } catch (err: any) {
      toast.error(
        err.message ||
          t({ name: "Could not apply coupon", arName: "تعذر تطبيق كود الخصم" }),
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info(t({ name: "Coupon removed", arName: "تمت إزالة كود الخصم" }));
  };

  const onSubmit = async (data: CreateOrderDto) => {
    if (!cart || cart.items.length === 0) {
      toast.error(t({ name: "Your cart is empty", arName: "سلتك فارغة" }));
      return;
    }

    try {
      const payload: CreateOrderDto = {
        ...data,
        couponCode: appliedCoupon?.code,
      };

      const newOrder = await createOrder.mutateAsync(payload);
      toast.success(
        t({
          name: "Order placed successfully!",
          arName: "تم تأكيد طلبك بنجاح!",
        }),
      );
      router.push(`/account/orders?success=${newOrder.id}`);
    } catch (err: any) {
      toast.error(
        err.message ||
          t({ name: "Failed to place order", arName: "فشل إتمام الطلب" }),
      );
    }
  };

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t({ name: "Your cart is empty", arName: "سلتك فارغة" })}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t({
            name: "Add products to your cart before proceeding to checkout.",
            arName: "أضف منتجات إلى سلتك للمتابعة لإتمام الشراء.",
          })}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t({ name: "Browse Products", arName: "تصفح المنتجات" })}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            <span>{t({ name: "Back to Cart", arName: "العودة للسلة" })}</span>
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Checkout", arName: "إتمام الشراء" })}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Form Details (7-8 cols) */}
            <div className="space-y-6 lg:col-span-7 xl:col-span-8">
              {/* 1. Contact Information */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {t({ name: "1. Contact Information", arName: "1. معلومات الاتصال" })}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Full Name", arName: "الاسم الكامل" })} *
                    </label>
                    <input
                      {...register("customerName")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder={t({ name: "John Doe", arName: "أحمد محمد" })}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-rose-500">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Email Address", arName: "البريد الإلكتروني" })} *
                    </label>
                    <input
                      {...register("customerEmail")}
                      type="email"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder="email@example.com"
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-xs text-rose-500">{errors.customerEmail.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Phone Number", arName: "رقم الهاتف" })} *
                    </label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder="+20 100 000 0000"
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs text-rose-500">{errors.customerPhone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t({ name: "2. Shipping Address", arName: "2. عنوان الشحن" })}
                  </h2>

                  {/* Pick from saved addresses if available */}
                  {savedAddresses.length > 0 && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectSavedAddress(e.target.value);
                        }}
                        defaultValue=""
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                      >
                        <option value="">
                          {t({ name: "Select saved address", arName: "اختر عنواناً محفوظاً" })}
                        </option>
                        {savedAddresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.label || addr.city} - {addr.street}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Country", arName: "الدولة" })} *
                    </label>
                    <input
                      {...register("shippingAddress.country")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder="Egypt"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.shippingAddress.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "City", arName: "المدينة" })} *
                    </label>
                    <input
                      {...register("shippingAddress.city")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder={t({ name: "Cairo", arName: "القاهرة" })}
                    />
                    {errors.shippingAddress?.city && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Street Address", arName: "الشارع / العنوان" })} *
                    </label>
                    <input
                      {...register("shippingAddress.street")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder={t({ name: "123 Main St", arName: "شارع التحرير" })}
                    />
                    {errors.shippingAddress?.street && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.shippingAddress.street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Building / Floor", arName: "المبنى / الطابق" })}
                    </label>
                    <input
                      {...register("shippingAddress.building")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder="Bldg 4, Floor 2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      {t({ name: "Apartment / Unit", arName: "الشقة" })}
                    </label>
                    <input
                      {...register("shippingAddress.apartment")}
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                      placeholder="Apt 201"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Component */}
              <PaymentMethodSelector
                register={register}
                selectedMethod={selectedPaymentMethod}
              />

              {/* 4. Order Notes */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  {t({ name: "Order Notes (Optional)", arName: "ملاحظات الطلب (اختياري)" })}
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  placeholder={t({
                    name: "Special notes for delivery, landmark, etc.",
                    arName: "ملاحظات خاصة بالتوصيل، علامة مميزة، إلخ.",
                  })}
                />
              </div>
            </div>

            {/* Right Column: Order Summary Component (4-5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <CheckoutOrderSummary
                cart={cart}
                appliedCoupon={appliedCoupon}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isValidatingCoupon={isValidatingCoupon}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                isFreeShipping={isFreeShipping}
                tax={tax}
                taxRate={taxRate}
                total={total}
                isSubmitting={createOrder.isPending}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
