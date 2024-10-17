const { Readable } = require('stream')

const Chance = require('chance')
const chance = new Chance()

function simulateLLMStream() {
    return new Readable({
        // The 'read' function is called by Node.js whenever the stream wants more data
        read(size) {
            try {
                // Generate random string of length 130
                const chunk = chance.string({length: 130})

                // Push the generated chunk into the stream buffer which makes it available for consumption
                this.push(chunk+ ' ')

                // Randomly end the stream with a 25% probability
                if (Math.random() < 0.5) {
                    // Pushing 'null' signals that the stream has ended
                    this.push(null)
                }
            } catch (error) {
                // If an error occurs, emit an 'error' event
                this.emit('error', new Error(`Failed to generate chunk: ${error.message} `))
            }
        }
    })
}

module.exports = simulateLLMStream