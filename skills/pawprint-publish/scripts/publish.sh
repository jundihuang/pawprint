#!/bin/bash
# Usage: publish.sh <slug> <category> <title> <description> <icon> <author> [password]
# Example: publish.sh my-doc projects "My Document" "A cool doc" "📊" "Lisa (PM)" "secret123"

set -e

REPO_DIR="/tmp/clawme-docs"
SLUG="$1"
CATEGORY="$2"
TITLE="$3"
DESC="$4"
ICON="$5"
AUTHOR="$6"
PASSWORD="$7"
DATE=$(date +%Y-%m-%d)

if [ -z "$SLUG" ] || [ -z "$CATEGORY" ] || [ -z "$TITLE" ]; then
  echo "Usage: publish.sh <slug> <category> <title> <description> <icon> <author> [password]"
  exit 1
fi

FILE_PATH="docs/${CATEGORY}/${SLUG}.md"

# Ensure the markdown file exists
if [ ! -f "${REPO_DIR}/${FILE_PATH}" ]; then
  echo "ERROR: ${REPO_DIR}/${FILE_PATH} does not exist. Place the .md file first."
  exit 1
fi

# Build the new doc entry JSON
if [ -n "$PASSWORD" ]; then
  NEW_ENTRY=$(cat <<EOF
    {
      "slug": "${SLUG}",
      "category": "${CATEGORY}",
      "title": "${TITLE}",
      "description": "${DESC}",
      "file": "${FILE_PATH}",
      "password": "${PASSWORD}",
      "icon": "${ICON}",
      "date": "${DATE}",
      "author": "${AUTHOR}"
    }
EOF
)
else
  NEW_ENTRY=$(cat <<EOF
    {
      "slug": "${SLUG}",
      "category": "${CATEGORY}",
      "title": "${TITLE}",
      "description": "${DESC}",
      "file": "${FILE_PATH}",
      "icon": "${ICON}",
      "date": "${DATE}",
      "author": "${AUTHOR}"
    }
EOF
)
fi

# Append to docs array in config
cd "$REPO_DIR"
python3 -c "
import json
with open('docs.config.json', 'r') as f:
    config = json.load(f)
entry = json.loads('''${NEW_ENTRY}''')
# Check for duplicate slug
if any(d['slug'] == entry['slug'] for d in config['docs']):
    print(f'WARN: slug \"{entry[\"slug\"]}\" already exists, skipping add')
else:
    config['docs'].append(entry)
    with open('docs.config.json', 'w') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print(f'Added \"{entry[\"title\"]}\" to {entry[\"category\"]}')
"

# Commit and push
git add -A
git commit -m "docs: add ${SLUG} to ${CATEGORY}"
git push

echo "✅ Published: ${SLUG} → ${CATEGORY}"
echo "🔗 https://pawprint-jayce.vercel.app/docs#${SLUG}"
