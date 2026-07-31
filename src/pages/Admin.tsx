import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cdnImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, ArrowUp, ArrowDown, X, GripVertical, Check } from "lucide-react";

interface Project {
  id: string;
  title: string;
  role: string | null;
  images: string[];
  sort_order: number;
}

interface Offering {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  images: string[];
  cta_url: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [offeringDirty, setOfferingDirty] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [dragId, setDragId] = useState<string | null>(null);

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
      await loadOfferings();
      setLoading(false);
    })();
  }, [navigate]);

  const loadOfferings = async () => {
    const { data, error } = await supabase
      .from("offerings")
      .select("id, slug, title, tagline, images, cta_url")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Erro ao carregar offerings", description: error.message, variant: "destructive" });
      return;
    }
    setOfferings((data || []).map((o) => ({ ...o, images: o.images || [] })));
    setOfferingDirty({});
  };

  const updateOfferingLocal = (id: string, patch: Partial<Offering>) => {
    setOfferings((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setOfferingDirty((d) => ({ ...d, [id]: true }));
  };

  const handleSaveOffering = async (id: string) => {
    const o = offerings.find((x) => x.id === id);
    if (!o) return;
    const { error } = await supabase
      .from("offerings")
      .update({ tagline: o.tagline, cta_url: o.cta_url, images: o.images })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setOfferingDirty((d) => ({ ...d, [id]: false }));
    toast({ title: "Salvo" });
  };

  const handleOfferingUpload = async (offeringId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const o = offerings.find((x) => x.id === offeringId);
    if (!o) return;
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `offerings/${o.slug}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("project-images").upload(path, file);
      if (error) {
        toast({ title: "Upload falhou", description: error.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    const updatedImages = [...o.images, ...newUrls];
    updateOfferingLocal(offeringId, { images: updatedImages });
    await supabase.from("offerings").update({ images: updatedImages }).eq("id", offeringId);
    toast({ title: "Imagens adicionadas" });
  };

  const handleRemoveOfferingImage = (offeringId: string, url: string) => {
    const o = offerings.find((x) => x.id === offeringId);
    if (!o) return;
    updateOfferingLocal(offeringId, { images: o.images.filter((u) => u !== url) });
  };

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
    setDirty({});
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

  const handleSave = async (id: string) => {
    const p = projects.find((x) => x.id === id);
    if (!p) return;
    const { error } = await supabase
      .from("projects")
      .update({ title: p.title, role: p.role, images: p.images })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setDirty((d) => ({ ...d, [id]: false }));
    toast({ title: "Salvo" });
  };

  const updateLocal = (id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    setDirty((d) => ({ ...d, [id]: true }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar este projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    await loadProjects();
  };

  const persistOrder = async (ordered: Project[]) => {
    // Update sort_order for all in one go
    const updates = ordered.map((p, i) =>
      supabase.from("projects").update({ sort_order: i + 1 }).eq("id", p.id)
    );
    await Promise.all(updates);
    await loadProjects();
  };

  const handleMove = async (id: string, dir: -1 | 1) => {
    const idx = projects.findIndex((p) => p.id === id);
    const target = idx + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[idx], next[target]] = [next[target], next[idx]];
    setProjects(next);
    await persistOrder(next);
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const fromIdx = projects.findIndex((p) => p.id === dragId);
    const toIdx = projects.findIndex((p) => p.id === overId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...projects];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setProjects(next);
  };
  const handleDragEnd = async () => {
    if (!dragId) return;
    setDragId(null);
    await persistOrder(projects);
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
    const updatedImages = [...project.images, ...newUrls];
    updateLocal(projectId, { images: updatedImages });
    // Auto-persist images immediately so uploads aren't lost
    await supabase.from("projects").update({ images: updatedImages }).eq("id", projectId);
    toast({ title: "Imagens adicionadas" });
  };

  const handleRemoveImage = (projectId: string, url: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    updateLocal(projectId, { images: project.images.filter((u) => u !== url) });
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

      <p className="text-xs text-muted-foreground mb-6">
        Arraste pelo ícone <GripVertical className="inline h-3 w-3" /> para reordenar. Não esqueça de clicar em Salvar após editar texto ou remover imagens.
      </p>

      <div className="space-y-4">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum projeto ainda. Clique em "Novo" para começar.</p>
        )}
        {projects.map((p, i) => (
          <div
            key={p.id}
            onDragOver={(e) => handleDragOver(e, p.id)}
            className={`border border-border p-6 space-y-4 bg-background transition-opacity ${dragId === p.id ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div
                draggable
                onDragStart={() => handleDragStart(p.id)}
                onDragEnd={handleDragEnd}
                className="pt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                title="Arraste para reordenar"
              >
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="text-xs text-muted-foreground">#{i + 1}</div>
                <Input
                  value={p.title}
                  onChange={(e) => updateLocal(p.id, { title: e.target.value })}
                  placeholder="Título"
                />
                <Input
                  value={p.role || ""}
                  onChange={(e) => updateLocal(p.id, { role: e.target.value })}
                  placeholder="Função (ex: BRAND IDENTITY)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handleSave(p.id)}
                  disabled={!dirty[p.id]}
                  variant={dirty[p.id] ? "default" : "outline"}
                >
                  <Check className="h-4 w-4 mr-1" /> Salvar
                </Button>
                <div className="flex gap-1">
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
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {p.images.map((url) => (
                <div key={url} className="relative group aspect-square bg-muted">
                  <img src={cdnImage(url, 240, 60)} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
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

      <header className="flex justify-between items-center mt-20 mb-6">
        <h1 className="text-2xl font-bold tracking-tighter">CMS — Offerings</h1>
      </header>
      <p className="text-xs text-muted-foreground mb-6">
        Edite tagline, link do "Book a call" e imagens (1920×1080 recomendado) para cada serviço.
      </p>

      <div className="space-y-4">
        {offerings.map((o) => (
          <div key={o.id} className="border border-border p-6 space-y-4 bg-background">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="text-xs uppercase tracking-tight text-muted-foreground">
                  {o.title} — /{o.slug}
                </div>
                <Input
                  value={o.tagline || ""}
                  onChange={(e) => updateOfferingLocal(o.id, { tagline: e.target.value })}
                  placeholder="Tagline"
                />
                <Input
                  value={o.cta_url || ""}
                  onChange={(e) => updateOfferingLocal(o.id, { cta_url: e.target.value })}
                  placeholder="Book a call URL (https://cal.com/...)"
                />
              </div>
              <Button
                size="sm"
                onClick={() => handleSaveOffering(o.id)}
                disabled={!offeringDirty[o.id]}
                variant={offeringDirty[o.id] ? "default" : "outline"}
              >
                <Check className="h-4 w-4 mr-1" /> Salvar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {o.images.map((url) => (
                <div key={url} className="relative group bg-muted" style={{ aspectRatio: "1920 / 1080" }}>
                  <img src={cdnImage(url, 240, 60)} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                  <button
                    onClick={() => handleRemoveOfferingImage(o.id, url)}
                    className="absolute top-1 right-1 bg-background/80 p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label
                className="border border-dashed border-border flex items-center justify-center cursor-pointer text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition"
                style={{ aspectRatio: "1920 / 1080" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleOfferingUpload(o.id, e.target.files)}
                />
                + Imagens 1920×1080
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
