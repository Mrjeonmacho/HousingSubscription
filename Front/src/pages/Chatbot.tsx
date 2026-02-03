import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ChatMessage } from "../data/chat";

import ChatComposer from "../components/chatbot/ChatComposer";
import ChatMessageList from "../components/chatbot/ChatMessageList";

import { postChat, toChatbotErrorText } from "../api/ChatbotApi";

const ROOT_ACTIONS = [
  { label: "📘 청약/부동산 용어 쉽게 이해하기", value: "ROOT_TERM" },
  { label: "📜 정책 알아보기", value: "ROOT_POLICY" },
];

const TERM_QUESTIONS = [
  { label: "💰 소득 기준 계산 방법", value: "term_q1" },
  { label: "🏠 무주택 기준이 정확히 뭐예요?", value: "term_q2" },
  { label: "💼 직장인도 청년 지원 받을 수 있나요?", value: "term_q3" },
  { label: "🏢 부모님 집에 살아도 무주택인가요?", value: "term_q4" },
  { label: "👨‍👩‍👧 가구원 기준은 어떻게 계산하나요?", value: "term_q5" },
];
const TARGET_ACTIONS = [
  { label: "💍 신혼부부", value: "TARGET_NEWLYWED" },
  { label: "🎓 대학생/청년", value: "TARGET_YOUTH" },
];
const POLICY_LIST: Record<string, { label: string; value: string }[]> = {
  TARGET_NEWLYWED: [
    { label: "신혼부부 반환보증료", value: "policy1" },
    { label: "신혼부부 임차보증금 이자지원", value: "policy2" },
    { label: "신혼희망타운", value: "policy3" },
    { label: "행복주택", value: "policy10" },
  ],
  TARGET_YOUTH: [
    { label: "청년안심주택", value: "policy4" },
    { label: "청년월세지원", value: "policy5" },
    { label: "청년임차보증금 이자지원", value: "policy6" },
    { label: "청년전세임대", value: "policy7" },
    { label: "행복기숙사", value: "policy9" },
    { label: "희망하우징", value: "policy11" },
  ],
};
const POLICY_QUESTIONS = [
  { label: "💰 정책 요약", value: "summary" },
  { label: "📝 신청 자격 확인", value: "eligibility" },
  { label: "📂 준비해야 할 서류", value: "documents" },
  { label: "❓ 자주 헷갈리는 조건", value: "faq" },
];


export default function Chatbot() {
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [chatContext, setChatContext] = useState<string | null>(null);
  const [quickActions, setQuickActions] = useState(ROOT_ACTIONS);
  const isInputActive = chatContext !== null;

  const autoSentRef = useRef(false);

  const todayLabel = useMemo(() => {
    const d = new Date();
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          type: "text",
          text: "안녕하세요! 서울집사 AI입니다.\n부동산 용어가 어렵거나, 나에게 맞는 정책이 궁금하신가요?",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const handleSendText = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value || isSending) return;

      setErrorText(null);
      setIsSending(true);

      const userMessage: ChatMessage = {
        id: `chat-${Date.now()}`,
        role: "user",
        type: "text",
        text: value,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        let promptToSend = value;
        if (chatContext) {
           promptToSend = `[${chatContext}] ${value}`;
        }
        const answer = await postChat(promptToSend);

        const assistantMessage: ChatMessage = {
          id: `chat-${Date.now()}-assistant`,
          role: "assistant",
          type: "text",
          text: answer,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

      } catch (e) {
        const msg = toChatbotErrorText(e);
        setErrorText(msg);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            type: "text",
            text: msg,
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, chatContext]
  );

  // 외부 검색 유입 처리
  useEffect(() => {
    if (autoSentRef.current) return;
    const state = location.state as { initialMessage?: string } | null;
    const initialMessage = state?.initialMessage;

    if (!initialMessage) return;

    autoSentRef.current = true;
    setChatContext("GENERAL_QUESTION"); 
    setQuickActions([]); 
    setInput(initialMessage);
    void handleSendText(initialMessage);
  }, [location.state, handleSendText]);

  // 버튼 클릭 핸들러
  const handleQuickAction = (label: string, value: string) => {
    if (value === "ROOT_TERM") {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: "📘 어려운 용어 이해를 원하시는군요!\n궁금한 점을 아래에서 선택하거나 직접 물어보세요!",
          createdAt: new Date().toISOString(),
        },
      ]);
      setChatContext("keyword1"); 
      setQuickActions(TERM_QUESTIONS);
      return;
    }

    if (value === "ROOT_POLICY") {
      setMessages((prev) => [
        ...prev,
        { id: `sys-${Date.now()}`, role: "assistant", type: "text", text: "어떤 대상 유형에 해당하시나요?", createdAt: new Date().toISOString() },
      ]);
      setQuickActions(TARGET_ACTIONS);
      return;
    }

    if (value.startsWith("TARGET_")) {
      const nextList = POLICY_LIST[value];
      if (nextList) {
        setMessages((prev) => [
          ...prev,
          { id: `sys-${Date.now()}`, role: "assistant", type: "text", text: "관심 있는 정책을 선택해주세요.", createdAt: new Date().toISOString() },
        ]);
        setQuickActions(nextList);
      }
      return;
    }

    if (value.startsWith("policy")) {
      setMessages((prev) => [
        ...prev,
        { 
          id: `sys-${Date.now()}`, 
          role: "assistant", 
          type: "text", 
          text: `'${label}'에 대해 무엇이든 물어보세요!`, 
          createdAt: new Date().toISOString() 
        },
      ]);
      setChatContext(value); 
      setQuickActions(POLICY_QUESTIONS); 
      return;
    }

    // 질문 버튼 클릭
    if (value.startsWith("term_q") || ["summary", "eligibility", "documents", "faq"].includes(value)) {
      handleSendText(label);
      return;
    }
  };

  const handleSend = useCallback(async () => {
    await handleSendText(input);
  }, [handleSendText, input]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6 flex-1">
        <div className="flex justify-center pt-6">
          <div className="px-3 py-1 rounded-full bg-black/5 text-[12px] text-gray-500">
            {todayLabel}
          </div>
        </div>

        {errorText && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorText}
          </div>
        )}

        {/* ChatMessageList에 quickActions 전달 */}
        <ChatMessageList 
          messages={messages} 
          quickActions={quickActions}
          onQuickAction={handleQuickAction}
          isSending={isSending}
        />
      </div>

      {/* ChatComposer는 입력 역할만 수행 */}
      <ChatComposer
        input={input}
        isSending={isSending}
        isDisabled={!isInputActive}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}