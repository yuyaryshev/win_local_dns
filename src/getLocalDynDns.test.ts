import { expectDeepEqual } from "ystd";
import {
    LocalDynDnsData,
    LocalDynDnsRecord,
    parseDynDnsConfig,
} from "./getLocalDynDns.js";
describe("localDynDns/parseLocalDynDns.test.ts", () => {
    it("parseLocalDynDns", () => {
        const content: string = `# some comment 1
                        84-5a-7d-8c-33-af foo # some comment 2
                        0c-90-f3-99-58-9d bar
                        2c-4e-ae-63-bd-16 baz
                        -123.234`;
        const parsedRecords = parseDynDnsConfig(content);
        const expected: LocalDynDnsData = {
            items: [
                {
                    ip: undefined,
                    mac: "84-5a-7d-8c-33-af",
                    name: "foo",
                },
                {
                    ip: undefined,
                    mac: "0c-90-f3-99-58-9d",
                    name: "bar",
                },
                {
                    ip: undefined,
                    mac: "2c-4e-ae-63-bd-16",
                    name: "baz",
                },
            ],
            exclusions: [
                {
                    ippart: "123.234",
                },
            ],
        };
        expectDeepEqual(parsedRecords, expected);
    });
});
