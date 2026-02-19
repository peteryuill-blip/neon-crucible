import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUpload({ onUploadComplete, currentImageUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);

  const uploadMutation = trpc.gallery.uploadImage.useMutation();

  // Resize and optimize image
  const resizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        // Max width 1920px, maintain aspect ratio
        const MAX_WIDTH = 1920;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.85 // 85% quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      // Resize and optimize
      const optimizedBlob = await resizeImage(file);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(optimizedBlob);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Upload to S3 via tRPC
        const result = await uploadMutation.mutateAsync({
          filename: file.name,
          contentType: "image/jpeg",
          data: base64data,
        });

        setPreview(result.url);
        onUploadComplete(result.url);
        toast.success("Image uploaded successfully");
        setUploading(false);
      };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onUploadComplete("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        Work Image
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Optimizing and uploading...
              </p>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drop image here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Images will be automatically resized to 1920px width and optimized for web
              </p>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
