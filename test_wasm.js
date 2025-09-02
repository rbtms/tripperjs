import init from './pkg/tripperjs_wasm.js';

async function main() {
    //init.run_1000_iterations();
    let a = init.crypt3('password', 'password');
    console.log(a);
}

main();
