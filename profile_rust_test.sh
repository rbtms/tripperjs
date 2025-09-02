sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
test_bin=$(cargo test --release --all-targets --no-run --message-format=json \
  | grep -oP '"executable":"\K[^"]+' \
  | grep test-)
perf record -e cycles,instructions,cache-references,cache-misses "$test_bin"
perf script -i perf.data > out.folded
perf report

rm perf.data
rm perf.data.old
rm out.folded
