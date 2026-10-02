"use client";
import { Activity, Trash2 } from "lucide-react";
import { useActivityStore } from "@/store/useActivityStore";
import ClientDate from "@/components/ui/ClientDate";


export default function AdminLogsPage() {
  const { logs, clearLogs } = useActivityStore();

  const handleClear = () => {
    if (confirm("Clear all activity logs? This cannot be undone.")) {
      clearLogs();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">
            Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {logs.length} {logs.length === 1 ? "entry" : "entries"} (max 100)
          </p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Activity className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-400">No activity yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Actions like adding products or updating orders will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-950 transition">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-black dark:text-white">
                    {log.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {log.detail}
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  <ClientDate date={log.timestamp} />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}