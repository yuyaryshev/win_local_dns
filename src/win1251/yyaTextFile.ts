import { Buffer } from "node:buffer";
import fs from "fs";
import * as windows1251 from "./win1251";
import { removeBOMprefix } from "./TsvDb";
export type YyaEncoding = "utf-8" | "windows-1251";
export interface YyaTextOpts {
    encoding?: YyaEncoding;
    forceEncoding?: boolean;
    tryKeepFileEncoding?: boolean;
    alwaysKeepFileEncoding?: boolean;
}
export interface YyaFileHeaderInfo {
    encoding: YyaEncoding;
    header: Uint8Array;
}
export function getFileHeaderInfo(
    dataBuf: Uint8Array,
): YyaFileHeaderInfo | undefined {
    if (dataBuf[0] === 239 && dataBuf[1] === 187 && dataBuf[2] === 191) {
        return {
            encoding: "utf-8",
            header: new Uint8Array([239, 187, 191]),
        };
    }
}
export function encodingToHeader(
    encoding: YyaEncoding,
): Uint8Array | undefined {
    switch (encoding) {
        case "utf-8":
            return new Uint8Array([239, 187, 191]);
        case "windows-1251":
            return undefined;
    }
    return undefined;
}
export function bufferToString(
    dataBuf0: Buffer,
    opts?: YyaTextOpts,
): [string, YyaFileHeaderInfo | undefined] {
    const h = getFileHeaderInfo(dataBuf0);
    const encoding: YyaEncoding =
        (opts?.forceEncoding ? opts?.encoding : undefined) ||
        h?.encoding ||
        opts?.encoding ||
        "utf-8";
    const dataBuf =
        encoding === h?.encoding && h.header.length > 0
            ? dataBuf0.slice(h.header.length)
            : dataBuf0;
    switch (encoding) {
        case "windows-1251":
            return [windows1251.decode(dataBuf), h];
        case "utf-8":
            return [dataBuf.toString("utf-8"), h];
        default:
            throw new Error(
                `CODE00000766 Unsupported encoding ${encoding || "undefined"}`,
            );
    }
}
export function bufferFromString(
    s: string,
    opts?: YyaTextOpts,
    currentHeaderInfo?: YyaFileHeaderInfo,
): Buffer {
    // if(opts?.alwaysKeepFileEncoding)
    //     if()
    let encoding: YyaEncoding = "utf-8";
    let header: Uint8Array | undefined;
    if (
        (opts?.tryKeepFileEncoding && currentHeaderInfo?.encoding) ||
        opts?.alwaysKeepFileEncoding
    ) {
        if (!currentHeaderInfo?.encoding) {
            throw new Error(
                `alwaysKeepFileEncoding because no encoding provided in 'currentHeaderInfo' argument`,
            );
        }
        encoding = currentHeaderInfo.encoding;
        header = currentHeaderInfo.header;
    } else {
        encoding = opts?.encoding || "utf-8";
        header = encodingToHeader(encoding);
    }
    let r: Buffer;
    switch (encoding) {
        case "windows-1251":
            r = Buffer.from(windows1251.encode(s));
            break;
        case "utf-8":
            r = Buffer.from(s, "utf-8");
            break;
        default:
            throw new Error(
                `CODE00000767 Unsupported encoding ${encoding || "undefined"}`,
            );
    }
    return header ? Buffer.concat([header, r]) : r;
}
export function readTextFileSync(filePath: string, opts?: YyaTextOpts): string {
    const dataBuf = fs.readFileSync(filePath);
    return bufferToString(dataBuf, opts)[0];
}
export function readTextFileSyncEx(
    filePath: string,
    opts?: YyaTextOpts,
): [string, YyaFileHeaderInfo | undefined] {
    const dataBuf = fs.readFileSync(filePath);
    return bufferToString(dataBuf, opts);
}
export function writeTextFileSync(
    filePath: string,
    content: string,
    opts?: YyaTextOpts,
    currentHeaderInfo?: YyaFileHeaderInfo,
) {
    const dataBuf = bufferFromString(content, opts, currentHeaderInfo);
    fs.writeFileSync(filePath, dataBuf);
}
