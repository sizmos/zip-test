PROJECT=home

install:
	npm install
	npx playwright install

test:
	PROJECT=${PROJECT} npm test
