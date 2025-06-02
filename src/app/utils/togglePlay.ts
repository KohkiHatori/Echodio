export function togglePlay(
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setOverlayIcon: (v: 'play' | 'pause' | null) => void
) {
  setIsPlaying((prev) => {
    const next = !prev;
    setOverlayIcon(next ? 'play' : 'pause');
    setTimeout(() => setOverlayIcon(null), 1000);
    return next;
  });
}