# Development ep-asyncapi

## Build

```bash
npm install
npm run build
```

## Run Tests

```bash
npm test
```

### Run a Single Test

```bash
# set the env
source ./test/source.env.sh
# run test
# for example:
npx mocha --config test/.mocharc.yml test/specs/test-pass/acme-retail.spec.ts
# unset the env
unset_source_env
```

## Link

```bash
npm run dev:build
npm link
```

### Consuming Link

```bash
cd {consuming project}
npm link @solace-labs/ep-asyncapi
npm list
```

#### Unlink Consuming Link

```bash
cd {consuming project}
npm unlink --no-save @solace-labs/ep-asyncapi
# NOTE: now install the released package
npm install
npm list
```

---

The End.
