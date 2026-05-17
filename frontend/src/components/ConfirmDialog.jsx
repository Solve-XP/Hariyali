import "./ConfirmDialog.css";

import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {

  if (!open) return null;

  return (

    <div className="confirm-overlay">

      <div className="confirm-dialog">

        <h3 className="confirm-title">
          {title}
        </h3>

        <p className="confirm-message">
          {message}
        </p>

        <div className="confirm-actions">

          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : confirmText}
          </Button>

        </div>

      </div>

    </div>
  );
}