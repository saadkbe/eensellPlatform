"use client";

import * as React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const busy = isDeleting || loading;

  return (
    <Dialog open={open} onOpenChange={(val) => !busy && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-slate-200/80 dark:border-white/10 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                {description}
                {itemName && (
                  <span className="block mt-2 font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium truncate">
                    {itemName}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 p-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg h-9 px-3.5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={handleConfirm}
            className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-9 px-4 gap-1.5 shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
          >
            {busy ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
