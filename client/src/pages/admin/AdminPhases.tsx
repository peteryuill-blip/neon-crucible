import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhaseForm {
  id?: number;
  code: string;
  title: string;
  year: string;
  description: string;
  emotionalTemperature: string;
  sortOrder: number;
}

const emptyForm: PhaseForm = {
  code: "",
  title: "",
  year: new Date().getFullYear().toString(),
  description: "",
  emotionalTemperature: "",
  sortOrder: 0,
};

export default function AdminPhases() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<PhaseForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: phases, isLoading } = trpc.phases.list.useQuery();

  const createMutation = trpc.phases.create.useMutation({
    onSuccess: () => {
      toast.success("Phase created successfully");
      utils.phases.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.phases.update.useMutation({
    onSuccess: () => {
      toast.success("Phase updated successfully");
      utils.phases.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.phases.delete.useMutation({
    onSuccess: () => {
      toast.success("Phase deleted successfully");
      utils.phases.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openNew = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEdit = (phase: any) => {
    setForm({
      id: phase.id,
      code: phase.code || "",
      title: phase.title || "",
      year: phase.year || new Date().getFullYear().toString(),
      description: phase.description || "",
      emotionalTemperature: phase.emotionalTemperature || "",
      sortOrder: phase.sortOrder || 0,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.code.trim() || !form.title.trim()) {
      toast.error("Code and Title are required");
      return;
    }

    const data = {
      code: form.code,
      title: form.title,
      year: form.year,
      description: form.description || undefined,
      emotionalTemperature: form.emotionalTemperature || undefined,
      sortOrder: form.sortOrder,
    };

    if (isEditing && form.id) {
      updateMutation.mutate({ id: form.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phases</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              MANAGE PRACTICE PHASES (2018-2025+)
            </p>
          </div>
          <Button onClick={openNew} className="rounded-none font-mono gap-2">
            <Plus className="w-4 h-4" />
            ADD PHASE
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
                  <TableHead className="font-mono text-xs text-primary w-[80px]">CODE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">TITLE</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[80px]">YEAR</TableHead>
                  <TableHead className="font-mono text-xs text-primary">EMOTIONAL TEMP</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[80px]">ORDER</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phases?.map((phase) => (
                  <TableRow key={phase.id} className="border-border">
                    <TableCell className="font-mono text-primary font-bold">{phase.code}</TableCell>
                    <TableCell className="font-medium">{phase.title}</TableCell>
                    <TableCell className="font-mono text-xs">{phase.year}</TableCell>
                    <TableCell className="text-sm text-muted-foreground italic">{phase.emotionalTemperature || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{phase.sortOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(phase)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(phase.id)}>
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
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {isEditing ? "EDIT PHASE" : "ADD NEW PHASE"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Code & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">CODE *</Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
                    className="rounded-none"
                    placeholder="PH5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">YEAR *</Label>
                  <Input
                    value={form.year}
                    onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))}
                    className="rounded-none"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">TITLE *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-none"
                  placeholder="The New Beginning"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">EMOTIONAL TEMPERATURE</Label>
                <Input
                  value={form.emotionalTemperature}
                  onChange={(e) => setForm(prev => ({ ...prev, emotionalTemperature: e.target.value }))}
                  className="rounded-none"
                  placeholder="intense, meditative, fierce..."
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">DESCRIPTION</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-none min-h-[100px]"
                  placeholder="Describe this phase of the practice..."
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">SORT ORDER</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="rounded-none"
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
              Are you sure you want to delete this phase? Works associated with this phase will be unlinked.
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
