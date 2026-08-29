import { Clock, Download, ExternalLink, Laptop, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  detectPlatform,
  getInitialDownloadState,
  getLatestReleasePageUrl,
  getReleaseFallbackState,
  loadLatestRelease,
  resolveReleaseDownloadState,
  supportsPlatform,
  type DownloadState,
  type ReleaseAssetRules,
  type ReleaseStatus,
} from "../lib/download";

type DownloadButtonProps = {
  repo: string;
  status: ReleaseStatus;
  assetRules: ReleaseAssetRules;
  label: string;
};

export default function DownloadButton({
  repo,
  status,
  assetRules,
  label,
}: DownloadButtonProps) {
  const initialState = useMemo(() => getInitialDownloadState(status), [status]);
  const releasePageUrl = useMemo(() => getLatestReleasePageUrl(repo), [repo]);
  const [state, setState] = useState<DownloadState>(initialState);

  useEffect(() => {
    if (status !== "available") {
      setState(initialState);
      return;
    }

    const platform = detectPlatform(window.navigator.userAgent);

    if (!supportsPlatform(platform, assetRules)) {
      setState({
        kind: "unsupported",
        label: "Available for Windows only",
        href: null,
      });
      return;
    }

    setState(initialState);
    let cancelled = false;

    async function loadRelease() {
      try {
        const release = await loadLatestRelease(repo);

        if (!cancelled) {
          setState(
            resolveReleaseDownloadState(release, platform, assetRules, label, releasePageUrl),
          );
        }
      } catch {
        if (!cancelled) {
          setState(getReleaseFallbackState(releasePageUrl));
        }
      }
    }

    void loadRelease();

    return () => {
      cancelled = true;
    };
  }, [assetRules, initialState, label, releasePageUrl, repo, status]);

  const Icon =
    state.kind === "coming-soon"
      ? Clock
      : state.kind === "loading"
        ? LoaderCircle
        : state.kind === "unsupported"
          ? Laptop
          : state.kind === "source"
            ? ExternalLink
            : Download;
  const isDisabled =
    state.kind === "coming-soon" || state.kind === "loading" || state.kind === "unsupported";
  const className =
    isDisabled
      ? "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[rgba(210,138,85,0.28)] bg-[rgba(210,138,85,0.1)] px-4 text-sm font-bold text-[#ffd4ac]"
      : "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#58c7c9] px-4 text-sm font-black text-[#031115] shadow-sm shadow-[#58c7c9]/20 transition hover:bg-[#7ee0df]";

  if (isDisabled) {
    return (
      <button className={className} disabled type="button" aria-label={state.label} aria-live="polite">
        <Icon
          className={state.kind === "loading" ? "animate-spin" : undefined}
          size={17}
          aria-hidden="true"
        />
        <span>{state.label}</span>
      </button>
    );
  }

  if (state.kind === "source") {
    return (
      <a className={className} href={state.href} target="_blank" rel="noreferrer">
        <Icon size={17} aria-hidden="true" />
        <span>{state.label}</span>
      </a>
    );
  }

  return (
    <a className={className} href={state.href}>
      <Icon size={17} aria-hidden="true" />
      <span>{state.label}</span>
    </a>
  );
}
