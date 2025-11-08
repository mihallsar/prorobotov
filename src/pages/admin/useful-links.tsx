import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, ArrowLeft, ExternalLink } from "lucide-react";

interface UsefulLink {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  iconUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsefulLinks() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
    iconUrl: "",
    order: 0,
  });

  const { data: links = [], isLoading } = useQuery<UsefulLink[]>({
    queryKey: ["admin-useful-links"],
    queryFn: async () => {
      const response = await apiClient.api["useful-links"].$get();
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiClient.api.admin["useful-links"].$post({
        json: data,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-useful-links"] });
      resetForm();
      setIsCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const response = await apiClient.api.admin["useful-links"][":id"].$put({
        param: { id: id.toString() },
        json: data,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-useful-links"] });
      resetForm();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.api.admin["useful-links"][":id"].$delete({
        param: { id: id.toString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-useful-links"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      category: "",
      iconUrl: "",
      order: 0,
    });
  };

  const handleEdit = (link: UsefulLink) => {
    setEditingId(link.id);
    setFormData({
      title: link.title,
      description: link.description,
      url: link.url,
      category: link.category,
      iconUrl: link.iconUrl || "",
      order: link.order,
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingId(null);
    setIsCreating(false);
  };

  const categories = Array.from(new Set(links.map(link => link.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center text-blue-300 hover:text-blue-200 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад в админ-панель
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Управление полезными ссылками
            </h1>
          </div>
          {!isCreating && !editingId && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить ссылку
            </Button>
          )}
        </div>

        {(isCreating || editingId) && (
          <Card className="mb-8 bg-slate-800/50 border-blue-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">
                {editingId ? "Редактировать ссылку" : "Новая ссылка"}
              </CardTitle>
              <CardDescription className="text-slate-300">
                Заполните информацию о полезной ссылке
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Название</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="url" className="text-white">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    placeholder="https://example.com"
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Категория</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Например: Обучение, Инструменты, Форумы"
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <Label htmlFor="iconUrl" className="text-white">URL иконки (необязательно)</Label>
                  <Input
                    id="iconUrl"
                    type="url"
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                    placeholder="https://example.com/icon.png"
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="order" className="text-white">Порядок сортировки</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="bg-slate-900/50 border-blue-500/30 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {editingId ? "Сохранить" : "Создать"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="border-blue-500/30 text-white hover:bg-slate-800"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(category => {
              const categoryLinks = links.filter(link => link.category === category);
              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-4">{category}</h2>
                  <div className="grid gap-4">
                    {categoryLinks.map((link) => (
                      <Card key={link.id} className="bg-slate-800/50 border-blue-500/30 backdrop-blur">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {link.iconUrl && (
                                  <img src={link.iconUrl} alt="" className="w-8 h-8 rounded" />
                                )}
                                <h3 className="text-xl font-semibold text-white">{link.title}</h3>
                              </div>
                              <p className="text-slate-300 mb-3">{link.description}</p>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-400 hover:text-blue-300"
                              >
                                {link.url}
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                              <div className="mt-2 text-sm text-slate-400">
                                Порядок: {link.order}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => handleEdit(link)}
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 text-blue-400 hover:bg-slate-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  if (confirm("Удалить эту ссылку?")) {
                                    deleteMutation.mutate(link.id);
                                  }
                                }}
                                variant="outline"
                                size="sm"
                                className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {links.length === 0 && (
              <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <p className="text-slate-400 text-lg">
                    Полезные ссылки пока не добавлены. Нажмите "Добавить ссылку" чтобы создать первую.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
