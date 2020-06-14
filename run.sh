(docker network create --attachable galaxyvictor_network || true ) &&

(docker container rm gv-server-galaxy -f || true ) &&


docker build --rm -f "Dockerfile" -t binarysearch/gv-server-galaxy:latest . &&
docker run -p 3002:3002 -e LISTEN_PORT=3002 -e PIROS_STATUS_SERVER_HOST=galaxyvictor-server-status -e PIROS_STATUS_SERVER_PORT=12345 -e PIROS_STATUS_SERVICE_NAME=gv-server-galaxy -e POD_IP=1.1.1.2 -e POSTGRES_USERNAME=postgres -e POSTGRES_DATABASE=postgres -e POSTGRES_PASSWORD=12345 -e POSTGRES_PORT=5432 -e POSTGRES_HOST=db -e AUTH_SERVER_HOST=gv-server-civilizations -e AUTH_SERVER_PORT=3001 --name=gv-server-galaxy --network=galaxyvictor_network binarysearch/gv-server-galaxy:latest