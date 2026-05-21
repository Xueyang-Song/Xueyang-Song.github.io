import { Clock, Download, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  detectPlatform,
  getInitialDownloadState,
  selectReleaseAsset,
  type DownloadState,
  type ReleaseAssetPatterns,
} from "../lib/download";

type DownloadButtonProps = {
  repo: string;
  status: string;
  assetPatterns: ReleaseAssetPatterns;
  fallbackUrl: string;
  label: string;
};

type ReleaseResponse = {
  assets?: Array<{ name: string; browser_download_url: string }>;
  html_url?: string;
};

function repoApiUrl(repo: string) {
  const url = new URL(repo);
  const [, owner, name] = url.pathname.split("/");
  return `https://api.github.com/repos/${owner}/${name}/releases/latest`;
}

export default function DownloadButton({
  repo,
  status,
  assetPatterns,
  fallbackUrl,
  label,
}: DownloadButtonProps) {
  const initialState = useMemo(() => getInitialDownloadState(status, fallbackUrl), [fallbackUrl, status]);
  const [state, setState] = useState<DownloadState>(initialState);

  useEffect(() => {
    if (status !== "available") {
      setState(initialState);
      return;
    }

    let cancelled = false;

    async function loadRelease() {
      try {
        const response = await fetch(repoApiUrl(repo), {
          headers: { Accept: "application/vnd.github+json" },
        });

        if (!response.ok) {
          throw new Error("Release not available");
        }

        const release = (await response.json()) as ReleaseResponse;
        const platform = detectPlatform(window.navigator.userAgent);
        const href = selectReleaseAsset(release.assets ?? [], platform, assetPatterns);

        if (!cancelled && href) {
          setState({ kind: "download", label, href });
        } else if (!cancelled) {
          setState({
            kind: "source",
            label: "View release",
            href: release.html_url ?? fallbackUrl,
          });
        }
      } catch {
        if (!cancelled) {
          setState(initialState);
        }
      }
    }

    void loadRelease();

    return () => {
      cancelled = true;
    };
  }, [assetPatterns, fallbackUrl, initialState, label, repo, status]);

  const Icon = state.kind === "coming-soon" ? Clock : state.kind === "source" ? ExternalLink : Download;
  const className =
    state.kind === "coming-soon"
      ? "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[rgba(210,138,85,0.28)] bg-[rgba(210,138,85,0.1)] px-4 text-sm font-bold text-[#ffd4ac]"
      : "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#58c7c9] px-4 text-sm font-black text-[#031115] shadow-sm shadow-[#58c7c9]/20 transition hover:bg-[#7ee0df]";

  if (state.kind === "coming-soon") {
    return (
      <button className={className} disabled type="button" aria-label="Download coming soon">
        <Icon size={17} aria-hidden="true" />
        <span>{state.label}</span>
      </button>
    );
  }

  return (
    <a className={className} href={state.href} target="_blank" rel="noreferrer">
      <Icon size={17} aria-hidden="true" />
      <span>{state.label}</span>
    </a>
  );
}
