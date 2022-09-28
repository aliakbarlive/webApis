# Demo Provisioning 
ECR_REPOSITORY=better-seller
ACCOUNT=425054240983
REGION=us-east-1

# Provision supporting AWS resources...
aws:
	aws ecr create-repository --repository-name ${ECR_REPOSITORY}-web-app
	aws ecr create-repository --repository-name ${ECR_REPOSITORY}-api
	aws ecr create-repository --repository-name ${ECR_REPOSITORY}-postgres
	aws ecr create-repository --repository-name ${ECR_REPOSITORY}-redis

# Build docker images locally and up the dev environment
dev-up:
	docker-compose -f docker-compose.yml up --build

# Or manually build and tag each container
# docker build -f Dockerfile.prod -t my-first-image:latest .


# Tear down the dev environment
dev-down:
	docker-compose -f docker-compose.yml down

# Push latest images to ECR and up the ECS environment
ecs-up:
	# Login into ECR
	aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com

	# Tag latest images with ECR repository name
	docker --context default tag better-seller_web-app:latest ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-web-app:latest
	docker --context default tag better-seller_api:latest ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-api:latest
	docker --context default tag redis:latest ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-redis:latest
	docker --context default tag postgres:latest ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-postgres:latest

	# Push images to ECR
	docker --context default push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-web-app:latest
	docker --context default push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-api:latest
	docker --context default push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-redis:latest
	docker --context default push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}-postgres:latest

	# Up our ECS environment
	docker --context aws compose -f docker-compose.staging.yml up

# Tear down the ECS environment
ecs-down:
	docker --context aws compose -f docker-compose.staging.yml down

# Output resulting CloudFormation template
ecs-convert:
	docker --context aws compose convert -f docker-compose.staging.yml

# Clean up supporting AWS resources
clean:
	aws ecr delete-repository --repository-name ${ECR_REPOSITORY}-web-app --force
	aws ecr delete-repository --repository-name ${ECR_REPOSITORY}-api --force
	aws ecr delete-repository --repository-name ${ECR_REPOSITORY}-redis --force
	aws ecr delete-repository --repository-name ${ECR_REPOSITORY}-postgres --force