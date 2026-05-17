import "./ImageViewer.css";

export default function ImageViewer({
  image,
  onClose,
}) {

  if (!image) return null;

  return (

    <div
      className="image-preview-overlay"
      onClick={onClose}
    >

      <div className="image-preview-modal">

        <img
          src={image}
          alt="preview"
          className="image-preview"
        />

      </div>

    </div>
  );
}