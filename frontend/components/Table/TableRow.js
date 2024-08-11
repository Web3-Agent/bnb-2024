import { ReactNode } from "react";

export default function TableRow({ children }) {
    return (
        <tr className="">
            {children}
        </tr>
    );
}
