# .gitlab-ci/build-frontend.sh
#!/bin/bash

# stop script on error and log every executed command
set -ex

FRONTEND_IMAGE_TAG=${IMAGE_TAG_STAGING}
FRONTEND_IMAGE="${REPOSITORY_URL_STAGING_WEB}:${FRONTEND_IMAGE_TAG}"

# build the web server image
# docker build \
#     --cache-from  /
#     -t ${FRONTEND_IMAGE} /
#     -f .docker/frontend/Dockerfile \
#     .

docker build  -t $REPOSITORY_URL_STAGING_WEB:$IMAGE_TAG_STAGING -f Dockerfile.$IMAGE_TAG_STAGING .

# push image to our docker registry
docker push $REPOSITORY_URL_STAGING_WEB:$IMAGE_TAG_STAGING 

aws ecs update-service --cluster "${CLUSTER_NAME_STAGING}" --service "${SERVICE_NAME_WEB_STAGING}" --service "${SERVICE_NAME_WEB_STAGING}" --force-new-deployment --region "${AWS_DEFAULT_REGION}" 