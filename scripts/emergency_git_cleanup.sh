#!/bin/bash
# EMERGENCY: Clean Git History from Sensitive Data
# Run this script to completely remove sensitive files from Git history

echo "🚨 EMERGENCY: Cleaning sensitive data from Git history..."
echo "=============================================="

# Remove sensitive files from all Git history
echo "🔄 Removing .github/secrets/ from entire Git history..."
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .github/secrets/client_secret_*.json' \
--prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .github/secrets/smart_cooking2.json' \
--prune-empty --tag-name-filter cat -- --all

echo "🔄 Removing any remaining secrets directory..."
git filter-branch --force --index-filter \
'git rm -r --cached --ignore-unmatch .github/secrets' \
--prune-empty --tag-name-filter cat -- --all

# Clean up filter-branch refs
echo "🧹 Cleaning up Git references..."
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Git history cleaned!"
echo ""
echo "🚀 Next steps:"
echo "1. Force push to overwrite GitHub history: git push --force-with-lease origin main"
echo "2. Create new Google credentials immediately"
echo "3. Update all applications with new credentials"
echo ""
echo "⚠️  WARNING: This operation is irreversible!"
echo "⚠️  All collaborators must re-clone the repository!"

read -p "Press Enter to continue with force push..."
git push --force-with-lease origin clean-main:main
