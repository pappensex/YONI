# Copilot PR Import Script

## Overview

The `import-copilot-pr.sh` script automates the process of importing external Copilot PRs while enforcing company governance policies.

## Purpose

This script helps maintain code quality and consistency by:

1. **Importing External PRs**: Fetches and applies patches from Copilot tasks repository
2. **Enforcing Governance**: Automatically applies company policies
3. **Validating Changes**: Ensures no conflicts or duplicates exist
4. **Building & Testing**: Validates the imported code builds successfully

## Company Governance Policies

The script automatically enforces the following policies:

### 1. Single Stripe Webhook Route
- **Rule**: Only TypeScript webhook routes are allowed
- **Action**: Removes `api/stripe/webhook/route.js` if it exists
- **Keeps**: `api/stripe/webhook/route.ts`

### 2. TypeScript-Only Codebase
- **Rule**: JavaScript files are not allowed (`allowJs: false`)
- **Action**: Updates or adds `"allowJs": false` in `tsconfig.json`
- **Purpose**: Ensures type safety across the codebase

### 3. No Duplicate Routes
- **Rule**: Files with the same name but different extensions are not allowed
- **Check**: Scans all tracked files for duplicates
- **Action**: Fails the import if duplicates are found

## Usage

### Basic Usage

```bash
./import-copilot-pr.sh <PR_NUMBER>
```

### Example

```bash
./import-copilot-pr.sh 42
```

This will:
1. Create a new branch: `import/copilot-pr-42`
2. Fetch the patch from `https://github.com/copilot/tasks/pull/42.patch`
3. Apply the patch with commit history
4. Enforce governance policies
5. Build the project
6. Push the branch to origin

### After Running

Once the script completes successfully, create a PR using:

```bash
gh pr create --fill \
  --title "import: copilot/tasks PR 42" \
  --body "Imported via patch; build ok; no duplicate routes; TS enforced."
```

## Workflow Steps

### 1. Branch Creation
- Fetches latest from `origin`
- Creates branch: `import/copilot-pr-<NUMBER>`
- Based on: `origin/main`

### 2. Patch Application
- Downloads patch from Copilot tasks repository
- Performs dry run (`git apply --check`)
- Applies with `git am` to preserve commit history

### 3. Policy Enforcement
- Removes JavaScript webhook routes
- Configures TypeScript-only mode
- Validates no duplicate routes

### 4. Build Validation
- Enables corepack (if available)
- Installs dependencies (`npm ci` or `npm install`)
- Runs build script (if defined)

### 5. Commit & Push
- Commits policy changes
- Pushes branch to origin
- Provides PR creation command

## Error Handling

### Merge Conflicts

If the patch doesn't apply cleanly:

```
⚠️  Conflicts detected during patch application.
Please resolve manually:
  1. Check status:        git status
  2. Edit conflicted files
  3. Stage changes:       git add -A
  4. Continue:            git am --continue
```

**Resolution Steps:**
1. Check which files have conflicts: `git status`
2. Edit conflicted files to resolve markers
3. Stage resolved files: `git add -A`
4. Continue applying: `git am --continue`
5. Re-run the script from governance enforcement onwards

### Duplicate Routes

If duplicate routes are detected:

```
❌ Duplicate routes detected:
api/stripe/webhook/route
```

**Resolution Steps:**
1. Review the duplicate files
2. Decide which version to keep (prefer TypeScript)
3. Remove the unwanted file
4. Re-run the script

## Requirements

- Git
- Bash 4.0+
- Node.js and npm (if project has `package.json`)
- corepack (optional, for package manager version management)
- curl (for fetching patches)
- GitHub CLI (`gh`) for creating PRs (optional)

## Troubleshooting

### Script Won't Execute

```bash
chmod +x import-copilot-pr.sh
```

### Patch Not Found (404)

- Verify the PR number is correct
- Check that the PR exists at `https://github.com/copilot/tasks/pull/<NUMBER>`
- Ensure you have internet connectivity

### Build Failures

- Review the build output for specific errors
- Check that all dependencies are properly defined
- Ensure TypeScript types are correct

### Permission Errors on Push

- Verify you have write access to the repository
- Check your Git credentials are configured
- Ensure you're authenticated with GitHub

## Best Practices

1. **Review the Patch First**: Check the PR on GitHub before importing
2. **Clean Working Directory**: Ensure no uncommitted changes before running
3. **Test Locally**: After import, test the changes locally before creating PR
4. **Descriptive PR Titles**: Use the suggested format but add context if needed
5. **Review Policy Changes**: Check that governance enforcement didn't break functionality

## Security Considerations

- The script downloads patches from `github.com/copilot/tasks`
- Patches are saved to `/tmp/copilot.patch` (temporary file)
- All changes are committed and pushed under your Git identity
- Review patches before applying in production environments

## Maintenance

This script enforces current company policies. If policies change:

1. Update the governance section (lines dealing with `.js` removal or `tsconfig.json`)
2. Update this documentation
3. Test with a sample PR before rolling out

## Support

For issues or questions:
1. Check this documentation
2. Review error messages carefully
3. Open an issue in the repository
4. Contact the platform team
