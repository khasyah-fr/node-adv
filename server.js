const cluster = require('cluster')
const os = require('os')

const express = require('express')
const { Worker } = require('worker_threads')

const simulateLLMStream = require('./simulateLLMStream.js')

// Check if the current process is the master process
if (cluster.isMaster) {
    const numCPUs = os.cpus().length

    // Create a new worker process for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    // Event listener for when a worker process exits
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.id} died`)

        // Create a new worker process to replace it
        cluster.fork()
    })
} else {
    // This block runs inside each worker process

    const app = express()

    app.get('/process', (req, res) => {
        // Step 1: Perform CPU intensive task

        // Create a new worker thread that will run 'cpuWorker.js'
        const worker = new Worker('./cpuWorker.js')

        // When the worker thread finishes its task and sends a message back, this listener is triggered
        worker.on('message', (cpuResult) => {
            console.log(`CPU task result: ${cpuResult}, handled by pid: ${process.pid}`)

            // Step 2: After CPU task, start streaming from the LLM component
            const llmStream = simulateLLMStream()

            // Error handling for the LLM stream: If any error occurs while streaming
            llmStream.on('error', (error) => {
                console.error(`Error in LLM stream: ${error.message}`)
                res.status(500).send('Error occurred during stream')
            })

            // Pipe the LLM stream's data directly into the HTTP response
            llmStream.pipe(res)
        })

        // If an error occurs in the worker thread, this listener is triggered
        worker.on('error', (error) => {
            console.error(`Worker error: ${error.message}`)
            res.status(500).send('CPU worker encountered an error')
        })

        // If the worker thread exits unexpectedly, this listener is triggered
        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`)
                res.status(500).send('CPU worker failed unexpectedly')
            }
        })

        // Start the worker by sending it a message (in this case, 'start')
        worker.postMessage('start')
    })

    // Error handling for uncaught exceptions within the Express app
    app.use((err, req, res, next) => {
        console.error(`Unhandled error: ${err.message}`)
        res.status(500).send('An unexpected error occurred')
    })

    app.listen(18208, () => {
        console.log(`Worker ${process.pid} started, listening on port 18208`)
    })
}