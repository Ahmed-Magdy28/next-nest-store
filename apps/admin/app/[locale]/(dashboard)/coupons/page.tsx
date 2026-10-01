"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { couponsApi } from "@/lib/api";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { CouponDto } from "@repo/shared/dtos/e-commerce";
import { CouponTable } from "@/components/coupons/coupon-table";
import { CouponFormModal } from "@/components/coupons/coupon-form-modal";

export default function CouponsPage() {
  const t = useTranslations("Coupons");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [usageLimitPerUser, setUsageLimitPerUser] = useState("1");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [isActive, setIsActive] = useState(true);

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["admin", "coupons", page, search],
    queryFn: () => couponsApi.getCoupons({ page, limit: 10, search }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => couponsApi.createCoupon(data),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to create coupon"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      couponsApi.updateCoupon(id, data),
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update coupon"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to delete coupon"),
  });

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setType("PERCENTAGE");
    setValue("");
    setMinOrderAmount("");
    setMaxDiscount("");
    setUsageLimit("");
    setUsageLimitPerUser("1");
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    );
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CouponDto) => {
    setEditingCoupon(c);
    setCode(c.code);
    setType(c.type as any);
    setValue(String(c.value));
    setMinOrderAmount(c.minOrderAmount ? String(c.minOrderAmount) : "");
    setMaxDiscount(c.maxDiscount ? String(c.maxDiscount) : "");
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : "");
    setUsageLimitPerUser(
      c.usageLimitPerUser ? String(c.usageLimitPerUser) : "1"
    );
    setStartDate(new Date(c.startDate).toISOString().slice(0, 10));
    setEndDate(
      c.endDate ? new Date(c.endDate).toISOString().slice(0, 10) : ""
    );
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageLimitPerUser: usageLimitPerUser ? Number(usageLimitPerUser) : 1,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newCoupon")}</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={tCommon("search")}
            className="w-full ps-10 pe-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <CouponTable
        couponsData={couponsData}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        onEdit={openEditModal}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* Coupon Modal */}
      <CouponFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingCoupon={editingCoupon}
        isPending={createMutation.isPending || updateMutation.isPending}
        code={code}
        setCode={setCode}
        type={type}
        setType={setType}
        value={value}
        setValue={setValue}
        minOrderAmount={minOrderAmount}
        setMinOrderAmount={setMinOrderAmount}
        maxDiscount={maxDiscount}
        setMaxDiscount={setMaxDiscount}
        usageLimit={usageLimit}
        setUsageLimit={setUsageLimit}
        usageLimitPerUser={usageLimitPerUser}
        setUsageLimitPerUser={setUsageLimitPerUser}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </div>
  );
}
