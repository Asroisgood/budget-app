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
import { Button } from "@/components/ui/button";

export function AreYouSure({ buttons, load, doDelete, id }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{buttons}</AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900/95 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-200">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This action cannot be undone. This will permanently delete this
            category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={load}
            className="bg-slate-800/50 border border-white/20 text-slate-200 hover:bg-slate-700/50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700 border border-red-500/30"
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
