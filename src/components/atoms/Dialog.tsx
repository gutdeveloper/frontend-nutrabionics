import * as React from "react"
import { cn } from "../../lib/utils"

const Dialog = ({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: {
  children: React.ReactNode
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-50 bg-white rounded-lg shadow-lg max-h-[85vh] max-w-lg w-full overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

const DialogTrigger = ({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}

const DialogContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "max-h-[85vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center px-4 sm:px-6 py-4 border-b",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-end gap-2 p-4 sm:p-6 pt-2 border-t",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn(
        "text-xl font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

const DialogClose = ({
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="text-gray-500 hover:text-gray-700"
      aria-label="Cerrar"
      onClick={onClick}
      {...props}
    >
      {children || "✕"}
    </button>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose
} 