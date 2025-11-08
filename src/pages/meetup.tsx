import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth";
import { ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Meetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });
  
  const user = session?.data?.user;

  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat-messages"],
    queryFn: async () => {
      const res = await apiClient.api.chat.messages.$get();
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiClient.api.chat.messages.$post({
        json: { message: text },
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      setMessage("");
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      sendMessageMutation.mutate(message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-200">
            Требуется регистрация
          </h2>
          <p className="text-blue-300 mb-6">
            Чтобы участвовать в обсуждениях, необходимо войти в систему
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/sign-in")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              Войти
            </Button>
            <Button
              onClick={() => navigate("/sign-up")}
              variant="outline"
              className="border-blue-400 text-blue-300 hover:bg-blue-900/20"
            >
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex flex-col">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 px-8 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PROроботов" className="h-10 w-auto" />
            <span className="text-xl font-bold text-blue-200">PROроботов</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-8 py-8 flex flex-col max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Место встречи
          </h1>
          <p className="text-blue-300">
            Общайтесь с единомышленниками и обсуждайте робототехнику
          </p>
        </motion.div>

        <div className="flex-1 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 mb-4 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.userId === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      msg.userId === user.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                        : "bg-white/10"
                    }`}
                  >
                    <p className="text-xs text-blue-200 mb-1 font-semibold">
                      {msg.userName}
                    </p>
                    <p className="text-white">{msg.message}</p>
                    <p className="text-xs text-blue-300 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString("ru-RU")}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-blue-300">Пока нет сообщений. Начните беседу!</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-blue-400"
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
