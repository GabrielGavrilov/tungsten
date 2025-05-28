import { DataLeaf } from '@/providers/data/provider';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { DialogFooter } from '../ui/dialog';
import { buttonVariants } from '../ui/button';

type EditDescriptionDialogProps = {
  open: boolean;
  item: DataLeaf | null;
  onOpenChange: (open: boolean) => void;
};

export default function EditDescriptionDialog(
  props: EditDescriptionDialogProps
) {
  const { open, item, onOpenChange } = props;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogTitle>Edit descrpition for "{item?.name}"</DialogTitle>
        <DialogFooter>
          <DialogClose
            className={buttonVariants({ variant: 'ghost' })}
            type="button"
          >
            cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
