import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import "venobox/dist/venobox.min.css";

import bannerImg from "../../public/images/banner/banner1.png";
import separator from "../../public/images/separator/separator-top.svg";

const Home = () => {
  useEffect(() => {
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
        maxWidth: window.innerWidth >= 992 ? "50%" : "100%",
      });
    });
  }, [] );
  
    const gradientBorder = {
    padding: '10px', // Adjust padding as needed
    border: '5px solid transparent', // Set initial border to transparent
    borderImage: 'linear-gradient(135deg, #ff66cc, #6699ff) 1', // Gradient border
  };
  return (
    <>
    {/* new-branch */}
      <div
        className="slider-area slider-style-1 variation-default slider-bg-image bg-banner1"
        data-black-overlay="1" id="welcome"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="inner text-center mt--60">
                <h1 className="title display-one">
                Welcome to <span className="theme-gradient">Web3 Agent
                  
                  
                </span>
                  <span className="color-off"></span>
                </h1>              
                <p style={{ marginLeft: "2rem", marginRight: "2rem"}} className="b1 desc-text">
                  Unlock the full potential of blockchain with our AI-driven Web3 assistant, 
                  designed to make blockchain tasks seamless and efficient. Build and scale your Web3 apps with the simplicity of Web2 methods   
                </p>
              
                <div className="button-group">
                   <Link
                    className={`btn-default`}
                    href="/ask-agent"
                  >
                    <span>Launch</span>
                  </Link>
                </div>
                {/* <p className="color-gray mt--5">💳 No credit card required!</p> */}
              </div>
            </div>
            <div className="col-lg-10 col-xl-10 order-1 order-lg-2">
              <div style={gradientBorder}  className="frame-image frame-image-bottom bg-flashlight video-popup icon-center">
                <Image src={bannerImg} alt="Banner Images" />
                <div className="video-icon">
                  <Link
                    className="btn-default rounded-player popup-video border bg-white-dropshadow"
                    href="https://vimeo.com/909044532"
                    data-vbtype="video"
                  >
                    <span>
                      <i className="feather-play"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chatenai-separator has-position-bottom">
          <Image className="w-100" src={separator} alt="" />
        </div>
      </div>
    </>
  );
};

export default Home;