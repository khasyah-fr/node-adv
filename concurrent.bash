#Send 10 request concurrently

for i in {1..10}; do
    curl -s http://localhost:18208/process &
done
wait