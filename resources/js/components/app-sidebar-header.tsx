import { Breadcrumbs } from "@/components/breadcrumbs";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppearance } from "@/hooks/use-appearance";
import { setLocale, useTranslation } from "@/lib/i18n";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { Moon, Sun } from "lucide-react";

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { locale, t } = useTranslation();
    const AppearanceIcon = resolvedAppearance === "dark" ? Moon : Sun;
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <SidebarTrigger />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-0.5">
                    <div
                        role="group"
                        aria-label={t("Choose language")}
                        className="flex items-center text-xs font-semibold"
                    >
                        <button
                            type="button"
                            onClick={() => setLocale("id")}
                            aria-pressed={locale === "id"}
                            className={`rounded px-1.5 py-1 transition-colors hover:text-foreground ${
                                locale === "id"
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            }`}
                        >
                            ID
                        </button>
                        <span
                            aria-hidden="true"
                            className="text-muted-foreground"
                        >
                            |
                        </span>
                        <button
                            type="button"
                            onClick={() => setLocale("en")}
                            aria-pressed={locale === "en"}
                            className={`rounded px-1.5 py-1 transition-colors hover:text-foreground ${
                                locale === "en"
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            }`}
                        >
                            EN
                        </button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t(
                            resolvedAppearance === "dark"
                                ? "Switch to light mode"
                                : "Switch to dark mode",
                        )}
                        title={t(
                            resolvedAppearance === "dark"
                                ? "Switch to light mode"
                                : "Switch to dark mode",
                        )}
                        onClick={() =>
                            updateAppearance(
                                resolvedAppearance === "dark"
                                    ? "light"
                                    : "dark",
                            )
                        }
                    >
                        <AppearanceIcon />
                    </Button>
                    <NavUser />
                </div>
            </div>
        </header>
    );
}
