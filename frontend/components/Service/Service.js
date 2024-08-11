import React, { useEffect } from "react";

import sal from "sal.js";

import ServiceItem from "./ServiceItem";
import ServiceData from "../../data/home.json";

const Service = () => {
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
      <div className="rainbow-service-area rainbow-section-gap" id="features">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center"
                data-sal="slide-up"
                data-sal-duration="700"
                data-sal-delay="100"
                
              >
                <h4 className="subtitle">
                  <span className="theme-gradient"> User friendly</span>
                </h4>
                <h2 className="title w-600 mb--20" >
                 Features
                </h2>
                <p className="description b1">
                  Allows users to write and deploy smart contracts without extensive coding knowledge.
                </p>
              </div>
            </div>
          </div>

          <div className="row row--15 service-wrapper">
            <ServiceItem ServiceData={ServiceData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Service;
