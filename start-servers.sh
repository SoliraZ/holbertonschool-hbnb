#!/bin/bash

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
node proxy-server.js 