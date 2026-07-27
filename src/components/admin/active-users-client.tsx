"use client";

import { UserCheck, Search, Calendar, ChevronRight, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExportReportButton } from "@/components/admin/export-report-button";

interface ActiveUser {
  id: string;
  rank: number;
  name: string;
  email: string;
  imageUrl: string | null;
  startDate: string;
  role: string;
  completedLessons: number;
}

export function ActiveUsersClient({ users }: { users: ActiveUser[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const groupedUsers = useMemo(() => {
    const groups: Record<string, ActiveUser[]> = {};
    filteredUsers.forEach((user) => {
      const date = new Date(user.startDate);
      const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(user);
    });
    return groups;
  }, [filteredUsers]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 pb-24">
      {/* ── HEADER ── */}
      <div className="w-full px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-emerald-500" />
            Active Users
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Directory of all fully activated members and their start dates.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search active users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 h-10 border-slate-200 bg-white rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-emerald-500"
            />
          </div>
          <ExportReportButton />
        </div>
      </div>

      <div className="w-full px-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</div>
            <div className="col-span-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</div>
            <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</div>
            <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {Object.entries(groupedUsers).map(([monthYear, monthUsers]) => (
              <div key={monthYear}>
                {/* Month Group Header */}
                <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-2.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">{monthYear} <span className="text-slate-400 font-medium ml-1">({monthUsers.length})</span></h3>
                </div>
                
                {/* Month Users */}
                <div className="divide-y divide-slate-100">
                  {monthUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Rank */}
                      <div className="col-span-1 text-sm font-semibold text-slate-400">
                        {user.rank}
                      </div>

                      {/* User Info */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0 pr-4">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 shrink-0 object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-sm font-semibold text-slate-700">
                            {user.name[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Start Date */}
                      <div className="col-span-3 flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(user.startDate).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>

                      {/* Progress */}
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          <Award className="w-3.5 h-3.5 text-emerald-500" />
                          {user.completedLessons} Lessons
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex justify-end">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">No active users found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
