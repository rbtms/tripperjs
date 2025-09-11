/**
 * Imports the WebAssembly initialization function and the tripcode iteration runner.
 */
import wasmInit, { run_x_iterations, run_x_iterations_64 } from './tripperjs_wasm.js';

let wasmReady = false;

/**
 * Initializes the WebAssembly module if not already initialized.
 * Ensures wasmInit is only called once.
 * @returns {Promise<void>}
 */
async function initWasm() {
    if (!wasmReady) {
      await wasmInit();
      wasmReady = true;
    }
}

/**
 * Main message handler for the worker.
 * Listens for start requests with regex + iteration count, initializes WASM, 
 * and runs tripcode iterations in a loop until stopped.
 * 
 * @param {MessageEvent} e - Message containing:
 *   @param {string} e.data.regex - Regex string to search
 *   @param {number} e.data.iterPerBatch - Iterations per batch
 */
onmessage = async (e) => {
    const { regex, iterPerBatch } = e.data;
    await initWasm();
    let active = true;

    /**
     * Inner message handler for stop requests.
     * When receiving 'stop', it breaks the active loop.
     * 
     * @param {MessageEvent} msg - Message containing 'stop' command
     */
    self.onmessage = (msg) => {
      if (msg.data === 'stop') active = false;
    };

    /**
     * While active, repeatedly runs tripcode iterations and posts results back to the main thread.
     * Uses a short delay between batches to avoid blocking the event loop.
     * 
     * Posts back an object:
     * {
     *   batch: Array<[string, string]>, // Array of [password, tripcode]
     *   iterations: number              // Number of iterations processed
     * }
     */
    while (active) {
      const batch = await run_x_iterations_64(iterPerBatch, regex);
      postMessage({ batch: Array.from(batch.entries()), iterations: iterPerBatch*64 });
      //await new Promise(r => setTimeout(r, 10));
    }
};
