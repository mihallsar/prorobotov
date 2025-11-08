import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Catalog() {
  const { data: robots, isLoading } = useQuery({
    queryKey: ["robots"],
    queryFn: async () => {
      const res = await apiClient.api.robots.$get();
      if (!res.ok) throw new Error("Failed to fetch robots");
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

      <main className="container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Каталог роботов
          </h1>
          <p className="text-blue-300 text-lg">
            Современные роботы для различных сфер применения
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 animate-pulse"
              >
                <div className="h-56 bg-white/10 rounded-lg mb-4" />
                <div className="h-6 bg-white/10 rounded mb-2" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : robots && robots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {robots.map((robot: any, index: number) => (
              <motion.div
                key={robot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col">
                  {robot.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={robot.imageUrl}
                        alt={robot.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-blue-100 group-hover:text-cyan-300 transition-colors flex-1">
                        {robot.name}
                      </h3>
                    </div>
                    <p className="text-sm text-cyan-400 mb-3 font-medium">{robot.category}</p>
                    <p className="text-sm text-blue-300 mb-4 flex-1">
                      {robot.description}
                    </p>
                    {robot.price && (
                      <p className="text-2xl font-bold text-amber-400 mb-4">
                        {robot.price}
                      </p>
                    )}
                    {robot.officialWebsite && (
                      <a
                        href={robot.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Официальный сайт
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-blue-300 text-lg">Роботов в каталоге пока нет</p>
          </div>
        )}
      </main>
    </div>
  );
}
