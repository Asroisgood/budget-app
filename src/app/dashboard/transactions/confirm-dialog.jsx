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

// Suppress hydration warning for Radix UI components
const AlertDialogNoSSR = AlertDialog;
const AlertDialogTriggerNoSSR = AlertDialogTrigger;
const AlertDialogContentNoSSR = AlertDialogContent;
const AlertDialogDescriptionNoSSR = AlertDialogDescription;
const AlertDialogFooterNoSSR = AlertDialogFooter;
const AlertDialogHeaderNoSSR = AlertDialogHeader;
const AlertDialogTitleNoSSR = AlertDialogTitle;
const AlertDialogCancelNoSSR = AlertDialogCancel;
const AlertDialogActionNoSSR = AlertDialogAction;

export function AreYouSure({ buttons, load, doDelete, id }) {
  return (
    <AlertDialogNoSSR>
      <AlertDialogTriggerNoSSR asChild>{buttons}</AlertDialogTriggerNoSSR>
      <AlertDialogContentNoSSR className="bg-slate-900/95 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur max-w-md mx-4">
        <AlertDialogHeaderNoSSR>
          <AlertDialogTitleNoSSR className="text-slate-200">
            Are you absolutely sure?
          </AlertDialogTitleNoSSR>
          <AlertDialogDescriptionNoSSR className="text-slate-400">
            This action cannot be undone. This will permanently delete this
            transaction.
          </AlertDialogDescriptionNoSSR>
        </AlertDialogHeaderNoSSR>
        <AlertDialogFooterNoSSR className="flex-col sm:flex-row gap-2">
          <AlertDialogCancelNoSSR
            onClick={load}
            className="bg-slate-800/50 border border-white/20 text-slate-200 hover:bg-slate-700/50 transition-all duration-200 w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancelNoSSR>
          <AlertDialogActionNoSSR
            className="bg-red-600 text-white hover:bg-red-700 border border-red-500/30 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            onClick={() => {
              doDelete(id);
            }}
          >
            Delete
          </AlertDialogActionNoSSR>
        </AlertDialogFooterNoSSR>
      </AlertDialogContentNoSSR>
    </AlertDialogNoSSR>
  );
}
