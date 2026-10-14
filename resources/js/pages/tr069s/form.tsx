import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RouteFormDefinition } from '@/wayfinder';
import { useTranslation } from '@/lib/i18n';

export type Tr069Record = {
    id: number;
    nama: string;
    slug: string;
    host: string;
    port: number;
    created_at: string;
};

type Props = {
    form: RouteFormDefinition<'post'>;
    tr069?: Tr069Record;
    onSuccess: () => void;
};

export function Tr069Form({ form, tr069, onSuccess }: Props) {
    const { t } = useTranslation();

    return (
        <Form
            {...form}
            options={{ preserveScroll: true }}
            onSuccess={onSuccess}
            disableWhileProcessing
            className="space-y-5"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="nama">{t('Name')}</Label>
                        <Input
                            id="nama"
                            name="nama"
                            defaultValue={tr069?.nama}
                            required
                            maxLength={255}
                            autoComplete="off"
                            placeholder={t('TR-069 server name')}
                            className="rounded-lg"
                        />
                        <InputError message={errors.nama} />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="host">{t('Host')}</Label>
                        <Input
                            id="host"
                            name="host"
                            defaultValue={tr069?.host}
                            required
                            maxLength={255}
                            autoComplete="url"
                            placeholder="acs.example.com or 192.168.1.10"
                            className="rounded-lg"
                        />
                        <InputError message={errors.host} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="port">{t('Port')}</Label>
                        <Input
                            id="port"
                            name="port"
                            type="number"
                            min={1}
                            max={65535}
                            defaultValue={tr069?.port ?? 7557}
                            required
                            placeholder="7557"
                            className="rounded-lg"
                        />
                        <InputError message={errors.port} />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg"
                        >
                            {processing
                                ? t('Saving...')
                                : tr069
                                  ? t('Update')
                                  : t('Add TR-069')}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
