import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useChat } from "ai/react";
import sal from "sal.js";
import { nanoid } from "../../lib/utils";
import { FaLaptopCode, FaUserTie } from "react-icons/fa";

import { useChatComponentHandler } from "@/context/ChatComponentHandler";
import MountComponent from "../MountComponent/MountComponent";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Button from "../ui/Button";
import axiosHelper from "@/data/rest/axios";
import RightPanel from "./RightPanel";
import { warpcastSchemas } from "@/lib/functions/warpcastSchema";

const COMPONENT_MOUNT_ACTIONS = [
  "FETCH_USERS_DETAILS_BY_GIVEN_USERNAME",
  "FETCH_USER_DETAILS_BY_GIVEN_FID",
  "FOLLOWERS_BY_FID",
  "FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME",
  "FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME",
];

const DEFAULT_PROMPT_MESSAGES = [
  {
    prompt: "User Details",
    example:
      "Please give me the user details for mayurbagga username",
    category: "User",
  },
  {
    prompt: "User Details",
    example:
      "Please give me the user details for fid 3",
    category: "User",
  },
  {
    prompt: "Followers Details",
    example:
      "Please give me the follower's details for fid 3",
    category: "Follower",
  },
  // {
  //   prompt: "Cast a Post",
  //   example:
  //     "Cast this as a post in Farcaster",
  //   category: "Cast",
  // },
  {
    prompt: "Storage Details",
    example:
      "Give me storage allocation for mayurbagga",
    category: "Storage",
  },
  {
    prompt: "Storage Details",
    example:
      "Give me storage usage for mayurbagga",
    category: "Storage",
  },
];

