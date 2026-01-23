"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AreYouSure({ buttons, load, doDelete, id }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{buttons}</AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900/95 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur max-w-md mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-200">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This action cannot be undone. This will permanently delete this
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel
            onClick={load}
            className="bg-slate-800/50 border border-white/20 text-slate-200 hover:bg-slate-700/50 transition-all duration-200 w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700 border border-red-500/30 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            onClick={() => {
              doDelete(id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
