const { parentPort } = require('worker_threads')

// Listen for messages from the main thread
parentPort.on('message', (msg) => {
    if (msg === 'start') {
        // This block runs when the main thread sends the message 'start'
        try {
            // Simulate CPU expensive task
            let result = 0
            for (let i = 0; i < 1500; i++) {
                result += i
            }

            // Send result back to the main thread
            parentPort.postMessage(result)
        } catch (error) {
            // If any error occurs, throw error event to the main thread
            throw error
        }
    }
})