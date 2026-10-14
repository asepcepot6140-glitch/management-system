import { Head, router } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Tr069Form, type Tr069Record } from '@/pages/tr069s/form';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useTranslation } from '@/lib/i18n';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Tr069Controller from '@/actions/App/Http/Controllers/Tr069/Tr069Controller';
import tr069s from '@/routes/tr069s';

type Props = {
    tr069s: Tr069Record[];
};

const paperSx = {
    borderRadius: 2,
    bgcolor: 'var(--card)',
    color: 'var(--card-foreground)',
    borderColor: 'var(--border)',
    '& .MuiTableCell-root': {
        color: 'inherit',
        borderColor: 'var(--border)',
        whiteSpace: 'nowrap',
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
        backgroundColor: 'var(--muted)',
        color: 'var(--muted-foreground)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
        fontSize: '0.875rem',
        fontWeight: 400,
    },
    '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
        borderBottom: 0,
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
        bgcolor: 'var(--accent)',
    },
};

const addButtonClass =
    'border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/15';

export default function Tr069Index({ tr069s: records }: Props) {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState<Tr069Record | null>(null);
    const [deleting, setDeleting] = useState<Tr069Record | null>(null);
    const isDialogOpen = isCreateOpen || editing !== null;

    const closeDialog = () => {
        setIsCreateOpen(false);
        setEditing(null);
    };

    return (
        <>
            <Head title={t('TR-069')} />
            <div className="space-y-3 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">
                        {t('TR-069')}
                    </h1>
                    <Button
                        variant="outline"
                        size="sm"
                        className={addButtonClass}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus />
                        {t('Add TR-069')}
                    </Button>
                </div>

                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={paperSx}
                >
                    <Table size="small" aria-label={t('TR-069 server list')}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 56 }}>
                                    {t('No.')}
                                </TableCell>
                                <TableCell>{t('Name')}</TableCell>
                                <TableCell>{t('Host')}</TableCell>
                                <TableCell>{t('Port')}</TableCell>
                                <TableCell align="right">
                                    {t('Actions')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 1, color: 'text.secondary' }}
                                    >
                                        {t('No data found')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((tr069, index) => (
                                    <TableRow key={tr069.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{tr069.nama}</TableCell>
                                        <TableCell>{tr069.host}</TableCell>
                                        <TableCell>{tr069.port}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={t('Edit')}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label={`${t('Edit')} ${tr069.nama}`}
                                                    onClick={() =>
                                                        setEditing(tr069)
                                                    }
                                                >
                                                    <Pencil className="size-4" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={t('Delete')}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label={`${t('Delete')} ${tr069.nama}`}
                                                    onClick={() =>
                                                        setDeleting(tr069)
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDialog();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle>
                            {editing ? t('Edit TR-069') : t('Add TR-069')}
                        </DialogTitle>
                    </DialogHeader>
                    {editing ? (
                        <Tr069Form
                            key={`edit-${editing.slug}`}
                            form={Tr069Controller.update.form(editing.slug)}
                            tr069={editing}
                            onSuccess={closeDialog}
                        />
                    ) : (
                        <Tr069Form
                            key="create"
                            form={Tr069Controller.store.form()}
                            onSuccess={closeDialog}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <DeleteConfirmationDialog
                open={deleting !== null}
                itemName={deleting?.nama ?? ''}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleting(null);
                    }
                }}
                onConfirm={() => {
                    if (deleting) {
                        router.delete(
                            Tr069Controller.destroy.url(deleting.slug),
                        );
                    }
                }}
            />
        </>
    );
}

Tr069Index.layout = {
    breadcrumbs: [{ title: 'TR-069', href: tr069s.index() }],
};
