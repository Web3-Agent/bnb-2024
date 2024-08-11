import React, { createContext, useContext, useState, useEffect } from "react";

export const ChatComponentHandlerContext = createContext();

export const useChatComponentHandler = () => {
    const context = useContext(ChatComponentHandlerContext);
    if (context === undefined) {
        throw new Error("useChatComponentHandler must be used within an ChatComponentHandlerProvider");
    }
    return context;
};

export const ChatComponentHandlerProvider = ({ children }) => {
    const [action, setAction] = useState({
        type: '',
        data: null
    })
    return (
        <ChatComponentHandlerContext.Provider
            value={{
                action,
                setAction,
            }}
        >
            {children}
        </ChatComponentHandlerContext.Provider>
    );
};

export default ChatComponentHandlerProvider;
