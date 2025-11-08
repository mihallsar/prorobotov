import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Newspaper, 
  Bot, 
  HelpCircle, 
  Wrench, 
  MessageSquare, 
  Users,
  Settings
} from "lucide-react";

const adminSections = [
  { id: "news", title: "Новости", icon: Newspaper, path: "/admin/news", color: "from-blue-500 to-cyan-500" },
  { id: "robots", title: "Каталог роботов", icon: Bot, path: "/admin/robots", color: "from-blue-600 to-blue-800" },
  { id: "faq", title: "FAQ", icon: HelpCircle, path: "/admin/faq", color: "from-cyan-500 to-blue-600" },
  { id: "diy", title: "DIY проекты", icon: Wrench, path: "/admin/diy", color: "from-amber-500 to-yellow-600" },
  { id: "chat", title: "Управление чатом", icon: MessageSquare, path: "/admin/chat", color: "from-indigo-500 to-purple-600" },
  { id: "users", title: "Пользователи", icon: Users, path: "/admin/users", color: "from-green-500 to-emerald-600" },
  { id: "sources", title: "Источники новостей", icon: Settings, path: "/admin/sources", color: "from-slate-500 to-slate-700" },
];

export default function AdminDashboard() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  const user = session?.data?.user;
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 px-8 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PROроботов" className="h-10 w-auto" />
            <span className="text-xl font-bold text-blue-200">PROроботов - Админ панель</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-300">{user.email}</span>
            <Link
              to="/"
              className="text-sm text-blue-300 hover:text-white transition-colors"
            >
              На сайт
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <LayoutDashboard className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Панель управления
            </h1>
          </div>
          <p className="text-blue-300 text-lg">
            Управление контентом и пользователями сайта
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={section.path}>
                  <div className="group relative h-40 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      <Icon className="w-12 h-12 mb-3 text-cyan-400" />
                      <h3 className="text-xl font-bold text-center text-blue-100 group-hover:text-cyan-300 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
