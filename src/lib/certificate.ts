import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export interface CertificateData {
  studentName: string;
  certificateId: string;
  issueDate?: string;
  verificationUrl?: string;
}

export async function generateCertificatePdf(data: CertificateData): Promise<Blob> {
  const {
    studentName,
    certificateId,
    issueDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).toUpperCase(),
    verificationUrl = `https://www.eensell.com/verify/${certificateId}`,
  } = data;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [1536, 1024],
  });

  // Fetch the optimized certificate background template
  const templateUrl = "/certificate-template.jpg";
  let templateBase64: string;

  try {
    const response = await fetch(templateUrl);
    const blob = await response.blob();
    templateBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    throw new Error("Failed to load certificate template");
  }

  // Draw background template
  doc.addImage(templateBase64, "JPEG", 0, 0, 1536, 1024);

  // Print Student Name
  doc.setFont("helvetica", "bold");
  const formattedName = studentName.trim().toUpperCase();
  // Adjust font size dynamically if name is exceptionally long
  const nameFontSize = formattedName.length > 25 ? 32 : formattedName.length > 20 ? 36 : 40;
  doc.setFontSize(nameFontSize);
  doc.setTextColor(17, 24, 39); // Zinc-900
  doc.text(formattedName, 768, 482, { align: "center" });

  // Print Certificate ID (Top Right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99); // Zinc-600
  doc.text(certificateId, 1375, 114, { align: "center" });

  // Print Issue Date (Bottom Right above "DATE")
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(17, 24, 39);
  doc.text(issueDate, 1055, 860, { align: "center" });

  // Generate & Print Verification QR Code (Bottom Right)
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 140,
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    });
    doc.addImage(qrDataUrl, "PNG", 1335, 825, 75, 75);
  } catch (err) {
    console.error("Failed to generate certificate QR code:", err);
  }

  return doc.output("blob");
}

export function downloadCertificatePdf(blob: Blob, studentName: string) {
  const safeName = studentName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `Eensell_Certificate_${safeName}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
