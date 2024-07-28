import { HostsFileEntry, upsertHosts } from "./upsertHosts.js";
import { arpLookup, ArpEntry } from "./ArpTable.js";
import {
    getLocalDynDnsFromFile,
    LocalDynDnsData,
    LocalDynDnsRecord,
    parseDynDnsConfig,
} from "./getLocalDynDns.js";
import { readSettings } from "./settings/readSettings";
import * as Minio from "minio";
import { getMinioFileContents } from "./minio_tools";
export async function updateHostsFromLocalDynDns() {
    const settings = readSettings();
    let ddnsData: LocalDynDnsData | undefined;
    if (settings.minio) {
        try {
            const minioClient: Minio.Client = new Minio.Client(settings.minio!);
            const ddns_file_content = await getMinioFileContents(
                minioClient,
                settings.minio.bucketId,
                settings.minio.objectId,
            );
            ddnsData = parseDynDnsConfig(ddns_file_content);
            console.log(
                `CODE00000002 Fetched ddns_file from minio successfully!`,
            );
        } catch (e: any) {
            ddnsData = undefined;
            console.warn(
                `CODE00000003 Failed to fetch ddns_file file from minio!`,
                e,
            );
        }
    }
    if (!ddnsData) {
        ddnsData = getLocalDynDnsFromFile(
            settings.ddns_file_fallback || "local_dyn_dns.txt",
        );
    }
    const hostsUpdates: HostsFileEntry[] = [];
    for (let record of ddnsData.items) {
        const arpEntry: ArpEntry | undefined = record.mac
            ? arpLookup(record.mac, undefined, ddnsData.exclusions)
            : undefined;
        const hostsFileEntry: HostsFileEntry = {
            ip: record.ip || arpEntry?.ipAddress || "",
            name: record.name,
        };
        if (hostsFileEntry.ip && hostsFileEntry.ip.length) {
            hostsUpdates.push(hostsFileEntry);
        }
    }
    upsertHosts(hostsUpdates);
}
