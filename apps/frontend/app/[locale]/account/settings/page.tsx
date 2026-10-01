"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  User,
  Shield,
  Sliders,
  Laptop,
  Smartphone,
  Loader2,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Globe,
  Palette,
  PowerOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Link } from "../../../../i18n/routing";
import { ProtectedRoute } from "../../../../components/auth/protected-route";
import {
  useProfile,
  useUpdateUsername,
  useRequestEmailChange,
  useChangePassword,
} from "../../../../hooks/use-users";
import {
  useSessions,
  useRevokeSession,
  useDeleteSession,
  useRevokeOtherSessions,
  useDeleteOtherSessions,
} from "../../../../hooks/use-sessions";
import { LanguageSwitcher } from "../../../../components/common/toggleLanguage";
import { ThemeToggle } from "../../../../components/common/theme-toggle";

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const t = useTranslations("Account");
  const locale = useLocale();

  // Profile data & mutations
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const updateUsernameMutation = useUpdateUsername();
  const requestEmailChangeMutation = useRequestEmailChange();
  const changePasswordMutation = useChangePassword();

  // Sessions data & mutations
  const { data: sessions, isLoading: isLoadingSessions } = useSessions();
  const revokeSessionMutation = useRevokeSession();
  const deleteSessionMutation = useDeleteSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();
  const deleteOtherSessionsMutation = useDeleteOtherSessions();

  // Username form state
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile?.username]);

  // Email form state
  const [newEmail, setNewEmail] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === profile?.username) return;
    updateUsernameMutation.mutate({ username: username.trim() });
  };

  const handleRequestEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newEmail === profile?.email) return;
    requestEmailChangeMutation.mutate(
      { email: newEmail.trim() },
      {
        onSuccess: () => {
          setNewEmail("");
        },
      },
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return "—";
    try {
      const d = new Date(dateValue);
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return String(dateValue);
    }
  };

  const otherSessionsCount = sessions?.filter((s) => !s.isCurrent).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Breadcrumb / Header */}
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition mb-3 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("backToAccount")}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("settingsTitle")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("settingsDesc")}
          </p>
        </div>

        {/* Section 1: Change Username or Email */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("changeUsernameOrEmail")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("profileDesc")}
              </p>
            </div>
          </div>

          {isLoadingProfile ? (
            <div className="flex items-center gap-3 py-6 text-gray-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading profile...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Change Username Form */}
              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2"
                  >
                    {t("changeUsername")}
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    updateUsernameMutation.isPending ||
                    !username.trim() ||
                    username === profile?.username
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition cursor-pointer"
                >
                  {updateUsernameMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{t("updateUsername")}</span>
                </button>
              </form>

              {/* Change Email Form */}
              <form onSubmit={handleRequestEmailChange} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="newEmail"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400"
                    >
                      {t("changeEmail")}
                    </label>
                    <span className="text-xs text-gray-400">
                      Current: {profile?.email}
                    </span>
                  </div>
                  <input
                    id="newEmail"
                    type="email"
                    placeholder={t("newEmail")}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-400">
                    {t("emailNotice")}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    requestEmailChangeMutation.isPending ||
                    !newEmail.trim() ||
                    newEmail === profile?.email
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition cursor-pointer"
                >
                  {requestEmailChangeMutation.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{t("updateEmail")}</span>
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Section 2: Security & Change Password */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("security")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("changePassword")}
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2"
              >
                {t("currentPassword")}
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 ps-4 pe-11 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute end-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2"
              >
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 ps-4 pe-11 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute end-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2"
              >
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 ps-4 pe-11 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute end-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  changePasswordMutation.isPending ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition cursor-pointer"
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("updating")}</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{t("changePassword")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Section 3: Preferences (Language & Theme) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("preferences")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("settingsCardDesc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Language */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("language")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {locale === "ar" ? "العربية" : "English"}
                  </p>
                </div>
              </div>
              <LanguageSwitcher />
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("theme")}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Light / Dark mode
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Section 4: Active Sessions */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("sessions")}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("sessionsDesc")}
                </p>
              </div>
            </div>

            {otherSessionsCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => revokeOtherSessionsMutation.mutate()}
                  disabled={revokeOtherSessionsMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg transition disabled:opacity-50 dark:text-amber-400 dark:border-amber-900 dark:hover:bg-amber-950/40 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("terminateOthers")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteOtherSessionsMutation.mutate()}
                  disabled={deleteOtherSessionsMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition disabled:opacity-50 dark:text-rose-400 dark:border-rose-900 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t("deleteOthers")}</span>
                </button>
              </div>
            )}
          </div>

          {isLoadingSessions ? (
            <div className="flex items-center gap-3 py-6 text-gray-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading sessions...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions?.map((session) => {
                const isMobile =
                  session.userAgent?.toLowerCase().includes("mobile") ||
                  session.userAgent?.toLowerCase().includes("android") ||
                  session.userAgent?.toLowerCase().includes("iphone");
                const DeviceIcon = isMobile ? Smartphone : Laptop;
                const isRevoked = session.status === "REVOKED";

                return (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200/60 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        <DeviceIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {session.deviceName || session.userAgent?.slice(0, 30) || "Unknown Device"}
                          </span>
                          {session.isCurrent ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                              {t("currentSession")}
                            </span>
                          ) : isRevoked ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                              {t("endedBadge")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                              {t("activeBadge")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("ip")}: {session.ipAddress || "—"} • {t("lastActive")}:{" "}
                          {formatDate(session.lastUsedAt || session.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <div className="flex items-center gap-2 justify-end">
                        {!isRevoked && (
                          <button
                            type="button"
                            onClick={() => revokeSessionMutation.mutate(session.id)}
                            disabled={revokeSessionMutation.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg transition disabled:opacity-50 dark:text-amber-400 dark:border-amber-900 dark:hover:bg-amber-950/40 cursor-pointer"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                            <span>{t("endSession")}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteSessionMutation.mutate(session.id)}
                          disabled={deleteSessionMutation.isPending}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition disabled:opacity-50 dark:text-rose-400 dark:border-rose-900 dark:hover:bg-rose-950/40 cursor-pointer"
                          title={t("deleteSession")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t("deleteSession")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
