const { Readable } = require('stream')

const Chance = require('chance')
const chance = new Chance()

function simulateLLMStream() {
    return new Readable({
        read(size) {
            const chunk = chance.string({length: 130})
            this.push(chunk+ ' ')

            if (Math.random() < 0.5) {
                this.push(null)
            }
        }
    })
}

module.exports = simulateLLMStream