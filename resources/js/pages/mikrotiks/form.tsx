import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RouteFormDefinition } from '@/wayfinder';
import { useTranslation } from '@/lib/i18n';

export type MikrotikRecord = {
    id: number;
    nama: string;
    slug: string;
    ip: string;
    port: number;
    username: string;
    created_at: string;
};

type Props = {
    form: RouteFormDefinition<'post'>;
    mikrotik?: MikrotikRecord;
    onSuccess: () => void;
};

export function MikrotikForm({ form, mikrotik, onSuccess }: Props) {
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
                            defaultValue={mikrotik?.nama}
                            required
                            maxLength={255}
                            autoComplete="off"
                            placeholder={t('MikroTik device name')}
                            className="rounded-lg"
                        />
                        <InputError message={errors.nama} />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ip">{t('IP address')}</Label>
                        <Input
                            id="ip"
                            name="ip"
                            type="text"
                            defaultValue={mikrotik?.ip}
                            required
                            placeholder="192.168.1.1"
                            autoComplete="off"
                            className="rounded-lg"
                        />
                        <InputError message={errors.ip} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="port">{t('API port')}</Label>
                        <Input
                            id="port"
                            name="port"
                            type="number"
                            min={1}
                            max={65535}
                            defaultValue={mikrotik?.port}
                            required
                            placeholder="8728"
                            className="rounded-lg"
                        />
                        <InputError message={errors.port} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username">{t('Username')}</Label>
                        <Input
                            id="username"
                            name="username"
                            defaultValue={mikrotik?.username}
                            required
                            maxLength={255}
                            autoComplete="username"
                            placeholder={t('MikroTik username')}
                            className="rounded-lg"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            {t('Password')}
                            {mikrotik ? ` ${t('new (optional)')}` : ''}
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required={!mikrotik}
                            autoComplete="new-password"
                            placeholder={
                                mikrotik
                                    ? t('Leave blank to keep the current value')
                                    : t('MikroTik password')
                            }
                            className="rounded-lg"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg"
                        >
                            {processing
                                ? t('Saving...')
                                : mikrotik
                                  ? t('Update')
                                  : t('Add MikroTik')}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
