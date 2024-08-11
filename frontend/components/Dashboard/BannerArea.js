import Image from "next/image";
import Slider from "react-slick";

import img1 from "../../public/images/slider-bg/slider-sm-01.png";
import img2 from "../../public/images/slider-bg/slider-sm-02.png";
import img3 from "../../public/images/slider-bg/slider-sm-03.png";

const BannerArea = () => {
  var settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    adaptiveHeight: true,
    cssEase: "linear",
  };
  return (
    <>
      <Slider
        {...settings}
        className="rainbow-slider-section slick-grid-15 rainbow-slick-dot sm-slider-carosel-activation"
      >
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-one">
            <div className="content">
              <h4 className="title">Frequently Asked Questions</h4>
              <p className="desc">Explore our comprehensive repository</p>
            </div>
            <div className="img-section">
              <Image src={img1} width={480} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-three">
            <div className="content">
              <h4 className="title">Cognitive Services Hub</h4>
              <p className="desc">
                Immerse yourself in the world of cutting-edge
              </p>
            </div>
            <div className="img-section">
              <Image src={img3} width={480} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
        <div className="chatenai-small-slider slide-single-layout">
          <div className="inner bg-four">
            <div className="content">
              <h4 className="title">Best Quantum AI Services</h4>
              <p className="desc">Elevate your ventures with our AI Services</p>
            </div>
            <div className="img-section">
              <Image src={img2} width={480} height={165} alt="sm slider img" />
            </div>
          </div>
        </div>
      </Slider>
    </>
  );
};

export default BannerArea;
