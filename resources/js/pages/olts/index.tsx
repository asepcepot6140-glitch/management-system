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
import { OltForm, type OltOptions, type OltRecord } from '@/pages/olts/form';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useTranslation } from '@/lib/i18n';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import OltController from '@/actions/App/Http/Controllers/Olt/OltController';
import olts from '@/routes/olts';

type Props = {
    olts: OltRecord[];
    options: OltOptions;
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

export default function OltIndex({ olts: records, options }: Props) {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState<OltRecord | null>(null);
    const [deleting, setDeleting] = useState<OltRecord | null>(null);
    const isDialogOpen = isCreateOpen || editing !== null;

    const closeDialog = () => {
        setIsCreateOpen(false);
        setEditing(null);
    };

    return (
        <>
            <Head title={t('OLT')} />

            <div className="space-y-3 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">
                        {t('OLT')}
                    </h1>

                    <Button
                        variant="outline"
                        size="sm"
                        className={addButtonClass}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus />
                        {t('Add OLT')}
                    </Button>
                </div>

                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={paperSx}
                >
                    <Table size="small" aria-label={t('OLT list')}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 56 }}>
                                    {t('No.')}
                                </TableCell>
                                <TableCell>{t('Name')}</TableCell>
                                <TableCell>{t('Host')}</TableCell>
                                <TableCell>{t('Model')}</TableCell>
                                <TableCell>{t('Vendor')}</TableCell>
                                <TableCell>{t('Protocol')}</TableCell>
                                <TableCell>{t('Port')}</TableCell>
                                <TableCell>{t('Username')}</TableCell>
                                <TableCell align="right">
                                    {t('Actions')}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        align="center"
                                        sx={{ py: 1, color: 'text.secondary' }}
                                    >
                                        {t('No data found')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((olt, index) => (
                                    <TableRow key={olt.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{olt.nama}</TableCell>
                                        <TableCell>{olt.host}</TableCell>
                                        <TableCell>{olt.model}</TableCell>
                                        <TableCell>{olt.vendor}</TableCell>
                                        <TableCell>{olt.protocol}</TableCell>
                                        <TableCell>{olt.port ?? '-'}</TableCell>
                                        <TableCell>
                                            {olt.username ?? '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={t('Edit')}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label={`${t('Edit')} ${olt.nama}`}
                                                    onClick={() =>
                                                        setEditing(olt)
                                                    }
                                                >
                                                    <Pencil className="size-4" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title={t('Delete')}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label={`${t('Delete')} ${olt.nama}`}
                                                    onClick={() =>
                                                        setDeleting(olt)
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
                    if (!open) closeDialog();
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle>
                            {editing ? t('Edit OLT') : t('Add OLT')}
                        </DialogTitle>
                    </DialogHeader>

                    {editing ? (
                        <OltForm
                            key={`edit-${editing.slug}`}
                            form={OltController.update.form(editing.slug)}
                            options={options}
                            olt={editing}
                            onSuccess={closeDialog}
                        />
                    ) : (
                        <OltForm
                            key="create"
                            form={OltController.store.form()}
                            options={options}
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
                        router.delete(OltController.destroy.url(deleting.slug));
                    }
                }}
            />
        </>
    );
}

OltIndex.layout = {
    breadcrumbs: [{ title: 'OLT', href: olts.index() }],
};
