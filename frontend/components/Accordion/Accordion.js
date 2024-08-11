import React, { useEffect } from "react";
import sal from "sal.js";
import AccordionItem from "./AccordionItem";

const Accordion = ({ isHead }) => {
  useEffect(() => {
    sal();
  }, []);

  return (
    <>
      <div className="rainbow-accordion-area rainbow-section-gap">
        <div className="container">
          {isHead ? (
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div
                  className="section-title text-center"
                  data-sal="slide-up"
                  data-sal-duration="700"
                  data-sal-delay="100"
                >
                  <h4 className="subtitle ">
                    <span className="theme-gradient">Accordion</span>
                  </h4>
                  <h2 className="title w-600 mb--20">
                    Frequently Asked Questions
                  </h2>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="row mt--35 row--20">
            <div className="col-lg-10 offset-lg-1">
              <AccordionItem />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accordion;
