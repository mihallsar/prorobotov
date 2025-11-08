import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Link as LinkIcon } from "lucide-react";

interface UsefulLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  iconUrl: string | null;
  order: number;
}

export default function UsefulLinks() {
  const { data: links = [], isLoading } = useQuery<UsefulLink[]>({
    queryKey: ["useful-links"],
    queryFn: async () => {
      const response = await apiClient.api["useful-links"].$get();
      return response.json();
    },
  });

  const categories = Array.from(new Set(links.map(link => link.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PROроботов" className="h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PROроботов
            </span>
          </Link>
          <div className="flex gap-6">
            <Link to="/news" className="text-blue-300 hover:text-blue-200 transition-colors">
              Новости
            </Link>
            <Link to="/robots" className="text-blue-300 hover:text-blue-200 transition-colors">
              Каталог роботов
            </Link>
            <Link to="/faq" className="text-blue-300 hover:text-blue-200 transition-colors">
              FAQ
            </Link>
            <Link to="/diy" className="text-blue-300 hover:text-blue-200 transition-colors">
              DIY
            </Link>
            <Link to="/meetup" className="text-blue-300 hover:text-blue-200 transition-colors">
              Место встречи
            </Link>
            <Link to="/useful" className="text-cyan-400 font-semibold">
              Полезное
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Полезное
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Коллекция полезных ресурсов, инструментов и сайтов для робототехники
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400"></div>
          </div>
        ) : links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <LinkIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-xl text-slate-400">
              Полезные ссылки пока не добавлены
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => {
              const categoryLinks = links.filter(link => link.category === category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryLinks.map((link, index) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: categoryIndex * 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <Card className="h-full bg-gradient-to-br from-slate-800/80 to-blue-900/30 border-blue-500/30 backdrop-blur hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                {link.iconUrl ? (
                                  <img
                                    src={link.iconUrl}
                                    alt=""
                                    className="w-12 h-12 rounded-lg flex-shrink-0 object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                    <LinkIcon className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-white leading-tight">
                                      {link.title}
                                    </h3>
                                    <ExternalLink className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                                  </div>
                                  <p className="text-slate-300 text-sm line-clamp-3">
                                    {link.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-blue-500/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400">© 2025 PROроботов. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
