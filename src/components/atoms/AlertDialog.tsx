import * as React from "react"
import { cn } from "../../lib/utils"

const AlertDialog = ({
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
  
  // Prevent scrolling when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-50 bg-white rounded-lg shadow-lg max-w-lg w-full overflow-hidden p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

const AlertDialogTrigger = ({
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

const AlertDialogContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "space-y-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const AlertDialogHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const AlertDialogFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const AlertDialogTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn(
        "text-lg font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

const AlertDialogDescription = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn(
        "text-sm text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

const AlertDialogAction = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const AlertDialogCancel = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} 