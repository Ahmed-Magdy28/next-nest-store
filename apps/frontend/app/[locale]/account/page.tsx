"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Package,
  Heart,
  Settings,
  User,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Mail,
  Loader2,
  X,
} from "lucide-react";
import type { AddressDto, CreateAddressDto } from "@repo/shared/dtos/addresses";

import { Link } from "../../../i18n/routing";
import { ProtectedRoute } from "../../../components/auth/protected-route";
import { useProfile } from "../../../hooks/use-users";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../../../hooks/use-addresses";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const t = useTranslations("Account");
  const locale = useLocale();

  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null);

  // Address form fields
  const [label, setLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setLabel("");
    setFullName(profile?.username || "");
    setPhone("");
    setCountry("Egypt");
    setCity("");
    setArea("");
    setStreet("");
    setBuilding("");
    setApartment("");
    setPostalCode("");
    setIsDefault(addresses?.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: AddressDto) => {
    setEditingAddress(addr);
    setLabel(addr.label || "");
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setCountry(addr.country || "Egypt");
    setCity(addr.city);
    setArea(addr.area || "");
    setStreet(addr.street);
    setBuilding(addr.building || "");
    setApartment(addr.apartment || "");
    setPostalCode(addr.postalCode || "");
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateAddressDto = {
      label: label.trim() || null,
      fullName: fullName.trim(),
      phone: phone.trim(),
      country: country.trim() || "Egypt",
      city: city.trim(),
      area: area.trim() || null,
      street: street.trim(),
      building: building.trim() || null,
      apartment: apartment.trim() || null,
      postalCode: postalCode.trim() || null,
      isDefault,
    };

    if (editingAddress) {
      updateAddressMutation.mutate(
        { id: editingAddress.id, body: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingAddress(null);
          },
        },
      );
    } else {
      createAddressMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const formatMemberDate = (dateVal?: Date | string) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
      }).format(d);
    } catch {
      return "";
    }
  };

  const isSaving =
    createAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* User Profile Header Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl sm:text-3xl font-black text-white shadow-md shadow-blue-500/20">
                {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.username || t("title")}
                  </h1>
                  {profile?.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{profile?.email || "—"}</span>
                  </span>
                  {profile?.createdAt && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {t("memberSince")} {formatMemberDate(profile.createdAt)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/account/settings"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
            >
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </Link>
          </div>
        </div>

        {/* Navigation Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AccountCard
            href="/account/orders"
            icon={Package}
            label={t("orders")}
            desc={t("ordersCardDesc")}
          />
          <AccountCard
            href="/account/wishlist"
            icon={Heart}
            label={t("wishlist")}
            desc={t("wishlistDesc")}
          />
          <AccountCard
            href="/account/settings"
            icon={Settings}
            label={t("settings")}
            desc={t("settingsCardDesc")}
          />
        </div>

        {/* Shipping Addresses Section */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("shippingAddresses")}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("shippingAddressesDesc")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t("addAddress")}</span>
            </button>
          </div>

          {/* Loading */}
          {isLoadingAddresses && (
            <div className="flex items-center gap-3 py-8 text-sm text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading addresses...</span>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingAddresses && (!addresses || addresses.length === 0) && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center dark:border-gray-800">
              <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("noAddresses")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {t("noAddressesDesc")}
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("addAddress")}</span>
              </button>
            </div>
          )}

          {/* Address Cards Grid */}
          {!isLoadingAddresses && addresses && addresses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`relative rounded-2xl border p-5 transition flex flex-col justify-between gap-4 ${
                    addr.isDefault
                      ? "border-blue-500 bg-blue-50/20 dark:border-blue-700 dark:bg-blue-950/20"
                      : "border-gray-200 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-800/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {addr.label && (
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {addr.label}
                          </span>
                        )}
                        {addr.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                            {t("defaultBadge")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(addr)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition dark:hover:text-blue-400 cursor-pointer"
                          title={t("editAddress")}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAddressMutation.mutate(addr.id)}
                          disabled={deleteAddressMutation.isPending}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition dark:hover:text-rose-400 cursor-pointer"
                          title={t("deleteAddress")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addr.fullName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {addr.phone}
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5 pt-1">
                      <p>
                        {addr.street}
                        {addr.building && `, Bldg ${addr.building}`}
                        {addr.apartment && `, Apt ${addr.apartment}`}
                      </p>
                      <p>
                        {[addr.area, addr.city, addr.country, addr.postalCode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {!addr.isDefault && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setDefaultAddressMutation.mutate(addr.id)}
                        disabled={setDefaultAddressMutation.isPending}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                      >
                        {t("setDefault")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add / Edit Address Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingAddress ? t("editAddress") : t("addAddress")}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Label */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("addressLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder="Home, Office..."
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("phone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("city")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Area */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("area")}
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("country")}
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Street */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                    {t("street")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Building */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("building")}
                    </label>
                    <input
                      type="text"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Apartment */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("apartment")}
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                      {t("postalCode")}
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Set as default checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                    />
                    <span>{t("setAsDefault")}</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{t("saveAddress")}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountCard({
  href,
  icon: Icon,
  label,
  desc,
}: {
  href: string;
  icon: any;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <p className="mt-3 font-semibold text-gray-900 dark:text-white">
        {label}
      </p>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
    </Link>
  );
}
