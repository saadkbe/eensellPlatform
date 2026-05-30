"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExportReportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1. Fetch report data
      const res = await fetch("/api/admin/report");
      if (!res.ok) throw new Error("Failed to fetch report data");
      const data = await res.json();

      // 2. Dynamically import jsPDF (keeps bundle size small)
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      const brandColor: [number, number, number] = [10, 10, 10];
      const accentColor: [number, number, number] = [16, 185, 129];
      const mutedColor: [number, number, number] = [120, 120, 120];
      const reportDate = new Date(data.generatedAt).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });

      // ── Header ──────────────────────────────────────
      doc.setFillColor(...brandColor);
      doc.rect(0, 0, pageWidth, 44, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Eensell University", margin, 18);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Platform Analytics Report", margin, 26);

      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(reportDate, margin, 34);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(8);
      doc.text("CONFIDENTIAL", pageWidth - margin, 34, { align: "right" });

      y = 56;

      // ── Revenue Highlight ───────────────────────────
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, "F");
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, "S");

      doc.setTextColor(...accentColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL REVENUE", margin + 8, y + 9);

      doc.setTextColor(...brandColor);
      doc.setFontSize(20);
      doc.text(`${data.stats.revenue.toLocaleString()} MAD`, margin + 8, y + 19);

      doc.setTextColor(...mutedColor);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`${data.stats.activeUsers} active users × 200 MAD`, pageWidth - margin - 8, y + 15, { align: "right" });

      y += 34;

      // ── Key Metrics Grid ────────────────────────────
      doc.setTextColor(...brandColor);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Key Metrics", margin, y);
      y += 8;

      const metrics = [
        { label: "Total Users", value: data.stats.totalUsers },
        { label: "Active Users", value: data.stats.activeUsers },
        { label: "Pending", value: data.stats.pendingUsers },
        { label: "Suspended", value: data.stats.suspendedUsers },
        { label: "Total Modules", value: data.stats.totalModules },
        { label: "Published Modules", value: data.stats.publishedModules },
        { label: "Total Lessons", value: data.stats.totalLessons },
        { label: "Published Lessons", value: data.stats.publishedLessons },
        { label: "Lesson Completions", value: data.stats.completedProgress },
        { label: "Rejected Users", value: data.stats.rejectedUsers },
      ];

      const cols = 3;
      const cellW = contentWidth / cols;
      const cellH = 18;
      metrics.forEach((m, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = margin + col * cellW;
        const cy = y + row * cellH;

        doc.setFillColor(250, 250, 250);
        doc.roundedRect(cx + 1, cy, cellW - 2, cellH - 2, 2, 2, "F");
        doc.setDrawColor(230, 230, 230);
        doc.roundedRect(cx + 1, cy, cellW - 2, cellH - 2, 2, 2, "S");

        doc.setTextColor(...brandColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(String(m.value), cx + 6, cy + 8);

        doc.setTextColor(...mutedColor);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text(m.label, cx + 6, cy + 13.5);
      });

      y += Math.ceil(metrics.length / cols) * cellH + 10;

      // ── Modules Table ───────────────────────────────
      doc.setTextColor(...brandColor);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Modules Overview", margin, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["#", "Module Title", "Status", "Lessons", "Completions"]],
        body: data.modules.map((m: { title: string; isPublished: boolean; lessonCount: number; totalCompletions: number }, i: number) => [
          i + 1,
          m.title,
          m.isPublished ? "Published" : "Draft",
          m.lessonCount,
          m.totalCompletions,
        ]),
        headStyles: {
          fillColor: brandColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          cellPadding: 4,
        },
        bodyStyles: {
          fontSize: 8,
          cellPadding: 3.5,
          textColor: [40, 40, 40],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          2: { cellWidth: 22, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 25, halign: "center" },
        },
        styles: {
          lineWidth: 0.1,
          lineColor: [220, 220, 220],
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 12;

      // ── Check if we need a new page for users table ─
      if (y > 220) {
        doc.addPage();
        y = 20;
      }

      // ── Users Table ─────────────────────────────────
      doc.setTextColor(...brandColor);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Recent Users", margin, y);
      y += 4;

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["#", "Name", "Email", "Status", "Completed", "Joined"]],
        body: data.recentUsers.map((u: { name: string; email: string; status: string; completedLessons: number; joinedAt: string }, i: number) => [
          i + 1,
          u.name,
          u.email,
          u.status,
          u.completedLessons,
          new Date(u.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        ]),
        headStyles: {
          fillColor: brandColor,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8,
          cellPadding: 4,
        },
        bodyStyles: {
          fontSize: 7.5,
          cellPadding: 3,
          textColor: [40, 40, 40],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          3: { cellWidth: 22, halign: "center" },
          4: { cellWidth: 22, halign: "center" },
          5: { cellWidth: 28, halign: "center" },
        },
        styles: {
          lineWidth: 0.1,
          lineColor: [220, 220, 220],
          overflow: "ellipsize",
        },
      });

      // ── Footer ──────────────────────────────────────
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageH = doc.internal.pageSize.getHeight();
        doc.setDrawColor(230, 230, 230);
        doc.line(margin, pageH - 14, pageWidth - margin, pageH - 14);
        doc.setTextColor(...mutedColor);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text("Eensell University — Confidential Report", margin, pageH - 8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageH - 8, { align: "right" });
      }

      // 3. Download
      const filename = `Eensell_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      toast.success("Report downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2 shadow-sm border-border hover:bg-muted/50 transition-all"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isExporting ? "Generating..." : "Export Report"}
    </Button>
  );
}
