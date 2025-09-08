import wasmInit, { run_x_iterations } from './tripperjs_wasm.js';

class TripcodeResultList {
  /**
   * TripcodeResultList constructor
   * Creates a container to display tripcode results for a given regex.
   * @param {string} regexStr - The regex being searched
   * @param {HTMLElement} parentEl - Parent element to attach the results container
   */
  constructor(regexStr, parentEl) {
    this.regexStr = regexStr;
    this.matches = new Map();
    this.collapsed = false;
    this.parentEl = parentEl;
    this.createUI();
  }


  /**
   * Builds the HTML structure for the results container and appends it to the parent.
   */
  createUI() {
    this.container = document.createElement('div');
    this.container.className = 'results';

    this.header = document.createElement('div');
    this.header.className = 'results-header';
    this.header.innerHTML = `<strong>${this.regexStr}</strong>`;

    this.toggleBtn = document.createElement('button');
    this.toggleBtn.textContent = 'Collapse';
    this.toggleBtn.style.float = 'right';
    this.toggleBtn.onclick = () => this.toggleCollapse();

    this.header.appendChild(this.toggleBtn);
    this.container.appendChild(this.header);

    this.matchesEl = document.createElement('div');
    this.matchesEl.className = 'matches';
    this.container.appendChild(this.matchesEl);

    this.parentEl.appendChild(this.container);
  }

  /**
   * Adds a batch of tripcode matches to the container and renders them if not collapsed.
   * @param {Array} batch - Array of [password, tripcode] matches
   */
  addMatches(batch) {
    for (const [pwd, trip] of batch) {
      if (!this.matches.has(pwd)) {
        this.matches.set(pwd, trip);
        const div = document.createElement('div');
        div.className = 'tripcode';
        div.textContent = `${pwd} → ${trip}`;
        if (!this.collapsed) this.matchesEl.appendChild(div);
      }
    }
  }

  /**
   * Collapses or expands the results display.
   */
  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.toggleBtn.textContent = this.collapsed ? 'Expand' : 'Collapse';
    if (this.collapsed) {
      this.matchesEl.style.display = 'none';
    } else {
      this.matchesEl.style.display = '';
      this.matchesEl.innerHTML = '';
      for (const [pwd, trip] of this.matches.entries()) {
        const div = document.createElement('div');
        div.className = 'tripcode';
        div.textContent = `${pwd} → ${trip}`;
        this.matchesEl.appendChild(div);
      }
    }
  }
}

class TripcodeSearchUI {
  /**
   * TripcodeSearchUI constructor
   * Creates the UI for a single search, including speed and worker controls.
   * @param {string} regexStr - Regex for this search
   * @param {TripcodeSearch} parent - Reference to the parent search object
   */
  constructor(regexStr, parent) {
    this.regexStr = regexStr;
    this.parent = parent;
    this.entryEl = null;
    this.speedEl = null;
    this.workerCountEl = null;

    this.createUI();
  }


  /**
   * Builds the HTML for the search entry, binds buttons for add/remove worker and remove search.
   */
  createUI() {
    this.entryEl = document.createElement('div');
    this.entryEl.className = 'search-entry';
    this.entryEl.innerHTML = `
    <div class="search-title">
      <strong>${this.regexStr}</strong>       <div class="search-buttons"><button class="add-worker">+</button>
      <button class="remove-worker">-</button><button class="remove-search">Remove</button></div></div>
      <span class="speed">0</span> tripcodes / s
      <br>
      Threads: <span class="worker-count">0</span>
    `;

    document.getElementById('active-searches').appendChild(this.entryEl);

    this.speedEl = this.entryEl.querySelector('.speed');
    this.workerCountEl = this.entryEl.querySelector('.worker-count');

    // Bind buttons properly
    this.entryEl.querySelector('button').onclick = () => this.parent.remove();
    this.entryEl.querySelector('.add-worker').onclick = () => this.parent.addWorker();
    this.entryEl.querySelector('.remove-worker').onclick = () => this.parent.removeWorker();
    this.entryEl.querySelector('.remove-search').onclick = () => this.parent.remove();

    this.updateWorkerCount(this.parent.workers.length);
  }

  /**
   * Updates the speed display.
   * @param {number} speed - Iterations per second
   */
  updateSpeed(speed) {
    this.speedEl.textContent = new Intl.NumberFormat().format(speed);
  }

  /**
   * Updates the worker count display.
   * @param {number} count - Number of active workers
   */
  updateWorkerCount(count) {
    this.workerCountEl.textContent = count;
  }

  /**
   * Removes the search entry from the DOM.
   */
  remove() {
    this.entryEl.remove();
  }
}

class TripcodeSearch {
  /**
   * TripcodeSearch constructor
   * Manages workers and results for a single regex search.
   * @param {string} regexStr - Regex for this search
   */
  constructor(regexStr) {
    this.regexStr = regexStr;
    this.totalIterations = 0;
    this.lastUpdate = performance.now();
    this.workers = []; // Initialize BEFORE creating UI

    const resultsParent = document.getElementById('results');
    this.ui = new TripcodeSearchUI(this.regexStr, this);
    this.results = new TripcodeResultList(this.regexStr, resultsParent);

    this.addWorker(); // start the first worker automatically
  }

  /**
   * Adds a new worker to this search and starts it.
   */
  addWorker() {
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const { batch, iterations } = e.data;
      this.totalIterations += iterations;
      this.results.addMatches(batch);
      this.updateSpeed();
    };
    worker.postMessage({ regex: this.regexStr, iterPerBatch: 50_000 });
    this.workers.push(worker);
    this.ui.updateWorkerCount(this.workers.length);
  }

  /**
   * Removes a worker from this search and terminates it.
   */
  removeWorker() {
    if (this.workers.length === 0) return;
    const worker = this.workers.pop();
    worker.terminate();
    this.ui.updateWorkerCount(this.workers.length);
  }

  /**
   * Updates the speed display based on iterations processed.
   */
  updateSpeed() {
    const now = performance.now();
    if (now - this.lastUpdate >= 1000) {
      const seconds = (now - this.lastUpdate) / 1000;
      const speed = Math.round(this.totalIterations / seconds) || 0;
      this.ui.updateSpeed(speed);
      this.totalIterations = 0;
      this.lastUpdate = now;
    }
  }

  /**
   * Terminates all workers and removes the search UI and results.
   */
  remove() {
    for (const w of this.workers) w.terminate();
    this.workers = [];
    this.ui.remove();
    this.results.container.remove();
    TripcodeSearch.searches.delete(this.regexStr);
  }

  /**
   * Creates a new search or adds a worker to an existing one.
   * @param {string} regexStr - Regex for the search
   */
  static createSearch(regexStr) {
    if (!TripcodeSearch.searches.has(regexStr)) {
      const search = new TripcodeSearch(regexStr);
      TripcodeSearch.searches.set(regexStr, search);
    } else {
      // Add worker to existing search
      TripcodeSearch.searches.get(regexStr).addWorker();
    }
  }
}

TripcodeSearch.searches = new Map();

// Form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('regex-input');

  form.onsubmit = e => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) TripcodeSearch.createSearch(val);
    input.value = '';
  };
});

// Initialize WASM module
let wasmReady = false;
(async () => {
  await wasmInit();
  wasmReady = true;
})();
