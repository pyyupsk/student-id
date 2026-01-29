.PHONY: serve format

PORT ?= 8000

serve: ## Start local dev server
	python3 -m http.server $(PORT) -d www

format: ## Format HTML, CSS, and JS with Prettier
	npx -y prettier --write "www/**/*.{html,css,js}"
