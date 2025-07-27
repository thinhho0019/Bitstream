// app/chat/page.tsx (Next.js 13+ App Router)
'use client'

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button_';
import { Card, CardContent } from '@/components/ui/card';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useRouter } from "next/navigation";
import { askChatBox } from '@/services/chatbox';

export default function ChatBoxClient() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [executing, setExecuting] = useState<boolean>(false);
    const dragScrollRef = useDragScroll();
    const [isDragging, setIsDragging] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const router = useRouter();
    const [recommnedation, setRecommendation] = useState<string[] | null>([]);
    useEffect(() => {
        const fetchUserId = async () => {
            const res = await fetch("/api/auth");
            if (!res.ok) {
                router.push("/login");
                return;
            }
            const data = await res.json();
            setUserId(data.userId);
            setToken(data.id_token);
        };
        setRecommendation([
            "How price of bitcoin today?",
            "What is the current price of Bitcoin?",
            "what is bitstream?"
        ]);
        fetchUserId();
        const interval = setInterval(() => {
            fetchUserId();
        }, 30 * 60 * 1000); // Refresh user ID every minute
        //clear mount 
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const execApiChat = async (message: string) => {
        if (userId === null) {
            console.error("User ID is not set");
            return;
        }
        setExecuting(true);
        const input = message.trim();
        try {
            const res = await askChatBox({
                message: input,
                user_id: userId, // Replace with actual account ID
                token: token || "" // Use the token if available
            });
            if (!res || !res.response) {
                setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Không có phản hồi từ AI.' }]);
                return;
            }
            setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
        } catch (err) {
            console.error("Error calling chat API:", err);
            setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Lỗi kết nối server.' }]);
        } finally {
            setLoading(false);
            setExecuting(false);
        }
    }
    const sendMessage = async () => {

        if (loading || executing) return;
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        execApiChat(input);
    };
    const handleClickrecommendation = (item: string) => {
        if (isDragging) return;
        if (loading || executing) return;
        const userMessage = { role: 'user', content: item };
        setMessages((prev) => [...prev, userMessage]);
        execApiChat(item);
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(false);
        dragStartX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        dragCurrentX.current = e.clientX;
        if (Math.abs(dragCurrentX.current - dragStartX.current) > 5) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        setTimeout(() => {
            setIsDragging(false);
        }, 0); // reset sau 1 tick
    };
    return (
        <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto">
            <div className="flex items-baseline space-x-2 justify-between p-4 bg-gray-700 rounded-lg mb-4">
                <p className="text-white text-sm font-medium sm:text-base">Crypto GPT Chat</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pb-32">
                {messages.map((msg, i) => (
                    <Card key={i} className={msg.role === 'user' ? 'bg-gray-100' : 'bg-blue-100'}>
                        <CardContent className="p-3 whitespace-pre-wrap">
                            <strong>{msg.role === 'user' ? '🧑 Bạn' : '🤖 AI'}:</strong> {msg.content}
                        </CardContent>
                    </Card>
                ))}
                <div ref={chatEndRef} />
            </div>
            {/* Thanh nhập cố định */}
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 bg-white z-50">
                <div className="w-full max-w-2xl mx-auto flex gap-2 mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
                    ref={dragScrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    {recommnedation && recommnedation.map((item, index) => (
                        <Button
                            key={index}
                            onClick={() => handleClickrecommendation(item)}
                            className="bg-gray-200 hover:bg-gray-300 !text-black font-medium text-sm font-bold px-4 py-2 text-center break-words max-w-xs"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
                <div className="w-full max-w-2xl mx-auto flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập câu hỏi về Bitcoin..."
                    />
                    <Button onClick={sendMessage} disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi'}
                    </Button>
                </div>
            </div>
        </div>


    );
}
