import React from "react";

export default function Loader({ show, close }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
            }}
        >
            {show && (
                <div
                    className="spinner-border text-warning"
                    style={{ width: "6rem", height: "6rem" }}
                    role="status"
                    onClick={close}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
        </div>
    );
}
