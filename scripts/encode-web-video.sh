#!/usr/bin/env bash
# Encode a raw product capture into the site's web-video pair + poster.
#
#   scripts/encode-web-video.sh <input> <slug> [poster_seconds]
#
#   scripts/encode-web-video.sh videos/firstvid.mp4 film
#     → assets/video/film.av1.mp4     AV1 10-bit, the primary source (~smallest)
#     → assets/video/film.mp4         H.264 fallback for older browsers
#     → assets/video/film-poster.jpg  poster frame (default: 1s in)
#
# Settings were tuned 2026-07-30 against real footage with VMAF:
#   AV1  (SVT-AV1 preset 3, CRF 43, 10-bit) → VMAF ~95, ~85% smaller than source
#   H.264 (x264 veryslow, CRF 26)           → VMAF ~94 fallback
# Audio is always stripped; these clips autoplay muted.
#
# Requires ffmpeg (brew install ffmpeg).
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: $0 <input> <slug> [poster_seconds]" >&2
  exit 1
fi

IN="$1"
SLUG="$2"
POSTER_AT="${3:-1}"
OUTDIR="$(cd "$(dirname "$0")/.." && pwd)/assets/video"
mkdir -p "$OUTDIR"

# Downscale anything larger than 1080p; never upscale. Pad-safe even heights.
SCALE="scale='min(1920,iw)':-2"

echo "→ AV1 (primary)…"
ffmpeg -y -v warning -i "$IN" -an -map_metadata -1 \
  -vf "$SCALE" \
  -c:v libsvtav1 -preset 3 -crf 43 -pix_fmt yuv420p10le -g 240 \
  -svtav1-params tune=0 \
  -movflags +faststart \
  "$OUTDIR/$SLUG.av1.mp4"

echo "→ H.264 (fallback)…"
ffmpeg -y -v warning -i "$IN" -an -map_metadata -1 \
  -vf "$SCALE,scale=in_range=auto:out_range=tv" \
  -c:v libx264 -preset veryslow -crf 26 -pix_fmt yuv420p -profile:v high \
  -movflags +faststart \
  "$OUTDIR/$SLUG.mp4"

echo "→ Poster @ ${POSTER_AT}s…"
ffmpeg -y -v warning -ss "$POSTER_AT" -i "$IN" -frames:v 1 -update 1 \
  -vf "$SCALE" -q:v 4 \
  "$OUTDIR/$SLUG-poster.jpg"

echo
echo "Done. Sizes:"
ls -la "$OUTDIR/$SLUG.av1.mp4" "$OUTDIR/$SLUG.mp4" "$OUTDIR/$SLUG-poster.jpg" | awk '{printf "  %-60s %8.2f MB\n", $9, $5/1048576}'
echo
echo "Markup (swap into the matching .film-frame in index.html):"
cat <<HTML
  <video class="film-video" poster="/assets/video/$SLUG-poster.jpg"
         autoplay muted loop playsinline>
    <source src="/assets/video/$SLUG.av1.mp4" type='video/mp4; codecs="av01.0.08M.10"'>
    <source src="/assets/video/$SLUG.mp4" type="video/mp4">
  </video>
HTML
