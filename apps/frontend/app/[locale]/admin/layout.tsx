import { ProtectedRoute } from "../../../components/auth/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
