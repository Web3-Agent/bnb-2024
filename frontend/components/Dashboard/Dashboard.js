import React, { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import sal from 'sal.js';
import { nanoid } from '../../lib/utils';
import BannerArea from './BannerArea';
import Image from 'next/image';
import Form from '@/pages/Form';
import Items from './items';
import user from '../../public/images/team/team-01.jpg';
import { functionSchemas } from '@/lib/functions/schemas';
import { useChatComponentHandler } from '@/context/ChatComponentHandler';
import CodeGenerator from '../CodeGenerator/CodeGenerator';
import { ChatList } from '../Chat/ChatList';
import { MemoizedReactMarkdown } from '../Chat/Markdown';
import { CodeBlock } from '../Chat/CodeBlock';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import ReactMarkdown, { Options } from 'react-markdown';
import axios from 'axios';
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useWalletClient,
} from 'wagmi';
import { useVerifyMessage } from 'wagmi';
import Web3 from 'web3';
import { verifyMessage } from '@wagmi/core';
import { config } from '@/context/Web3Provider';
import { signMessage } from '@wagmi/core';
import { apiUrl } from '@/api/apiConstant';
import useLocalStorageIsNull from '@/hooks/localhost';
import { FaUserTie } from 'react-icons/fa';

const Dashboard = ({ id, initialMessages }) => {
  const { action, setAction } = useChatComponentHandler();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: provider } = useWalletClient();
  const isValueNull = useLocalStorageIsNull('web3agent-token');
  const [calldata, setCalldata] = useState([]);
  const signMsg = async () => {
    try {
      const response = await axios.get(
        `${apiUrl()}api/v1/user/user-nonce`,
        {
          params: {
            walletAddress: address.toLowerCase(),
          },
        },
        {
          headers: apiHeader(),
        }
      );
      console.log('🚀 ~ response ~ response:', response?.data);
      const result = await signMessage(config, {
        message: response?.data?.message,
      });
      console.log('🚀 ~ signMsg ~ result:', result);
      localStorage.setItem(
        `web3agent-token`,
        JSON.stringify({
          signature: result,
          walletAddress: address.toLowerCase(),
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isConnected && isValueNull) {
      console.log('heelow');
      signMsg();
    }
  }, [isConnected, address, isValueNull]);

  const redeemClaimtoken = async () => {
    try {
      const web3 = new Web3(provider);
      const account = await web3.eth.requestAccounts();
      const gasLimit = 200000;
      const gasPrice = await web3.eth.getGasPrice();
      const signedTx = await web3.eth.sendTransaction(
        { ...calldata, gasPrice: gasPrice, gasLimit: gasLimit },
        address
      );

      return signedTx;
    } catch (e) {
      console.log(e);
    }
  };

  const functionCallHandler = async (chatMessages, functionCall) => {
    if (functionCall.name === 'CREATE_SMART_CONTRACT') {
      console.log('👉🏻 Line 22 : ', JSON.parse(functionCall.arguments));

      setAction((prev) => ({
        ...prev,
        type: 'CREATE_SMART_CONTRACT',
        data: JSON.parse(functionCall.arguments),
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'CREATE_SMART_CONTRACT',
            role: 'function',
            content: content,
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'GIVE_ME_GAS_PRICE') {
      setAction((prev) => ({
        ...prev,
        type: 'GIVE_ME_GAS_PRICE',
        data: {},
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'GIVE_ME_GAS_PRICE',
            role: 'function',
            content: "{ name: 'Nikhil Pankaj', }",
            data: { name: 'Nikhil' },
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH') {
      setAction((prev) => ({
        ...prev,
        type: 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH',
        data: {},
      }));

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'TRANSACTION_DETAILS_BY_TRANSACTION_HASH',
            role: 'function',
            content: "{ name: 'Nikhil Pankaj', }",
            data: { name: 'Nikhil' },
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'APPROVE_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'APPROVE_ERC20_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('APPROVAL', {
        action: functionCall.name,
        userAddress: address,
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,

        {
          action: functionCall.name,
          userAddress: address,
          fromAddress: parsedArguments.tokenAddress,
          toAddress: parsedArguments.approvalAddress,
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log(apiResponse.data);
      setCalldata(apiResponse.data.data);

      redeemClaimtoken();
      // useSendTransaction({ to: apiResponse.data.data.to, value: apiResponse.data.data.value, data: apiResponse.data.data.calldata })
      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'APPROVE_ERC20_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'SEND_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'SEND_ERC20_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('SEND_ERC20_TOKEN', {
        action: functionCall.name,
        userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          fromAddress: parsedArguments.tokenAddress,
          toAddress: parsedArguments.receiverAddress,
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log(apiResponse.data);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'APPROVE_ERC20_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'WRAP_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'WRAP_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('WRAP_TOKEN', {
        action: functionCall.name,
        userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log(apiResponse.data);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'WRAP_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'UNWRAP_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'UNWRAP_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('UNWRAP_TOKEN', {
        action: functionCall.name,
        userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log(apiResponse.data);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'UNWRAP_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'SWAP_ERC20_TOKEN') {
      setAction((prev) => ({
        ...prev,
        type: 'SWAP_ERC20_TOKEN',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('SWAP_ERC20_TOKEN', {
        action: functionCall.name,
        userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          fromToken: parsedArguments.fromToken,
          toToken: parsedArguments.toToken,
          chainId: '56',
          slippage: parsedArguments.slippage,
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log('SWAP DATA', {
        fromAddress: parsedArguments.fromToken,
        toAddress: apiResponse.data,
        amount: parsedArguments.tokenAmount,
      });

      const approveResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: 'APPROVE_ERC20_TOKEN',
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          fromAddress: parsedArguments.fromToken,
          toAddress: apiResponse.data.data.toAddress,
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log('APPROVE DATA', approveResponse.data);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'SWAP_ERC20_TOKEN',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
    if (functionCall.name === 'LIMIT_ORDER') {
      setAction((prev) => ({
        ...prev,
        type: 'LIMIT_ORDER',
        data: {},
      }));

      const parsedArguments = JSON.parse(functionCall.arguments);

      console.log('LIMIT_ORDER', {
        action: functionCall.name,
        userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
        data: parsedArguments,
      });

      const apiResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: functionCall.name,
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          fromToken: parsedArguments.fromToken,
          toToken: parsedArguments.toToken,
          chainId: '56',
          slippage: parsedArguments.slippage,
          amount: parsedArguments.tokenAmount,
          price: parsedArguments.setPrice
        },
        {
          headers: apiHeader(),
        }
      );
      console.log('LIMIT_ORDER DATA', {
        fromAddress: parsedArguments.fromToken,
        toAddress: apiResponse.data,
        amount: parsedArguments.tokenAmount,
      });

      const approveResponse = await axios.post(
        `${apiUrl()}api/v1/calldata/`,
        {
          action: 'APPROVE_ERC20_TOKEN',
          userAddress: '0x87Cf86F087580aE6183fF66a437b0B466C2dc52F',
          fromAddress: parsedArguments.fromToken,
          toAddress: apiResponse.data.data.toAddress,
          amount: parsedArguments.tokenAmount,
        },
        {
          headers: apiHeader(),
        }
      );
      console.log('APPROVE DATA', approveResponse.data);

      const functionResponse = {
        messages: [
          ...chatMessages,
          {
            id: nanoid(),
            name: 'LIMIT_ORDER',
            role: 'function',
            content: JSON.stringify(apiResponse.data),
          },
        ],
        functions: functionSchemas,
      };

      return functionResponse;
    }
  };

  const { messages, append, setMessages, reload, stop, isLoading, input, setInput } =
    useChat({
      // api: "http://localhost:3001/api/chat",
      experimental_onFunctionCall: functionCallHandler,
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          console.log(response.statusText);
          // toast.error(response.statusText);
        }
      },
    });

  const handleSendMessage = async (message) => {
    // Push the new message to the messages array
    scrollToBottom();
    await append(
      {
        id,
        content: message,
        role: 'user',
      },
      { functions: functionSchemas }
    );
  };

  useEffect(() => {
    sal();
  }, []);

  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  };
  const processChildren = (children) => {
    if (Array.isArray(children) && typeof children[0] === 'string') {
      // Create a new array with the modified string
      const newChildren = [...children];
      newChildren[0] = newChildren[0].replace('`▍`', '▍');
      return newChildren;
    }
    return children;
  };
  return (
    <>
      <div className='rbt-main-content mr--0' ref={containerRef}>
        <div className='rbt-daynamic-page-content'>
          <div className='rbt-dashboard-content'>
            {/* <div className="banner-area">
              <BannerArea />
            </div> */}
            <div className='content-page'>
              <div className='chat-box-list'>
                <div className='welcome-wrapper'>
                  {/* <div className="content-section">
                    <h4 className="title">👋 Welcome, {address?.slice(0,4)}{"..."}{address?.slice(38)}
                    </h4>
                  </div> */}
                  {/* <div className="btn-section">
                    <a
                      className="btn-default bg-solid-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#newchatModal"
                    >
                      <span className="icon pe-2">
                        <i className="feather-plus-circle"></i>
                      </span>
                      <span>New Chat</span>
                    </a>
                  </div> */}
                </div>
                <div className='rainbow-generartor-section rainbow-section-gap'>
                  <div
                    className='section-title text-center sal-animate'
                    data-sal='slide-up'
                    data-sal-duration='700'
                    data-sal-delay='100'
                  >
                    <h4 className='subtitle '>
                      <span className='theme-gradient'>Web3Agent</span>
                    </h4>
                    <h2 className='title w-600 mb--20'>
                      Unleashing the Power of Web3
                    </h2>
                    <p className='description b1'>
                      We provide Mastering the Art of generating and deploying{' '}
                      <br />
                      Smartcontract using simple prompts with AI.
                    </p>
                  </div>
                  <div className='genarator-section'>
                    {messages?.slice(1).map((chat, index) =>
                      chat.role === 'user' ? (
                        <div key={index} className="chat-box author-speech bg-flashlight">
                          <div className="inner">
                            <div className="chat-section">
                              <div className="author border border-2 border-success">
                                <FaUserTie className="text-success" />
                              </div>
                              <div className='chat-content'>
                                <h6 className='title'>You</h6>
                                <p>{chat.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className='chat-box author-speech bg-flashlight'
                        >
                          <div className='inner'>
                            <div className='chat-section'>
                              <div className='author'>
                                <Image
                                  className='w-100'
                                  src={user}
                                  width={40}
                                  height={40}
                                  alt='Author'
                                />
                              </div>
                              <div className='chat-content'>
                                <h6 className='title'>Web3 Agent</h6>
                                <ReactMarkdown>{chat.content}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <ul className='genarator-card-group'>{/* <Items /> */}</ul>

                    <div className='content-page'></div>
                  </div>
                </div>
              </div>
            </div>
            <div className='rbt-static-bar collapse-width'>
              <Form onSendMessage={handleSendMessage} setInput={setInput} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
