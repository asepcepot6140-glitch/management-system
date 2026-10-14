import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

export type OnuRecord = {
    index: string;
    if_index: number;
    olt_port: string;
    onu_id: number;
    interface: string;
    name: string | null;
    serial_number: string | null;
    rx_power: number | null;
    rx_power_status: 'good' | 'warning' | 'danger' | 'na';
    rx_power_raw: number | null;
    status: string;
    status_code: number | null;
};

export type ChipColor = 'success' | 'error' | 'warning' | 'info' | 'default';

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

const statusMeta: Record<string, { label: string; color: ChipColor }> = {
    working: { label: 'Online', color: 'success' },
    offline: { label: 'Offline', color: 'default' },
    los: { label: 'LOS', color: 'error' },
    authFailed: { label: 'Authentication failed', color: 'error' },
    dyingGasp: { label: 'Dying gasp', color: 'warning' },
    logging: { label: 'Logging', color: 'info' },
    syncMib: { label: 'Sync MIB', color: 'info' },
    unknown: { label: 'Unknown', color: 'default' },
};

const STATUS_ORDER = [
    'working',
    'dyingGasp',
    'los',
    'authFailed',
    'offline',
    'logging',
    'syncMib',
    'unknown',
];

export const metaFor = (status: string, t: (key: string) => string) => {
    const meta = statusMeta[status] ?? {
        label: status,
        color: 'default' as ChipColor,
    };

    return { ...meta, label: t(meta.label) };
};

export const sortStatuses = (statusCounts: Record<string, number>) =>
    Object.keys(statusCounts).sort((a, b) => {
        const indexA = STATUS_ORDER.indexOf(a);
        const indexB = STATUS_ORDER.indexOf(b);

        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

const paperSx = {
    overflow: 'hidden',
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
    '& .MuiTablePagination-root': {
        color: 'inherit',
        borderTop: '1px solid var(--border)',
    },
    '& .MuiTablePagination-select, & .MuiTablePagination-selectIcon': {
        color: 'inherit',
    },
    '& .MuiTablePagination-actions .MuiIconButton-root': {
        color: 'inherit',
    },
    '& .MuiTablePagination-actions .MuiIconButton-root.Mui-disabled': {
        opacity: 0.35,
    },
};

const paginationMenuProps = {
    slotProps: {
        paper: {
            sx: {
                bgcolor: 'var(--popover)',
                color: 'var(--popover-foreground)',
                border: '1px solid var(--border)',
                borderRadius: 2,
            },
        },
    },
};

const triggerClass = 'h-9 w-full rounded-lg sm:w-56';

type Props = {
    onus: OnuRecord[];
    ports: string[];
    statusCounts: Record<string, number>;
};
export function OnuTable({ onus, ports, statusCounts }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [portFilter, setPortFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return onus.filter((onu) => {
            if (portFilter !== 'all' && onu.olt_port !== portFilter) {
                return false;
            }

            if (statusFilter !== 'all' && onu.status !== statusFilter) {
                return false;
            }

            if (keyword === '') {
                return true;
            }

            return [onu.interface, onu.name, onu.serial_number].some((value) =>
                value?.toLowerCase().includes(keyword),
            );
        });
    }, [onus, search, portFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * perPage;
    const rows = filtered.slice(start, start + perPage);

    const statuses = sortStatuses(statusCounts);

    return (
        <Paper variant="outlined" sx={paperSx}>
            {/* Toolbar di dalam tabel: search + filter port + filter status */}
            <div className="flex flex-wrap items-center gap-2 border-b p-3">
                <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                        placeholder={t(
                            'Search name, serial number, or interface',
                        )}
                        className="h-9 rounded-lg pl-9"
                    />
                </div>

                <Select
                    value={portFilter}
                    onValueChange={(value) => {
                        setPortFilter(value);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className={triggerClass}>
                        <SelectValue placeholder={t('All ports')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                        <SelectItem value="all">{t('All ports')}</SelectItem>
                        {ports.map((port) => (
                            <SelectItem key={port} value={port}>
                                gpon-olt_{port}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        setStatusFilter(value);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className={triggerClass}>
                        <SelectValue placeholder={t('All statuses')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                        <SelectItem value="all">{t('All statuses')}</SelectItem>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {metaFor(status, t).label} (
                                {statusCounts[status]})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <TableContainer>
                <Table size="small" aria-label={t('ONU list')}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 56 }}>{t('No.')}</TableCell>
                            <TableCell>{t('Interface')}</TableCell>
                            <TableCell>{t('Name')}</TableCell>
                            <TableCell>{t('Serial Number')}</TableCell>
                            <TableCell>{t('RX Power')}</TableCell>
                            <TableCell>{t('Status')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{ py: 3, color: 'text.secondary' }}
                                >
                                    {t('No matching ONUs.')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((onu, index) => {
                                const meta = metaFor(onu.status, t);

                                return (
                                    <TableRow key={onu.index}>
                                        <TableCell>
                                            {start + index + 1}
                                        </TableCell>
                                        <TableCell>{onu.interface}</TableCell>
                                        <TableCell>{onu.name ?? '-'}</TableCell>
                                        <TableCell>
                                            {onu.serial_number ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    onu.rx_power === null ||
                                                    onu.rx_power_status === 'na'
                                                        ? 'text-red-600'
                                                        : onu.rx_power < -27
                                                          ? 'text-red-600'
                                                          : onu.rx_power < -24
                                                            ? 'text-yellow-600'
                                                            : 'text-green-600'
                                                }
                                            >
                                                {onu.rx_power === null ||
                                                onu.rx_power_status === 'na'
                                                    ? t('N/A')
                                                    : `${onu.rx_power.toFixed(2)} dBm`}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`${
                                                    meta.color === 'success'
                                                        ? 'text-green-600'
                                                        : meta.color === 'error'
                                                          ? 'text-red-600'
                                                          : meta.color ===
                                                              'warning'
                                                            ? 'text-yellow-600'
                                                            : meta.color ===
                                                                'info'
                                                              ? 'text-blue-600'
                                                              : 'text-muted-foreground'
                                                }`}
                                            >
                                                {meta.label}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filtered.length}
                page={currentPage - 1}
                onPageChange={(_event, newPage) => setPage(newPage + 1)}
                rowsPerPage={perPage}
                rowsPerPageOptions={PER_PAGE_OPTIONS}
                onRowsPerPageChange={(event) => {
                    setPerPage(parseInt(event.target.value, 10));
                    setPage(1);
                }}
                labelRowsPerPage={t('Rows per page')}
                labelDisplayedRows={({ from, to, count }) =>
                    t(':from-:to of :count', { from, to, count })
                }
                getItemAriaLabel={(type) =>
                    t(
                        {
                            first: 'First page',
                            last: 'Last page',
                            next: 'Next page',
                            previous: 'Previous page',
                        }[type],
                    )
                }
                slotProps={{
                    select: {
                        MenuProps: paginationMenuProps,
                    },
                }}
            />
        </Paper>
    );
}
