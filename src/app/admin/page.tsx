"use client";

import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminAuth } from "@/components/admin/AdminAuth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPanel />
    </div>
  );
}
