import { describe, expect, it, vi } from "vitest";
import {
  detectPlatform,
  getInitialDownloadState,
  getLatestReleaseApiUrl,
  getLatestReleasePageUrl,
  getReleaseFallbackState,
  loadLatestRelease,
  resolveReleaseDownloadState,
  selectReleaseAsset,
  supportsPlatform,
  type ReleaseAssetRules,
} from "./download";

describe("download helpers", () => {
  it("detects common desktop platforms", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("windows");
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("mac");
    expect(detectPlatform("Example/1.0 (Darwin arm64)")).toBe("mac");
    expect(detectPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("linux");
    expect(detectPlatform("unknown")).toBe("unknown");
  });

  it("keeps unreleased apps in a coming-soon state", () => {
    expect(getInitialDownloadState("coming-soon")).toEqual({
      kind: "coming-soon",
      label: "Download coming soon",
      href: null,
    });
  });

  it("starts available downloads in a loading state", () => {
    expect(getInitialDownloadState("available")).toEqual({
      kind: "loading",
      label: "Preparing download…",
      href: null,
    });
  });

  it("selects only the exact Paper Pilot Windows installer", () => {
    const rules: ReleaseAssetRules = {
      windows: [{ prefix: "Paper-Pilot-Setup-", suffix: ".exe" }],
    };

    const selected = selectReleaseAsset(
      [
        {
          name: "Paper-Pilot-Setup-0.3.4.exe.blockmap",
          browser_download_url: "https://example.com/blockmap",
        },
        { name: "latest.yml", browser_download_url: "https://example.com/metadata" },
        {
          name: "Paper-Pilot-Setup-0.3.4.exe",
          browser_download_url: "https://example.com/installer",
        },
      ],
      "windows",
      rules,
    );

    expect(selected).toBe("https://example.com/installer");
  });

  it("does not expose a Windows-only release on other platforms", () => {
    const rules: ReleaseAssetRules = {
      windows: [{ prefix: "Paper-Pilot-Setup-", suffix: ".exe" }],
    };

    expect(supportsPlatform("windows", rules)).toBe(true);
    expect(supportsPlatform("mac", rules)).toBe(false);
    expect(supportsPlatform("linux", rules)).toBe(false);
    expect(supportsPlatform("unknown", rules)).toBe(false);
  });

  it("builds a stable latest-release fallback URL", () => {
    expect(getLatestReleasePageUrl("https://github.com/example/app/")).toBe(
      "https://github.com/example/app/releases/latest",
    );
    expect(getLatestReleaseApiUrl("https://github.com/example/app")).toBe(
      "https://api.github.com/repos/example/app/releases/latest",
    );
  });

  it("resolves direct downloads and safe release-page fallbacks", () => {
    const rules: ReleaseAssetRules = {
      windows: [{ prefix: "Paper-Pilot-Setup-", suffix: ".exe" }],
    };
    const releasePageUrl = "https://github.com/example/app/releases/latest";

    expect(
      resolveReleaseDownloadState(
        {
          assets: [
            {
              name: "Paper-Pilot-Setup-0.3.4.exe",
              browser_download_url: "https://example.com/installer",
            },
          ],
        },
        "windows",
        rules,
        "Download Paper Pilot for Windows",
        releasePageUrl,
      ),
    ).toEqual({
      kind: "download",
      label: "Download Paper Pilot for Windows",
      href: "https://example.com/installer",
    });

    expect(
      resolveReleaseDownloadState(
        { assets: [], html_url: "https://github.com/example/app/releases/tag/v1.0.0" },
        "windows",
        rules,
        "Download Paper Pilot for Windows",
        releasePageUrl,
      ),
    ).toEqual({
      kind: "source",
      label: "View latest release",
      href: "https://github.com/example/app/releases/tag/v1.0.0",
    });

    expect(getReleaseFallbackState(releasePageUrl)).toEqual({
      kind: "source",
      label: "View latest release",
      href: releasePageUrl,
    });
  });

  it("shares duplicate latest-release API requests", async () => {
    const repo = "https://github.com/example/shared-request-test";
    const request = vi.fn(async () =>
      new Response(JSON.stringify({ assets: [], html_url: `${repo}/releases/tag/v1.0.0` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const first = loadLatestRelease(repo, request);
    const second = loadLatestRelease(repo, request);

    expect(second).toBe(first);
    await expect(first).resolves.toEqual({
      assets: [],
      html_url: `${repo}/releases/tag/v1.0.0`,
    });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("drops failed API requests so a later attempt can retry", async () => {
    const repo = "https://github.com/example/retry-test";
    const failedRequest = vi.fn(async () => new Response(null, { status: 503 }));

    await expect(loadLatestRelease(repo, failedRequest)).rejects.toThrow("Release not available");

    const retryRequest = vi.fn(async () =>
      new Response(JSON.stringify({ assets: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(loadLatestRelease(repo, retryRequest)).resolves.toEqual({ assets: [] });
    expect(failedRequest).toHaveBeenCalledTimes(1);
    expect(retryRequest).toHaveBeenCalledTimes(1);
  });

  it("returns null when the release API has no matching assets", () => {
    expect(selectReleaseAsset([], "mac", { mac: [{ suffix: ".dmg" }] })).toBeNull();
  });
});
