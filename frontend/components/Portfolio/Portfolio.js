import React, { useEffect, useState } from "react";
import Image from "next/image";
import UserNav from "../Common/UserNav";
import PricingTwo from "../Pricing/PricingTwo";
import AccordionItem from "../Accordion/AccordionItem";
import Table from "../Table/Table";
import TableThead from "../Table/TableThead";
import { restDataApi } from "@/data/rest/data-api";
import TableRow from "../Table/TableRow";

const Portfolio = () => {
    const [tokenBalances, setTokenBalances] = useState([]);
    const payload = {
        "action": "TOKEN_BALANCE_FOR_ADDRESS",
        "provider": "covalent",
        "query": {
            "walletAddress": "0xbdfa4f4492dd7b7cf211209c4791af8d52bf5c50",
            "network": "eth-mainnet"
        }
    }
    const getTokenHoldingForAddress = async () => {
        try {
            const response = await restDataApi(payload);
            console.log('👉🏻 Line 21 : ', response);
            setTokenBalances(response?.data?.items)
        } catch (error) {
            console.log('👉🏻 Line 24 : ', error);

        }
    }
    useEffect(() => {
        getTokenHoldingForAddress()
    }, [])
    const thead = () => {
        const headers = [
            { label: "#" },
            { label: "Token" },
            { label: "Symbol" },
            { label: "Decimals" },
            { label: "Contract" },
            { label: "Prince" },
            { label: "Balance" },
        ];
        return <TableThead headers={headers} theadClass="px-6 py-2" />;
    };
    const tbody = () => {


        return (
            <>
                {(tokenBalances || []).map((_, index) => (
                    <TableRow>
                        <td className="whitespace-nowrap px-6 py-2">
                            <Image src={_?.logo_url} alt={index}
                                width={20}
                                height={20}
                            />
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.token}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">

                            {_?.symbol}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.contract_decimals}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                            {_?.contract_address}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">{_?.price}</td>
                        <td className="whitespace-nowrap px-6 py-2">{_?.balance}</td>
                    </TableRow>
                ))}
            </>
        );
    };
    return (
        <>
            <div className="rbt-main-content mr--0 mb--0">
                <div className="rbt-daynamic-page-content center-width">
                    <div className="rbt-dashboard-content">
                        <UserNav title="Portfolio" />
                        <div className="content-page pb--50 overflow-auto">
                            <Table
                                renderThead={thead()}
                                renderTbody={tbody()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Portfolio;
