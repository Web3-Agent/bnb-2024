import Link from "next/link";
import React from "react";

const SingleFooter = ({ data }) => {
  return (
    <>
      {data.map((item, innerIndex) => (
        <div className="col-lg-2 col-md-6 col-sm-6 col-12" key={innerIndex}>
          <div className="rainbow-footer-widget">
            <div className={`widget-menu-${item.top ? "top" : "bottom"}`}>
              <h4 className="title">{item.title}</h4>
              <div className="inner">
                <ul className="footer-link link-hover">
                  {item.innerItem.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.link}>{subItem.text}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SingleFooter;
