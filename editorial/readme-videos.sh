#!/bin/bash
# 给仓库首页 README 压三段影片。README 里能播放的视频，只能是在 GitHub 网页上传的附件，
# 免费账号每个不能超过 10MB；GitHub 的播放器也不能另设封面，只显示视频的第一帧。
# 所以这里把第一帧换成网站用的封面图，其余逐帧不动、声音不动，再按时长算码率，压到 9MB 上下。
#
#     bash editorial/readme-videos.sh [输出文件夹]
#
# 需要带 libx264 的 ffmpeg。换了影片或封面之后运行，把压出来的文件传到 GitHub（拖进 issue #1 的评论框，
# 发出评论，链接才不会失效），再把新链接换进 README。
set -e
cd "$(dirname "$0")/.."
A=dist/assets
OUT="${1:-${TMPDIR:-/tmp}/portfolio-readme-videos}"
mkdir -p "$OUT"

# $1 源片  $2 封面图（和 build.py 里影片的 poster 一致）  $3 输出名  $4 宽  $5 高
encode() {
  local dur kbps log="$OUT/pass-$3"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$A/$1")
  kbps=$(awk -v d="$dur" 'BEGIN { printf "%d", 9.0e6 * 8 / d / 1000 - 138 }')  # 声音 128k，另留一点封装的余量
  local fc="[1:v]scale=$4:$5:flags=lanczos,setsar=1,format=yuv420p,trim=end_frame=1,setpts=PTS-STARTPTS[p];[0:v]fps=30,scale=$4:$5:flags=lanczos,setsar=1,format=yuv420p,trim=start_frame=1,setpts=PTS-STARTPTS[r];[p][r]concat=n=2:v=1:a=0[v]"
  local x264=(-c:v libx264 -preset veryslow -profile:v high -pix_fmt yuv420p -b:v "${kbps}k")
  ffmpeg -v error -y -i "$A/$1" -loop 1 -framerate 30 -t 1 -i "$A/$2" -filter_complex "$fc" -map "[v]" "${x264[@]}" -pass 1 -passlogfile "$log" -an -f null /dev/null
  ffmpeg -v error -y -i "$A/$1" -loop 1 -framerate 30 -t 1 -i "$A/$2" -filter_complex "$fc" -map "[v]" -map 0:a:0 "${x264[@]}" -pass 2 -passlogfile "$log" -c:a aac -b:a 128k -movflags +faststart "$OUT/$3.mp4"
  rm -f "$log"*
  local size; size=$(wc -c < "$OUT/$3.mp4" | tr -d ' ')
  echo "$OUT/$3.mp4  $((size / 1000)) KB$( [ "$size" -ge 10000000 ] && echo '  超过 10MB，GitHub 免费账号传不上去，把 9.0e6 调小再压')"
}

# Astra 原片是 4K、每秒 60 帧，README 里用 720p、每秒 30 帧，同样大小下画面更干净
encode canvasflow-film.mp4 grow.webp CanvasFlow 1600 900 &
encode agent-film-v9.mp4 astra-film-poster.png Astra 1280 720 &
encode co-thinker-film.mp4 co-thinker-poster.webp Co-Thinker 1600 900 &
wait
