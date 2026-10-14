import { usePage } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useTranslation } from '@/lib/i18n';

export function NavUser() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const { t } = useTranslation();

    if (!auth.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="size-10 rounded-full p-1"
                    aria-label={`${t('Open user menu for')} ${auth.user.name}`}
                    data-test="header-user-menu-button"
                >
                    <Avatar className="size-8 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
