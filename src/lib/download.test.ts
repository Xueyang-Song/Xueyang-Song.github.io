import { describe, expect, it } from "vitest";
import {
  detectPlatform,
  getInitialDownloadState,
  selectReleaseAsset,
  type ReleaseAssetPatterns,
} from "./download";

describe("download helpers", () => {
  it("detects common desktop platforms", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("windows");
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("mac");
    expect(detectPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
    expect(detectPlatform("unknown")).toBe("unknown");
  });

  it("keeps unreleased apps in a coming-soon state", () => {
    expect(getInitialDownloadState("coming-soon", "https://github.com/example/app")).toEqual({
      kind: "coming-soon",
      label: "Download coming soon",
      href: null,
    });
  });

  it("selects the platform-specific release asset when available", () => {
    const patterns: ReleaseAssetPatterns = {
      windows: [".exe", ".msi"],
      mac: [".dmg"],
      linux: [".AppImage"],
    };

    const selected = selectReleaseAsset(
      [
        { name: "AcademiaML-1.6.0.dmg", browser_download_url: "https://example.com/mac" },
        { name: "AcademiaML-Setup-1.6.0.exe", browser_download_url: "https://example.com/win" },
      ],
      "windows",
      patterns,
    );

    expect(selected).toBe("https://example.com/win");
  });

  it("returns null when the release API has no matching assets", () => {
    expect(selectReleaseAsset([], "mac", { mac: [".dmg"] })).toBeNull();
  });
});
