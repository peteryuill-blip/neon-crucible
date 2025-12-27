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
import { Plus, Pencil, Trash2, Loader2, Upload, FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface ArchiveFileForm {
  id?: number;
  filename: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  fileKey: string;
  description: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
}

const emptyForm: ArchiveFileForm = {
  filename: "",
  fileType: "TXT",
  fileSize: "",
  fileUrl: "",
  fileKey: "",
  description: "",
  category: "technical",
  isPublished: true,
  sortOrder: 0,
};

const categories = [
  { value: "protocol", label: "Protocol" },
  { value: "source", label: "Primary Source" },
  { value: "technical", label: "Technical" },
  { value: "metaquestion", label: "Metaquestion" },
];

const fileTypes = ["TXT", "PDF", "MD", "JSON", "CSV"];

export default function AdminArchive() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ArchiveFileForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data: archiveFiles, isLoading } = trpc.archiveFiles.list.useQuery();

  const createMutation = trpc.archiveFiles.create.useMutation({
    onSuccess: () => {
      toast.success("Archive file created successfully");
      utils.archiveFiles.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.archiveFiles.update.useMutation({
    onSuccess: () => {
      toast.success("Archive file updated successfully");
      utils.archiveFiles.list.invalidate();
      setIsDialogOpen(false);
      setForm(emptyForm);
      setIsEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.archiveFiles.delete.useMutation({
    onSuccess: () => {
      toast.success("Archive file deleted successfully");
      utils.archiveFiles.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadMutation = trpc.upload.archiveFile.useMutation({
    onSuccess: (data) => {
      setForm(prev => ({ 
        ...prev, 
        fileUrl: data.url, 
        fileKey: data.key,
        filename: prev.filename || data.key.split("/").pop() || "file"
      }));
      toast.success("File uploaded successfully");
      setUploading(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setUploading(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Detect file type
    const ext = file.name.split(".").pop()?.toUpperCase() || "TXT";
    setForm(prev => ({ 
      ...prev, 
      filename: file.name,
      fileType: ext,
      fileSize: formatFileSize(file.size)
    }));

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        base64Data: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
    return (bytes / (1024 * 1024)).toFixed(1) + "MB";
  };

  const openNew = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEdit = (file: any) => {
    setForm({
      id: file.id,
      filename: file.filename || "",
      fileType: file.fileType || "TXT",
      fileSize: file.fileSize || "",
      fileUrl: file.fileUrl || "",
      fileKey: file.fileKey || "",
      description: file.description || "",
      category: file.category || "technical",
      isPublished: file.isPublished ?? true,
      sortOrder: file.sortOrder || 0,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.filename.trim()) {
      toast.error("Filename is required");
      return;
    }

    const data = {
      filename: form.filename,
      fileType: form.fileType || undefined,
      fileSize: form.fileSize || undefined,
      fileUrl: form.fileUrl || undefined,
      fileKey: form.fileKey || undefined,
      description: form.description || undefined,
      category: form.category || undefined,
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
            <h1 className="text-3xl font-bold tracking-tight">Archive Files</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              RAW DATA / TECHNICAL PROTOCOLS / PRIMARY SOURCES
            </p>
          </div>
          <Button onClick={openNew} className="rounded-none font-mono gap-2">
            <Plus className="w-4 h-4" />
            UPLOAD FILE
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
                  <TableHead className="font-mono text-xs text-primary w-[60px]">TYPE</TableHead>
                  <TableHead className="font-mono text-xs text-primary">FILENAME</TableHead>
                  <TableHead className="font-mono text-xs text-primary">CATEGORY</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[80px]">SIZE</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[100px]">STATUS</TableHead>
                  <TableHead className="font-mono text-xs text-primary w-[120px]">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archiveFiles?.map((file) => (
                  <TableRow key={file.id} className="border-border">
                    <TableCell>
                      <span className="font-mono text-xs px-2 py-1 bg-muted/20">
                        {file.fileType || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{file.filename}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getCategoryLabel(file.category || "")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{file.fileSize || "—"}</TableCell>
                    <TableCell>
                      <span className={`font-mono text-xs ${file.isPublished ? "text-green-400" : "text-yellow-400"}`}>
                        {file.isPublished ? "PUBLIC" : "HIDDEN"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {file.fileUrl && (
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(file)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(file.id)}>
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
          <DialogContent className="rounded-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono">
                {isEditing ? "EDIT ARCHIVE FILE" : "UPLOAD ARCHIVE FILE"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* File Upload */}
              {!isEditing && (
                <div className="space-y-2">
                  <Label className="font-mono text-xs">FILE</Label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-border cursor-pointer hover:bg-muted/5 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : form.fileUrl ? (
                      <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        <span className="font-mono text-sm">{form.filename}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="font-mono text-xs text-muted-foreground">CLICK TO UPLOAD</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {/* Filename */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">FILENAME *</Label>
                <Input
                  value={form.filename}
                  onChange={(e) => setForm(prev => ({ ...prev, filename: e.target.value }))}
                  className="rounded-none font-mono"
                  placeholder="NEON_PROTOCOL_V1.txt"
                />
              </div>

              {/* Type & Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-xs">FILE TYPE</Label>
                  <Select
                    value={form.fileType}
                    onValueChange={(v) => setForm(prev => ({ ...prev, fileType: v }))}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {fileTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-xs">FILE SIZE</Label>
                  <Input
                    value={form.fileSize}
                    onChange={(e) => setForm(prev => ({ ...prev, fileSize: e.target.value }))}
                    className="rounded-none font-mono"
                    placeholder="24KB"
                  />
                </div>
              </div>

              {/* Category */}
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
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="font-mono text-xs">DESCRIPTION</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-none"
                  placeholder="Brief description of the file contents..."
                  rows={2}
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs">PUBLIC</Label>
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
              Are you sure you want to delete this archive file?
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
