import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-xl border-0 shadow-xl">
        <div className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 overflow-hidden">
            <svg className="absolute -top-24 -right-24 text-red-200/50 dark:text-red-900/20" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.9277 142.687C33.3336 136.926 21.3144 138.676 13.761 146.23C6.2077 153.783 4.45816 165.802 10.2189 175.396C15.9796 184.99 28.7451 188.438 39.2315 183.682C49.7179 178.926 54.6653 166.685 50.8481 156.008C47.0309 145.331 35.3742 137.432 24.1807 139.092C13.1401 140.629 5.24064 150.94 5.51878 162.109" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
            </svg>
            <svg className="absolute -bottom-16 -left-16 text-red-200/50 dark:text-red-900/20" width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M157.373 138.746C166.967 144.507 178.986 142.757 186.539 135.204C194.093 127.65 195.842 115.632 190.081 106.038C184.321 96.4434 171.555 92.9954 161.069 97.7513C150.582 102.507 145.635 114.748 149.452 125.425C153.269 136.103 164.926 144.002 176.119 142.342C187.16 140.804 195.059 130.493 194.781 119.325" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
            </svg>
          </div>

          <DialogHeader className="flex flex-col items-center gap-4 pt-10 pb-6 px-6 relative">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 flex items-center justify-center shadow-md"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
              </motion.div>
            </motion.div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">Delete Course</DialogTitle>
              <DialogDescription className="text-center max-w-[320px] mt-2 text-zinc-600 dark:text-zinc-400">
                This action cannot be undone. This will permanently delete the
                course and remove it from our servers.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
            <DialogFooter className="flex z-50 relative flex-col sm:flex-row gap-3 sm:gap-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="w-full sm:w-auto rounded-full border-zinc-200 dark:border-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 dark:from-red-600 dark:to-rose-600 dark:hover:from-red-500 dark:hover:to-rose-500 text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Delete Permanently
                </motion.span>
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
