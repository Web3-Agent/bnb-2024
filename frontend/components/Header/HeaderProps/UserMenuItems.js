import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const UserMenuItems = ({ parentClass }) => {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;
  return (
    <>
      <ul className={parentClass}>
        <li>
          <Link
            className={isActive("/profile-details") ? "active" : ""}
            href="/profile-details"
          >
            <i className="feather-user"></i>
            <span>Profile Details</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/notification") ? "active" : ""}
            href="/notification"
          >
            <i className="feather-shopping-bag"></i>
            <span>Notification</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/chat-export") ? "active" : ""}
            href="/chat-export"
          >
            <i className="feather-users"></i>
            <span>Chat Export</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/appearance") ? "active" : ""}
            href="/appearance"
          >
            <i className="feather-home"></i>
            <span>Apperance</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/plans-billing") ? "active" : ""}
            href="/plans-billing"
          >
            <i className="feather-briefcase"></i>
            <span>Plans and Billing</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/sessions") ? "active" : ""}
            href="/sessions"
          >
            <i className="feather-users"></i>
            <span>Sessions</span>
          </Link>
        </li>
        <li>
          <Link
            className={isActive("/application") ? "active" : ""}
            href="/application"
          >
            <i className="feather-list"></i>
            <span>Application</span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default UserMenuItems;
