"use client";

import { useState } from "react";
import Link from "next/link";
import { ShopName } from "@repo/shared/constants";

import {
  ShoppingBag,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Value Propositions / Badges */}
      <div className="border-b border-gray-100 dark:border-gray-800/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Free Express Shipping
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                On orders over $100
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                30-Day Money Back
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hassle-free returns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Secure Checkout
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                256-bit SSL Encryption
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                24/7 Dedicated Support
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Always here to help
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="space-y-6 lg:col-span-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>{ShopName}</span>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your one-stop modern marketplace for high-quality products. Built
              for high performance, security, and seamless shopping.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Subscribe to our newsletter
              </p>
              {subscribed ? (
                <div className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  ✓ Thank you for subscribing!
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-md gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <span>Join</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links (8-col grid) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:pl-8">
            {/* Shop Links */}
            <div>
              <p className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Shop
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Featured Deals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-arrivals"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <p className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Support
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Help Center / FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Track Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <p className="text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Company
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Store Inc. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              {/* <Github className="h-5 w-5" /> */}
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              {/* <Twitter className="h-5 w-5" /> */}
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              {/* <Instagram className="h-5 w-5" /> */}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gray-900 dark:hover:text-white"
            >
              {/* <Linkedin className="h-5 w-5" /> */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
