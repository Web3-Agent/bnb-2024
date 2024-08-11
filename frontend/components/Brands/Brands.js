import Image from "next/image";

import brand1 from "../../public/images/brand/brand-01.png";
import brand2 from "../../public/images/brand/brand-02.png";
import brand3 from "../../public/images/brand/brand-03.png";
import brand4 from "../../public/images/brand/brand-04.png";
import brand5 from "../../public/images/brand/brand-05.png";
import brand6 from "../../public/images/brand/brand-06.png";
import brand7 from "../../public/images/brand/brand-07.png";
import brand8 from "../../public/images/brand/brand-08.png";

const Brands = () => {
  return (
    <>
      <div className="rainbow-brand-area rainbow-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="section-title text-center sal-animate"
                data-sal="slide-up"
                data-sal-duration="700"
                data-sal-delay="100"
              >
                <h4 className="subtitle ">
                  <span className="theme-gradient">Our Awesome Client</span>
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mt--10">
              <ul className="brand-list brand-style-2">
                <li>
                  <a href="#">
                    <Image
                      src={brand1}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand2}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand3}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand4}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand5}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand6}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand7}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand8}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <Image
                      src={brand1}
                      width={148}
                      height={70}
                      alt="Brand Image"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brands;
