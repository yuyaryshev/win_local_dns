import {
    string,
    number,
    boolean,
    object,
    optional,
    Decoder,
} from "yuyaryshev-json-type-validation";
export interface MinioSettings {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucketId: string;
    objectId: string;
}
export interface WinLocalDnsSettings {
    ddns_file_fallback?: string;
    minio?: MinioSettings;
}
const minioSettingsDecoder: Decoder<MinioSettings> = object({
    endPoint: string(),
    port: number(),
    useSSL: boolean(),
    accessKey: string(),
    secretKey: string(),
    bucketId: string(),
    objectId: string(),
});
const winLocalDnsSettingsDecoder: Decoder<WinLocalDnsSettings> = object({
    ddns_file_fallback: optional(string()),
    minio: optional(minioSettingsDecoder),
});
export { minioSettingsDecoder, winLocalDnsSettingsDecoder };
