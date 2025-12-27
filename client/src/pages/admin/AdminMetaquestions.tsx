import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MetaquestionForm {
  id?: number;
  question: string;
  answer: string;
  isAnswered: boolean;
  sortOrder: number;
}

const emptyForm: MetaquestionForm = {
  question: "",
  answer: "",
  isAnswered: false,
  sortOrder: 0,
};

export default function AdminMetaquestions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<MetaquestionForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: metaquestions, isLoading } = trpc.metaquestions.list.useQuery();

  const createMutation = trpc.metaquestions.create.useMutation({
    onSuccess: () => {
      toast.success("Metaquestion created successfully");
      utils.metaquestions.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.metaquestions.update.useMutation({
    onSuccess: () => {
      toast.success("Metaquestion updated successfully");
      utils.metaquestions.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.metaquestions.delete.useMutation({
    onSuccess: () => {
      toast.success("Metaquestion deleted successfully");
      utils.metaquestions.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const openNew = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEdit = (mq: any) => {
    setForm({
      id: mq.id,
      question: mq.question || "",
      answer: mq.answer || "",
      isAnswered: mq.isAnswered ?? false,
      sortOrder: mq.sortOrder || 0,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.question.trim()) {
      toast.error("Question is required");
      return;
    }

    const data = {
      question: form.question,
      answer: form.answer || undefined,
      isAnswered: form.isAnswered,
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
            <h1 className="text-3xl font-bold tracking-tight">Metaquestions</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              THE QUESTIONS THAT HAUNT THE PRACTICE
            </p>
          </div>
          <Button onClick={openNew} className="rounded-none font-mono gap-2">
            <Plus className="w-4 h-4" />
            ADD QUESTION
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
                  <TableHead className="font-mono text-xs text-primary w-[60px]">Q#</TableHead>
                  <TableHead className="font-mono text-xs text-primary">QUESTION</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">ANSWERED</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metaquestions?.map((mq, index) => (
                  <TableRow key={mq.id} className="border-border">
                    <TableCell className="font-mono text-primary font-bold">Q{index + 1}</TableCell>
                    <TableCell className="font-serif italic">{mq.question}</TableCell>
                    <TableCell>
                      <span className={`font-mono text-xs ${mq.isAnswered ? "text-green-400" : "text-yellow-400"}`}>
                        {mq.isAnswered ? "ANSWERED" : "OPEN"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(mq)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(mq.id)}>
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
                {isEditing ? "EDIT METAQUESTION" : "NEW METAQUESTION"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Question */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">QUESTION *</Label>
                <Input
                  value={form.question}
                  onChange={(e) => setForm(prev => ({ ...prev, question: e.target.value }))}
                  className="rounded-none"
                  placeholder="Does the practice sustain the life, or consume it?"
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

              {/* Answer (optional) */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">ANSWER (OPTIONAL)</Label>
                <Input
                  value={form.answer}
                  onChange={(e) => setForm(prev => ({ ...prev, answer: e.target.value }))}
                  className="rounded-none"
                  placeholder="Leave empty if question remains open..."
                />
              </div>

              {/* Answered Toggle */}
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs">ANSWERED</Label>
                <Switch
                  checked={form.isAnswered}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, isAnswered: checked }))}
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
              Are you sure you want to delete this metaquestion?
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
