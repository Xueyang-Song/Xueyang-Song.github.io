export type Platform = "windows" | "mac" | "linux" | "unknown";

export type ReleaseAssetPatterns = Partial<Record<Platform, string[]>>;

export type DownloadState =
  | {
      kind: "coming-soon";
      label: string;
      href: null;
    }
  | {
      kind: "source";
      label: string;
      href: string;
    }
  | {
      kind: "download";
      label: string;
      href: string;
    };

export function detectPlatform(userAgent: string): Platform {
  const value = userAgent.toLowerCase();

  if (value.includes("win")) {
    return "windows";
  }

  if (value.includes("mac")) {
    return "mac";
  }

  if (value.includes("linux") || value.includes("x11")) {
    return "linux";
  }

  return "unknown";
}

export function selectReleaseAsset(
  assets: Array<{ name: string; browser_download_url: string }>,
  platform: Platform,
  patterns: ReleaseAssetPatterns,
): string | null {
  const preferredPatterns = [...(patterns[platform] ?? []), ...(patterns.unknown ?? [])];

  for (const pattern of preferredPatterns) {
    const asset = assets.find((candidate) =>
      candidate.name.toLowerCase().includes(pattern.toLowerCase()),
    );

    if (asset) {
      return asset.browser_download_url;
    }
  }

  return null;
}

export function getInitialDownloadState(status: string, fallbackUrl: string): DownloadState {
  if (status === "available") {
    return {
      kind: "source",
      label: "View release",
      href: fallbackUrl,
    };
  }

  return {
    kind: "coming-soon",
    label: "Download coming soon",
    href: null,
  };
}
