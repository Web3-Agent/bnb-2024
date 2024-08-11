import Separator from "@/pages/separator";
import Image from "next/image";
import Link from "next/link";

import logo from "../../public/images/logo/logo.png";
import logoDark from "../../public/images/logo/logo-dark.png";

import FooterData from "../../data/footer.json";
import SingleFooter from "./FooterProps/SingleFooter";

const Footer = () => {
  return (
    <>
      <footer className="rainbow-footer footer-style-default footer-style-3 position-relative">
        <Separator top={true} />
        <div className="footer-top">
          <div className="container">
            <div className="row justify-content-center mb--30">
              <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="rainbow-footer-widget text-center">
                  {/* <div className="logo">
                    <Link href="/">
                      <Image
                        className="logo-light"
                        src={logo}
                        width={201}
                        height={35}
                        alt="Corporate Logo"
                      />
                      <Image
                        className="logo-dark"
                        src={logoDark}
                        width={201}
                        height={35}
                        alt="Corporate Logo"
                      />
                    </Link>
                  </div> */}
                   <div style={{margin:"5px"}}>
                <Link href="/">
                  <Image
                    // className="logo-light"
                    src={logo}
                    width={220}
                    height={"auto"}
                    alt="Web3 Agent Logo"
                  />
                </Link>
              </div>
                  <p className="b1 text-center mt--20 mb--0">
                  Let AI empower you to effortlessly create your token and seamlessly go cross-chain.
                  </p>
                </div>
              </div>
            </div>
            <div className="separator-animated animated-true mt--50 mb--50"></div>
            {/* {FooterData &&
              FooterData.footer.map((data, index) => (
                <div className="row" key={index}>
                  <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="rainbow-footer-widget">
                      <h4 className="title">{data.title}</h4>
                      <div className="inner">
                        <h6 className="subtitle">{data.desc}</h6>
                        <form className="newsletter-form" action="#">
                          <div className="form-group">
                            <input
                              type="email"
                              placeholder="Enter Your Email Here"
                            />
                            <button
                              className="btn-default bg-solid-primary"
                              type="submit"
                            >
                              <i className="feather-arrow-right"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <SingleFooter data={data.services} />
                  <SingleFooter data={data.products} />
                  <SingleFooter data={data.company} />
                  <SingleFooter data={data.solutions} />
                </div>
              ))} */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
