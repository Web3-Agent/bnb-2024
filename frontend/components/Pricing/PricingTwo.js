import React, { useEffect } from "react";
import sal from "sal.js";

import PricingData from "../../data/home.json";
import SinglePrice from "./PricingProps/SinglePrice";
import Compare from "./Compare";

const PricingTwo = ({
  parentClass,
  childClass,
  start,
  end,
  isHeading,
  gap,
}) => {
  useEffect(() => {
    sal();

    const cards = document.querySelectorAll(".bg-flashlight");

    cards.forEach((bgflashlight) => {
      bgflashlight.onmousemove = function (e) {
        let x = e.pageX - bgflashlight.offsetLeft;
        let y = e.pageY - bgflashlight.offsetTop;

        bgflashlight.style.setProperty("--x", x + "px");
        bgflashlight.style.setProperty("--y", y + "px");
      };
    });
  }, []);

  return (
    <>
      <div className="main-content">
        <div
          className={`rainbow-pricing-area ${gap ? "rainbow-section-gap rainbow-section-gapTop-big" : ""
            }`}
        >
          <div className="container">
            <div className="wrapper">
              <div className="row">
                <div className="col-lg-12">
                  {isHeading ? (
                    <div
                      className="section-title text-center"
                      data-sal="slide-up"
                      data-sal-duration="400"
                      data-sal-delay="150"
                    >
                      <h4 className="subtitle">
                        <span className="theme-gradient">Pricing</span>
                      </h4>
                      <h2 className="title w-600 mb--20">
                        Commence Content Journey with AI
                      </h2>
                      <p className="description b1">
                        Collaborate with AI to generate content that resonates.
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  <nav className="chatenai-tab">
                    <div
                      className="tab-btn-grp nav nav-tabs mb-3 text-center justify-content-center"
                      id="nav-tab"
                      role="tablist"
                    >
                      <button
                        className="nav-link active"
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-home"
                        type="button"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                      >
                        Monthly
                      </button>
                      <button
                        className="nav-link with-badge"
                        id="nav-profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                      >
                        Yearly
                        <span className="rainbow-badge-card badge-border">
                          20% Off
                        </span>
                      </button>
                    </div>
                  </nav>
                </div>
              </div>

              <div className={childClass} id="nav-tabContent">
                <div
                  className="tab-pane fade active show"
                  id="nav-home"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                >
                  <div className="row row--15 mt_dec--30">
                    {PricingData &&
                      PricingData.pricing
                        .slice(start, end)
                        .map((data, index) => (
                          <SinglePrice
                            {...data}
                            data={data}
                            key={index}
                            parentClass={parentClass}
                            incresePrice={false}
                          />
                        ))}
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="nav-profile"
                  role="tabpanel"
                  aria-labelledby="nav-profile-tab"
                >
                  <div className="row row--15">
                    {PricingData &&
                      PricingData.pricing
                        .slice(start, end)
                        .map((data, index) => (
                          <SinglePrice
                            {...data}
                            data={data}
                            key={index}
                            parentClass={parentClass}
                            incresePrice={true}
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>
            <Compare />
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingTwo;
