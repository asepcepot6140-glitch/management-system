import { Form } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { RouteFormDefinition } from "@/wayfinder";
import { useTranslation } from "@/lib/i18n";

export type OltRecord = {
    id: number;
    nama: string;
    slug: string;
    host: string;
    model: string;
    vendor: string;
    protocol: string;
    port: number | null;
    username: string | null;
    created_at: string;
};

type Option = { value: string; label: string };

// Dikirim dari OltController::options(); aturan vendor -> model ada di enum PHP.
export type OltOptions = {
    vendors: (Option & { models: string[] })[];
    models: Option[];
    protocols: Option[];
};

type Props = {
    form: RouteFormDefinition<"post">;
    options: OltOptions;
    olt?: OltRecord;
    onSuccess: () => void;
};

const triggerClass = "h-10 w-full rounded-lg";
const contentClass = "rounded-lg";

export function OltForm({ form, options, olt, onSuccess }: Props) {
    const { t } = useTranslation();
    const modelsFor = (vendor: string) =>
        options.vendors.find((item) => item.value === vendor)?.models ?? [];

    const initialVendor = olt?.vendor ?? options.vendors[0]?.value ?? "";
    const initialModel =
        olt?.model ??
        modelsFor(initialVendor)[0] ??
        options.models[0]?.value ??
        "";

    const [vendor, setVendor] = useState(initialVendor);
    const [model, setModel] = useState(initialModel);
    const [protocol, setProtocol] = useState(
        olt?.protocol ?? options.protocols[0]?.value ?? "snmp",
    );

    const allowedModels = options.models.filter((item) =>
        modelsFor(vendor).includes(item.value),
    );

    // Ganti vendor -> kalau model lama tidak didukung, pindah ke model pertama yang didukung.
    const handleVendorChange = (next: string) => {
        setVendor(next);

        const allowed = modelsFor(next);

        if (!allowed.includes(model)) {
            setModel(allowed[0] ?? "");
        }
    };

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
                        <Label htmlFor="nama">{t("Name")}</Label>
                        <Input
                            id="nama"
                            name="nama"
                            defaultValue={olt?.nama}
                            required
                            maxLength={255}
                            autoComplete="off"
                            placeholder={t("OLT device name")}
                            className="rounded-lg"
                        />
                        <InputError message={errors.nama} />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="host">{t("Host / IP address")}</Label>
                        <Input
                            id="host"
                            name="host"
                            defaultValue={olt?.host}
                            required
                            maxLength={255}
                            autoComplete="off"
                            placeholder="192.168.1.10"
                            className="rounded-lg"
                        />
                        <InputError message={errors.host} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="vendor">{t("Vendor")}</Label>
                        <Select
                            name="vendor"
                            value={vendor}
                            onValueChange={handleVendorChange}
                            required
                        >
                            <SelectTrigger id="vendor" className={triggerClass}>
                                <SelectValue
                                    placeholder={t("Select a vendor")}
                                />
                            </SelectTrigger>
                            <SelectContent className={contentClass}>
                                {options.vendors.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.vendor} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="model">{t("PON model")}</Label>
                        <Select
                            name="model"
                            value={model}
                            onValueChange={setModel}
                            required
                        >
                            <SelectTrigger id="model" className={triggerClass}>
                                <SelectValue
                                    placeholder={t("Select a PON model")}
                                />
                            </SelectTrigger>
                            <SelectContent className={contentClass}>
                                {allowedModels.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.model} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="protocol">{t("Protocol")}</Label>
                        <Select
                            name="protocol"
                            value={protocol}
                            onValueChange={setProtocol}
                            required
                        >
                            <SelectTrigger
                                id="protocol"
                                className={triggerClass}
                            >
                                <SelectValue
                                    placeholder={t("Select a protocol")}
                                />
                            </SelectTrigger>
                            <SelectContent className={contentClass}>
                                {options.protocols.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.protocol} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="port">{t("Port")}</Label>
                        <Input
                            id="port"
                            name="port"
                            type="number"
                            min={1}
                            max={65535}
                            defaultValue={olt?.port ?? ""}
                            placeholder={protocol === "snmp" ? "161" : "80"}
                            className="rounded-lg"
                        />
                        <InputError message={errors.port} />
                    </div>

                    {protocol === "web" && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="username">
                                    {t("Username")}
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    defaultValue={olt?.username ?? ""}
                                    required
                                    maxLength={255}
                                    autoComplete="username"
                                    placeholder={t("Device username")}
                                    className="rounded-lg"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t("Password")}
                                    {olt ? ` ${t("new (optional)")}` : ""}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required={!olt}
                                    autoComplete="new-password"
                                    placeholder={
                                        olt
                                            ? t(
                                                  "Leave blank to keep the current value",
                                              )
                                            : t("Device password")
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={errors.password} />
                            </div>
                        </>
                    )}

                    {protocol === "snmp" && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="snmp_ro">
                                    {t("SNMP Read Only (RO)")}
                                </Label>
                                <Input
                                    id="snmp_ro"
                                    name="snmp_ro"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={
                                        olt
                                            ? t(
                                                  "Leave blank to keep the current value",
                                              )
                                            : t("SNMP RO community")
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={errors.snmp_ro} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="snmp_rw">
                                    {t("SNMP Read Write (RW)")}
                                </Label>
                                <Input
                                    id="snmp_rw"
                                    name="snmp_rw"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={
                                        olt
                                            ? t(
                                                  "Leave blank to keep the current value",
                                              )
                                            : t("SNMP RW community")
                                    }
                                    className="rounded-lg"
                                />
                                <InputError message={errors.snmp_rw} />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg"
                        >
                            {processing
                                ? t("Saving...")
                                : olt
                                  ? t("Update")
                                  : t("Add OLT")}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
