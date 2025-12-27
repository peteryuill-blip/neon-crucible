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
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface WorkForm {
  id?: number;
  title: string;
  phaseId: number | null;
  dateCreated: string;
  technique: string;
  dimensions: string;
  colorPalette: string;
  emotionalRegister: string;
  imageUrl: string;
  imageKey: string;
  thumbnailUrl: string;
  journalExcerpt: string;
  neonReading: string;
  seriesName: string;
  isPublished: boolean;
  sortOrder: number;
}

const emptyForm: WorkForm = {
  title: "",
  phaseId: null,
  dateCreated: "",
  technique: "",
  dimensions: "",
  colorPalette: "",
  emotionalRegister: "",
  imageUrl: "",
  imageKey: "",
  thumbnailUrl: "",
  journalExcerpt: "",
  neonReading: "",
  seriesName: "",
  isPublished: true,
  sortOrder: 0,
};

export default function AdminWorks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<WorkForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data: worksData, isLoading } = trpc.works.list.useQuery({ limit: 100 });
  const { data: phases } = trpc.phases.list.useQuery();

  const createMutation = trpc.works.create.useMutation({
    onSuccess: () => {
      toast.success("Work created successfully");
      utils.works.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.works.update.useMutation({
    onSuccess: () => {
      toast.success("Work updated successfully");
      utils.works.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.works.delete.useMutation({
    onSuccess: () => {
      toast.success("Work deleted successfully");
      utils.works.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadMutation = trpc.upload.workImage.useMutation({
    onSuccess: (data) => {
      setForm(prev => ({ ...prev, imageUrl: data.url, imageKey: data.key }));
      toast.success("Image uploaded successfully");
      setUploading(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setUploading(false);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        filename: file.name,
        contentType: file.type,
        base64Data: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const openNew = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEdit = (work: any) => {
    setForm({
      id: work.id,
      title: work.title || "",
      phaseId: work.phaseId,
      dateCreated: work.dateCreated || "",
      technique: work.technique || "",
      dimensions: work.dimensions || "",
      colorPalette: work.colorPalette || "",
      emotionalRegister: work.emotionalRegister || "",
      imageUrl: work.imageUrl || "",
      imageKey: work.imageKey || "",
      thumbnailUrl: work.thumbnailUrl || "",
      journalExcerpt: work.journalExcerpt || "",
      neonReading: work.neonReading || "",
      seriesName: work.seriesName || "",
      isPublished: work.isPublished ?? true,
      sortOrder: work.sortOrder || 0,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const data = {
      title: form.title,
      phaseId: form.phaseId || undefined,
      dateCreated: form.dateCreated || undefined,
      technique: form.technique || undefined,
      dimensions: form.dimensions || undefined,
      colorPalette: form.colorPalette || undefined,
      emotionalRegister: form.emotionalRegister || undefined,
      imageUrl: form.imageUrl || undefined,
      imageKey: form.imageKey || undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      journalExcerpt: form.journalExcerpt || undefined,
      neonReading: form.neonReading || undefined,
      seriesName: form.seriesName || undefined,
      isPublished: form.isPublished,
      sortOrder: form.sortOrder,
    };

    if (isEditing && form.id) {
      updateMutation.mutate({ id: form.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getPhaseCode = (phaseId: number | null) => {
    if (!phaseId || !phases) return "—";
    const phase = phases.find(p => p.id === phaseId);
    return phase?.code ?? "—";
  };

  const works = worksData?.items ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Works</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              MANAGE YOUR ARTWORK ARCHIVE
            </p>
          </div>
          <Button onClick={openNew} className="rounded-none font-mono gap-2">
            <Plus className="w-4 h-4" />
            ADD WORK
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
                  <TableHead className="font-mono text-xs text-primary w-[60px]">IMG</TableHead>
                  <TableHead className="font-mono text-xs text-primary">TITLE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">PHASE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">TECHNIQUE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">DATE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">STATUS</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => (
                  <TableRow key={work.id} className="border-border">
                    <TableCell>
                      {work.imageUrl ? (
                        <img src={work.imageUrl} alt="" className="w-10 h-10 object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-muted/20 flex items-center justify-center text-muted-foreground text-xs">
                          —
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell className="font-mono text-xs">{getPhaseCode(work.phaseId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{work.technique || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{work.dateCreated || "—"}</TableCell>
                    <TableCell>
                      <span className={`font-mono text-xs ${work.isPublished ? "text-green-400" : "text-yellow-400"}`}>
                        {work.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(work)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(work.id)}>
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
          <DialogContent className="max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {isEditing ? "EDIT WORK" : "ADD NEW WORK"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">IMAGE</Label>
                {form.imageUrl ? (
                  <div className="relative w-full h-48 bg-muted/10 border border-border">
                    <img src={form.imageUrl} alt="" className="w-full h-full object-contain" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-none"
                      onClick={() => setForm(prev => ({ ...prev, imageUrl: "", imageKey: "" }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-border cursor-pointer hover:bg-muted/5 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="font-mono text-xs text-muted-foreground">CLICK TO UPLOAD</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">TITLE *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-none"
                  placeholder="WORK_STUDY_001"
                />
              </div>

              {/* Phase & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">PHASE</Label>
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
                <div className="space-y-2">
                  <Label className="font-mono text-xs">DATE CREATED</Label>
                  <Input
                    value={form.dateCreated}
                    onChange={(e) => setForm(prev => ({ ...prev, dateCreated: e.target.value }))}
                    className="rounded-none"
                    placeholder="2024-01"
                  />
                </div>
              </div>

              {/* Technique & Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">TECHNIQUE</Label>
                  <Input
                    value={form.technique}
                    onChange={(e) => setForm(prev => ({ ...prev, technique: e.target.value }))}
                    className="rounded-none"
                    placeholder="Ink on Paper"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">DIMENSIONS</Label>
                  <Input
                    value={form.dimensions}
                    onChange={(e) => setForm(prev => ({ ...prev, dimensions: e.target.value }))}
                    className="rounded-none"
                    placeholder="120x80cm"
                  />
                </div>
              </div>

              {/* Color Palette & Emotional Register */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">COLOR PALETTE</Label>
                  <Input
                    value={form.colorPalette}
                    onChange={(e) => setForm(prev => ({ ...prev, colorPalette: e.target.value }))}
                    className="rounded-none"
                    placeholder="Deep blues, burnt orange"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">EMOTIONAL REGISTER</Label>
                  <Input
                    value={form.emotionalRegister}
                    onChange={(e) => setForm(prev => ({ ...prev, emotionalRegister: e.target.value }))}
                    className="rounded-none"
                    placeholder="contemplative"
                  />
                </div>
              </div>

              {/* Series Name */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">SERIES NAME</Label>
                <Input
                  value={form.seriesName}
                  onChange={(e) => setForm(prev => ({ ...prev, seriesName: e.target.value }))}
                  className="rounded-none"
                  placeholder="Void Series"
                />
              </div>

              {/* Journal Excerpt */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">JOURNAL EXCERPT</Label>
                <Textarea
                  value={form.journalExcerpt}
                  onChange={(e) => setForm(prev => ({ ...prev, journalExcerpt: e.target.value }))}
                  className="rounded-none min-h-[80px]"
                  placeholder="Personal notes about this work..."
                />
              </div>

              {/* Neon Reading */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">NEON'S READING</Label>
                <Textarea
                  value={form.neonReading}
                  onChange={(e) => setForm(prev => ({ ...prev, neonReading: e.target.value }))}
                  className="rounded-none min-h-[80px]"
                  placeholder="Neon's interpretation of this work..."
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle className="font-mono">CONFIRM DELETE</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to delete this work? This action cannot be undone.
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
