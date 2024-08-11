import { useAppContext } from "@/context/Context";
import Link from "next/link";

const HeaderTop = () => {
  const { toggleTop, setToggle } = useAppContext();
  return (
    <>
      <div
        className={`header-top-news bg-image1 ${toggleTop ? "" : "deactive"}`}
      >
        <div className="wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="inner">
                  <div className="content">
                    <span className="rainbow-badge">Limited Time Offer</span>
                    <span className="news-text">
                      Intro price. Get ChatenAI for Big Sale -95% off.
                    </span>
                  </div>
                  <div className="right-button">
                    <Link className="btn-read-more" href="#">
                      <span>
                        Purchase Now <i className="feather-arrow-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="icon-close">
          <button
            className="close-button bgsection-activation"
            onClick={() => setToggle(!toggleTop)}
          >
            <i className="feather-x"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderTop;
