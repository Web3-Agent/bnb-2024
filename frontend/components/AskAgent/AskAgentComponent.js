import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useChat } from "ai/react";
import sal from "sal.js";
import { FaLaptopCode } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

import { searchDataSchemas } from "@/lib/functions/searchDataSchema";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const AskAgentComponent = ({ id, initialMessages, nameParam, descParam }) => {

    const [message, setMessage] = useState("");
    const containerRef = useRef(null);
    useEffect(() => {
        // Scrolls to the bottom of the container when component mounts or updates
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const resetToDefault = () => {
        setMessage("");
        setAction((prev) => ({
            ...prev,
            type: "",
            data: {},
        }));
        setMessages([])
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim() !== "") {
            handleSendMessage(message);
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


    const functionCallHandler = async (chatMessages, functionCall) => {
        console.log('👉🏻 Line 23 : ', functionCall);
    };

    const { messages, setMessages, append, reload, stop, isLoading, input, setInput } =
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
                    console.log(response.statusText)
                    // toast.error(response.statusText);
                }
            },
        });

    const handleSendMessage = async () => {
        // Push the new message to the messages array
        scrollToBottom()
        await append(
            {
                id,
                content: message,
                role: "user",
            },
            { functions: searchDataSchemas }
        );
    };

    useEffect(() => {
        sal();
    }, []);


    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    };

    return (
        <>
            <div className="rbt-main-content mr--0" ref={containerRef}>
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
                                        <h2 className="title w-600 mb--20">
                                            Unleashing the Power of AI
                                        </h2>
                                        <p className="description b1">
                                            Ask anything, and get answers like lightning fast 🚀
                                        </p>
                                    </div>
                                    <div className="genarator-section">
                                        {(messages.filter(item => item?.content?.length))?.slice(1).map((chat, index) => (

                                            chat.role === 'user' ? (
                                                <div key={index} className="chat-box author-speech bg-flashlight mt--20">
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
                                            ) : (<div key={index} className="chat-box author-speech bg-flashlight">
                                                <div className="inner">
                                                    <div className="chat-section">
                                                        <div className="author border border-2 border-primary">
                                                            <FaLaptopCode className="text-primary" />
                                                        </div>
                                                        <div className="chat-content">
                                                            <h6 className="title">Web3 Agent</h6>
                                                            <Markdown remarkPlugins={[remarkGfm]}
                                                                children={chat.content}
                                                                components={{
                                                                    code(props) {
                                                                        const { children, className, node, ...rest } = props;
                                                                        const match = /language-(\w+)/.exec(className || '');
                                                                        return match ? (
                                                                            <SyntaxHighlighter
                                                                                {...rest}
                                                                                PreTag="div"
                                                                                children={String(children).replace(/\n$/, '')}
                                                                                language={match[1]}
                                                                            // style={a11yDark}
                                                                            />
                                                                        ) : (
                                                                            <code {...rest} className={className}>
                                                                                {children}
                                                                            </code>
                                                                        );
                                                                    }
                                                                }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rbt-static-bar collapse-width">
                            <div ref={containerRef} onKeyDown={handleKeyPress}>
                                <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
                                <form className="new-chat-form border-gradient" onSubmit={handleSubmit}>
                                    <textarea
                                        rows="1"
                                        placeholder="Send a message..."
                                        value={message}
                                        onChange={handleMessageChange}
                                        onKeyDown={handleKeyPress}

                                    />
                                    <div className="right-icons">
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
                    </div>
                </div>
            </div >
        </>
    );
};

export default AskAgentComponent;
