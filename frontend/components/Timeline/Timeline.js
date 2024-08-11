import React, { useEffect } from "react";
import sal from "sal.js";

import "venobox/dist/venobox.min.css";

import TimnelineData from "../../data/home.json";
import Link from "next/link";

const Timeline = () => {
  useEffect(() => {
    sal();

    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
        maxWidth: window.innerWidth >= 992 ? "50%" : "100%",
      });
    });
  }, []);
  return (
    <>
      <div className="rainbow-timeline-area rainbow-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center"
                data-sal="slide-up"
                data-sal-duration="700"
                data-sal-delay="100"
              >
                <h4 className="subtitle ">
                  <span className="theme-gradient">HOW IT WORKS</span>
                </h4>
                <h2 className="title w-600 mb--20">
                 Why Web3 Agent?
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10 offset-lg-1 mt--30">
              <div className="timeline-style-two bg-flashlight bg-color-blackest">
                <div className="row row--0">
                  {TimnelineData &&
                    TimnelineData.timeline.map((data, index) => (
                      <div
                        className="col-lg-4 col-md-4 rainbow-timeline-single dark-line"
                        key={index}
                      >
                        <div className="rainbow-timeline">
                          <h6
                            className="title"
                            data-sal="slide-up"
                            data-sal-duration="700"
                            data-sal-delay="200"
                          >
                            {data.title}
                          </h6>
                          <div className="progress-line">
                            <div className="line-inner"></div>
                          </div>
                          <div className="progress-dot">
                            <div className="dot-level">
                              <div className="dot-inner"></div>
                            </div>
                          </div>
                          <p
                            className="description"
                            data-sal="slide-up"
                            data-sal-duration="700"
                            data-sal-delay="300"
                          >
                            {data.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="button-group mt--50 text-center">
                <Link className="btn-default btn-large" href="/text-generator">
                  Start writing for free
                </Link>
                <Link
                  className="btn-default btn-large btn-border popup-video"
                  href="https://youtu.be/ThRYF96HIzA?si=Yz-Yc5HSf8uLPv-G"
                  data-vbtype="video"
                >
                  <span>
                    <i className="feather-play"></i>
                  </span>{" "}
                  See action in video
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
