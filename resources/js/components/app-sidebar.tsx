import { Link } from "@inertiajs/react";
import { ChevronDown, Circle, LayoutGrid, Network, Server } from "lucide-react";
import type { ComponentProps } from "react";
import AppLogo from "@/components/app-logo";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import { dashboard } from "@/routes";
import mikrotiks from "@/routes/mikrotiks";
import olts from "@/routes/olts";
import onus from "@/routes/onus";
import tr069s from "@/routes/tr069s";
import { useTranslation } from "@/lib/i18n";

type SubItem = {
    title: string;
    href: ComponentProps<typeof Link>["href"];
    isActive: boolean;
};

type CollapseMenuProps = {
    title: string;
    icon: React.ElementType;
    items: SubItem[];
};

// Menu collapse dengan satu atau lebih sub-menu.
// Induk hanya berubah warna teks; latar aktif hanya di sub-menu.
function CollapseMenu({ title, icon: Icon, items }: CollapseMenuProps) {
    const { isMobile, setOpenMobile } = useSidebar();
    const { t } = useTranslation();
    const isActive = items.some((item) => item.isActive);

    const parentColor = isActive
        ? "font-medium text-sidebar-primary data-[state=open]:text-sidebar-primary"
        : "text-sidebar-foreground data-[state=open]:text-sidebar-foreground";

    const closeMobileSidebar = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Collapsible defaultOpen={isActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: title }}
                        className={`${parentColor} hover:text-sidebar-accent-foreground data-[state=open]:hover:text-sidebar-accent-foreground`}
                    >
                        <Icon />
                        <span>{t(title)}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 ml-2 gap-1 border-l-0 py-1 pr-0 pl-3">
                        {items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={item.isActive}
                                    className="h-8 gap-3 px-3"
                                >
                                    <Link
                                        href={item.href}
                                        prefetch
                                        onClick={closeMobileSidebar}
                                    >
                                        <Circle className="size-2! fill-current" />
                                        <span>{t(item.title)}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const { isMobile, setOpenMobile } = useSidebar();
    const { t } = useTranslation();

    const closeMobileSidebar = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard()}
                                prefetch
                                onClick={closeMobileSidebar}
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>{t("Platform")}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(dashboard())}
                                tooltip={{ children: t("Dashboard") }}
                            >
                                <Link
                                    href={dashboard()}
                                    prefetch
                                    onClick={closeMobileSidebar}
                                >
                                    <LayoutGrid />
                                    <span>{t("Dashboard")}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <CollapseMenu
                            title="Mikrotik"
                            icon={Network}
                            items={[
                                {
                                    title: "Index",
                                    href: mikrotiks.index(),
                                    isActive: isCurrentUrl(mikrotiks.index()),
                                },
                            ]}
                        />

                        <CollapseMenu
                            title="TR-069"
                            icon={Server}
                            items={[
                                {
                                    title: "Index",
                                    href: tr069s.index(),
                                    isActive: isCurrentUrl(tr069s.index()),
                                },
                            ]}
                        />

                        <CollapseMenu
                            title="OLT"
                            icon={Server}
                            items={[
                                {
                                    title: "Index",
                                    href: olts.index(),
                                    isActive: isCurrentUrl(olts.index()),
                                },
                                {
                                    title: "ONU",
                                    href: onus.index(),
                                    isActive: isCurrentUrl(onus.index()),
                                },
                            ]}
                        />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
