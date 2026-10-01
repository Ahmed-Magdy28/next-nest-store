"use client";

import { Link } from "../../i18n/routing";
import { useTranslations } from "next-intl";
import { navMenuData } from "@repo/shared/constants";
import type { NavMenuDataType } from "@repo/shared/types";

type NavLocation = "left" | "center" | "right";

interface NavBarProps {
  /** Alignment for desktop navigation links. Defaults to "center" */
  location?: NavLocation;
}

const DEFAULT_NAV_LOCATION: NavLocation = "center";

const LOCATION_CLASSES: Record<NavLocation, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function NavBar({
  location = DEFAULT_NAV_LOCATION,
}: NavBarProps) {
  const t = useTranslations("Nav");
  const getNavTitle = (title: string) => (t.has(title) ? t(title) : title);

  return (
    <nav
      className={`hidden md:flex md:flex-1 md:items-center md:gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 ${LOCATION_CLASSES[location]}`}
    >
      {navMenuData.map((item: NavMenuDataType) => (
        <Link
          key={item.title}
          href={item.href}
          className="transition-colors hover:text-blue-600 dark:hover:text-white"
        >
          {getNavTitle(item.title)}
        </Link>
      ))}
    </nav>
  );
}
