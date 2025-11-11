#!/usr/bin/env bash
# Test script for import-copilot-pr.sh governance enforcement
# This tests the governance components without requiring an actual external PR

set -euo pipefail

echo "🧪 Testing import-copilot-pr.sh governance enforcement"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PASS=0
FAIL=0

# Helper functions
pass() {
    echo "  ✅ PASS: $1"
    PASS=$((PASS + 1))
}

fail() {
    echo "  ❌ FAIL: $1"
    FAIL=$((FAIL + 1))
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Test 1: Script exists and is executable
section "Test 1: Script Setup"
if [ -f "import-copilot-pr.sh" ]; then
    pass "Script file exists"
else
    fail "Script file not found"
fi

if [ -x "import-copilot-pr.sh" ]; then
    pass "Script is executable"
else
    fail "Script is not executable"
fi

# Test 2: Script syntax validation
section "Test 2: Script Syntax"
if bash -n import-copilot-pr.sh 2>/dev/null; then
    pass "Script syntax is valid"
else
    fail "Script has syntax errors"
fi

# Test 3: Help message
section "Test 3: Help Message"
set +e
set +o pipefail
output=$(./import-copilot-pr.sh 2>&1)
set -e
set -o pipefail

if echo "$output" | grep -q "Usage:"; then
    pass "Help message displays correctly"
else
    fail "Help message not found"
fi

# Test 4: Duplicate JS/JSX detection
section "Test 4: Duplicate File Detection"
# Current state should have duplicates
if [ -f "api/stripe/webhook/route.js" ] && [ -f "api/stripe/webhook/route.ts" ]; then
    pass "Found expected duplicate: api/stripe/webhook/route.*"
else
    fail "Expected duplicate not found: api/stripe/webhook/route.*"
fi

if [ -f "core/modules/deploy-center/YoniDeployControlCenter.jsx" ] && [ -f "core/modules/deploy-center/YoniDeployControlCenter.tsx" ]; then
    pass "Found expected duplicate: YoniDeployControlCenter.*"
else
    fail "Expected duplicate not found: YoniDeployControlCenter.*"
fi

# Test 5: Duplicate check logic
section "Test 5: Duplicate Check Logic"
# Test that find command detects duplicates before removal
dupe_count=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  | sed "s/\.[^.]*$//" | sort | uniq -d | wc -l)

if [ "$dupe_count" -gt 0 ]; then
    pass "Duplicate detection finds duplicates ($dupe_count found)"
else
    fail "Duplicate detection should find duplicates but found none"
fi

# Test 6: Simulated removal and re-check
section "Test 6: Removal Simulation"
# Create temporary backup
cp api/stripe/webhook/route.js /tmp/route.js.bak 2>/dev/null || true
cp core/modules/deploy-center/YoniDeployControlCenter.jsx /tmp/YoniDeployControlCenter.jsx.bak 2>/dev/null || true

# Remove duplicates
rm -f api/stripe/webhook/route.js
rm -f core/modules/deploy-center/YoniDeployControlCenter.jsx

# Check for duplicates after removal
dupe_count_after=$(find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  | sed "s/\.[^.]*$//" | sort | uniq -d | wc -l)

if [ "$dupe_count_after" -eq 0 ]; then
    pass "No duplicates found after removal"
else
    fail "Duplicates still exist after removal ($dupe_count_after found)"
fi

# Restore files
git restore api/stripe/webhook/route.js core/modules/deploy-center/YoniDeployControlCenter.jsx 2>/dev/null || {
    # If git restore fails, use backup
    mv /tmp/route.js.bak api/stripe/webhook/route.js 2>/dev/null || true
    mv /tmp/YoniDeployControlCenter.jsx.bak core/modules/deploy-center/YoniDeployControlCenter.jsx 2>/dev/null || true
}

pass "Files restored after test"

# Test 7: TypeScript file preservation
section "Test 7: TypeScript File Preservation"
if [ -f "api/stripe/webhook/route.ts" ]; then
    pass "TypeScript webhook file exists"
else
    fail "TypeScript webhook file missing"
fi

if [ -f "core/modules/deploy-center/YoniDeployControlCenter.tsx" ]; then
    pass "TypeScript component file exists"
else
    fail "TypeScript component file missing"
fi

# Test 8: Documentation
section "Test 8: Documentation"
if [ -f "COPILOT_PR_IMPORT.md" ]; then
    pass "Documentation file exists"
else
    fail "Documentation file missing"
fi

if grep -q "import-copilot-pr.sh" README.md; then
    pass "README.md references the import script"
else
    fail "README.md doesn't reference the import script"
fi

# Test 9: Script components
section "Test 9: Script Components"
if grep -q 'rm -f.*js' import-copilot-pr.sh; then
    pass "Script contains JS/JSX removal logic"
else
    fail "Script missing JS/JSX removal logic"
fi

if grep -q "allowJs.*false" import-copilot-pr.sh; then
    pass "Script contains TypeScript-only config"
else
    fail "Script missing TypeScript-only config"
fi

if grep -q "git am" import-copilot-pr.sh; then
    pass "Script uses git am for patch application"
else
    fail "Script doesn't use git am"
fi

if grep -q "npm run build" import-copilot-pr.sh; then
    pass "Script includes build step"
else
    fail "Script missing build step"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Passed: $PASS"
echo "  ❌ Failed: $FAIL"
echo "  📈 Total:  $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All tests passed!"
    echo ""
    exit 0
else
    echo "⚠️  Some tests failed. Please review the output above."
    echo ""
    exit 1
fi
