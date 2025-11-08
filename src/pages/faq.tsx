import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const { data: faqItems, isLoading } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const res = await apiClient.api.faq.$get();
      if (!res.ok) throw new Error("Failed to fetch FAQ");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
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

      <main className="container mx-auto px-8 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Часто задаваемые вопросы
          </h1>
          <p className="text-blue-300 text-lg">
            Ответы на популярные вопросы о робототехнике
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : faqItems && faqItems.length > 0 ? (
          <div className="space-y-4">
            {faqItems.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-blue-100 pr-4">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform ${
                        openItem === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-blue-300 leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-blue-300 text-lg">Вопросов пока нет</p>
          </div>
        )}
      </main>
    </div>
  );
}
