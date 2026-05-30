"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState, useCallback, useTransition } from "react";
import { Upload, X, CheckCircle2, AlertCircle, FileText, Loader2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitHomework } from "@/actions/homework.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type HomeworkUploaderProps = {
  lessonId: string;
  initialStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
  initialFileUrl?: string | null;
  initialFeedback?: string | null;
};

export function HomeworkUploader({
  lessonId,
  initialStatus,
  initialFileUrl,
  initialFeedback,
}: HomeworkUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error" | "submitted">(initialStatus ? "submitted" : "idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [hwStatus, setHwStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const { startUpload } = useUploadThing("homeworkPdf", {
    onUploadProgress: (p) => {
      setProgress(p);
    },
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const url = res[0].ufsUrl || res[0].url;
        // Submit to DB
        startTransition(async () => {
          try {
            await submitHomework(lessonId, url);
            setStatus("submitted");
            setHwStatus("PENDING");
            toast.success("Homework submitted successfully!");
          } catch (e) {
            setStatus("error");
            setErrorMsg("Failed to save submission");
            toast.error("Upload complete but failed to save.");
          }
        });
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
      if (selectedFile.size > 16 * 1024 * 1024) {
        toast.error(`File is too large. Max size is 16MB.`);
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
    [startUpload, lessonId]
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

  // Submitted state
  if (status === "submitted" || hwStatus) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center border",
              hwStatus === "APPROVED" ? "bg-emerald-500/10 border-emerald-500/20" :
              hwStatus === "REJECTED" ? "bg-red-500/10 border-red-500/20" :
              "bg-amber-500/10 border-amber-500/20"
            )}>
              {hwStatus === "APPROVED" ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> :
               hwStatus === "REJECTED" ? <X className="w-6 h-6 text-red-500" /> :
               <FileCheck className="w-6 h-6 text-amber-500" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Homework Status</h3>
              <div className="flex items-center gap-2 mt-1">
                {hwStatus === "APPROVED" && <Badge className="bg-emerald-500 text-white">Approved</Badge>}
                {hwStatus === "PENDING" && <Badge className="bg-amber-500 text-white">Pending Review</Badge>}
                {hwStatus === "REJECTED" && <Badge className="bg-red-500 text-white">Rejected</Badge>}
              </div>
            </div>
          </div>
          
          {hwStatus === "REJECTED" && initialFeedback && (
             <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg mb-4">
               <p className="text-xs font-bold text-red-500 uppercase mb-1">Feedback</p>
               <p className="text-sm text-foreground">{initialFeedback}</p>
             </div>
          )}

          {hwStatus === "REJECTED" && (
            <Button variant="outline" className="w-full mt-2" onClick={reset}>
              Upload New Submission
            </Button>
          )}

          {hwStatus === "APPROVED" && (
             <p className="text-sm text-muted-foreground">Great job! Your assignment was approved. You can now complete this lesson.</p>
          )}

          {hwStatus === "PENDING" && (
            <p className="text-sm text-muted-foreground">Your assignment is under review. You can proceed once it's approved.</p>
          )}
        </CardContent>
      </Card>
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
  if (status === "uploading" || isPending) {
    return (
      <div className="p-5 border border-border bg-muted/30 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file?.name || "Submitting..."}</p>
            <p className="text-xs text-muted-foreground">
              {progress < 100 ? `Uploading... ${progress}%` : "Saving submission..."}
            </p>
          </div>
          <span className="text-sm font-semibold text-primary tabular-nums">{progress}%</span>
        </div>
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
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-primary" />
        Homework Required
      </h3>
      <p className="text-sm text-muted-foreground">Please upload your assignment as a PDF. You must complete this to mark the lesson as done.</p>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 mt-4",
          "p-8 flex flex-col items-center justify-center gap-3 text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 hover:bg-muted/30 bg-background"
        )}
      >
        <input
          type="file"
          accept=".pdf"
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
          <p className="text-sm font-medium text-foreground">Upload Homework PDF</p>
          <p className="text-xs text-muted-foreground mt-1">
            {isDragging ? "Drop your PDF here" : "Drag & drop your PDF or click to browse"}
          </p>
        </div>
      </div>
    </div>
  );
}
