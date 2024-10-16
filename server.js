const cluster = require('cluster')
const os = require('os')

const express = require('express')
const { Worker } = require('worker_threads')

const simulateLLMStream = require('./simulateLLMStream.js')

if (cluster.isMaster) {
    const numCPUs = os.cpus().length

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.id} died`)
    })
} else {
    const app = express()

    app.get('/process', (req, res) => {
        // Step 1: Perform CPU intensive task
        const worker = new Worker('./cpuWorker.js')

        worker.on('message', (cpuResult) => {
            console.log(`CPU task result: ${cpuResult}, handled by pid: ${process.pid}`)

            // Step 2: After CPU task, start streaming from the LLM component
            const llmStream = simulateLLMStream()
            llmStream.pipe(res)
        })

        worker.postMessage('start')
    })

    app.listen(18208, () => {
        console.log(`Worker ${process.pid} started, listening on port 18208`)
    })
}