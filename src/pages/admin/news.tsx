import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminNews() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    imageUrl: "",
    videoUrl: "",
    sourceUrl: "",
    sourceName: "",
  });

  const { data: news } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const res = await apiClient.api.news.$get();
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiClient.api.admin.news.$post({ json: data });
      if (!res.ok) throw new Error("Failed to create news");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await apiClient.api.admin.news[":id"].$put({ param: { id: id.toString() }, json: data });
      if (!res.ok) throw new Error("Failed to update news");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.api.admin.news[":id"].$delete({ param: { id: id.toString() } });
      if (!res.ok) throw new Error("Failed to delete news");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      imageUrl: "",
      videoUrl: "",
      sourceUrl: "",
      sourceName: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      summary: item.summary || "",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      sourceUrl: item.sourceUrl || "",
      sourceName: item.sourceName || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10 px-8 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Назад к панели
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-blue-200">Управление новостями</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Plus className="w-4 h-4 mr-2" />
                Добавить новость
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Редактировать" : "Добавить"} новость</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Заголовок"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700"
                />
                <Textarea
                  placeholder="Краткое описание"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Textarea
                  placeholder="Полный текст"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  className="bg-slate-800 border-slate-700 min-h-[200px]"
                />
                <Input
                  placeholder="URL изображения"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Input
                  placeholder="URL видео"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Input
                  placeholder="Название источника"
                  value={formData.sourceName}
                  onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Input
                  placeholder="URL источника"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                  {editingItem ? "Обновить" : "Создать"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {news?.map((item: any) => (
            <div key={item.id} className="rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-100 mb-2">{item.title}</h3>
                  <p className="text-blue-300 text-sm mb-2">{item.summary}</p>
                  <p className="text-xs text-blue-400">
                    {new Date(item.publishedAt).toLocaleDateString("ru-RU")}
                    {item.isAutoGenerated && " • Автоматически"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="border-blue-400">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="border-red-400 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
