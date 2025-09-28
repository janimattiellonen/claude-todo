# Claude Code Configuration

## Commit Workflow Preferences

When committing changes, always follow this workflow:

1. **Check git status** to see what files have changed
2. **Add files explicitly** using individual `git add <file>` commands instead of `git add .`
3. **Create comprehensive commit messages** that include:
   - Brief summary line
   - Bullet points describing changes
   - Context about why changes were made
   - Generated with Claude Code footer

## Example Commit Workflow

```bash
# Check what changed
git status

# Add files explicitly (NOT git add .)
git add package.json
git add src/new-feature.ts
git add src/__tests__/new-feature.test.ts

# Commit with detailed message
git commit -m "Add new feature with comprehensive tests

- Implement new feature functionality
- Add unit tests with Jest
- Update package dependencies
- Add documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Testing

- Use `npm test` to run Jest tests
- Ensure tests pass before committing
- Run `npm run lint` to check code quality