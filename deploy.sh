#!/bin/bash
set -e

git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing to commit"
git push origin main

echo "Deployed. GitHub Pages will update in ~30 seconds."
echo "https://kitsworstnightmare.com"
