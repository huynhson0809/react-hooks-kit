# Contributing

Thanks for your interest in contributing to **react-hookz-kit**!

## How to contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-hook`
3. Write your code and tests
4. Run checks:
   ```bash
   npm test
   npm run typecheck
   npm run build
   ```
5. Commit with [conventional commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `test:`, `docs:`
6. Open a Pull Request

## Adding a new hook

1. Create `src/useMyHook.ts`
2. Export it from `src/index.ts`
3. Add tests in `tests/useMyHook.test.ts`
4. Update the hook table in `README.md`

## Code style

- TypeScript strict mode
- No runtime dependencies
- Each hook in its own file
- Every hook must have tests

## Reporting bugs

Open an [issue](https://github.com/huynhson0809/Redux-todo-app/issues) with:
- What you expected
- What happened
- Minimal reproduction
