import { DataLeaf } from '@/providers/data/provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, buttonVariants } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type EditDescriptionDialogProps = {
  open: boolean;
  item: DataLeaf | null;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  description: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditDescriptionDialog(
  props: EditDescriptionDialogProps
) {
  const { open, item, onOpenChange } = props;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  function close() {
    form.reset();
    onOpenChange(false);
  }

  async function onSubmit(value: FormSchema) {
    if (!item) return close();

    const { description } = value;

    console.log(description);
  }

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogTitle>Edit description for "{item.name}"</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="leading-1">
                    description
                    {form.formState.errors.description?.message ?? undefined}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                className={buttonVariants({ variant: 'ghost' })}
                type="button"
              >
                cancel
              </DialogClose>
              <Button variant="default" type="submit">
                submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
