"use client";
import { useEffect, useState } from "react";

interface ClientDateProps {
  date: string | Date;
  mode?: "datetime" | "date";
  className?: string;
}

export default function ClientDate({ date, mode = "datetime", className }: ClientDateProps) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    const text =
      mode === "date"
        ? d.toLocaleDateString("en-KE")
        : d.toLocaleString("en-KE");
    setFormatted(text);
  }, [date, mode]);

  return <span className={className}>{formatted || "—"}</span>;
}