import Link from "next/link";
import React, { useEffect } from "react";
import sal from "sal.js";

const SinglePrice = ({ data, incresePrice, parentClass }) => {
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
      <div className={`${parentClass} ${!incresePrice ? "mt--30" : ""}`}>
        <div
          className={`rainbow-pricing style-chatenai ${
            data.price > 50 ? "active" : ""
          }`}
        >
          <div className="pricing-table-inner bg-flashlight">
            <div className="pricing-top">
              <div className="pricing-header">
                <h4 className="title">{data.title}</h4>
                <div className="pricing">
                  <div className="price-wrapper">
                    {data.price === 0 ? (
                      ""
                    ) : data.text === "" ? (
                      <span className="currency">$</span>
                    ) : (
                      ""
                    )}

                    {data.price === 0 ? (
                      <span className="price">Free</span>
                    ) : data.text ? (
                      <span className="price sm-text">{data.text} </span>
                    ) : (
                      <span className="price">
                        {incresePrice
                          ? data.price <= 50
                            ? data.price + 250
                            : data.price + 400
                          : data.price}
                      </span>
                    )}
                  </div>
                  <span className="subtitle">{data.subTitle}</span>
                </div>
                <div className="separator-animated animated-true mt--30 mb--30"></div>
              </div>
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
            </div>
            <div className="pricing-footer">
              {data.price === 0 ? (
                <Link className="btn-default btn-border" href="#">
                  Try it now
                </Link>
              ) : data.title === "Enterprise" ? (
                <Link className={`btn-default btn-border`} href="#">
                  Contact Sales
                </Link>
              ) : (
                <Link
                  className={`${
                    data.title === "Business"
                      ? "btn-default btn-border"
                      : "btn-default"
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
    </>
  );
};

export default SinglePrice;
