
const assert = require('assert');
const js     = require('../app/js/worker.js');


async function instantiate(path) {
  const fs = require('fs');
  const buf = fs.readFileSync(path);

  return await WebAssembly.instantiate(buf, {
    main: {
      sayHello() {
        console.log('Hello from WebAssembly!');
      }
          },
      env: {
        abort(msg, file, line, column) {
          console.error('abort');
        }
      }
  });
}
  
function read_mem(mem, off) {
  let digest = '';

  for(let i = 0; i < 13; i++)
    digest += String.fromCharCode( mem[20000 + off*13 + i] );

  return digest;
}

// Initial length 16384 (64kb)
// JS   : 5.7s
// WASM : 6.8s
describe('JS', function() {
  this.timeout(10000);

  it('Is correct', function() {
    const hash = 'abYH7TYgEKz2Q';
    const _hash = js.main(1);
    assert.equal( _hash, hash );
  });
  
  it('100.000 runs', function() {
    js.main(100000);
  });
});

describe('WASM', async function() {
  let wasm, mem;
  this.timeout(10000);

  before( async function() {
    const path = 'app/bin/worker.wasm';
    const obj  = await instantiate(path);
    wasm = obj.instance.exports;

    wasm.memory.grow(100);
    mem = new Int8Array(wasm.memory.buffer);
  });

  it('Is correct', function() {
    const hash = 'abYH7TYgEKz2Q';
    wasm.main(1);
    assert.equal( read_mem(mem, 0), hash );
  });
  
  it('100.000 runs', function() {
    wasm.main(100000);
  });
});


