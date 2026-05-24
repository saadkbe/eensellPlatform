"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState, useCallback } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileImage, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FileUploaderProps = {
  endpoint: "moduleImage" | "lessonResource";
  onUploadComplete: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
};

export function FileUploader({
  endpoint,
  onUploadComplete,
  label = "Upload File",
  accept,
  maxSizeMB = 16,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => {
      setProgress(p);
    },
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const url = res[0].ufsUrl || res[0].url;
        onUploadComplete(url);
        setStatus("success");
        toast.success("File uploaded successfully!");
      }
    },
    onUploadError: (error) => {
      setStatus("error");
      setErrorMsg(error.message || "Upload failed");
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFile = useCallback(
    async (selectedFile: File) => {
      // Validate size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File is too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      setFile(selectedFile);
      setStatus("uploading");
      setProgress(0);
      setErrorMsg("");

      try {
        await startUpload([selectedFile]);
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err?.message || "Upload failed");
      }
    },
    [startUpload, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
    },
    [handleFile]
  );

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setErrorMsg("");
  };

  const isImage = endpoint === "moduleImage";
  const FileIcon = isImage ? FileImage : FileText;

  // Success state
  if (status === "success") {
    return (
      <div className="flex items-center justify-between p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Upload complete</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {file?.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex items-center justify-between p-4 border border-destructive/30 bg-destructive/5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-destructive">Upload failed</p>
            <p className="text-xs text-muted-foreground">{errorMsg}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-muted-foreground hover:text-foreground"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Uploading state
  if (status === "uploading") {
    return (
      <div className="p-5 border border-border bg-muted/30 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
            <p className="text-xs text-muted-foreground">
              {progress < 100 ? `Uploading... ${progress}%` : "Processing..."}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary tabular-nums">{progress}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // Idle state — drop zone
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200",
        "p-8 flex flex-col items-center justify-center gap-3 text-center",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/40 hover:bg-muted/30 bg-background"
      )}
    >
      <input
        type="file"
        accept={accept || (isImage ? "image/*" : undefined)}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
          isDragging ? "bg-primary/10" : "bg-muted group-hover:bg-primary/10"
        )}
      >
        <Upload
          className={cn(
            "w-6 h-6 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
        </p>
      </div>
      <p className="text-[11px] text-muted-foreground/60">
        {isImage ? "PNG, JPG, WebP up to 4MB" : `PDF, DOC, or other files up to ${maxSizeMB}MB`}
      </p>
    </div>
  );
}
