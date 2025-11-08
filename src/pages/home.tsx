import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, Boxes, HelpCircle, Wrench, Users, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const sections = [
  { 
    id: "news", 
    title: "Новости", 
    icon: Newspaper,
    color: "from-blue-400 to-cyan-400",
    path: "/news"
  },
  { 
    id: "catalog", 
    title: "Каталог роботов", 
    icon: Boxes,
    color: "from-blue-600 to-blue-800",
    path: "/catalog"
  },
  { 
    id: "faq", 
    title: "FAQ", 
    icon: HelpCircle,
    color: "from-cyan-400 to-blue-500",
    path: "/faq"
  },
  { 
    id: "diy", 
    title: "DIY", 
    icon: Wrench,
    color: "from-amber-400 to-yellow-500",
    path: "/diy"
  },
  { 
    id: "meetup", 
    title: "Место встречи", 
    icon: Users,
    color: "from-blue-700 to-indigo-800",
    path: "/meetup"
  },
];

const Gear = ({ size = 200, delay = 0, rotation = 0, top = "20%", left = "10%", opacity = 0.15 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ 
      top, 
      left,
      width: size,
      height: size,
    }}
    animate={{ rotate: 360 }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      ease: "linear",
      delay 
    }}
    initial={{ rotate: rotation }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ opacity }}>
      <defs>
        <linearGradient id={`gearGrad${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#60a5fa", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M50,10 L54,18 L62,18 L56,24 L58,32 L50,28 L42,32 L44,24 L38,18 L46,18 Z
           M50,68 L54,76 L62,76 L56,82 L58,90 L50,86 L42,90 L44,82 L38,76 L46,76 Z
           M10,50 L18,54 L18,62 L24,56 L32,58 L28,50 L32,42 L24,44 L18,38 L18,46 Z
           M68,50 L76,54 L76,62 L82,56 L90,58 L86,50 L90,42 L82,44 L76,38 L76,46 Z
           M50,50 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0"
        fill={`url(#gearGrad${delay})`}
        stroke="#1e3a8a"
        strokeWidth="1"
      />
    </svg>
  </motion.div>
);

export default function Home() {
  const { data: latestNews } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const res = await apiClient.api.news.$get({ query: { limit: "3" } });
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
  });

  const { data: featuredRobots } = useQuery({
    queryKey: ["featured-robots"],
    queryFn: async () => {
      const res = await apiClient.api.robots.$get({ query: { limit: "3" } });
      if (!res.ok) throw new Error("Failed to fetch robots");
      return res.json();
    },
  });

  const { data: latestDiy } = useQuery({
    queryKey: ["latest-diy"],
    queryFn: async () => {
      const res = await apiClient.api.diy.$get({ query: { limit: "3" } });
      if (!res.ok) throw new Error("Failed to fetch DIY projects");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Gear size={300} delay={0} rotation={0} top="5%" left="5%" />
        <Gear size={250} delay={2} rotation={45} top="15%" left="75%" />
        <Gear size={200} delay={4} rotation={90} top="60%" left="10%" />
        <Gear size={280} delay={1} rotation={135} top="50%" left="70%" />
        <Gear size={220} delay={3} rotation={180} top="80%" left="45%" />
        <Gear size={180} delay={5} rotation={270} top="25%" left="40%" opacity={0.1} />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="PROроботов" className="h-12 w-auto" />
        </Link>
        <div className="flex gap-6 items-center">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="text-sm font-medium text-blue-200 hover:text-white transition-colors"
            >
              {section.title}
            </Link>
          ))}
          <Link
            to="/sign-in"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all text-sm font-semibold"
          >
            Войти
          </Link>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            PROроботов
          </h1>
          <p className="text-2xl text-blue-200 font-light">
            Мир робототехники
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={section.path}>
                  <div className="group relative h-48 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-16 h-16 mb-4 text-cyan-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-16">
          {latestNews && latestNews.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-200">Последние новости</h2>
                <Link 
                  to="/news" 
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Все новости <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestNews.slice(0, 3).map((article: any) => (
                  <Link key={article.id} to={`/news/${article.id}`}>
                    <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 h-full">
                      {article.imageUrl && (
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-blue-100">{article.title}</h3>
                        <p className="text-sm text-blue-300 line-clamp-3">{article.summary}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {featuredRobots && featuredRobots.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-200">Каталог роботов</h2>
                <Link 
                  to="/catalog" 
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Весь каталог <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredRobots.slice(0, 3).map((robot: any) => (
                  <Link key={robot.id} to={`/catalog/${robot.id}`}>
                    <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 h-full">
                      {robot.imageUrl && (
                        <img 
                          src={robot.imageUrl} 
                          alt={robot.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-blue-100">{robot.name}</h3>
                        <p className="text-sm text-cyan-400 mb-2">{robot.category}</p>
                        <p className="text-sm text-blue-300 line-clamp-2">{robot.description}</p>
                        {robot.price && (
                          <p className="text-lg font-bold text-amber-400 mt-3">{robot.price}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {latestDiy && latestDiy.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-blue-200">DIY проекты</h2>
                <Link 
                  to="/diy" 
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Все проекты <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestDiy.slice(0, 3).map((project: any) => (
                  <Link key={project.id} to={`/diy/${project.id}`}>
                    <div className="rounded-xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 h-full">
                      {project.imageUrl && (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-blue-100">{project.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
                            {project.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-blue-300 line-clamp-3">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-32 px-8 py-8 border-t border-white/10">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-blue-300">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="hover:text-white transition-colors"
            >
              {section.title}
            </Link>
          ))}
          <span className="text-blue-400">© 2024 PROроботов</span>
        </div>
      </footer>
    </div>
  );
}
