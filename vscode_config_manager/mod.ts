/**
 * vscode.ts
 */
import * as path from "https://deno.land/std@0.78.0/path/mod.ts";

const getSettingsPath = (): string => {
  const paths = {
    darwin: Deno.env.get("HOME") +
      "/Library/Application Support/Code/User/settings.json",
    linux: Deno.env.get("HOME") + "/.config/Code/User/settings.json",
    windows: Deno.env.get("APPDATA") + "\\Code\\User\\settings.json",
  };

  return paths[Deno.build.os];
};

const backupSettingsJson = async (): Promise<void> => {
  const settingsFilePath = getSettingsPath();
  await Deno.copyFile(settingsFilePath, path.join(Deno.cwd(), "settings.json"));
};

const backupExtensionsList = async (): Promise<void> => {
  const cmd = Deno.run({ cmd: ["code", "--list-extensions"], stdout: "piped" });
  const output = await cmd.output();

  const decoder = new TextDecoder("utf-8");
  const outputText = decoder.decode(output);
  // await Deno.stdout.write(output);

  await Deno.writeTextFile(path.join(Deno.cwd(), "extensions"), outputText);

  cmd.close();
};

(async () => {
  await backupSettingsJson();
  await backupExtensionsList();
})();
