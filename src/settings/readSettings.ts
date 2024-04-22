import { readFileSync } from "fs";
import JSON5 from "json5";
import {
    WinLocalDnsSettings,
    winLocalDnsSettingsDecoder,
} from "./settings_types";

export function readSettings(
    settingsFilePath: string = "settings.json5",
): WinLocalDnsSettings {
    const settingsStr = readFileSync(settingsFilePath, "utf-8");
    const settings = JSON5.parse(settingsStr);

    winLocalDnsSettingsDecoder.runWithException(settings, {
        errorMessageWithData: true,
    });
    return settings;
}
