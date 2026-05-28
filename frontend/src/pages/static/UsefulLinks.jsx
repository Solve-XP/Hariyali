import "./UsefulLinks.css";

import {
  ExternalLink,
} from "lucide-react";

import {
  usefulLinks,
} from "../../data/usefulLinks";

export default function UsefulLinks() {

  const groupedLinks =
    usefulLinks.reduce(
      (
        acc,
        link
      ) => {

        if (
          !acc[
            link.category
          ]
        ) {

          acc[
            link.category
          ] = [];
        }

        acc[
          link.category
        ].push(
          link
        );

        return acc;
      },

      {}
    );

  return (

    <div className="page">

      {/* HEADER */}

      <div className="page__header">

        <h1 className="page__title">

          Useful Links

        </h1>

        <p className="page__subtitle">

          Helpful agriculture,
          government,
          subsidy and
          farming resources.

        </p>

      </div>

      {/* CONTENT */}

      <div className="useful-links-page">

        {Object.entries(
          groupedLinks
        ).map(

          ([
            category,
            links,
          ]) => (

            <section
              key={
                category
              }
              className="
                useful-links-section
              "
            >

              <h2>

                {category}

              </h2>

              <div
                className="
                  useful-links-grid
                "
              >

                {links.map(
                  (
                    link
                  ) => (

                    <div
                      key={
                        link.name
                      }

                      className="
                        useful-link-card
                      "
                    >

                      <div>

                        <h3>

                          {
                            link.name
                          }

                        </h3>

                        <p>

                          {
                            link.description
                          }

                        </p>

                      </div>

                      <a
                        href={
                          link.url
                        }

                        target="_blank"

                        rel="
                          noreferrer
                        "

                        className="
                          useful-link-btn
                        "
                      >

                        Visit Website

                        <ExternalLink
                          size={
                            16
                          }
                        />

                      </a>

                    </div>
                  )
                )}

              </div>

            </section>
          )
        )}

      </div>

    </div>
  );
}