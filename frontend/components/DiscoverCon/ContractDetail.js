import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import { FaDownload } from "react-icons/fa6";
import { ImDownload2 } from "react-icons/im";
import { FaCode } from "react-icons/fa6";
import { SiBnbchain } from "react-icons/si";

import sal from "sal.js";
import Markdown from 'react-markdown'
import { toBase64 } from 'openai/core';
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import { saveAs } from 'file-saver';
import Button from "../ui/Button";
import axios from "axios";


const SELECT_OPTION = [
    { label: 'Smart Contract', value: 'SMART_CONTRACT' }
]
const LOADER_DEFAULT_STATE = {
    action: 'default',
    loading: false
}
const PROMPT_DEFAULT_STATE = {
    contractType: 'SMART_CONTRACT',
    prompt: 'Write a smart contract that stores a value.'
}
const DEPLOYED_CONTRACT_DEFAULT_STATE = {
    success: false,
    abi: [],
    contract: '',
    transactionHash: ''
}
const ContractDetail = () => {
    const [_web3, _setWeb3] = useState("");
    const [loader, setLoader] = useState(LOADER_DEFAULT_STATE)
    const [contractBuilderForm, setContractBuilderForm] = useState(PROMPT_DEFAULT_STATE);
    const [deployedContractInfo, setDeployedContractInfo] = useState(DEPLOYED_CONTRACT_DEFAULT_STATE);
    const [chatGPTRawResponse, setChatGPTRawResponse] = useState(null);
    // const [chatGPTRawResponse, setChatGPTRawResponse] = useState("Sure, here is a simple smart contract written in Solidity that stores a value. This contract follows the best security practices such as using the latest compiler version and making the state variable private.\n\n```solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.7;\n\ncontract StoreValue {\n    uint256 private value;\n\n    event ValueChanged(uint256 newValue);\n\n    function setValue(uint256 _value) public {\n        value = _value;\n        emit ValueChanged(_value);\n    }\n\n    function getValue() public view returns (uint256) {\n        return value;\n    }\n}\n```\n\nThis contract has a private state variable `value` and two functions `setValue` and `getValue`. The `setValue` function allows you to set the value of the `value` variable and emits an event `ValueChanged` whenever the value is changed. The `getValue` function allows you to view the current value of the `value` variable.");
    const [chatGPTCodeResponse, setChatGPTCodeResponse] = useState("");
    const resetStates = () => {
        setLoader(LOADER_DEFAULT_STATE);
        setContractBuilderForm(PROMPT_DEFAULT_STATE);
        setDeployedContractInfo(DEPLOYED_CONTRACT_DEFAULT_STATE);
        setChatGPTRawResponse("");
        setChatGPTCodeResponse("")
    }
    const getChatGptResponse = async () => {
        setLoader((prev) => ({
            ...prev,
            action: 'generate',
            loading: true
        }))
        try {
            const { data } = await axios.post('/api/contract-builders',
                {
                    "template": "SMART_CONTRACT",
                    "query": {
                        "prompt": "Write a smart contract that stores a value."
                    }
                }
            )
            setChatGPTRawResponse(data?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoader((prev) => ({
                ...prev,
                action: 'default',
                loading: false
            }))
        }
    }

    const getCodeOnlyFromChatGPTResponse = () => {
        const code = chatGPTRawResponse.substring(chatGPTRawResponse.indexOf('```solidity') + 11, chatGPTRawResponse.lastIndexOf('```'))
        return code;
    }

    const downloadSourceCode = () => {
        // setIsLoading(true)
        try {
            const code = getCodeOnlyFromChatGPTResponse();
            console.log({ code })
            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'contract.sol');
        } catch (error) {

        } finally {
            // setIsLoading(false)
        }
    }

    const openInRemix = async () => {
        try {
            const code = getCodeOnlyFromChatGPTResponse();
            const base = toBase64(code)
            const link = `https://remix.ethereum.org/?#code=${base}&autoCompile=true&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js`
            window.open(link, "_blank")
        } catch (error) {
            console.log({ error })
        }
    }

    const downloadHardHatProject = async () => {
        // setIsLoading(true)
        try {
            const code = getCodeOnlyFromChatGPTResponse();
            const response = await fetch(
                `${process.env.WEB_THREE_AGENT_NODE_APP}/api/v1/hardhat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sourceCode: code })
                });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'hardhat-project.zip';
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error(error)
        } finally {
            // setIsLoading(false)
        }
    }

    const deployContractTxnCall = async (abi, bytecode) => {
        try {
            const accounts = await _web3.eth.getAccounts();
            const networkId = await _web3.eth.net.getId();
            const contract = new _web3.eth.Contract(
                abi,
            );
            let transactionHash = ''
            // Deploy the contract
            const deployedContract = await contract.deploy({
                data: bytecode
            }).send({
                from: accounts[0],
                gas: '3000000', // Adjust gas value according to your contract
                gasPrice: '1000000000', // Adjust gas price according to your preferences
                // gas: '3000000', // Adjust gas value according to your contract
            }).on('transactionHash', (hash) => {
                console.log('Transaction hash:', hash);
                transactionHash = hash
                // You can save the transaction hash if needed
            }).on('receipt', (receipt) => {
                console.log('Receipt:', receipt);
            }).on('confirmation', (confirmationNumber, receipt) => {
                console.log('Confirmation number:', confirmationNumber);
            }).on('error', (error) => {
                console.error('Error:', error);
            });
            setDeployedContractInfo((prev) => ({
                ...prev,
                success: true,
                contract: deployedContract.options.address,
                transactionHash
            }))
            setChatGPTRawResponse(null);
            return deployedContract.options.address
        } catch (error) {
            console.error(error)
        }
    };

    const deployContract = async () => {
        setLoader((prev) => ({
            ...prev,
            action: 'deploy-contract',
            loading: true
        }))
        try {
            const sourceCode = getCodeOnlyFromChatGPTResponse()
            const { data: { data } } = await axios.post(`${process.env.WEB_THREE_AGENT_NODE_APP}/api/v1/compile-contract`,
                {
                    sourceCode
                }
            )
            setDeployedContractInfo((prev) => ({
                ...prev,
                abi: data.abi
            }))
            await deployContractTxnCall(data.abi, data.bytecode)
        } catch (error) {
            console.error(error)
        } finally {
            setLoader((prev) => ({
                ...prev,
                action: 'default',
                loading: false
            }))
        }
    }

    useEffect(() => {
        sal();
    }, []);

    useEffect(() => {
        const initializeWeb3 = async () => {
            // Modern DApp browsers like MetaMask inject a web3 instance
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    _setWeb3(web3Instance);
                } catch (error) {
                    console.error('User denied account access');
                }
            }
            // Legacy dApp browsers
            else if (window.web3) {
                const web3Instance = new Web3(window.web3.currentProvider);
                let myWeb3 = new Web3(web3Instance);

                _setWeb3(myWeb3);
                // const oldProvider = web3.currentProvider; // keep a reference to metamask provider
            }
            else {
                console.log('No web3 instance detected');
            }
        };

        initializeWeb3();
    }, []);

    useEffect(() => {
        if (chatGPTRawResponse?.length) {
            const code = getCodeOnlyFromChatGPTResponse();
            setChatGPTCodeResponse(code);
        }
    }, [chatGPTRawResponse]);

    return (
        <>
            <div className="rbt-main-content mr--0 mt--30">
                <div className="rbt-daynamic-page-content">
                    <div className="rbt-dashboard-content">
                        <div className="content-page">
                            <div className="chat-box-list">
                                <div className="rainbow-generartor-section rainbow-section-gap">
                                    <div
                                        className="section-title text-center sal-animate"
                                        data-sal="slide-up"
                                        data-sal-duration="700"
                                        data-sal-delay="100"
                                    >
                                        <h4 className="subtitle ">
                                            <span className="theme-gradient">Web3Agent</span>
                                        </h4>
                                        <h3 className="title w-600 mb--10">
                                            Create Contract
                                        </h3>
                                        <p className="description b3">
                                            Token that allows the owner to mint tokens up to the cap.
                                        </p>
                                    </div>
                                    <div className="genarator-section" style={{ marginBottom: "2rem" }}>
                                        <div className="row rounded p-4 border-gradient">
                                            <h4>constructor Functionality</h4>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: "repeat(2, minmax(300px,1fr))",
                                                gap: "1rem",
                                                paddingBottom: "2rem"
                                            }}>
                                                <div>
                                                    <label>Name</label>
                                                    <i className="feather-help-circle" style={{ marginLeft: "5px" }}></i>
                                                    <input type="text" placeholder="string" style={{ fontSize: "11px" }}></input>
                                                </div>
                                                <div>
                                                    <label>Symbol</label>
                                                    <i className="feather-help-circle" style={{ marginLeft: "5px" }}></i>
                                                    <input className="border-gradint" type="text" placeholder="string" style={{ fontSize: "11px" }}></input>
                                                </div>
                                                <div>
                                                    <label>Total Supply</label>
                                                    <i className="feather-help-circle" style={{ marginLeft: "5px" }}></i>
                                                    <input type="text" placeholder="unit256" style={{ fontSize: "11px" }}></input>
                                                </div>
                                                <div>
                                                    <label>Cap</label>
                                                    <i className="feather-help-circle" style={{ marginLeft: "5px" }}></i>
                                                    <input type="text" placeholder="unit256" style={{ fontSize: "11px" }}></input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="genarator-section">
                                        <div className="row rounded p-4 border-gradient">
                                            <h4>Deploy From</h4>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <p style={{ marginBottom: "5px" }}>Metamask Wallet</p>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <input type="text" placeholder="Account" style={{ width: "500px"}}></input>
                                                    <button className="btn-default btn-small" style={{
                                                    }}>CONNECT WALLET</button>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                                                <hr />
                                                OR
                                                <hr />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                    <p><i className="feather-circle"></i>{" "}Unlocked Accounts</p>
                                                    <p>Balance: 1000000.00 BB{" "}<i className="feather-help-circle"></i></p>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "center" }} >
                                                    <input  type="text" placeholder="0xbE9DA44bF7423c6475fC4594Ad5Bd7a4c6" className='border-gradient'
                                                        style={{ width: "350px", fontSize: "11px", textAlign: "center", padding: "3px 10px"
                                                    }}></input>
                                                    {/* <select style={{padding:""}}>
                                                        <option>0xbE9DA44bF7423c6475fC4594Ad5Bd7a4c6951E8547</option>
                                                        <option>0xbE9DA44bF7423c6475fC4594Ad5Bd7a4c6951E8547</option>
                                                        <option>0xbE9DA44bF7423c6475fC4594Ad5Bd7a4c6951E8547</option>
                                                        <option>0xbE9DA44bF7423c6475fC4594Ad5Bd7a4c6951E8547</option>
                                                    </select> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{display:"flex",justifyContent:"center"}}>
                                        <button className="btn-default btn-small" style={{ margin:"15px"}}>DEPLOY</button>   
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ContractDetail;
