"use client";

import { useState } from "react";
import { useLocalized } from "../../../i18n/use-localized";

interface PricePreset {
  label: { name: string; arName: string };
  min?: number;
  max?: number;
}

const PRICE_PRESETS: PricePreset[] = [
  { label: { name: "Under $50", arName: "أقل من $50" }, max: 50 },
  { label: { name: "$50 – $200", arName: "$50 – $200" }, min: 50, max: 200 },
  { label: { name: "$200 – $500", arName: "$200 – $500" }, min: 200, max: 500 },
  { label: { name: "$500+", arName: "$500 فأكثر" }, min: 500 },
];

interface PriceFilterSectionProps {
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
}

/**
 * Price range filter with quick preset chips and custom Min/Max inputs.
 */
export function PriceFilterSection({
  minPrice,
  maxPrice,
  onPriceChange,
}: PriceFilterSectionProps) {
  const { t } = useLocalized();
  const [minInput, setMinInput] = useState(minPrice ? String(minPrice) : "");
  const [maxInput, setMaxInput] = useState(maxPrice ? String(maxPrice) : "");

  const applyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMin = minInput.trim() ? Number(minInput) : undefined;
    const parsedMax = maxInput.trim() ? Number(maxInput) : undefined;
    onPriceChange(
      parsedMin && parsedMin > 0 ? parsedMin : undefined,
      parsedMax && parsedMax > 0 ? parsedMax : undefined,
    );
  };

  return (
    <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {t({ name: "Price Range", arName: "نطاق السعر" })}
        </span>
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <button
            type="button"
            onClick={() => onPriceChange(undefined, undefined)}
            className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            {t({ name: "Clear", arName: "مسح" })}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRICE_PRESETS.map((preset) => {
          const isActive =
            minPrice === preset.min && maxPrice === preset.max;
          return (
            <button
              key={preset.label.name}
              type="button"
              onClick={() =>
                isActive
                  ? onPriceChange(undefined, undefined)
                  : onPriceChange(preset.min, preset.max)
              }
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {t(preset.label)}
            </button>
          );
        })}
      </div>

      <form onSubmit={applyCustomRange} className="grid grid-cols-5 gap-2">
        <input
          type="number"
          min={1}
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          placeholder={t({ name: "Min $", arName: "من $" })}
          className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-white"
        />
        <input
          type="number"
          min={1}
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          placeholder={t({ name: "Max $", arName: "إلى $" })}
          className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-white"
        />
        <button
          type="submit"
          className="col-span-1 rounded-lg bg-gray-900 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {t({ name: "Go", arName: "تم" })}
        </button>
      </form>
    </div>
  );
}
