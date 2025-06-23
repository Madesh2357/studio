import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Siren } from "lucide-react";

interface EmergencyAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EmergencyAlertDialog({ open, onOpenChange }: EmergencyAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 mb-4">
              <Siren className="h-10 w-10 text-destructive animate-pulse" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">EMERGENCY ALERT!</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            High risk of rapid storm development! The forecast shows a potential probability increase of over 40% in a 3-hour period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 text-center text-muted-foreground">
          <p>Coastal guards have been notified of your location.</p>
          <p className="font-semibold">Please seek shelter immediately and follow safety protocols.</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction className="w-full" onClick={() => onOpenChange(false)}>
            Acknowledge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
