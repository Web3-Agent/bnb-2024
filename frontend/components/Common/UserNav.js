import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import HeaderData from "../../data/header.json";

const UserNav = ({title}) => {
  const router = useRouter();

  const isActive = (href) => router.pathname === href;
  return (
    <>
      <div className="banner-area">
        <div className="settings-area">
          <h3 className="title">{title}</h3>

          <ul className="user-nav">
            {HeaderData &&
              HeaderData.navDashboardItem.slice(0, 7).map((data, index) => (
                <li key={index}>
                  <Link
                    href={data.link}
                    className={isActive(data.link) ? "active" : ""}
                  >
                    <span>
                      {data.text === "Profile" ? "Profile Details" : data.text}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserNav;
