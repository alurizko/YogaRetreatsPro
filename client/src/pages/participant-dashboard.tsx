import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";

const ParticipantDashboard = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const email = user?.email || "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff6f0]">
      <h1 className="text-3xl font-bold mb-4">Личный кабинет участника</h1>
      {email && <p className="text-lg mb-4">Вы вошли как: <span className="font-semibold">{email}</span></p>}
      {!email && <p className="text-lg text-red-500 mb-4">Не удалось определить email пользователя</p>}
      <button
        onClick={handleLogout}
        className="bg-warm-orange text-black font-semibold px-6 py-2 rounded hover:bg-warm-orange/90 mb-8"
      >
        Выйти
      </button>
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 mt-4">
        <h2 className="text-xl font-bold mb-2">Ваши бронирования</h2>
        <p className="text-soft-gray">Здесь в будущем появится список ваших ретритов и бронирований.</p>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