const SearchData = ({ id, initialMessages }) => {
  // const { address: userAccountAddress } = useAccount();
  const [message, setMessage] = useState("");
  const containerRef = useRef(null);
  const { action, setAction } = useChatComponentHandler();
  const [userChatHistory, setUserChatHistory] = useState([]);
  const [showCommandPan, setShowCommandPan] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  useEffect(() => {
    // Scrolls to the bottom of the container when component mounts or updates
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });
  useEffect(() => {
    // getChatHistory();
  }, []);
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const deleteChatHistory = async (chat) => {
    const { _id } = chat;
    const {
      data: { data },
    } = await axiosHelper(
      `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/chat-history/${_id}`,
      "DELETE",
      null,
      null
    );
    console.log("👉🏻 Line 130 : ", data);
    getChatHistory();
  };
  // const getChatHistory = async () => {
  //   try {
  //     const {
  //       data: { data },
  //     } = await axiosHelper(
  //       `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/chat-history?userAccountAddress=${userAccountAddress}&type=SEARCH_DATA`,
  //       "GET",
  //       null,
  //       null
  //     );
  //     setUserChatHistory(data);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // };
  // const handleSaveChatHistoryClick = async () => {
  //   try {
  //     if (!messages?.length) {
  //       throw new Error("NO_CHAT_TO_SAVE");
  //     }
  //     const { data } = await axiosHelper(
  //       `${process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP}/api/v1/chat-history`,
  //       "POST",
  //       null,
  //       { messages, wallet_address: userAccountAddress, type: "SEARCH_DATA" }
  //     );
  //     getChatHistory();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const resetToDefault = () => {
    setMessage("");
    setAction((prev) => ({
      ...prev,
      type: "",
      data: {},
    }));
    setMessages([]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      handleSendMessage(message);
      console.log(message);
      setMessage("");
    } else {
      alert("Please enter a message.");
    }
  };

  const handleKeyPress = (event) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  const getCategoryNames = () => {
    let category = DEFAULT_PROMPT_MESSAGES.map((item) => item.category).filter(
      function (v, i, self) {
        return i == self.indexOf(v);
      }
    );
    return ["All"].concat(category);
  };

  const functionCallHandler = async (chatMessages, functionCall) => {
    console.log("🚀 ~ functionCallHandler ~ chatMessages:", chatMessages);
    console.log("🚀 ~ functionCallHandler ~ functionCall:", functionCall);
    const name = functionCall?.name;
    if (COMPONENT_MOUNT_ACTIONS.includes(name)) {
      const args = JSON.parse(functionCall.arguments);
      console.log("🚀 ~ functionCallHandler ~ args:", args);
      const temp = {
        id: nanoid(),
        name,
        role: "system",
        content: name,
        data: {
          ...args,
          type: name,
        },
      };
      setMessages([...chatMessages, temp]);
    }
  };

  const {
    messages,
    setMessages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
  } = useChat({
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

  const handleSendMessage = async () => {
    // Push the new message to the messages array
    scrollToBottom();
    await append(
      {
        id,
        content: message,
        role: "user",
      },
      { functions: warpcastSchemas }
    );
  };

  useEffect(() => {
    sal();
  }, []);

  const scrollToBottom = (chat, action) => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };
  const chatAction = (chat, action) => {
    console.log("👉🏻 Line 411 : ", chat, action);

    switch (action) {
      case "SELECT": {
        setMessages(chat.messages);
        break;
      }
      case "DELETE": {
        deleteChatHistory(chat);
      }
      case "RESET": {
        resetToDefault();
      }
      default: {
        console.log("UNKNOWN_ACTION_REQUEST");
      }
    }
  };
  return (
    <>
      {console.log("👉🏻 Line 403 : ", userChatHistory)}
      <RightPanel
        data={userChatHistory}
        chatAction={(chat, action) => {
          chatAction(chat, action);
        }}
      />
      <div className="rbt-main-content">
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
                    <h2 className="title w-600 mb--10">
                      Unleashing the Power of Web3
                    </h2>
                    <p className="description b1">
                      We provide Mastering the Art of generating and deploying{" "}
                      <br />
                      Smartcontract using simple prompts with AI.
                    </p>
                  </div>
                  <div className="genarator-section">
                    {messages
                      .filter((item) => item?.content?.length)
                      .map((chat, index) =>
                        chat.role === "user" ? (
                          <div
                            key={index}
                            className="chat-box author-speech bg-flashlight mt--20"
                          >
                            <div className="inner">
                              <div className="chat-section">
                                <div className="author border border-2 border-success">
                                  <FaUserTie className="text-success" />
                                </div>
                                <div className="chat-content">
                                  <h6 className="title">You</h6>
                                  <p>{chat.content}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="chat-box author-speech bg-flashlight"
                          >
                            <div className="inner">
                              <div className="chat-section">
                                <div className="author border border-2 border-primary">
                                  <FaLaptopCode className="text-primary" />
                                </div>
                                <div className="chat-content">
                                  <h6 className="title">Web3 Agent</h6>
                                  {console.log("👉🏻 Line 223 : ", chat)}
                                  {COMPONENT_MOUNT_ACTIONS.includes(
                                    chat?.content
                                  ) ? (
                                    <MountComponent data={chat} />
                                  ) : (
                                    <Markdown
                                      remarkPlugins={[remarkGfm]}
                                      children={chat.content}
                                      components={{
                                        code(props) {
                                          const {
                                            children,
                                            className,
                                            node,
                                            ...rest
                                          } = props;
                                          const match = /language-(\w+)/.exec(
                                            className || ""
                                          );
                                          return match ? (
                                            <SyntaxHighlighter
                                              {...rest}
                                              PreTag="div"
                                              children={String(
                                                children
                                              ).replace(/\n$/, "")}
                                              language={match[1]}
                                            // style={a11yDark}
                                            />
                                          ) : (
                                            <code
                                              {...rest}
                                              className={className}
                                            >
                                              {children}
                                            </code>
                                          );
                                        },
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="rbt-static-bar">
              <div ref={containerRef} onKeyDown={handleKeyPress}>
                <Tooltip
                  id="my-tooltip"
                  className="custom-tooltip tooltip-inner"
                />
                <div className="new-chat-form">
                  <div
                    className="offcanvas offcanvas-bottom rounded bg-dark"
                    tabIndex="-1"
                    id="offcanvasExample"
                    aria-labelledby="offcanvasExampleLabel"
                    style={{ position: "relative" }}
                  >
                    <div className="offcanvas-header p-4 border-bottom border-secondary">
                      <h5
                        className="offcanvas-title"
                        id="offcanvasExampleLabel"
                      >
                        Query Commands
                      </h5>
                      <button
                        type="button"
                        className="btn-close bg-light"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="offcanvas-body">
                      <div
                        className="border-bottom border-secondary pb-4"
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: 20,
                        }}
                      >
                        {getCategoryNames()?.map((item, index) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedCategory(item)}
                            title={item}
                            // btnclassName={"btn p-3 btn-secondry border-gradient color-white my-4 fs-4"}
                            btnClass={`btn btn-outline-white color-white p-2 ${selectedCategory === item
                              ? "btn-outline-success"
                              : "btn-outline-secondary"
                              }`}
                            style={{ width: "80px" }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "start",
                          alignItems: "start",
                        }}
                      >
                        {DEFAULT_PROMPT_MESSAGES.map(
                          (item, index) =>
                            (selectedCategory === "All" ||
                              selectedCategory === item.category) && (
                              <div
                                onClick={() => setMessage(item.example)}
                                data-bs-dismiss="offcanvas"
                                key={index}
                                className="py-2 text-light cursor-pointer text-start"
                              >
                                <i className="feather-terminal px-2"></i>
                                {item.example}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  className="new-chat-form border-gradient"
                  onSubmit={handleSubmit}
                >
                  <div className="left-icons">
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setShowCommandPan(true)}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasExample"
                      aria-controls="offcanvasExample"
                      style={{
                        cursor: "pointer",
                        color: "white",
                        fontSize: "17px",
                      }}
                    >
                      <i className="feather-command"></i>
                    </button>
                  </div>
                  <textarea
                    rows="1"
                    placeholder="Send a message..."
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyPress}
                  />
                  <div className="right-icons">
                    {/* <button
                      type="button"
                      className="form-icon icon-send"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Save Chat"
                      onClick={() => handleSaveChatHistoryClick()}
                    >
                      <i className="feather-bookmark"></i>
                    </button> */}
                    <button
                      type="submit"
                      className="form-icon icon-send"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Send message"
                    >
                      <i className="feather-send"></i>
                    </button>
                    <button
                      type="button"
                      className="form-icon icon-send"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Clear query"
                      onClick={() => resetToDefault()}
                    >
                      <i className="feather-refresh-ccw"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* <div className="rbt-static-bar">
              <form
                className='new-chat-form border-gradient'
                onSubmit={handleSubmit}
              >
                <div className='left-icons'>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setShowCommandPan(true)}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                    style={{
                      cursor: 'pointer',
                      color: "white",
                      fontSize: "17px"
                    }}
                  >
                    <i className='feather-command'></i>
                  </button>
                </div>
                <textarea
                  rows='1'
                  placeholder='Send a message...'
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                />
                <div className='right-icons'>
                  <button
                    type='submit'
                    className='form-icon icon-send'
                    data-tooltip-id='my-tooltip'
                    data-tooltip-content='Send message'
                  >
                    <i className='feather-send'></i>
                  </button>
                  <button
                    type='button'
                    className='form-icon icon-send'
                    data-tooltip-id='my-tooltip'
                    data-tooltip-content='Clear query'
                    onClick={() => resetToDefault()}
                  >
                    <i className='feather-refresh-ccw'></i>
                  </button>
                </div>
              </form>

              <p className="b3 small-text">
                Web3Agent can make mistakes. Consider checking important information.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  promptContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    // padding: '20px',
    flexWrap: "wrap",
  },
  col: {
    display: "flex",
    justifyContent: "center",
  },
  promptCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#D11EE5",
    borderWidth: "1px",
    borderStyle: "solid",
    width: "100%",
    maxWidth: "300px",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    textAlign: "left",
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
  },
  imgContainer: {
    marginRight: "15px",
  },
  img: {
    borderRadius: "5px",
  },
  promptText: {
    // marginBottom: '5px',
    fontSize: "1.5rem",
  },
  exampleText: {
    fontSize: "1rem",
  },
};

export default SearchData;
