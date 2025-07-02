import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
