import React from "react";
import UserNav from "../Common/UserNav";
import PricingTwo from "../Pricing/PricingTwo";
import AccordionItem from "../Accordion/AccordionItem";

const PlansBilling = () => {
  return (
    <>
      <div className="rbt-main-content mr--0 mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <UserNav title="Plans & Billing" />
            <div className="content-page pb--50">
              <PricingTwo
                parentClass="col-xl-4 col-lg-6 col-md-6 col-12"
                childClass="tab-content bg-transparent bg-light"
                start={1}
                end={4}
                isHeading={false}
                gap={false}
              />
              <div className="row rainbow-section-gap row--20">
                <div className="col-lg-12">
                  <AccordionItem />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlansBilling;
