import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/lib/i18n';

type Props = {
    open: boolean;
    itemName: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export function DeleteConfirmationDialog({
    open,
    itemName,
    onOpenChange,
    onConfirm,
}: Props) {
    const { t } = useTranslation();
    const confirmDelete = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('Delete :name?', { name: itemName })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            'This data will be permanently deleted and cannot be recovered.',
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" type="button">
                            {t('Cancel')}
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={confirmDelete}
                    >
                        {t('Delete')}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
