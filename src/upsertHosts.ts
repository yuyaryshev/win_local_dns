import * as fs from "fs";
import { a } from "vite/dist/node/types.d-aGj9QkWt";
export interface HostsFileEntry {
    ip: string;
    name: string;
}
const hostsFilePath = "C:\\Windows\\System32\\drivers\\etc\\hosts";
export function upsertHosts(entries: HostsFileEntry[]) {
    // Load hosts file
    const oldContent = fs.readFileSync(hostsFilePath, "utf-8");
    let newContent = oldContent;

    // Split into lines
    const lines = oldContent.split("\n");

    // Iterate over provided entries
    for (let entry of entries) {
        // Check if entry exists
        const existingIndex = lines.findIndex(
            (line) => line.split("#")[0].split(/\s+/)[1] === entry.name,
        );

        // If exists, update its IP
        if (existingIndex !== -1) {
            const existingLine = lines[existingIndex];
            const updatedLine = existingLine.replace(
                /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
                entry.ip,
            );
            lines[existingIndex] = updatedLine;
        } else {
            // If doesn't exist, append to end
            lines.push(`${entry.ip}\t${entry.name}`);
        }
    }

    // Join lines back into content
    newContent = lines.join("\n");

    // Check length
    if (newContent.length >= 0.95 * oldContent.length) {
        if (newContent === oldContent) {
            console.log(`CODE00000001 No updates to hosts file needed.`);
            return;
        }
        // Write hosts file back to disk
        try {
            fs.writeFileSync(hostsFilePath, newContent);
            console.log(`CODE00001551 hosts newContent=\n`, newContent);
        } catch (e: any) {
            console.log(`CODE00001551 hosts newContent=\n`, newContent);
            console.error(
                `CODE00001551 failed to update hosts file because of error\n${e.message}\n\n`,
                e.stack,
            );
        }
    } else {
        console.error(
            "Error: New content length is smaller than old content length.",
        );
    }
}
