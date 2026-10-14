import { Head, router } from "@inertiajs/react";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import { OnuSummaryCard } from "@/pages/onus/card";
import { OnuTable } from "@/pages/onus/table";
import type { OnuRecord } from "@/pages/onus/table";
import onuRoutes from "@/routes/onus";

type OltOption = {
    id: number;
    nama: string;
    slug: string;
    host: string;
    vendor: string;
    model: string;
    protocol: string;
};

type OnuError = {
    key: string;
    values?: Record<string, string | number | OnuError>;
};

type Props = {
    olts: OltOption[];
    selectedOlt: string | null;
    onus: OnuRecord[];
    ports: string[];
    statusCounts: Record<string, number>;
    error: OnuError | null;
};

function translateError(
    error: OnuError,
    t: (key: string, values?: Record<string, string | number>) => string,
): string {
    const values: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(error.values ?? {})) {
        values[key] =
            typeof value === "object" ? translateError(value, t) : value;
    }

    return t(error.key, values);
}

// Kotak pesan kosong (samakan dengan tema Tailwind/shadcn)
const messagePaperSx = {
    p: 3,
    borderRadius: 2,
    bgcolor: "var(--card)",
    color: "var(--card-foreground)",
    borderColor: "var(--border)",
};

const outlineButtonClass =
    "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/15";

const triggerClass = "h-9 w-full rounded-lg sm:w-56";

export default function OnuIndex({
    olts,
    selectedOlt,
    onus,
    ports,
    statusCounts,
    error,
}: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const visit = (query: Record<string, string | number>) => {
        router.get(
            onuRoutes.index.url({ query }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    const handleRefresh = () => {
        if (selectedOlt) {
            visit({ olt: selectedOlt, refresh: 1 });
        }
    };

    return (
        <>
            <Head title={t("ONU")} />
            <div className="space-y-3 p-3">
                <h1 className="text-xl font-semibold tracking-tight">
                    {t("ONU")}
                </h1>

                {olts.length === 0 ? (
                    <Paper variant="outlined" sx={messagePaperSx}>
                        <p className="text-center text-sm text-muted-foreground">
                            {t(
                                "No OLTs yet. Add an OLT first from the OLT menu.",
                            )}
                        </p>
                    </Paper>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={selectedOlt ?? ""}
                                onValueChange={(slug) => visit({ olt: slug })}
                            >
                                <SelectTrigger className={triggerClass}>
                                    <SelectValue
                                        placeholder={t("Select an OLT")}
                                    />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {olts.map((olt) => (
                                        <SelectItem
                                            key={olt.slug}
                                            value={olt.slug}
                                        >
                                            {olt.nama} · {olt.host}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedOlt && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${outlineButtonClass} h-9 rounded-lg`}
                                    disabled={loading}
                                    onClick={handleRefresh}
                                >
                                    <RefreshCw
                                        className={
                                            loading ? "animate-spin" : ""
                                        }
                                    />
                                    {t("Refresh")}
                                </Button>
                            )}
                        </div>

                        {loading && <LinearProgress sx={{ borderRadius: 1 }} />}

                        {!selectedOlt && !error && (
                            <Paper variant="outlined" sx={messagePaperSx}>
                                <p className="text-center text-sm text-muted-foreground">
                                    {t(
                                        "Select an OLT first to display the ONU list.",
                                    )}
                                </p>
                            </Paper>
                        )}

                        {error && (
                            <Alert severity="error">
                                {translateError(error, t)}
                            </Alert>
                        )}

                        {selectedOlt && !error && (
                            <>
                                <OnuSummaryCard
                                    total={onus.length}
                                    statusCounts={statusCounts}
                                />

                                {/* key = OLT, jadi search/filter/halaman ter-reset saat ganti OLT */}
                                <OnuTable
                                    key={selectedOlt}
                                    onus={onus}
                                    ports={ports}
                                    statusCounts={statusCounts}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

OnuIndex.layout = {
    breadcrumbs: [{ title: "ONU", href: onuRoutes.index() }],
};
