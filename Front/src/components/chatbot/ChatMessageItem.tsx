/* eslint-disable @typescript-eslint/no-unused-vars */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type ComponentPropsWithoutRef } from "react";
import type { ChatMessage } from "../../data/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
};

// HTML 속성 + node 속성 정의
type MarkdownComponentProps<T extends React.ElementType> = ComponentPropsWithoutRef<T> & {
  node?: object;
};

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isAnnouncement = message.type === "announcement";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      {/* 봇 아이콘 */}
      {isAssistant ? (
        <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px] leading-none text-primary">
            smart_toy
          </span>
        </div>
      ) : null}

      <div className={isUser ? "max-w-[70%]" : "max-w-[74%]"}>
        {isAssistant ? (
          <div className="text-[12px] text-gray-500 mb-2">Seoul Jibsa AI</div>
        ) : null}

        <div
          className={
            isUser
              ? "bg-primary text-white rounded-2xl px-4 py-3 shadow-sm"
              : isAnnouncement
              ? "bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-black/10 ring-1 ring-primary/10"
              : "bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-black/5"
          }
        >
          <div className="text-[14px] leading-6 break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                
                a: ({ node, ...props }: MarkdownComponentProps<"a">) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium underline underline-offset-2 ${
                      isUser ? "text-white" : "text-blue-600 hover:text-blue-500"
                    }`}
                  />
                ),
                ul: ({ node, ...props }: MarkdownComponentProps<"ul">) => (
                  <ul {...props} className="list-disc pl-4 my-2 space-y-1" />
                ),
                ol: ({ node, ...props }: MarkdownComponentProps<"ol">) => (
                  <ol {...props} className="list-decimal pl-4 my-2 space-y-1" />
                ),
                li: ({ node, ...props }: MarkdownComponentProps<"li">) => (
                  <li {...props} className="pl-1" />
                ),
                strong: ({ node, ...props }: MarkdownComponentProps<"strong">) => (
                  <strong {...props} className="font-bold" />
                ),
                blockquote: ({ node, ...props }: MarkdownComponentProps<"blockquote">) => (
                  <blockquote
                    {...props}
                    className="border-l-4 border-gray-300 pl-3 my-2 text-gray-500 italic"
                  />
                ),
                table: ({ node, ...props }: MarkdownComponentProps<"table">) => (
                  <div className="overflow-x-auto my-2">
                    <table {...props} className="min-w-full border-collapse border border-gray-200 text-sm" />
                  </div>
                ),
                th: ({ node, ...props }: MarkdownComponentProps<"th">) => (
                  <th {...props} className="border border-gray-300 px-2 py-1 bg-gray-50 font-semibold" />
                ),
                td: ({ node, ...props }: MarkdownComponentProps<"td">) => (
                  <th {...props} className="border border-gray-300 px-2 py-1 font-normal" />
                ),
                p: ({ node, ...props }: MarkdownComponentProps<"p">) => (
                  <p {...props} className="mb-2 last:mb-0" />
                ),
                h1: ({ node, ...props }: MarkdownComponentProps<"h1">) => (
                  <h1 {...props} className="text-xl font-bold mt-4 mb-2" />
                ),
                h2: ({ node, ...props }: MarkdownComponentProps<"h2">) => (
                  <h2 {...props} className="text-lg font-bold mt-3 mb-2" />
                ),
                h3: ({ node, ...props }: MarkdownComponentProps<"h3">) => (
                  <h3 {...props} className="text-base font-bold mt-2 mb-1" />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 유저 아이콘 */}
      {isUser ? (
        <div className="ml-3 mt-1 h-8 w-8 rounded-full bg-black/5 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px] leading-none text-gray-600">
            person
          </span>
        </div>
      ) : null}
    </div>
  );
}