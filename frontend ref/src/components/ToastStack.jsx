import "./ToastStack.css";
import { useApp } from "../context/AppContext";

export default function ToastStack() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.variant}`}>{t.message}</div>
      ))}
    </div>
  );
}
