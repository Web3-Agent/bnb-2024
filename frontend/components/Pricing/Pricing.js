import React, { useEffect } from "react";
import sal from "sal.js";

import PricingData from "../../data/home.json";
import Link from "next/link";

const Pricing = () => {
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
      <div className="rainbow-pricing-area rainbow-section-gap" id="about">
        <div className="container" style={{height:"400px", alignContent:"center"}} >
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center"
                data-sal="slide-up"
                data-sal-duration="400"
                data-sal-delay="150"
                
              >
                <h4 className="subtitle " >
                   <span className="theme-gradient">Our Technology</span> 
                </h4>
                <h2 className="title w-600 mb--20">
                  About us
                </h2>
                <p className="description b1">
                Web3Agent is pioneering the integration of AI in blockchain through our innovative API. 
                This API facilitates access to Web3 operations, enabling our AI agent to perform a wide range of blockchain functions effectively.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="row row--15">
            {PricingData &&
              PricingData.pricing.slice(0, 3).map((data, index) => (
                <div className="col-lg-4 col-md-6 col-12" key={index}>
                  <div
                    className={`rainbow-pricing style-2 ${
                      data.isActive ? "active" : ""
                    }`}
                  >
                    <div className="pricing-table-inner bg-flashlight">
                      <div className="pricing-header">
                        <h4 className="title">{data.title}</h4>
                        <div className="pricing">
                          <div className="price-wrapper">
                            {data.price === 0 ? (
                              ""
                            ) : (
                              <span className="currency">$</span>
                            )}
                            <span className="price">
                              {data.price === 0 ? "Free" : data.price}
                            </span>
                          </div>
                          <span className="subtitle">{data.subTitle}</span>
                        </div>
                      </div>
                      <div className="separator-animated animated-true mt--30 mb--30"></div>
                      <div className="pricing-body">
                        <ul className="list-style--1">
                          {data.subItem.map((innerData, innerIndex) => (
                            <li key={innerIndex}>
                              <i
                                className={`feather-${
                                  innerData.isMinus ? "minus" : "check"
                                }-circle pe-2`}
                              ></i>
                              {innerData.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-footer">
                        {data.price === 0 ? (
                          <Link className="btn-default btn-border" href="#">
                            Try it now
                          </Link>
                        ) : (
                          <Link
                            className={`btn-default ${
                              !data.isActive ? "btn-border" : ""
                            }`}
                            href="#"
                          >
                            Purchase Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Pricing;
