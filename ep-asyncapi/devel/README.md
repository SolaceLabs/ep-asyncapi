# Development ep-asyncapi


## Build & Link
```bash
# link this to global
npm build
npm link

# in using project:
npm link @solace-iot-team/ep-asyncapi
npm list # update package.json with new version number if needed
# unlink again
npm unlink --no-save @solace-iot-team/ep-asyncapi
# NOTE: now install the released package
npm install
```


## Run Tests

```bash
npm test
```

### Run a Single Test
````bash
# set the env
source ./test/source.env.sh
# run test
# for example:
npx mocha --config test/.mocharc.yml test/specs/misc/pino.spec.ts
# pretty print server output:
npx mocha --config test/.mocharc.yml test/specs/misc/pino.spec.ts | npx pino-pretty
# unset the env
unset_source_env
````


---

The End.
