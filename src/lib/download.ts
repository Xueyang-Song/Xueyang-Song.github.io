export type Platform = "windows" | "mac" | "linux" | "unknown";

export type ReleaseStatus = "coming-soon" | "available";

export type ReleaseAssetRule = {
  prefix?: string;
  suffix: string;
};

export type ReleaseAssetRules = Partial<Record<Platform, ReleaseAssetRule[]>>;

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

export type ReleaseResponse = {
  assets?: ReleaseAsset[];
  html_url?: string;
};

type ReleaseRequest = (input: string, init?: RequestInit) => Promise<Response>;

export type DownloadState =
  | {
      kind: "coming-soon";
      label: string;
      href: null;
    }
  | {
      kind: "loading";
      label: string;
      href: null;
    }
  | {
      kind: "unsupported";
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

const latestReleaseRequests = new Map<string, Promise<ReleaseResponse>>();

export function detectPlatform(userAgent: string): Platform {
  const value = userAgent.toLowerCase();

  if (
    value.includes("windows") ||
    /\bwin(?:32|64)\b/.test(value) ||
    value.includes("wow64")
  ) {
    return "windows";
  }

  if (value.includes("macintosh") || value.includes("mac os") || value.includes("darwin")) {
    return "mac";
  }

  if (value.includes("linux") || value.includes("x11")) {
    return "linux";
  }

  return "unknown";
}

export function selectReleaseAsset(
  assets: ReleaseAsset[],
  platform: Platform,
  rules: ReleaseAssetRules,
): string | null {
  const preferredRules = [...(rules[platform] ?? []), ...(rules.unknown ?? [])];

  for (const rule of preferredRules) {
    const normalizedPrefix = rule.prefix?.toLowerCase();
    const normalizedSuffix = rule.suffix.toLowerCase();
    const asset = assets.find((candidate) => {
      const normalizedName = candidate.name.toLowerCase();
      const hasExpectedPrefix = normalizedPrefix
        ? normalizedName.startsWith(normalizedPrefix)
        : true;

      return hasExpectedPrefix && normalizedName.endsWith(normalizedSuffix);
    });

    if (asset) {
      return asset.browser_download_url;
    }
  }

  return null;
}

export function supportsPlatform(platform: Platform, rules: ReleaseAssetRules): boolean {
  return (rules[platform]?.length ?? 0) > 0 || (rules.unknown?.length ?? 0) > 0;
}

export function getLatestReleasePageUrl(repo: string): string {
  return `${repo.replace(/\/+$/, "")}/releases/latest`;
}

export function getLatestReleaseApiUrl(repo: string): string {
  const url = new URL(repo);
  const [owner, name] = url.pathname.split("/").filter(Boolean);

  if (url.hostname.toLowerCase() !== "github.com" || !owner || !name) {
    throw new Error("Invalid GitHub repository URL");
  }

  return `https://api.github.com/repos/${owner}/${name}/releases/latest`;
}

export function loadLatestRelease(
  repo: string,
  request: ReleaseRequest = fetch,
): Promise<ReleaseResponse> {
  const cacheKey = getLatestReleasePageUrl(repo);
  const cachedRequest = latestReleaseRequests.get(cacheKey);

  if (cachedRequest) {
    return cachedRequest;
  }

  const releaseRequest = request(getLatestReleaseApiUrl(repo), {
    headers: { Accept: "application/vnd.github+json" },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error("Release not available");
    }

    return (await response.json()) as ReleaseResponse;
  });

  latestReleaseRequests.set(cacheKey, releaseRequest);
  void releaseRequest.catch(() => {
    if (latestReleaseRequests.get(cacheKey) === releaseRequest) {
      latestReleaseRequests.delete(cacheKey);
    }
  });

  return releaseRequest;
}

export function resolveReleaseDownloadState(
  release: ReleaseResponse,
  platform: Platform,
  rules: ReleaseAssetRules,
  label: string,
  releasePageUrl: string,
): DownloadState {
  const href = selectReleaseAsset(release.assets ?? [], platform, rules);

  if (href) {
    return { kind: "download", label, href };
  }

  return {
    kind: "source",
    label: "View latest release",
    href: release.html_url ?? releasePageUrl,
  };
}

export function getReleaseFallbackState(releasePageUrl: string): DownloadState {
  return {
    kind: "source",
    label: "View latest release",
    href: releasePageUrl,
  };
}

export function getInitialDownloadState(status: ReleaseStatus): DownloadState {
  if (status === "available") {
    return {
      kind: "loading",
      label: "Preparing download…",
      href: null,
    };
  }

  return {
    kind: "coming-soon",
    label: "Download coming soon",
    href: null,
  };
}
