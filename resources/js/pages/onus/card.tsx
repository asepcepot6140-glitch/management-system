import { useTranslation } from "@/lib/i18n";
import { metaFor, sortStatuses } from "@/pages/onus/table";
import type { ChipColor } from "@/pages/onus/table";

const dotClass: Record<ChipColor, string> = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-sky-500",
    default: "bg-muted-foreground",
};

type Props = {
    total: number;
    statusCounts: Record<string, number>;
};

// Card ringkasan: "Total 407 ONU" + jumlah per status.
export function OnuSummaryCard({ total, statusCounts }: Props) {
    const { t } = useTranslation();
    const statuses = sortStatuses(statusCounts);

    return (
        <div className="w-full rounded-xl border bg-card p-4 text-card-foreground sm:w-fit sm:min-w-56">
            <p className="text-base font-semibold">
                {t("Total :count ONU", { count: total })}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
                {statuses.map((status) => {
                    const meta = metaFor(status, t);

                    return (
                        <li key={status} className="flex items-center gap-2">
                            <span
                                className={`size-2 shrink-0 rounded-full ${dotClass[meta.color]}`}
                            />
                            <span className="text-muted-foreground">
                                {meta.label}:
                            </span>
                            <span className="font-medium">
                                {statusCounts[status]}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
