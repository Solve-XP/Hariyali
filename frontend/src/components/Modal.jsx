import "./Modal.css";

export default function Modal({
  open,
  title,
  children,
  onClose,
  width = "680px",
}) {

  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div
        className="modal"
        style={{ maxWidth: width }}
      >

        <div className="modal-header">

          <h2>{title}</h2>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}