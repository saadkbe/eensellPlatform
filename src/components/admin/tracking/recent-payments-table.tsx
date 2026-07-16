"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { User, CheckCircle2 } from "lucide-react";

export function RecentPaymentsTable({ users, pricePerStudent }: { users: any[], pricePerStudent: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-border/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-foreground">Recent Payments</h3>
          <p className="text-sm text-muted-foreground font-medium">Latest successful activations.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-bold tracking-wider border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Payment Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((user) => {
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
                    {format(new Date(user.updatedAt), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {pricePerStudent.toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-max ml-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Activated</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No recent payments found for this campaign.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
