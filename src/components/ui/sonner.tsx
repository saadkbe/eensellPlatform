"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4 shrink-0" />,
        info: <InfoIcon className="size-4 shrink-0" />,
        warning: <TriangleAlertIcon className="size-4 shrink-0" />,
        error: <OctagonXIcon className="size-4 shrink-0" />,
        loading: <Loader2Icon className="size-4 shrink-0 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-900 dark:group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-200 dark:group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
          description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-zinc-900 group-[.toast]:text-white dark:group-[.toast]:bg-white dark:group-[.toast]:text-zinc-900 group-[.toast]:rounded-xl font-semibold",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400 group-[.toast]:rounded-xl",
          error:
            "!bg-[#fef2f2] dark:!bg-[#2a0e11] !text-[#991b1b] dark:!text-[#fca5a5] !border-[#fecaca] dark:!border-[#7f1d1d] !shadow-[0_10px_30px_rgba(239,68,68,0.25)]",
          success:
            "!bg-[#f0fdf4] dark:!bg-[#0d2818] !text-[#166534] dark:!text-[#86efac] !border-[#bbf7d0] dark:!border-[#14532d] !shadow-[0_10px_30px_rgba(16,185,129,0.2)]",
          warning:
            "!bg-[#fffbeb] dark:!bg-[#291804] !text-[#92400e] dark:!text-[#fcd34d] !border-[#fde68a] dark:!border-[#78350f] !shadow-[0_10px_30px_rgba(245,158,11,0.2)]",
          info:
            "!bg-[#eff6ff] dark:!bg-[#0b1c33] !text-[#1e40af] dark:!text-[#93c5fd] !border-[#bfdbfe] dark:!border-[#1e3a8a] !shadow-[0_10px_30px_rgba(59,130,246,0.2)]",
          closeButton:
            "!bg-white dark:!bg-zinc-900 !border-zinc-200 dark:!border-zinc-700 !text-zinc-600 dark:!text-zinc-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
