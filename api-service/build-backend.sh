# .gitlab-ci/build-frontend.sh
#!/bin/bash

# stop script on error and log every executed command
set -ex

BACKEND_IMAGE_TAG=${IMAGE_TAG_STAGING}
BACKEND_IMAGE="${REPOSITORY_URL_STAGING_API}:${BACKEND_IMAGE_TAG}"

# build the web server image
# docker build \
#     --cache-from  /
#     -t ${FRONTEND_IMAGE} /
#     -f .docker/frontend/Dockerfile \
#     .

docker build  -t $BACKEND_IMAGE -f Dockerfile.$IMAGE_TAG_STAGING .

# push image to our docker registry
docker push $BACKEND_IMAGE

aws ecs update-service --cluster "${CLUSTER_NAME_STAGING}" --service "${SERVICE_NAME_API_STAGING}" --service "${SERVICE_NAME_API_STAGING}" --force-new-deployment --region "${AWS_DEFAULT_REGION}" 