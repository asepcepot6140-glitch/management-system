import { useCallback } from "react";
import { useSyncExternalStore } from "react";

export type Locale = "id" | "en";

const translations: Record<Locale, Record<string, string>> = {
    en: {
        "Vendor :vendor tidak mendukung model :model.":
            "Vendor :vendor does not support model :model.",
    },
    id: {
        "Switch to light mode": "Beralih ke mode terang",
        "Switch to dark mode": "Beralih ke mode gelap",
        "Choose language": "Pilih bahasa",
        Dashboard: "Dashboard",
        Platform: "Platform",
        Index: "Daftar",
        Settings: "Pengaturan",
        "Manage your profile and account settings":
            "Kelola profil dan pengaturan akun Anda",
        Profile: "Profil",
        Security: "Keamanan",
        Appearance: "Tampilan",
        "Appearance settings": "Pengaturan tampilan",
        "Update the appearance settings for your account":
            "Perbarui pengaturan tampilan akun Anda",
        Light: "Terang",
        Dark: "Gelap",
        System: "Sistem",
        "Profile settings": "Pengaturan profil",
        "Update your name and email address":
            "Perbarui nama dan alamat email Anda",
        Name: "Nama",
        "Full name": "Nama lengkap",
        "Email address": "Alamat email",
        Save: "Simpan",
        "Security settings": "Pengaturan keamanan",
        "Update password": "Perbarui kata sandi",
        "Ensure your account is using a long, random password to stay secure":
            "Pastikan akun Anda menggunakan kata sandi panjang dan acak agar tetap aman",
        "Current password": "Kata sandi saat ini",
        "New password": "Kata sandi baru",
        Password: "Kata sandi",
        "Confirm password": "Konfirmasi kata sandi",
        "Delete account": "Hapus akun",
        "Delete your account and all of its resources":
            "Hapus akun Anda beserta seluruh datanya",
        Warning: "Peringatan",
        "Please proceed with caution, this cannot be undone.":
            "Harap berhati-hati, tindakan ini tidak dapat dibatalkan.",
        "Are you sure you want to delete your account?":
            "Apakah Anda yakin ingin menghapus akun?",
        "Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.":
            "Setelah akun dihapus, seluruh sumber daya dan data juga akan dihapus permanen. Masukkan kata sandi untuk mengonfirmasi penghapusan akun.",
        Cancel: "Batal",
        "Log out": "Keluar",
        "Log in": "Masuk",
        "Log in to your account": "Masuk ke akun Anda",
        "Enter your email and password below to log in":
            "Masukkan email dan kata sandi Anda untuk masuk",
        "Forgot your password?": "Lupa kata sandi?",
        "Remember me": "Ingat saya",
        "Don't have an account?": "Belum punya akun?",
        "Sign up": "Daftar",
        Register: "Daftar",
        "Create an account": "Buat akun",
        "Enter your details below to create your account":
            "Masukkan data Anda untuk membuat akun",
        "Create account": "Buat akun",
        "Already have an account?": "Sudah memiliki akun?",
        "Forgot password": "Lupa kata sandi",
        "Enter your email to receive a password reset link":
            "Masukkan email untuk menerima tautan pengaturan ulang kata sandi",
        "Email password reset link": "Kirim tautan pengaturan ulang kata sandi",
        "Or, return to": "Atau, kembali ke",
        "log in": "masuk",
        "Reset password": "Atur ulang kata sandi",
        "Please enter your new password below": "Masukkan kata sandi baru Anda",
        Welcome: "Selamat datang",
        "Let's get started": "Mari mulai",
        "Laravel has an incredibly rich ecosystem.":
            "Laravel memiliki ekosistem yang sangat kaya.",
        "We suggest starting with the following.":
            "Kami menyarankan untuk memulai dengan hal berikut.",
        "Read the": "Baca",
        Documentation: "Dokumentasi",
        "Watch video tutorials at": "Tonton video tutorial di",
        "Deploy now": "Deploy sekarang",
        "Mikrotik list": "Daftar MikroTik",
        "TR-069 server list": "Daftar server TR-069",
        "OLT list": "Daftar OLT",
        "No OLTs yet. Add an OLT first from the OLT menu.":
            "Belum ada OLT. Tambahkan OLT terlebih dahulu di menu OLT.",
        "Select an OLT": "Pilih OLT",
        "All ports": "Semua port",
        "All statuses": "Semua status",
        Refresh: "Muat ulang",
        "Select an OLT first to display the ONU list.":
            "Pilih OLT terlebih dahulu untuk menampilkan daftar ONU.",
        "Total :count ONU": "Total :count ONU",
        "ONU list": "Daftar ONU",
        "Serial Number": "Serial Number",
        ONU: "ONU",
        Interface: "Interface",
        Status: "Status",
        "No matching ONUs.": "Tidak ada ONU yang cocok.",
        "OLT not found.": "OLT tidak ditemukan.",
        "ONU listing is not supported for this OLT vendor, model, and protocol combination.":
            "Daftar ONU belum didukung untuk kombinasi vendor, model, dan protokol OLT ini.",
        "Failed to fetch data from OLT: :message":
            "Gagal mengambil data dari OLT: :message",
        "The PHP SNMP extension is not enabled. Enable the extension and restart PHP.":
            "Ekstensi PHP SNMP belum diaktifkan. Aktifkan ekstensi lalu mulai ulang PHP.",
        "The SNMP RO community is not configured for this OLT.":
            "SNMP RO community belum diisi untuk OLT ini.",
        "SNMP walk failed (:host): :error": "SNMP walk gagal (:host): :error",
        Online: "Online",
        Offline: "Offline",
        LOS: "LOS",
        "Authentication failed": "Autentikasi gagal",
        "Dying gasp": "Dying gasp",
        Logging: "Logging",
        "Sync MIB": "Sync MIB",
        Unknown: "Unknown",
        "No.": "No.",
        "No data found": "Data tidak ditemukan",
        Model: "Model",
        Edit: "Edit",
        "Open user menu for": "Buka menu pengguna untuk",
        Sidebar: "Bilah sisi",
        "Displays the mobile sidebar.":
            "Menampilkan bilah sisi pada perangkat seluler.",
        "Toggle sidebar": "Buka atau tutup bilah sisi",
        Close: "Tutup",
        More: "Lainnya",
        "Breadcrumb navigation": "Navigasi breadcrumb",
        Loading: "Memuat",
        Mikrotik: "Mikrotik",
        "TR-069": "TR-069",
        OLT: "OLT",
        "Add MikroTik": "Tambah MikroTik",
        "Add TR-069": "Tambah TR-069",
        "Add OLT": "Tambah OLT",
        "Edit MikroTik": "Edit MikroTik",
        "Edit TR-069": "Edit TR-069",
        "Edit OLT": "Edit OLT",
        "MikroTik device name": "Nama perangkat MikroTik",
        "TR-069 server name": "Nama server TR-069",
        "OLT device name": "Nama perangkat OLT",
        "MikroTik username": "Nama pengguna MikroTik",
        "MikroTik password": "Kata sandi MikroTik",
        "Device password": "Kata sandi perangkat",
        "Device username": "Nama pengguna perangkat",
        "IP address": "Alamat IP",
        "Host / IP address": "Host / alamat IP",
        "API port": "Port API",
        Username: "Nama pengguna",
        Vendor: "Vendor",
        "PON model": "Model PON",
        "Select a vendor": "Pilih vendor",
        "Select a PON model": "Pilih model PON",
        Protocol: "Protokol",
        "Select a protocol": "Pilih protokol",
        Port: "Port",
        "SNMP Read Only (RO)": "SNMP Read Only (RO)",
        "SNMP Read Write (RW)": "SNMP Read Write (RW)",
        "SNMP RO community": "Community SNMP RO",
        "SNMP RW community": "Community SNMP RW",
        "new (optional)": "baru (opsional)",
        "Leave blank to keep the current value":
            "Kosongkan jika tidak ingin mengubah",
        Host: "Host",
        Actions: "Aksi",
        "Save changes": "Simpan perubahan",
        "Saving...": "Menyimpan...",
        Update: "Perbarui",
        "Delete :name?": "Hapus :name?",
        "This data will be permanently deleted and cannot be recovered.":
            "Data ini akan dihapus permanen dan tidak dapat dikembalikan.",
        Delete: "Hapus",
        "Language updated.": "Bahasa berhasil diperbarui.",
        "Profile updated.": "Profil berhasil diperbarui.",
        "Password updated.": "Kata sandi berhasil diperbarui.",
        "Mikrotik created successfully.": "MikroTik berhasil ditambahkan.",
        "Mikrotik updated successfully.": "MikroTik berhasil diperbarui.",
        "Mikrotik deleted successfully.": "MikroTik berhasil dihapus.",
        "TR-069 server created successfully.":
            "Server TR-069 berhasil ditambahkan.",
        "TR-069 server updated successfully.":
            "Server TR-069 berhasil diperbarui.",
        "TR-069 server deleted successfully.":
            "Server TR-069 berhasil dihapus.",
        "OLT created successfully.": "OLT berhasil ditambahkan.",
        "OLT updated successfully.": "OLT berhasil diperbarui.",
        "OLT deleted successfully.": "OLT berhasil dihapus.",
        "Vendor :vendor does not support model :model.":
            "Vendor :vendor tidak mendukung model :model.",
    },
};

