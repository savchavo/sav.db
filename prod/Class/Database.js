"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const Error_1 = __importDefault(require("./Error"));
const lodash_1 = __importDefault(require("lodash"));
class Database extends events_1.EventEmitter {
    constructor(dataName) {
        super();
        this.dosya = dataName || "./database.json";
        this.data = {};
        if (!fs_1.default.existsSync(this.dosya)) {
            fs_1.default.writeFileSync(this.dosya, "{}", "utf-8");
        }
        else {
            this.bul();
        }
        ;
    }
    ;
    bul() {
        const data = JSON.parse(`${fs_1.default.readFileSync(this.dosya)}`);
        if (typeof data == "object") {
            this.data = data;
        }
        ;
    }
    ;
    kaydet() {
        fs_1.default.writeFileSync(this.dosya, JSON.stringify(this.data, null), "utf8");
    }
    ;
    cevirAnahtar(key) {
        if (!key || typeof key != "string")
            return { key: undefined, target: undefined };
        if (key.includes(".")) {
            let spl = key.split(".");
            let parsed = spl.shift();
            let target = spl.join(".");
            return { key: parsed, target };
        }
        ;
        return { key, target: undefined };
    }
    ;
    getData(key, data) {
        let parsed = this.cevirAnahtar(key);
        if (parsed.target)
            data = lodash_1.default.get(data, parsed.target);
        return data;
    }
    ;
    setData(key, data, value) {
        let parsed = this.cevirAnahtar(key);
        if (typeof data === "object" && parsed.target) {
            return lodash_1.default.set(data, parsed.target, value);
        }
        else if (parsed.target)
            throw new Error_1.default("Nesne Olmayan Hedeflenemez!", "BulmaHata");
        return data;
    }
    ;
    /* UTİL BİTİŞ */
    get(key) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        let cevir = this.cevirAnahtar(key);
        let data = this.data[`${cevir.key}`];
        if (!data)
            return null;
        let item;
        if (cevir.target)
            item = this.getData(key, Object.assign({}, data));
        else
            item = data;
        return item !== undefined ? item : null;
    }
    ;
    fetch(key) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        let cevir = this.cevirAnahtar(key);
        let data = this.data[`${cevir.key}`];
        if (!data)
            return null;
        let item;
        if (cevir.target)
            item = this.getData(key, Object.assign({}, data));
        else
            item = data;
        return item !== undefined ? item : null;
    }
    ;
    set(key, value) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        if (!value)
            throw new Error_1.default("Geçersiz Değer!", "DeğerHatası");
        let cevir = this.cevirAnahtar(key);
        let data = this.data[`${cevir.key}`];
        if (!data) {
            this.data[key] = cevir.target ? this.setData(key, {}, value) : value;
            this.kaydet();
        }
        else {
            this.data[key] = cevir.target ? this.setData(key, {}, value) : value;
            this.kaydet();
        }
        ;
    }
    ;
    has(key) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        return Boolean(this.get(key));
    }
    ;
    exists(key) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        return Boolean(this.get(key));
    }
    ;
    all() {
        return Object.keys(this.data).map((key) => {
            return {
                ID: key,
                data: this.get(key)
            };
        });
    }
    ;
    deleteAll() {
        this.data = {};
        this.kaydet();
    }
    ;
    add(key, count) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        if (!key || typeof key !== "number")
            throw new Error_1.default("Geçersiz Number!", "AnahtarHatası");
        if (!this.get(key))
            this.data[key] = 0;
        this.data[key] += count;
        this.kaydet();
    }
    ;
    subtract(key, count) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        if (!key || typeof key !== "number")
            throw new Error_1.default("Geçersiz Number!", "SayıHatası");
        if (!this.get(key))
            this.data[key] = 0;
        this.data[key] -= count;
        this.kaydet();
    }
    ;
    sub(key, count) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        if (!key || typeof key !== "number")
            throw new Error_1.default("Geçersiz Number!", "SayıHatası");
        if (!this.get(key))
            this.data[key] = 0;
        this.data[key] -= count;
        this.kaydet();
    }
    ;
    push(key, element) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        if (!element)
            throw new Error_1.default("Geçersiz Element!", "ElementHatası");
        if (!this.get(key))
            this.data[key] = [];
        this.data[key].push(element);
        this.kaydet();
    }
    ;
    keyArray() {
        const data = this.all();
        return data.map(m => m.ID);
    }
    ;
    valueArray() {
        const data = this.all();
        return data.map(m => m.data);
    }
    ;
    PatrondbToquickdb(quickdb) {
        if (!quickdb)
            throw new Error_1.default("Geçersiz QuickDB!", "QuickdbHatası");
        let data = this.all();
        data.forEach((kadir) => {
            quickdb.set(kadir.ID, kadir.data);
        });
        return quickdb.all();
    }
    ;
    quickdbToPatrondb(quickdb) {
        if (!quickdb)
            throw new Error_1.default("Geçersiz QuickDB!", "QuickdbHatası");
        let data = quickdb.all();
        data.forEach((kadir) => {
            this.set(kadir.ID, kadir.data);
        });
        return this.all();
    }
    ;
    eval(code) {
        return eval(code);
    }
    ;
    type(key) {
        if (!key || typeof key !== "string")
            throw new Error_1.default("Geçersiz Anahtar!", "AnahtarHatası");
        let fetched = this.get(key);
        if (Array.isArray(fetched))
            return "array";
        return typeof fetched;
    }
    ;
    backup(zaman) {
        if (!zaman || typeof zaman !== "number")
            throw new Error_1.default("Geçersiz Zaman!", "ZamanHatası");
        const ds = './Yedekler/';
        if (!fs_1.default.existsSync(ds)) {
            fs_1.default.mkdirSync(ds);
        }
        ;
        setInterval(() => {
            const ad = `yedek-${Date.now()}.json`;
            fs_1.default.writeFileSync(ds + ad, JSON.stringify(this.data, null), "utf8");
        }, (zaman || 86400000));
    }
    ;
    pull(key, value, multiple) {
        if (!multiple) {
            multiple = true;
        }
        ;
        let data = this.get(key);
        if (data === null)
            return false;
        if (!Array.isArray(data))
            throw new Error_1.default("Pull Yapacağım Objede Array Yok!", "ArrayHatası");
        if (Array.isArray(value)) {
            data = data.filter(i => !value.includes(i));
            return this.set(key, data);
        }
        else {
            if (!!multiple) {
                data = data.filter(i => i !== value);
                return this.set(key, data);
            }
            else {
                const hasItem = data.some(x => x === value);
                if (!hasItem)
                    return false;
                const index = data.findIndex(x => x === value);
                data = data.splice(index, 1);
                return this.set(key, data);
            }
            ;
        }
        ;
    }
    ;
    toJSON() {
        let all = this.all();
        const json = {};
        all.forEach((element) => {
            json[element.ID] = element.data;
        });
        return json;
    }
    ;
    includes(key) {
        let json = this.toJSON();
        let keyArray = this.keyArray();
        keyArray = keyArray.filter((item) => item.includes(key));
        if (keyArray.length <= 0)
            return {};
        const obj = {};
        for (const key of keyArray) {
            obj[key] = json[key];
        }
        ;
        return obj;
    }
    ;
    startsWith(key) {
        let json = this.toJSON();
        let keyArray = this.keyArray();
        keyArray = keyArray.filter((item) => item.startsWith(key));
        if (keyArray.length <= 0)
            return {};
        const obj = {};
        for (const key of keyArray) {
            obj[key] = json[key];
        }
        ;
        return obj;
    }
    ;
    endsWith(key) {
        let json = this.toJSON();
        let keyArray = this.keyArray();
        keyArray = keyArray.filter((item) => item.endsWith(key));
        if (keyArray.length <= 0)
            return {};
        const obj = {};
        for (const key of keyArray) {
            obj[key] = json[key];
        }
        ;
        return obj;
    }
    ;
    destroy() {
        fs_1.default.unlinkSync(this.dosya);
    }
    ;
}
exports.Database = Database;
;
