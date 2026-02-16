#!/bin/bash
# Cleanup temporary files created during modernization testing

echo "Removing temporary modernization files..."

# Remove backup files
rm -f package.json.original
rm -f webpack.config.js.original
rm -f tsconfig.json.original

# Remove template files
rm -f package.modern.json
rm -f webpack.modern.config.js
rm -f tsconfig.modern.json

# Optionally remove checklist (uncomment if desired)
# rm -f MODERNIZATION_CHECKLIST.md

echo "Cleanup complete!"
echo ""
echo "Remaining files:"
ls -la | grep -v node_modules | grep -v "^d"
