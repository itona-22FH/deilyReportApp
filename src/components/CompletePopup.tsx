import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  target: string;
}

export const  CompletePopup = ({
  isOpen,
  onClose,
  action,
  target,
}: CompletePopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action}完了</DialogTitle>
          <DialogDescription>
            {target}が正常に{action}されました。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
