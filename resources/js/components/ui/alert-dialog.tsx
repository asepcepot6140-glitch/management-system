import * as React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

function AlertDialogContent({
    ...props
}: React.ComponentProps<typeof DialogContent>) {
    return <DialogContent role="alertdialog" {...props} />;
}

const AlertDialog = Dialog;
const AlertDialogTrigger = DialogTrigger;
const AlertDialogCancel = DialogClose;
const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

export {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
};
