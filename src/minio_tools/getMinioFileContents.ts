import { Client } from "minio";

// Function to fetch file contents
export async function getMinioFileContents(
    minioClient: Client,
    bucketName: string,
    objectName: string,
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        minioClient.getObject(bucketName, objectName, (err, stream) => {
            if (err) {
                reject(err);
            } else {
                stream.on("data", (chunk: any) => {
                    chunks.push(chunk);
                });
                stream.on("end", () => {
                    const content = Buffer.concat(chunks).toString("utf-8");
                    resolve(content);
                });
                stream.on("error", (error: any) => {
                    reject(error);
                });
            }
        });
    });
}
