#!/bin/bash

# Verify Docker Services for Cryage Project
echo "Verifying Docker services for Cryage Project..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Please install Docker and docker-compose."
    exit 1
fi

# Start services
echo "Starting services..."
docker-compose up -d
echo "Waiting for services to start (10 seconds)..."
sleep 10

# Check service status
echo "Checking service status..."
if docker-compose ps | grep -q "backend.*Up"; then
  echo "✅ Backend service is running"
else
  echo "❌ Backend service is not running"
fi

if docker-compose ps | grep -q "frontend.*Up"; then
  echo "✅ Frontend service is running"
else
  echo "❌ Frontend service is not running"
fi

if docker-compose ps | grep -q "redis.*Up"; then
  echo "✅ Redis service is running"
else
  echo "❌ Redis service is not running"
fi

# Test backend health endpoint
echo "Testing backend health endpoint..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
  echo "✅ Backend health check passed"
else
  echo "❌ Backend health check failed"
fi

# Test frontend accessibility
echo "Testing frontend accessibility..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [[ $HTTP_STATUS -ge 200 && $HTTP_STATUS -lt 400 ]]; then
  echo "✅ Frontend is accessible (HTTP status: $HTTP_STATUS)"
else
  echo "❌ Frontend is not accessible (HTTP status: $HTTP_STATUS)"
fi

# Test Redis connection
echo "Testing Redis connectivity..."
if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
  echo "✅ Redis connectivity check passed"
else
  echo "❌ Redis connectivity check failed"
fi

# Test backend hot-reloading
echo "Testing backend hot-reloading..."
# Create a temporary test file to trigger hot-reloading
TEST_FILE="cryage_backend/app/test_file.py"
echo "# Test file for hot-reloading" > $TEST_FILE
sleep 5
if docker-compose logs backend | grep -q "Detected change in"; then
  echo "✅ Backend hot-reloading test passed"
  rm $TEST_FILE
else
  echo "❌ Backend hot-reloading test failed"
  rm $TEST_FILE
fi

echo "Note: Frontend hot-reloading needs to be tested manually by making a change to a frontend file and observing the update."

# Summary
echo ""
echo "==== Services Verification Summary ===="
if docker-compose ps | grep -q "Up" && curl -s http://localhost:8000/health | grep -q "healthy" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "2"; then
  echo "✅ All services are running correctly!"
else
  echo "❌ Some services have issues. Please check the logs above."
fi

# Ask if user wants to stop services
read -p "Do you want to stop the Docker services? (y/n) " STOP_SERVICES
if [[ $STOP_SERVICES == "y" ]]; then
  echo "Stopping services..."
  docker-compose down
fi

# Exit with appropriate status code
if docker-compose ps | grep -q "Up" && curl -s http://localhost:8000/health | grep -q "healthy" && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "2"; then
    exit 0
else
    exit 1
fi
