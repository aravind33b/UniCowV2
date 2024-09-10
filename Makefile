build-contracts:
	cd hook && forge build && cd ..
	cd avs && forge build && cd ..

test-contracts:
	cd hook && forge test && cd ..
	cd avs && forge test && cd ..

deploy-to-anvil:
	./scripts/deploy-all-to-anvil.sh

start-anvil:
	./scripts/start-anvil.sh