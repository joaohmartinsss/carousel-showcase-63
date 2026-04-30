import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, ArrowUp, ArrowDown, X } from "lucide-react";

interface Project {
  id: string;
  title: string;
  role: string | null;
  images: string[];
  sort_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    document.title = "Admin — Pequeno";
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserId(data.session.user.id);
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleData);
      await loadProjects();
      setLoading(false);
    })();
  }, [navigate]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      return;
    }
    setProjects(data || []);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddProject = async () => {
    const maxOrder = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { error } = await supabase.from("projects").insert({
      title: "Novo projeto",
      role: "BRAND IDENTITY",
      images: [],
      sort_order: maxOrder + 1,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await loadProjects();
  };

  const handleUpdate = async (id: string, patch: Partial<Project>) => {
    const { error } = await supabase.from("projects").update(patch).eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    await loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    await loadProjects();
  };

  const handleMove = async (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex((p) => p.id === id);
    const swap = projects[idx + dir];
    if (!swap) return;
    const a = projects[idx];
    await supabase.from("projects").update({ sort_order: swap.sort_order }).eq("id", a.id);
    await supabase.from("projects").update({ sort_order: a.sort_order }).eq("id", swap.id);
    await loadProjects();
  };

  const handleUpload = async (projectId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${projectId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) {
        toast({ title: "Upload falhou", description: error.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    await handleUpdate(projectId, { images: [...project.images, ...newUrls] });
  };

  const handleRemoveImage = async (projectId: string, url: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    await handleUpdate(projectId, { images: project.images.filter((u) => u !== url) });
  };

  const handleMakeMeAdmin = async () => {
    if (!userId) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setIsAdmin(true);
    toast({ title: "Você agora é admin" });
  };

  if (loading) return <div className="p-8 text-sm">Carregando...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 gap-4 text-center">
        <h1 className="text-2xl font-bold tracking-tighter">Você não é admin</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Se este é o primeiro acesso e ainda não há nenhum admin no sistema, clique abaixo para se promover.
          Depois disso, novos usuários só podem ser promovidos por outro admin.
        </p>
        <Button onClick={handleMakeMeAdmin}>Tornar-me admin</Button>
        <Button variant="ghost" onClick={handleSignOut}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 md:px-16 py-12">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold tracking-tighter">CMS — Projetos</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddProject} size="sm"><Plus className="h-4 w-4 mr-1" /> Novo</Button>
          <Button onClick={handleSignOut} variant="ghost" size="sm">Sair</Button>
        </div>
      </header>

      <div className="space-y-8">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum projeto ainda. Clique em "Novo" para começar.</p>
        )}
        {projects.map((p, i) => (
          <div key={p.id} className="border border-border p-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <Input
                  value={p.title}
                  onChange={(e) => setProjects(projects.map(x => x.id === p.id ? { ...x, title: e.target.value } : x))}
                  onBlur={(e) => handleUpdate(p.id, { title: e.target.value })}
                  placeholder="Título"
                />
                <Input
                  value={p.role || ""}
                  onChange={(e) => setProjects(projects.map(x => x.id === p.id ? { ...x, role: e.target.value } : x))}
                  onBlur={(e) => handleUpdate(p.id, { role: e.target.value })}
                  placeholder="Função (ex: BRAND IDENTITY)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" onClick={() => handleMove(p.id, -1)} disabled={i === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleMove(p.id, 1)} disabled={i === projects.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {p.images.map((url) => (
                <div key={url} className="relative group aspect-square bg-muted">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button
                    onClick={() => handleRemoveImage(p.id, url)}
                    className="absolute top-1 right-1 bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-border flex items-center justify-center cursor-pointer text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(p.id, e.target.files)}
                />
                + Imagens
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
