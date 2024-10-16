const { parentPort } = require('worker_threads')

parentPort.on('message', (msg) => {
    if (msg === 'start') {
        // Simulate CPU expensive task
        let result = 0
        for (let i = 0; i < 1000; i++) {
            result += i
        }

        parentPort.postMessage(result)
    }
})