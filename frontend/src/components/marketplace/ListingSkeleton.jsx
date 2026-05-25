import "./ListingSkeleton.css";

export default function ListingSkeleton({
  count = 6,
}) {

  return (

    <div className="
      listing-skeleton-grid
    ">

      {Array.from({
        length: count,
      }).map(
        (_, index) => (

        <div
          key={index}
          className="
            listing-skeleton-card
          "
        >

          <div className="
            listing-skeleton-image
          " />

          <div className="
            listing-skeleton-body
          ">

            <div className="
              listing-skeleton-title
            " />

            <div className="
              listing-skeleton-subtitle
            " />

            <div className="
              listing-skeleton-meta
            ">

              <div className="
                listing-skeleton-box
              " />

              <div className="
                listing-skeleton-box
              " />

            </div>

            <div className="
              listing-skeleton-location
            " />

            <div className="
              listing-skeleton-actions
            ">

              <div className="
                listing-skeleton-button
              " />

              <div className="
                listing-skeleton-button
              " />

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}