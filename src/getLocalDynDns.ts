import fs from "fs";
import { MinioSettings } from "./settings";
export interface LocalDynDnsRecord {
    ip?: string;
    mac?: string;
    name: string;
}
export function getLocalDynDnsFromFile(
    filepath: string = "local_dyn_dns.txt",
): LocalDynDnsRecord[] {
    const content = fs.readFileSync(filepath, "utf-8");
    return parseDynDnsConfig(content);
}

export function parseDynDnsConfig(content: string): LocalDynDnsRecord[] {
    const records: LocalDynDnsRecord[] = [];
    const lines = content.split("\n");
    for (const line0 of lines) {
        const line = line0.split("#")[0].trim();
        if (!line.trim()) continue;
        const [macOrIp, name] = line.split(/\s+/);
        const ip = macOrIp.split(".").length === 4 ? macOrIp : undefined;
        const mac = ip ? undefined : macOrIp;
        if ((mac || ip) && name) {
            records.push({
                ip,
                mac,
                name,
            });
        }
    }
    return records;
}
