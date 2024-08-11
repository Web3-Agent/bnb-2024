"use client"


import React, { useState } from "react";
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import Image from "next/image";
import { TbWorldSearch } from "react-icons/tb";
// import { cn } from '@/app/lib/utils'
import { CodeBlock } from './CodeBlock'
import { MemoizedReactMarkdown } from './Markdown'
// import { IconF, IconOpenAI, IconUser } from '@/app/_components/ui/icons'
// import { ChatMessageActions } from '@/app/_components/chat-message-actions'
// import { Message } from "ai";
// import { Button } from "./ui/button";
import user from "../../public/images/team/team-01.jpg";


export function ChatMessage({ message, ...props }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const onExpandClick = () => setIsExpanded(!isExpanded);
    if (message.function_call && !isExpanded) {
        return (
            <div
                className="group relative mb-4 flex items-start md:-ml-12"
                {...props}
            >
                <div
                    className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow bg-primary text-primary-foreground"
                >
                    <TbWorldSearch className="dark:text-white text-black" />
                </div>
                <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                    {/* <Button onClick={onExpandClick} className="rounded p-2 bg-primary text-primary-foreground flex justify-start">
                        <span>Looking Action</span>
                    </Button> */}
                    {/* <ChatMessageActions message={message} onExpandClick={onExpandClick} /> */}
                </div>

            </div>
        )
    }

    return (
        <div
            style={{ color: "black" }}
            className={'group relative mb-4 flex items-start md:-ml-12'}
            {...props}
        >
            <div
                style={{ color: "black" }}
                className={
                    'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow ' +
                        message.role === 'user'
                        ? 'bg-background'
                        : 'bg-primary text-primary-foreground'
                }
            >
                {message.role === 'user' ? <TbWorldSearch /> : message.function_call ? <TbWorldSearch className="dark:text-white text-black" /> : <TbWorldSearch />}
            </div>
            <div className="chat-box author-speech bg-flashlight">
                <div className="inner">
                    <div className="chat-section">
                        <div className="author">
                            <Image
                                className="w-100"
                                src={user}
                                width={40}
                                height={40}
                                alt="Author"
                            />
                        </div>
                        <div className="chat-content">
                            <h6 className="title">You</h6>
                            <p>{message?.content}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ color: "black" }} className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                <MemoizedReactMarkdown

                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 overflow-auto"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            return <p style={{ color: "black" }} className="mb-2 last:mb-0 text-green-800 dark:text-black">{children}</p>
                        },
                        code({ node, inline, className, children, ...props }) {
                            if (children.length) {
                                if (children[0] == '▍') {
                                    return (
                                        <span className="mt-1 animate-pulse cursor-default">▍</span>
                                    )
                                }

                                children[0] = (children[0]).replace('`▍`', '▍')
                            }

                            const match = /language-(\w+)/.exec(className || '')

                            if (inline) {
                                return (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }

                            return (
                                <CodeBlock
                                    key={Math.random()}
                                    language={(match && match[1]) || ''}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            )
                        }
                    }}
                >
                    {(message.content === '') ? (typeof message.function_call === 'string' ? message.function_call : JSON.stringify(message.function_call)) : message.content ?? ''}
                </MemoizedReactMarkdown>
                {/* <ChatMessageActions message={message} onExpandClick={onExpandClick} /> */}
            </div>
        </div>
    )
}