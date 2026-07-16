"use client";

import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { ExternalLink, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
    </svg>
  );
}

export function PendingPaymentsTable({ users }: { users: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-border/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-foreground">Pending Payments</h3>
          <p className="text-sm text-muted-foreground font-medium">Accounts created but missing payment.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold tracking-wider border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Registration Date</th>
              <th className="px-6 py-4 text-center">Days Waiting</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((user) => {
              const daysWaiting = differenceInDays(new Date(), new Date(user.createdAt));
              const isWarning = daysWaiting > 3;

              return (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.firstName} className="w-8 h-8 rounded-full bg-secondary object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {format(new Date(user.createdAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        isWarning ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {daysWaiting} {daysWaiting === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`https://wa.me/` /* add actual logic if possible */} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#25D366] hover:text-[#128C7E] hover:bg-[#25D366]/10">
                          <WhatsAppIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No pending payments. Everyone is paid up!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
