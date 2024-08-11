import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import avatar from "../../public/images/team/team-01.jpg";
import UserMenuItems from "../Header/HeaderProps/UserMenuItems";
import HeaderData from "../../data/header.json";
import { useAppContext } from "@/context/Context";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const LeftpanelDashboard = () => {
  const router = useRouter();
  const { shouldCollapseLeftbar } = useAppContext();

  const isActive = (href) => router.pathname === href;

  return (
    <>
      <div
        className={`rbt-left-panel popup-dashboardleft-section ${shouldCollapseLeftbar ? "collapsed" : ""
          }`}
      >
        <div className="rbt-default-sidebar">
          <div className="inner">
            <div className="content-item-content">
              <div className="rbt-default-sidebar-wrapper">
                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    {/* <li>
                      <Link
                        className={isActive("/dashboard") ? "active" : ""}
                        href="/dashboard"
                      >
                        <i className="feather-monitor"></i>
                        <span>Ask Agent</span>
                      </Link>
                    </li> */}
                    {/* <li>
                      <Link
                        className={isActive("/plans-billing") ? "active" : ""}
                        href="/plans-billing"
                      >
                        <i className="feather-briefcase"></i>
                        <span>Manage Subsription</span>
                      </Link>
                    </li> */}
                  </ul>
                  {/* <div className="rbt-sm-separator"></div> */}
                  {/* <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    {HeaderData &&
                      HeaderData.leftPanel.slice(0, 7).map((data, index) => (
                        <li key={index}>
                          <Link
                            href={data.link}
                            className={
                              isActive(data.link)
                                ? "active"
                                : `${data.isDisable ? "disabled" : ""}`
                            }
                          >
                            <Image
                              src={data.img}
                              width={35}
                              height={35}
                              alt="AI Generator"
                            />
                            <span>{data.title}</span>
                            {data.badge !== "" ? (
                              <div className="rainbow-badge-card badge-sm ml--10">
                                {data.badge}
                              </div>
                            ) : (
                              ""
                            )}
                          </Link>
                        </li>
                      ))}
                  </ul> */}
                </nav>

                {/* <div className="rbt-sm-separator"></div> */}

                <nav className="mainmenu-nav">
                  <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    {/* <li className="has-submenu">
                       <a
                        className="collapse-btn collapsed"
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        <i className="feather-plus-circle"></i>
                        <span>Ask Agent</span>
                      </a> 

                      <div className="collapse" id="collapseExample">
                        <UserMenuItems parentClass="submenu rbt-default-sidebar-list" />
                      </div>
                    </li>  */}
                    <li>
                      <Link className={isActive("/ask-agent") ? "active" : ""} href="/ask-agent">
                        <i className="feather-command"></i>
                        <span>Ask Agent</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/send-transaction") ? "active" : ""} href="send-transaction">
                        <i className="feather-briefcase"></i>
                        <span>Send Transaction</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/contract-builders") ? "active" : ""} href="contract-builders">
                        <i className="feather-file"></i>
                        <span>Deploy Contract</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/image-generator") ? "active" : ""} href="/image-generator">
                        <i className="feather-image"></i>
                        <span>Image Generator</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/contract-templates") ? "active" : ""} href="contract-templates">
                        <i className="feather-code"></i>
                        <span>Discover Contract</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/search-data") ? "active" : ""} href="/search-data">
                        <i className="feather-database"></i>
                        <span>Search Data</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/warpcast") ? "active" : ""} href="/warpcast">
                        <i className="feather-hash"></i>
                        <span>Warpcast</span>
                      </Link>
                    </li>
                    <li>
                      <Link className={isActive("/token-list") ? "active" : ""} href="/token-list">
                        <i className="feather-search"></i>
                        <span>Token List</span>
                      </Link>
                    </li>

                    {/* <li>
                      <Link className={isActive("/prompt-list") ? "active" : ""} href="/prompt-list">
                        <i className="feather-plus-circle"></i>
                        <span>Prompt List</span>
                      </Link>
                    </li> */}


                  </ul>
                  <div className="rbt-sm-separator"></div>
                  {/* <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                    <li>
                      <Link
                        className={isActive("/release-notes") ? "active" : ""}
                        href="/release-notes"
                      >
                        <i className="feather-plus-circle"></i>
                        <span>Settinggs</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={isActive("/terms-policy") ? "active" : ""}
                        href="/terms-policy"
                      >
                        <i className="feather-briefcase"></i>
                        <span>Terms & Policy</span>
                      </Link>
                    </li>
                  </ul> */}
                </nav>
              </div>
            </div>
          </div>

          <div className="subscription-box">
            {/* <div className="inner">
              <ConnectButton />
            </div> */}
          </div>
          {/* <p className="subscription-copyright copyright-text text-center b4  small-text">
            Made with love in India
          </p> */}
        </div>
      </div>
    </>
  );
};

export default LeftpanelDashboard;
