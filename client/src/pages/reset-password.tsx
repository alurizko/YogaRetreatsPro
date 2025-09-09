import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Получаем токен из URL
  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка сброса пароля");
      setMessage("Пароль успешно изменён! Теперь вы можете войти с новым паролем.");
    } catch (err: any) {
      setMessage(err.message || "Ошибка сброса пароля");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Некорректная ссылка для сброса пароля.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white rounded-xl p-8 w-full max-w-md shadow space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Сброс пароля</h2>
        <input
          type="password"
          placeholder="Новый пароль"
          className="w-full border rounded px-4 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          className="w-full border rounded px-4 py-2"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {message && <div className="text-center text-red-500">{message}</div>}
        <button
          type="submit"
          className="w-full bg-forest-green text-white font-semibold py-2 rounded hover:bg-forest-green/90"
          disabled={loading}
        >
          {loading ? "Сохраняем..." : "Сбросить пароль"}
        </button>
      </form>
    </div>
  );
} 