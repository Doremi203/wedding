.PHONY: build deploy release

build:
	npm run build

# Deploys the existing out/ build. Requires AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
# to be set — see scripts/deploy.sh or README.md for how to load them from Terraform.
deploy:
	./scripts/deploy.sh

# Builds fresh and deploys in one step.
release: build deploy
