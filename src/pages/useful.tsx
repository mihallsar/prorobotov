import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Filter } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface UsefulLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  iconUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function UsefulPage() {
  const [links, setLinks] = useState<UsefulLink[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await apiClient.content["useful-links"].$get();
      const data = await response.json();
      setLinks(data as UsefulLink[]);
      
      const uniqueCategories = ["Все", ...new Set(data.map((link: UsefulLink) => link.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = selectedCategory === "Все" 
    ? links 
    : links.filter(link => link.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
            Полезное
          </h1>
          <p className="text-gray-300 text-lg">
            Подборка полезных ресурсов и сайтов о робототехнике
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex items-center gap-3 flex-wrap"
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Категории:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {filteredLinks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            <p className="text-xl">Нет ссылок в этой категории</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  {link.iconUrl ? (
                    <img 
                      src={link.iconUrl} 
                      alt={link.title} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                    {link.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {link.title}
                </h3>
                
                <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                  {link.description}
                </p>

                <div className="flex items-center text-cyan-400 text-sm font-medium">
                  <span className="group-hover:mr-2 transition-all">Перейти</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
