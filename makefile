GECKODRIVER_VERSION := v0.34.0
GECKODRIVER_URL := https://github.com/mozilla/geckodriver/releases/download/$(GECKODRIVER_VERSION)/geckodriver-$(GECKODRIVER_VERSION)-linux64.tar.gz
GECKODRIVER_FOLDER := /tmp
GECKODRIVER_PATH := ${GECKODRIVER_FOLDER}/geckodriver

#---- Testing -------------------------------------------------------------------------------------

# Run Rust tests in release mode with output shown
_test:
	cargo test --release -- --nocapture
test:
	RUSTFLAGS="-C target-cpu=native" make _test
test_avx512:
	RUSTFLAGS="-C target-feature=+avx512f" make _test

_test_wasm:
	# Remove previous builds
	rm -r ./target/wasm* || true

	# Download geckodriver if not already in /tmp
	@test -f /tmp/geckodriver || ( \
		wget -O /tmp/geckodriver.tar.gz ${GECKODRIVER_URL} && \
		tar -xzf /tmp/geckodriver.tar.gz -C ${GECKODRIVER_FOLDER} && \
		chmod +x ${GECKODRIVER_PATH} \
	)

	# Build wasm tests
	cargo test build --release --target wasm32-unknown-unknown --no-run

	@WASM_FILE=$$(find target/wasm32-unknown-unknown/release -name 'test_wasm*.wasm' | head -n 1); \
	if [ -z "$$WASM_FILE" ]; then \
		echo "No wasm test file found!"; \
		exit 1; \
	fi; \
	echo "Found wasm file: $$WASM_FILE"; \
	GECKODRIVER=/tmp/geckodriver wasm-bindgen-test-runner $$WASM_FILE --nocapture
test_wasm:
	RUSTFLAGS="-C target-feature=+simd128,+bulk-memory" make _test_wasm

test_matrix:
	cargo test test_matrix --release -- --nocapture

#---- Building -------------------------------------------------------------------------------------

_build_wasm:
	wasm-pack build --target web --release
	cp ./pkg/tripperjs_wasm_bg.wasm ./page/assets/
	cp ./pkg/tripperjs_wasm.js      ./page/assets/
	rm -r ./pkg
build_wasm:
	RUSTFLAGS="-C target-feature=+simd128,+bulk-memory" make _build_wasm

_build_wasm_debug:
	wasm-pack build --target web --debug
	cp ./pkg/tripperjs_wasm_bg.wasm ./page/assets/
	cp ./pkg/tripperjs_wasm.js      ./page/assets/
	rm -r ./pkg
build_wasm_debug:
	RUSTFLAGS="-C target-feature=+simd128,+bulk-memory" make _build_wasm_debug

#---- Profiling -----------------------------------------------------------------------------------

profile:
	sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
	@bash -c '\
		test_bin=$$(cargo test --all-targets --no-run --message-format=json \
			| grep -oP '"'"'"executable":"\K[^"]+'"'"' \
			| grep test-) && \
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" test_performance_64 && \
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
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" test_performance_64 && \
		perf script -i perf.data > out.folded && \
		perf report && \
		rm -f perf.data perf.data.old out.folded \
	'

profile_matrix:
	sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
	@bash -e -o pipefail -c '\
		# Find the test binary for test_matrix_transposition \
		test_bin=$$(cargo test --no-run --message-format=json \
			| jq -r "select(.profile.test == true) | select(.target.name == \"test_matrix_transposition\") | .executable" \
		) && \
		if [ -z "$$test_bin" ]; then \
			echo "Error: no test_matrix_transposition executable found" >&2; exit 1; \
		fi; \
		echo "Using test binary: $$test_bin" && \
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" -- test_matrix_transposition_performance && \
		perf script -i perf.data > out.folded && \
		perf report && \
		rm -f perf.data perf.data.old out.folded \
	'

profile_matrix_release:
	sudo sh -c 'echo 1 > /proc/sys/kernel/perf_event_paranoid'
	@bash -e -o pipefail -c '\
		# Find the test binary for test_matrix_transposition \
		test_bin=$$(cargo test --release --no-run --message-format=json \
			| jq -r "select(.profile.test == true) | select(.target.name == \"test_matrix_transposition\") | .executable" \
		) && \
		if [ -z "$$test_bin" ]; then \
			echo "Error: no test_matrix_transposition executable found" >&2; exit 1; \
		fi; \
		echo "Using test binary: $$test_bin" && \
		perf record -e cycles,instructions,cache-references,cache-misses "$$test_bin" -- test_matrix_transposition_performance && \
		perf script -i perf.data > out.folded && \
		perf report && \
		rm -f perf.data perf.data.old out.folded \
	'
