import { execSync } from "child_process";
import { bufferToString, YyaEncoding } from "./win1251/yyaTextFile";
import { LocalDynDnsExclusion } from "./getLocalDynDns";

export interface ArpEntry {
    arpInterface: string;
    ipAddress: string;
    macAddress: string;
    type: string;
}

export function getArpTable(): ArpEntry[] {
    try {
        const arpOutputBuffer = execSync("chcp 65001 && arp -a");
        const [arpOutput] = bufferToString(arpOutputBuffer, {
            encoding: "windows-1251",
        });
        return parseArpOutput(arpOutput);
    } catch (error) {
        throw new Error(`Error retrieving ARP table: ${error}`);
    }
}

export function parseArpOutput(output: string): ArpEntry[] {
    const arpEntries: ArpEntry[] = [];
    let currentArpInterfaceIp: string | undefined;
    const lines = output.split("\n");
    for (const line of lines) {
        if (line.trim() === "") {
            currentArpInterfaceIp = undefined;
        } else if (line.includes("Interface:")) {
            const ipAddressMatch = line.match(/Interface:\s*(\S+)/);
            if (ipAddressMatch) {
                currentArpInterfaceIp = ipAddressMatch[1];
            }
        } else if (
            currentArpInterfaceIp &&
            line.match(
                /^\s*\d+\.\d+\.\d+\.\d+\s+([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\s+\S+\s*$/,
            )
        ) {
            const [ipAddress, macAddress, type] = line.trim().split(/\s+/);
            arpEntries.push({
                arpInterface: currentArpInterfaceIp,
                ipAddress,
                macAddress,
                type,
            });
        }
    }
    return arpEntries;
}
export function arpLookup(
    mac: string,
    allowedIpPrefix?: string,
    arpTable?: ArpEntry[],
    exclusions?: LocalDynDnsExclusion[],
): ArpEntry | undefined {
    const macNormalized = mac.toLocaleLowerCase();
    if (!arpTable) {
        arpTable = getArpTable();
    }
    for (let rec of arpTable) {
        if (
            rec.macAddress.toLocaleLowerCase() === macNormalized &&
            (!allowedIpPrefix || rec.ipAddress.startsWith(allowedIpPrefix))
        ) {
            if (
                exclusions &&
                exclusions.filter((excl) =>
                    rec.ipAddress.startsWith(excl.ippart),
                ).length
            ) {
                continue;
            }
            return rec;
        }
    }
}
