import fs from 'node:fs';

const file = 'resources/js/wayfinder/index.ts';
const source = fs.readFileSync(file, 'utf8');
const old =
    'type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";';

if (source.includes(old)) {
    fs.writeFileSync(
        file,
        source.replace(old, old.replace('"options";', '"options" | "query";')),
    );
} else if (!source.includes('"query"')) {
    throw new Error('Wayfinder Method type tidak ditemukan.');
}
