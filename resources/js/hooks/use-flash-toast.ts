import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';
import { getLocale, translate } from '@/lib/i18n';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            const style =
                data.type === 'success'
                    ? {
                          backgroundColor: '#16a34a',
                          borderColor: '#15803d',
                          color: '#ffffff',
                      }
                    : data.type === 'error'
                      ? {
                            backgroundColor: '#dc2626',
                            borderColor: '#b91c1c',
                            color: '#ffffff',
                        }
                      : undefined;

            toast[data.type](translate(getLocale(), data.message), { style });
        });
    }, []);
}
