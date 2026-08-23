# Task 1 TDD evidence

This note preserves the scaffold's red-to-green evidence without claiming that
the pre-scaffold state can be replayed from the current checkout.

## Historical scaffold red

Before the data module and declared dependencies were created, the Task 1
implementer ran:

```text
npm test -- --run src/data/site.test.ts
```

The run failed with a module-not-found error. That exact pre-scaffold state is
no longer present in Git, so this is recorded as historical implementation
evidence rather than presented as a fresh current failure.

## Historical scaffold green

After the initial data layer and media were added, the same focused command
reported `1 file passed, 1 test passed`; `npm run build` exited with code 0.

## Provenance follow-up red → green

The provenance review added tests for explicit documentary scene assignments,
VK source status, and the rule that menu data has no interior-photo IDs. Before
the production changes, the focused test run reported 2 failed and 1 passed:

```text
TypeError: Cannot read properties of undefined (reading 'hero')
TypeError: Cannot read properties of undefined (reading 'url')
```

After adding `documentarySceneMedia`, the explicit blocked VK source record,
and removing misleading interior IDs from menu items, the same command passed:

```text
npm test -- --run src/data/site.test.ts
Test Files  1 passed (1)
Tests       3 passed (3)
```

