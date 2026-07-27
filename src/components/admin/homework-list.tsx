"use client";

import { useState, useTransition } from "react";
import { reviewHomework } from "@/actions/homework.actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HomeworkWithRelations = {
  id: string;
  fileUrl: string;
  status: string;
  feedback: string | null;
  createdAt: Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
  };
  lesson: {
    id: string;
    title: string;
    module: {
      title: string;
    };
  };
};

export function HomeworkList({
  initialHomeworks,
  isAll,
}: {
  initialHomeworks: HomeworkWithRelations[];
  isAll: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reviewDialog, setReviewDialog] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleReview = (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      try {
        await reviewHomework(id, status, feedback.trim() ? feedback : undefined);
        toast.success(`Homework ${status.toLowerCase()} successfully`);
        setReviewDialog(null);
        setFeedback("");
      } catch {
        toast.error("Failed to update homework status");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={!isAll ? "default" : "outline"} onClick={() => router.push("/admin/homeworks")} size="sm">
          Pending Review
        </Button>
        <Button variant={isAll ? "default" : "outline"} onClick={() => router.push("/admin/homeworks?tab=all")} size="sm">
          All Submissions
        </Button>
      </div>

      {initialHomeworks.length === 0 ? (
        <Card className="bg-white/[0.02] border-white/[0.06] shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No submissions found</h3>
            <p className="text-sm text-white/40 max-w-sm">
              {isAll ? "No homework has been submitted yet." : "You're all caught up! No pending homework to review."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialHomeworks.map((hw) => (
            <Card key={hw.id} className="bg-white/[0.02] border-white/[0.06] shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-5 gap-5">
                  
                  {/* User Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    {hw.user.imageUrl ? (
                      <img src={hw.user.imageUrl} alt={hw.user.firstName || "User"} className="w-12 h-12 rounded-full border border-white/[0.06]" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                        {hw.user.firstName?.charAt(0) || hw.user.email.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {hw.user.firstName} {hw.user.lastName}
                      </p>
                      <p className="text-xs text-white/40 truncate max-w-[150px]">
                        {hw.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Homework Details */}
                  <div className="flex-1 min-w-0 border-l border-white/[0.04] pl-5 md:py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] font-medium bg-white/[0.04] border-white/[0.08]">
                        {hw.lesson.module.title}
                      </Badge>
                      {hw.status === "PENDING" && <Badge className="bg-amber-500 hover:bg-amber-500/80 text-white text-[10px]">Pending</Badge>}
                      {hw.status === "APPROVED" && <Badge className="bg-emerald-500 hover:bg-emerald-500/80 text-white text-[10px]">Approved</Badge>}
                      {hw.status === "REJECTED" && <Badge className="bg-red-500 hover:bg-red-500/80 text-white text-[10px]">Rejected</Badge>}
                    </div>
                    <h4 className="font-semibold text-white text-sm truncate">
                      {hw.lesson.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-white/40 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {hw.createdAt.toLocaleDateString()}
                      </p>
                      <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> View PDF
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 md:pl-5 shrink-0">
                    {hw.status === "PENDING" ? (
                      <Dialog open={reviewDialog === hw.id} onOpenChange={(open) => { setReviewDialog(open ? hw.id : null); if (!open) setFeedback(""); }}>
                        <DialogTrigger render={<Button size="sm" className="w-full md:w-auto" />}>
                          Review Submission
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-[#0a0b10] border-white/[0.06] text-white">
                          <DialogHeader>
                            <DialogTitle>Review Homework</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-4 bg-white/[0.02] rounded-lg border border-white/[0.06]">
                              <p className="text-sm font-semibold mb-2">Submission Document</p>
                              <a href={hw.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full gap-2">
                                  <FileText className="w-4 h-4" /> Open PDF
                                </Button>
                              </a>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Feedback (Optional)</label>
                              <Textarea 
                                placeholder="Explain why it was rejected, or say great job!" 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                className="bg-white/[0.04] border-white/[0.08] text-white"
                              />
                            </div>

                            <div className="flex gap-3 pt-2">
                              <Button 
                                variant="destructive" 
                                className="w-full gap-2" 
                                onClick={() => handleReview(hw.id, "REJECTED")}
                                disabled={isPending}
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </Button>
                              <Button 
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2" 
                                onClick={() => handleReview(hw.id, "APPROVED")}
                                disabled={isPending}
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                       <div className="text-right">
                         {hw.feedback && (
                           <div className="mb-2 p-2 bg-white/[0.02] rounded-lg border border-white/[0.06] max-w-[250px] text-left">
                             <p className="text-[10px] font-bold uppercase text-white/40 mb-0.5">Your Feedback</p>
                             <p className="text-xs text-white line-clamp-2">{hw.feedback}</p>
                           </div>
                         )}
                         <Button variant="outline" size="sm" onClick={() => { setReviewDialog(hw.id); setFeedback(hw.feedback || ""); }}>
                           Edit Review
                         </Button>
                       </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
