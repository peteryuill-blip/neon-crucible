import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

interface EssayForm {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  phaseId: number | null;
  isPublished: boolean;
  sortOrder: number;
}

const emptyForm: EssayForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "core_reading",
  phaseId: null,
  isPublished: true,
  sortOrder: 0,
};

const categories = [
  { value: "core_reading", label: "Core Reading" },
  { value: "phase_overview", label: "Phase Overview" },
  { value: "technical", label: "Technical" },
  { value: "reflection", label: "Reflection" },
];

export default function AdminEssays() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<EssayForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: essays, isLoading } = trpc.essays.list.useQuery();
  const { data: phases } = trpc.phases.list.useQuery();

  const createMutation = trpc.essays.create.useMutation({
    onSuccess: () => {
      toast.success("Essay created successfully");
      utils.essays.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.essays.update.useMutation({
    onSuccess: () => {
      toast.success("Essay updated successfully");
      utils.essays.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.essays.delete.useMutation({
    onSuccess: () => {
      toast.success("Essay deleted successfully");
      utils.essays.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const openNew = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEdit = (essay: any) => {
    setForm({
      id: essay.id,
      title: essay.title || "",
      slug: essay.slug || "",
      description: essay.description || "",
      content: essay.content || "",
      category: essay.category || "core_reading",
      phaseId: essay.phaseId,
      isPublished: essay.isPublished ?? true,
      sortOrder: essay.sortOrder || 0,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and Slug are required");
      return;
    }

    const data = {
      title: form.title,
      slug: form.slug,
      description: form.description || undefined,
      content: form.content || undefined,
      category: form.category || undefined,
      phaseId: form.phaseId || undefined,
      isPublished: form.isPublished,
      sortOrder: form.sortOrder,
    };

    if (isEditing && form.id) {
      updateMutation.mutate({ id: form.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Essays</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              NEON'S LONG-FORM WRITINGS
            </p>
          </div>
          <Button onClick={openNew} className="rounded-none font-mono gap-2">
            <Plus className="w-4 h-4" />
            NEW ESSAY
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border border-border rounded-none overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-mono text-xs text-primary">TITLE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">SLUG</TableHead>
                  <TableHead className="font-mono text-xs text-primary">CATEGORY</TableHead>
                  <TableHead className="font-mono text-xs text-primary">STATUS</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {essays?.map((essay) => (
                  <TableRow key={essay.id} className="border-border">
                    <TableCell className="font-medium">{essay.title}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{essay.slug}</TableCell>
                    <TableCell className="text-sm">{getCategoryLabel(essay.category || "")}</TableCell>
                    <TableCell>
                      <span className={`font-mono text-xs ${essay.isPublished ? "text-green-400" : "text-yellow-400"}`}>
                        {essay.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(essay)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(essay.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {isEditing ? "EDIT ESSAY" : "NEW ESSAY"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">TITLE *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm(prev => ({ 
                      ...prev, 
                      title: e.target.value,
                      slug: isEditing ? prev.slug : generateSlug(e.target.value)
                    }));
                  }}
                  className="rounded-none"
                  placeholder="The Long Breathing"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">SLUG *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="rounded-none font-mono"
                  placeholder="the-long-breathing"
                />
              </div>

              {/* Category & Phase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">CATEGORY</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">LINKED PHASE</Label>
                  <Select
                    value={form.phaseId?.toString() || "none"}
                    onValueChange={(v) => setForm(prev => ({ ...prev, phaseId: v === "none" ? null : parseInt(v) }))}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="none">No Phase</SelectItem>
                      {phases?.map(phase => (
                        <SelectItem key={phase.id} value={phase.id.toString()}>
                          {phase.code} — {phase.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">DESCRIPTION</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-none"
                  placeholder="A brief summary of the essay..."
                  rows={2}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">CONTENT (MARKDOWN)</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="rounded-none font-mono text-sm min-h-[300px]"
                  placeholder="## The Long Breathing&#10;&#10;The practice spans seven years..."
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs">PUBLISHED</Label>
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isPublished: checked }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none font-mono">
                CANCEL
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="rounded-none font-mono"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isEditing ? "UPDATE" : "CREATE"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle className="font-mono">CONFIRM DELETE</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to delete this essay? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-none font-mono">
                CANCEL
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
                className="rounded-none font-mono"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                DELETE
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
