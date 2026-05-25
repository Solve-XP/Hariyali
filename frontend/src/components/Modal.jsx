import "./Modal.css";

export default function Modal({
  open,
  title,
  children,
  onClose,
  width = "680px",
}) {

  if (!open) {
    return null;
  }

  function handleOverlayClick(
    e
  ) {

    if (
      e.target ===
      e.currentTarget
    ) {

      onClose?.();
    }
  }

  return (

    <div
      className="
        modal-overlay
      "
      onClick={
        handleOverlayClick
      }
    >

      <div
        className="
          modal
        "
        style={{
          maxWidth:
            width,
        }}
      >

        {/* HEADER */}

        <div className="
          modal-header
        ">

          <h2>
            {title}
          </h2>

          <button
            className="
              modal-close
            "
            onClick={
              onClose
            }
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="
          modal-body
        ">

          {children}

        </div>

      </div>

    </div>
  );
}