const listeners = new Set<() => void>();
let currentLocale: Locale = "en";

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

function notifyLocaleChange(): void {
    listeners.forEach((listener) => listener());
}

function isLocale(value: string | null): value is Locale {
    return value === "id" || value === "en";
}

export function initializeLocale(): void {
    if (typeof window === "undefined") {
        return;
    }

    const storedLocale = localStorage.getItem("locale");

    if (isLocale(storedLocale)) {
        currentLocale = storedLocale;
        document.documentElement.lang = storedLocale;
        document.cookie = `ui_locale=${storedLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
}

export function getLocale(): Locale {
    return currentLocale;
}

export function setLocale(locale: Locale): void {
    if (locale === currentLocale) {
        return;
    }

    currentLocale = locale;
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
    document.cookie = `ui_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    notifyLocaleChange();
}

export function translate(locale: Locale, key: string): string {
    return translations[locale][key] ?? key;
}

export function useTranslation() {
    const locale = useSyncExternalStore(
        subscribe,
        getLocale,
        () => "en" as Locale,
    );
    const t = useCallback(
        (key: string, values: Record<string, string | number> = {}) =>
            Object.entries(values).reduce(
                (translated, [name, value]) =>
                    translated.replaceAll(`:${name}`, String(value)),
                translate(locale, key),
            ),
        [locale],
    );

    return {
        locale,
        setLocale,
        t,
    };
}
