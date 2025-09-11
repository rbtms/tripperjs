# Makefile
GECKODRIVER_VERSION := v0.34.0
GECKODRIVER_URL := https://github.com/mozilla/geckodriver/releases/download/$(GECKODRIVER_VERSION)/geckodriver-$(GECKODRIVER_VERSION)-linux64.tar.gz
GECKODRIVER_TMP := /tmp/geckodriver

# Run Rust tests in release mode with output shown
test:
	RUSTFLAGS="-C target-cpu=native" cargo test --release -- --nocapture

test_avx512:
	RUSTFLAGS="-C target-feature=+avx512f" make test

test_wasm:
	# Download geckodriver if not already in /tmp
	@test -f /tmp/geckodriver || ( \
		wget -O /tmp/geckodriver.tar.gz https://github.com/mozilla/geckodriver/releases/download/v0.34.0/geckodriver-v0.34.0-linux64.tar.gz && \
		tar -xzf /tmp/geckodriver.tar.gz -C /tmp && \
		chmod +x /tmp/geckodriver \
	)

	# Build wasm tests (without running)
	cargo test build --release --target wasm32-unknown-unknown --no-run

	@WASM_FILE=$$(find target/wasm32-unknown-unknown/release -name 'test*.wasm' | head -n 1); \
	if [ -z "$$WASM_FILE" ]; then \
		echo "No wasm test file found!"; \
		exit 1; \
	fi; \
	echo "Found wasm file: $$WASM_FILE"; \
	GECKODRIVER=/tmp/geckodriver wasm-bindgen-test-runner $$WASM_FILE --nocapture

test_wasm_simd128:
	RUSTFLAGS="-C target-cpu=native -C target-feature=+simd128" make test_wasm

# Build wasm for web
build_wasm:
	wasm-pack build --target web
	cp ./pkg/tripperjs_wasm_bg.wasm ./page/assets/
	cp ./pkg/tripperjs_wasm.js      ./page/assets/
	rm -r ./pkg

build_wasm_simd128:
	RUSTFLAGS="-C target-cpu=native -C target-feature=+simd128" make build_wasm

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