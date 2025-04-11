#!/bin/bash

# Function to kill background processes
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to catch SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Start the Flask backend
echo "Starting Flask backend..."
cd part4/hbnb_backend
python3 run.py &

# Wait for the Flask backend to start
echo "Waiting for Flask backend to start..."
sleep 5

# Start the proxy server
echo "Starting proxy server..."
cd ../..
node proxy-server.js &

# Wait for all background processes to finish
wait 