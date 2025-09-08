# Makefile

# Run Rust tests in release mode with output shown
test:
	cargo test --release -- --nocapture

# Run custom bash profile script
profile:
	bash profile_rust_test.sh

test_wasm:
	wasm-pack test --firefox --headless

# Build wasm for web
build_wasm:
	wasm-pack build --target web
	cp ./pkg/tripperjs_wasm_bg.wasm ./page/assets/
	cp ./pkg/tripperjs_wasm.js      ./page/assets/
	rm -r ./pkg

# Build wasm for Node.js and copy the .wasm file
build_wasm_node:
	wasm-pack build --target nodejs
	mv ./pkg/tripperjs_wasm_bg.wasm ./page/assets/
	mv ./pkg/tripperjs_wasm.js      ./page/assets/
	rm -r ./pkg

profile:
	sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
	@bash -c '\
		test_bin=$$(cargo test --all-targets --no-run --message-format=json \
			| grep -oP '"'"'"executable":"\K[^"]+'"'"' \
			| grep test-) && \
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" && \
		perf script -i perf.data > out.folded && \
		perf report && \
		rm -f perf.data perf.data.old out.folded \
	'
profile_release:
	sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
	@bash -c '\
		test_bin=$$(cargo test --release --all-targets --no-run --message-format=json \
			| grep -oP '"'"'"executable":"\K[^"]+'"'"' \
			| grep test-) && \
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" && \
		perf script -i perf.data > out.folded && \
		perf report && \
		rm -f perf.data perf.data.old out.folded \
	'
