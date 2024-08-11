import React from "react";
import Link from "next/link";

const GridMenu = ({ ToolsData }) => {
  return (
    <>
      <div className="mainmenu-nav d-none d-lg-block one-menu">
        <ul className="mainmenu one-menu-item">
          <li className="with-megamenu has-menu-child-item position-relative menu-item-open">
            <Link className="header-round-btn" href="#">
              <span>
                <i className="feather-grid"></i>
              </span>
            </Link>

            {/* <div className="rainbow-megamenu with-mega-item-2 right-align">
              <div className="wrapper">
                <div className="row row--0">
                  <div className="col-lg-4 single-mega-item">
                    <div className="genarator-section">
                      <ToolsItem ToolsData={ToolsData} start={0} end={4} />
                    </div>
                  </div>
                  <div className="col-lg-4 single-mega-item">
                    <div className="genarator-section">
                      <ToolsItem ToolsData={ToolsData} start={4} end={8} />
                    </div>
                  </div>
                  <div className="col-lg-4 single-mega-item">
                    <div className="genarator-section">
                      <ToolsItem ToolsData={ToolsData} start={8} end={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </li>
        </ul>
      </div>
    </>
  );
};

export default GridMenu;
