# Node.js Cluster + Worker Threads + Streams

## Description

This project demonstrates how to build a Node.js backend service using:
- **Cluster**: to handle HTTP requests on multiple CPU cores.
- **Worker Threads**: for handling CPU-bound tasks without blocking the event loop.
- **Streams**: to process data efficiently using readable streams.

## Installation
1. Clone the repository.
2. Run `npm install` to install the necessary dependencies.

## Usage
1. Start the server: `npm start`
2. Send a request to `http://localhost:8000/process` to trigger the CPU task followed by reading from a simulated stream.

## Notes
- The CPU task is a simple loop (sum of numbers), offloaded to a worker thread.
- The simulated LLM client generates random 130-character strings with a 50% chance of stopping.

