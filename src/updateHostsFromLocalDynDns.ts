import { HostsFileEntry, upsertHosts } from "./upsertHosts.js";
import { arpLookup, ArpEntry } from "./ArpTable.js";
import {
    getLocalDynDnsFromFile,
    LocalDynDnsRecord,
    parseDynDnsConfig,
} from "./getLocalDynDns.js";
import { readSettings } from "./settings/readSettings";
import * as Minio from "minio";
import { getMinioFileContents } from "./minio_tools";
export async function updateHostsFromLocalDynDns() {
    const settings = readSettings();

    const ddnsRecords: LocalDynDnsRecord[] = [];

    if (settings.minio) {
        try {
            const minioClient: Minio.Client = new Minio.Client(settings.minio!);
            const ddns_file_content = await getMinioFileContents(
                minioClient,
                settings.minio.bucketId,
                settings.minio.objectId,
            );
            ddnsRecords.push(...parseDynDnsConfig(ddns_file_content));
            console.log(
                `CODE00000000 Fetched ddns_file from minio successfully!`,
            );
        } catch (e: any) {
            console.warn(
                `CODE00000000 Failed to fetch ddns_file file from minio!`,
                e,
            );
        }
    }

    if (!ddnsRecords.length) {
        ddnsRecords.push(
            ...getLocalDynDnsFromFile(
                settings.ddns_file_fallback || "local_dyn_dns.txt",
            ),
        );
    }

    const hostsUpdates: HostsFileEntry[] = [];
    for (let record of ddnsRecords) {
        const arpEntry: ArpEntry | undefined = record.mac
            ? arpLookup(record.mac)
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
