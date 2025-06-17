import { expectDeepEqual } from "ystd";
import { arpLookup, getArpTable, parseArpOutput } from "./ArpTable";
// import JSON5 from "json5";

describe("win_local_dns/getArpTable.test.ts", () => {
    it("parseArpOutput", () => {
        const arpTable = parseArpOutput(arpOutputExample);
        expectDeepEqual(arpTable, parsedExampleArp);
    });
    it("getArpTable", () => {
        const arpTable = getArpTable();
        expectDeepEqual(arpTable.length > 1, true);
        expectDeepEqual(arpTable[0].ipAddress.split(".").length, 4);
    });
    it("arpLookup", () => {
        const arpTable = parseArpOutput(arpOutputExample);
        const r = arpLookup("84-5a-7d-8c-33-af", undefined, arpTable);
        expectDeepEqual(r, {
            arpInterface: "192.168.1.127",
            ipAddress: "192.168.1.57",
            macAddress: "84-5a-7d-8c-33-af",
            type: "dynamic",
        });
    });
});
const arpOutputExample = `
Active code page: 65001

Interface: 192.168.1.127 --- 0x8
  Internet Address      Physical Address      Type
  192.168.1.9           4a-d1-8e-7f-5b-36     dynamic   
  192.168.1.57          84-5a-7d-8c-33-af     dynamic   
  192.168.1.255         0c-90-f3-99-58-9d     static    
  224.0.0.22            2c-4e-ae-63-bd-16     static    
  224.0.0.251           32-64-1e-c1-7d-f0     static    
  224.0.0.252           a8-9c-73-cc-42-10     static    
  239.255.255.250       f8-b8-76-27-f9-29     static    
  255.255.255.255       60-30-5a-3e-72-bf     static    

Interface: 192.168.81.1 --- 0xf
  Internet Address      Physical Address      Type
  192.168.81.3          d6-d9-68-8b-cd-0f     static    
  224.0.0.22            70-4a-d2-51-67-e1     static    
  224.0.0.251           53-5f-f0-c8-d1-60     static    
  224.0.0.252           3c-8a-f0-af-9c-fb     static    
  239.255.255.250       60-ef-02-18-d9-8e     static    

Interface: 192.168.5.1 --- 0x1b
  Internet Address      Physical Address      Type
  192.168.5.7           69-88-67-5e-90-d7     static    
  224.0.0.22            0b-12-8e-4e-bb-f9     static    
  224.0.0.251           44-d1-d9-20-b4-5c     static    
  224.0.0.252           5c-bd-8d-02-7e-98     static    
  239.255.255.250       41-4f-5b-9a-18-d0     static    

Interface: 172.31.64.1 --- 0x2b
  Internet Address      Physical Address      Type
  172.31.79.7           52-52-6f-30-c8-44     static    
  224.0.0.22            77-1b-9f-6a-28-ff     static    
  224.0.0.251           8a-38-09-9e-e6-27     static    
  239.255.255.250       9e-6c-17-4e-f8-0e     static    
  255.255.255.255       73-79-53-f2-28-47     static    

Interface: 172.28.224.1 --- 0x32
  Internet Address      Physical Address      Type
  172.28.239.4          4c-d7-d6-99-d9-9e     static    
  224.0.0.22            13-18-0b-98-17-e9     static    
  224.0.0.251           e7-f6-5f-f8-7e-92     static    
  239.255.255.250       ad-e2-2b-3c-26-f9     static    

Interface: 172.24.16.1 --- 0x36
  Internet Address      Physical Address      Type
  172.24.31.3           5a-11-44-56-81-4b     static    
  224.0.0.22            67-0e-1a-c1-eb-7a     static    
  224.0.0.251           11-b4-e1-23-d6-c4     static    
  239.255.255.250       e9-3d-0e-91-3a-79     static    

Interface: 172.30.224.1 --- 0x3a
  Internet Address      Physical Address      Type
  172.30.239.6          24-af-d2-24-32-d6     static    
  224.0.0.22            63-b9-3d-3e-9b-59     static    
  224.0.0.251           83-7c-5d-44-17-0e     static    
  239.255.255.250       44-97-b1-7c-7d-e1     static       
`;
const parsedExampleArp = [
    {
        arpInterface: "192.168.1.127",
        ipAddress: "192.168.1.9",
        macAddress: "4a-d1-8e-7f-5b-36",
        type: "dynamic",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "192.168.1.57",
        macAddress: "84-5a-7d-8c-33-af",
        type: "dynamic",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "192.168.1.255",
        macAddress: "0c-90-f3-99-58-9d",
        type: "static",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "224.0.0.22",
        macAddress: "2c-4e-ae-63-bd-16",
        type: "static",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "224.0.0.251",
        macAddress: "32-64-1e-c1-7d-f0",
        type: "static",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "224.0.0.252",
        macAddress: "a8-9c-73-cc-42-10",
        type: "static",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "239.255.255.250",
        macAddress: "f8-b8-76-27-f9-29",
        type: "static",
    },
    {
        arpInterface: "192.168.1.127",
        ipAddress: "255.255.255.255",
        macAddress: "60-30-5a-3e-72-bf",
        type: "static",
    },
    {
        arpInterface: "192.168.81.1",
        ipAddress: "192.168.81.3",
        macAddress: "d6-d9-68-8b-cd-0f",
        type: "static",
    },
    {
        arpInterface: "192.168.81.1",
        ipAddress: "224.0.0.22",
        macAddress: "70-4a-d2-51-67-e1",
        type: "static",
    },
    {
        arpInterface: "192.168.81.1",
        ipAddress: "224.0.0.251",
        macAddress: "53-5f-f0-c8-d1-60",
        type: "static",
    },
    {
        arpInterface: "192.168.81.1",
        ipAddress: "224.0.0.252",
        macAddress: "3c-8a-f0-af-9c-fb",
        type: "static",
    },
    {
        arpInterface: "192.168.81.1",
        ipAddress: "239.255.255.250",
        macAddress: "60-ef-02-18-d9-8e",
        type: "static",
    },
    {
        arpInterface: "192.168.5.1",
        ipAddress: "192.168.5.7",
        macAddress: "69-88-67-5e-90-d7",
        type: "static",
    },
    {
        arpInterface: "192.168.5.1",
        ipAddress: "224.0.0.22",
        macAddress: "0b-12-8e-4e-bb-f9",
        type: "static",
    },
    {
        arpInterface: "192.168.5.1",
        ipAddress: "224.0.0.251",
        macAddress: "44-d1-d9-20-b4-5c",
        type: "static",
    },
    {
        arpInterface: "192.168.5.1",
        ipAddress: "224.0.0.252",
        macAddress: "5c-bd-8d-02-7e-98",
        type: "static",
    },
    {
        arpInterface: "192.168.5.1",
        ipAddress: "239.255.255.250",
        macAddress: "41-4f-5b-9a-18-d0",
        type: "static",
    },
    {
        arpInterface: "172.31.64.1",
        ipAddress: "172.31.79.7",
        macAddress: "52-52-6f-30-c8-44",
        type: "static",
    },
    {
        arpInterface: "172.31.64.1",
        ipAddress: "224.0.0.22",
        macAddress: "77-1b-9f-6a-28-ff",
        type: "static",
    },
    {
        arpInterface: "172.31.64.1",
        ipAddress: "224.0.0.251",
        macAddress: "8a-38-09-9e-e6-27",
        type: "static",
    },
    {
        arpInterface: "172.31.64.1",
        ipAddress: "239.255.255.250",
        macAddress: "9e-6c-17-4e-f8-0e",
        type: "static",
    },
    {
        arpInterface: "172.31.64.1",
        ipAddress: "255.255.255.255",
        macAddress: "73-79-53-f2-28-47",
        type: "static",
    },
    {
        arpInterface: "172.28.224.1",
        ipAddress: "172.28.239.4",
        macAddress: "4c-d7-d6-99-d9-9e",
        type: "static",
    },
    {
        arpInterface: "172.28.224.1",
        ipAddress: "224.0.0.22",
        macAddress: "13-18-0b-98-17-e9",
        type: "static",
    },
    {
        arpInterface: "172.28.224.1",
        ipAddress: "224.0.0.251",
        macAddress: "e7-f6-5f-f8-7e-92",
        type: "static",
    },
    {
        arpInterface: "172.28.224.1",
        ipAddress: "239.255.255.250",
        macAddress: "ad-e2-2b-3c-26-f9",
        type: "static",
    },
    {
        arpInterface: "172.24.16.1",
        ipAddress: "172.24.31.3",
        macAddress: "5a-11-44-56-81-4b",
        type: "static",
    },
    {
        arpInterface: "172.24.16.1",
        ipAddress: "224.0.0.22",
        macAddress: "67-0e-1a-c1-eb-7a",
        type: "static",
    },
    {
        arpInterface: "172.24.16.1",
        ipAddress: "224.0.0.251",
        macAddress: "11-b4-e1-23-d6-c4",
        type: "static",
    },
    {
        arpInterface: "172.24.16.1",
        ipAddress: "239.255.255.250",
        macAddress: "e9-3d-0e-91-3a-79",
        type: "static",
    },
    {
        arpInterface: "172.30.224.1",
        ipAddress: "172.30.239.6",
        macAddress: "24-af-d2-24-32-d6",
        type: "static",
    },
    {
        arpInterface: "172.30.224.1",
        ipAddress: "224.0.0.22",
        macAddress: "63-b9-3d-3e-9b-59",
        type: "static",
    },
    {
        arpInterface: "172.30.224.1",
        ipAddress: "224.0.0.251",
        macAddress: "83-7c-5d-44-17-0e",
        type: "static",
    },
    {
        arpInterface: "172.30.224.1",
        ipAddress: "239.255.255.250",
        macAddress: "44-97-b1-7c-7d-e1",
        type: "static",
    },
];
