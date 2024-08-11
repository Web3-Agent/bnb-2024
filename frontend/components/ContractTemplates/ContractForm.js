import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FaCode, FaDownload } from 'react-icons/fa';
import { SiBnbchain } from 'react-icons/si';
import { ImDownload2 } from 'react-icons/im';
import { saveAs } from 'file-saver';
import { useAccount, useSignMessage } from 'wagmi';
import Web3 from 'web3';
import axios from 'axios';
import { Wallet, Provider, Contract, utils } from 'zksync-web3';







const LOADER_DEFAULT_STATE = {
    action: 'default',
    loading: false
};

const DEPLOYED_CONTRACT_DEFAULT_STATE = {
    success: false,
    abi: [],
    contract: '',
    transactionHash: ''
};

export default function ContractForm({ setSelectedContract, selectedContract }) {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [web3, setWeb3] = useState(null);
    const [loader, setLoader] = useState(LOADER_DEFAULT_STATE);
    const [deployedContractInfo, setDeployedContractInfo] = useState(DEPLOYED_CONTRACT_DEFAULT_STATE);
    const [form, setForm] = useState({});
    const [updatedCode, setUpdatedCode] = useState("");
    const [signature, setSignature] = useState("");
    const code = selectedContract.code;

    const downloadSourceCode = () => {
        try {
            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'contract.sol');
        } catch (error) {
            console.error(error);
        }
    };

    const openInRemix = async () => {
        try {
            const base = btoa(code); // Convert to Base64
            const link = `https://remix.ethereum.org/?#code=${base}&autoCompile=true&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.20+commit.a1b79de6.js`;
            window.open(link, "_blank");
        } catch (error) {
            console.error(error);
        }
    };

    const downloadHardHatProject = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/hardhat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sourceCode: code })
                }
            );
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
            console.error(error);
        }
    };

    useEffect(() => {
        const initializeWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);
                } catch (error) {
                    console.error('User denied account access');
                }
            } else if (window.web3) {
                const web3Instance = new Web3(window.web3.currentProvider);
                setWeb3(web3Instance);
            } else {
                console.log('No web3 instance detected');
            }
        };

        initializeWeb3();
    }, []);

    const deployContractTxnCall = async (abi, bytecode) => {
        if (!web3) {
            console.error('Web3 is not initialized');
            return;
        }
        try {
            const accounts = await web3.eth.getAccounts();
            const contract = new web3.eth.Contract( abi );
            const gasPrice = await provider.getGasPrice();

            const payMasterParm = utils.getPaymasterParams("0x56943c0C6DB4ebE6B485749DaB63A1AB69cd56eA", {
                type: "General",
                // empty bytes as paymaster does not use innerInput
                innerInput: new Uint8Array(),
                });


            let transactionHash = '';

            const deployedContract = await contract.deploy({
                data: bytecode,
                arguments: selectedContract.constructorParameters.map(param => form[param.key] || '')
            }).send({
                from: accounts[0],
                gas: '3000000',
                gasPrice: '1000000000'
                // maxPriorityFeePerGas: ethers.BigNumber.from(0),
                // maxFeePerGas: '900000000',
                // // hardhcoded for testing
                // gasLimit: 6000000,
                // customData: {
                // gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
                // payMasterParm,
                // },
            }).on('transactionHash', (hash) => {
                transactionHash = hash;
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
            }));

            return deployedContract.options.address;
        } catch (error) {
            console.error(error);
        }
    };

    const deployContract = async () => {
        setLoader((prev) => ({
            ...prev,
            action: 'deploy-contract',
            loading: true
        }));
        try {
            if (!isConnected || !address) {
                console.error('Wallet not connected');
                return;
            }

            if (!signature) {
                const message = 'Sign this message to confirm your identity.';
                const sig = await signMessageAsync({ message });
                setSignature(sig);
            }

           
            const payload = {
                sourceCode: `// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MintableToken is ERC20 {
   
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) payable ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

  
    function mint(uint256 amount, address to) external {
        _mint(to, amount);
    }
}`,
                // constructorArgs: selectedContract.constructorParameters.map(param => form[param.key] || '')
                 constructorArgs: ["mayur","mtk","100000"]

            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/compile-contract`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'walletAddress': address,
                        'signature': signature
                    }
                }
            );

            const { data } = response.data;
            console.log("Compiled ABI:", data.abi);
            console.log("Compiled Bytecode:", data.bytecode);

            if (!data.abi || !data.bytecode) {
                throw new Error("ABI or Bytecode not provided in the response.");
            }

            setDeployedContractInfo((prev) => ({
                ...prev,
                abi: data.abi
            }));

            await deployContractTxnCall(data.abi, data.bytecode);
        } catch (error) {
            console.error("Deploy contract error:", error);
        } finally {
            setLoader((prev) => ({
                ...prev,
                action: 'default',
                loading: false
            }));
        }
    };

    useEffect(() => {
        const updateContractCode = () => {
            const keys = Object.keys(form);
            let tempCode = code;
            keys.forEach(item => {
                tempCode = tempCode.replace(item, form[item]);
            });
            setUpdatedCode(tempCode);
        };
        updateContractCode();
    }, [form]);

    return (
        <>
            <div className='container p-4'>
                <div className='row' onClick={() => setSelectedContract({})}>
                    <div className='col-12'>
                        <h4 style={{ cursor: "pointer" }}> <i className="feather-arrow-left"></i> Back</h4>
                    </div>
                </div>
                <div className='row gap-1'>
                    <div className='col-12 fs-1'>
                        {selectedContract?.title}
                    </div>
                    <div className='col-12 fs-3'>
                        {selectedContract?.description}
                    </div>
                </div>
                <div className='d-flex gap-4 py-4'>
                    {selectedContract?.tags?.map((item, index) => (
                        <div style={styles.promptCard} key={index}>{item}</div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <div className='row m-0 mt-4' style={styles.promptCard}>
                        <div className='col-12 h4 mt-4'>Constructor Parameters</div>
                        {selectedContract?.constructorParameters?.map((item, index) => (
                            <div key={index} className='col-6 pb-4'>
                                <Input
                                    label={item.label}
                                    name={item.key}
                                    value={form[item.key] || ''}
                                    onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>

                    <div className='row m-0 mt-4' style={styles.promptCard}>
                        <div style={{ maxHeight: "600px", overflow: "auto" }} className='col-12 pb-4'>
                            <pre style={{ background: 'black' }}>{updatedCode}</pre>
                        </div>
                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col-12 text-center' style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <Button style={{ width: "100%" }} btnClass={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"} title="Download" onClick={downloadSourceCode} icon={FaDownload} iconclassName="text-white fs-3" />
                        <Button style={{ width: "100%" }} btnClass={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"} title="Hardhat" onClick={downloadHardHatProject} icon={ImDownload2} iconclassName="text-white fs-3" />
                        <Button style={{ width: "100%" }} btnClass={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"} title="Remix" onClick={openInRemix} icon={FaCode} iconclassName="text-white fs-3" />
                        <Button style={{ width: "100%" }} btnClass={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"} title="Deploy" onClick={deployContract} icon={SiBnbchain} iconclassName="text-white fs-3" loading={loader.action === 'deploy-contract' && loader.loading} disabled={loader.action === 'deploy-contract' && loader.loading} />
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    promptCard: {
        backgroundColor: '#1a1a1a',
        borderColor: '#D11EE5',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        textAlign: 'left',
        padding: '4px 8px',
        borderRadius: '8px',
        display: "flex",
        alignContent: "flex-start"
    },
};
