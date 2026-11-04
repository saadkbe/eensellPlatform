"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Receipt,
  Printer,
  Download,
  Plus,
  Trash2,
  Building2,
  CreditCard,
  CheckCircle2,
  Sparkles,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { saveInvoiceAction } from "@/actions/workspace.actions";
import { VerifiedCheckBadge, ShieldSecureSticker } from "@/components/workspace/workspace-stickers";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

interface WorkspaceInvoicesClientProps {
  initialAccount?: {
    agencyName?: string | null;
    senderName?: string | null;
    gmailAddress?: string | null;
  } | null;
  initialInvoices?: any[];
}

export function WorkspaceInvoicesClient({
  initialAccount,
  initialInvoices = [],
}: WorkspaceInvoicesClientProps) {
  const searchParams = useSearchParams();
  const initialClient = searchParams.get("client") || "";
  const initialFee = Number(searchParams.get("fee")) || 5000;

  const [agencyName, setAgencyName] = useState(
    initialAccount?.agencyName || "My AI Automation Agency"
  );
  const [agencyAddress, setAgencyAddress] = useState("Casablanca, Morocco");
  const [agencyEmail, setAgencyEmail] = useState(
    initialAccount?.gmailAddress || ""
  );

  const [clientName, setClientName] = useState(initialClient);
  const [clientAddress, setClientAddress] = useState("");
  const [clientContact, setClientContact] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${String(
      (initialInvoices?.length || 0) + 1
    ).padStart(3, "0")}`
  );
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)
  );
  const [currency, setCurrency] = useState("MAD");

  const [bankName, setBankName] = useState("Bank / Payment Method");
  const [accountName, setAccountName] = useState(
    initialAccount?.senderName || "Account Holder Name"
  );
  const [rib, setRib] = useState("RIB / IBAN / Account Number");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "WhatsApp AI Lead Qualification System (Architecture & Workflow Setup)",
      qty: 1,
      rate: initialFee,
    },
    {
      id: "2",
      description: "Monthly Server Hosting & 24/7 Webhook Maintenance Retainer",
      qty: 1,
      rate: 1500,
    },
  ]);

  const subtotal = items.reduce((acc, curr) => acc + curr.qty * curr.rate, 0);
  const total = subtotal;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        description: "Custom AI Automation Workflow Integration",
        qty: 1,
        rate: 2000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveInvoice = async () => {
    try {
      await saveInvoiceAction({
        invoiceNumber,
        clientName,
        service: items[0]?.description || "AI Automation Services",
        amount: total,
        dueDate,
        status: "SENT",
      });
      toast.success(`Facture ${invoiceNumber} enregistrée avec succès dans la base de données !`);
    } catch {
      toast.error("Erreur lors de l'enregistrement de la facture");
    }
  };

  return (
    <div className="w-full px-3 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-6 select-text">
      {/* ── Top Header Banner with Distinct Background (Hidden when printing) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl print:hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <ShieldSecureSticker className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  STEP 5 &bull; BILLING & INVOICING
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <VerifiedCheckBadge className="w-3.5 h-3.5" />
                  Official B2B Template
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Agency Invoices & Billing
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Generate and export professional client invoices with Moroccan bank RIB, legal terms, and instant print/PDF rendering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleSaveInvoice}
              variant="outline"
              size="sm"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 h-9 px-3.5 rounded-xl cursor-pointer shadow-xs backdrop-blur-md"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>Save Invoice</span>
            </Button>
            <Button
              onClick={handlePrint}
              size="sm"
              className="font-bold text-xs bg-white hover:bg-slate-100 text-slate-950 gap-1.5 h-9 px-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Printer className="w-3.5 h-3.5 text-slate-900" />
              <span>Print / PDF &rarr;</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── The Printable Invoice Sheet ── */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg text-slate-900 dark:text-foreground print:border-none print:shadow-none print:p-0">
        
        {/* Header Row: Agency Logo + Invoice Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-200 dark:border-border">
          <div className="space-y-1 max-w-sm">
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="text-2xl sm:text-3xl font-black bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-white w-full"
            />
            <input
              type="text"
              value={agencyAddress}
              onChange={(e) => setAgencyAddress(e.target.value)}
              className="text-xs text-slate-500 dark:text-muted-foreground bg-transparent border-none focus:outline-hidden w-full font-medium"
            />
            <input
              type="text"
              value={agencyEmail}
              onChange={(e) => setAgencyEmail(e.target.value)}
              className="text-xs text-primary bg-transparent border-none focus:outline-hidden w-full font-bold font-mono"
            />
          </div>

          <div className="text-left sm:text-right space-y-1">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold uppercase tracking-widest px-3 py-1">
              OFFICIAL INVOICE
            </Badge>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
              {invoiceNumber}
            </div>
            <div className="text-xs text-slate-500 dark:text-muted-foreground">
              Date: <span className="font-semibold text-slate-900 dark:text-white">{invoiceDate}</span>
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-bold">
              Due Date: {dueDate}
            </div>
          </div>
        </div>

        {/* Bill To & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 dark:border-border text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              BILLED TO:
            </span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="font-bold text-base text-slate-900 dark:text-white bg-transparent border-none focus:outline-hidden w-full"
            />
            <input
              type="text"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              className="text-slate-600 dark:text-muted-foreground bg-transparent border-none focus:outline-hidden w-full font-medium"
            />
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="text-slate-500 dark:text-muted-foreground bg-transparent border-none focus:outline-hidden w-full"
            />
          </div>

          <div className="space-y-1.5 sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              PAYMENT TERMS:
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Bank Wire Transfer (Virement Bancaire)
            </div>
            <div className="text-slate-500 dark:text-muted-foreground">
              Currency: <strong className="text-slate-900 dark:text-white uppercase">{currency}</strong>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-border text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 w-3/5">Service Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Rate</th>
                <th className="py-3 text-right">Amount</th>
                <th className="py-3 text-right print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border text-xs">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        item.description = e.target.value;
                        setItems([...items]);
                      }}
                      className="w-full bg-transparent border-none focus:outline-hidden font-medium text-slate-900 dark:text-white"
                    />
                  </td>

                  <td className="py-3.5 text-center font-mono">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        item.qty = Number(e.target.value);
                        setItems([...items]);
                      }}
                      className="w-12 text-center bg-transparent border-none focus:outline-hidden font-mono"
                    />
                  </td>

                  <td className="py-3.5 text-right font-mono font-bold">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        item.rate = Number(e.target.value);
                        setItems([...items]);
                      }}
                      className="w-20 text-right bg-transparent border-none focus:outline-hidden font-mono font-bold"
                    />
                  </td>

                  <td className="py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                    {(item.qty * item.rate).toLocaleString()} {currency}
                  </td>

                  <td className="py-3.5 text-right pl-2 print:hidden">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-3 print:hidden">
            <Button
              type="button"
              onClick={handleAddItem}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1 border-dashed"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service Item</span>
            </Button>
          </div>
        </div>

        {/* Total Calculations */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-6 border-t border-slate-200 dark:border-border">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-200/80 dark:border-border text-xs space-y-1.5 max-w-sm w-full">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>Bank Transfer Details:</span>
            </div>
            <div className="text-slate-600 dark:text-muted-foreground text-[11px]">
              Bank: <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="bg-transparent border-b border-border text-slate-900 dark:text-white font-medium outline-none px-1" />
            </div>
            <div className="text-slate-600 dark:text-muted-foreground text-[11px]">
              Beneficiary: <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="bg-transparent border-b border-border text-slate-900 dark:text-white font-medium outline-none px-1" />
            </div>
            <div className="text-slate-600 dark:text-muted-foreground text-[11px] font-mono">
              RIB / IBAN: <input type="text" value={rib} onChange={(e) => setRib(e.target.value)} className="bg-transparent border-b border-border text-primary font-black outline-none px-1 w-full" />
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Please include Invoice #{invoiceNumber} as payment reference.
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-border">
              <span className="text-slate-500">Subtotal:</span>
              <span className="font-mono font-bold">{subtotal.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-border">
              <span className="text-slate-500">TVA / Tax (0% Auto-entrepreneur):</span>
              <span className="font-mono text-slate-400">0.00 {currency}</span>
            </div>
            <div className="flex justify-between py-2 text-base font-black text-slate-900 dark:text-white">
              <span>Total Due:</span>
              <span className="text-primary font-mono">{total.toLocaleString()} {currency}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Legal Terms */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-border text-[11px] text-slate-500 dark:text-muted-foreground leading-relaxed">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Terms & Conditions:
          </p>
          <p>
            Payment is due within 15 days of invoice date. Services include continuous AI system monitoring, server maintenance, and priority bug resolution. Thank you for your partnership!
          </p>
        </div>

      </div>
    </div>
  );
}
