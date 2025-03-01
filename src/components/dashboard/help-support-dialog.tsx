"use client";

import { useState } from "react";
import { HelpCircle, Globe, Mail, Clock, ArrowUpRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HelpSupportDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center">
        <HelpCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span className="ml-5 sidebar-expanded-only" onClick={() => setOpen(true)}>
          Help & Support
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-2xl bg-background shadow-2xl">
          {/* Hero section with gradient background */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/80 via-primary to-primary-foreground p-8">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary-foreground/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-background/10 blur-2xl" />
            
            <DialogHeader className="relative z-10 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
                  <HelpCircle className="h-6 w-6 text-background" />
                </div>
                <DialogClose className="rounded-full p-1.5 text-primary-foreground hover:bg-background/20">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">Support Center</h2>
              <p className="mt-2 text-primary-foreground/80">
                We're here to help with any questions you might have
              </p>
            </DialogHeader>
          </div>

          {/* Information cards with hover effects */}
          <div className="grid gap-3 p-6">
            <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-muted/30 p-4 transition-all hover:shadow-md hover:border-primary/20 hover:bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium uppercase text-muted-foreground">Website</h4>
                  <a 
                    href="https://devkins.dev" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-1 flex items-center text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    devkins.dev
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-70" />
                  </a>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-16 w-16 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-muted/30 p-4 transition-all hover:shadow-md hover:border-primary/20 hover:bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium uppercase text-muted-foreground">Email</h4>
                  <a 
                    href="mailto:devkins.dev@gmail.com" 
                    className="mt-1 flex items-center text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    devkins.dev@gmail.com
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-70" />
                  </a>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-16 w-16 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-muted/30 p-4 transition-all hover:shadow-md hover:border-primary/20 hover:bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium uppercase text-muted-foreground">Support Hours</h4>
                  <p className="mt-1 text-base font-medium text-foreground">
                    Monday to Friday: 9:00 AM - 12:00 PM EST
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-16 w-16 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between border-t border-border/30 p-6">
            <p className="text-sm text-muted-foreground">
              Need urgent assistance?
            </p>
            <Button 
              className="relative overflow-hidden group bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link 
                href="https://devkins.dev/contact" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Contact Us
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}