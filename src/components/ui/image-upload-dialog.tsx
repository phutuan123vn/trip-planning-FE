import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/api/image-api";
import { useMutation } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (imageId: string, imageUrl: string) => void;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onUploadSuccess,
}: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (file: File) => uploadImage({ file, fileName: file.name }),
    onSuccess: (data) => {
      toast.success("Image uploaded successfully!");
      onUploadSuccess(data.id, data.url);
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleClose() {
    setSelectedFile(null);
    setPreviewUrl(null);
    onOpenChange(false);
  }

  function handleUpload() {
    if (!selectedFile) return;
    upload(selectedFile);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl !font-bold !text-gray-900 dark:!text-white">Upload Image</DialogTitle>
          <DialogDescription>
            Select an image file to upload (max 5MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File input */}
          <div className="space-y-2">
            <Label htmlFor="file">Choose Image</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="relative rounded-lg border overflow-hidden bg-muted">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-contain"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={clearSelection}
                disabled={isPending}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
            className="gap-2"
          >
            {isPending ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="size-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
