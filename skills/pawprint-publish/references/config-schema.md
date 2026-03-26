# docs.config.json Schema

```json
{
  "site": {
    "title": "string",
    "description": "string",
    "password": "string (site-level gate password)"
  },
  "categories": [
    {
      "id": "projects|areas|resources|archives",
      "label": "string (display name)",
      "icon": "emoji",
      "description": "string (shown under category header)"
    }
  ],
  "docs": [
    {
      "slug": "string (URL-safe, unique)",
      "category": "projects|areas|resources|archives",
      "title": "string",
      "description": "string",
      "file": "docs/<category>/<slug>.md",
      "password": "string (optional, omit for public)",
      "icon": "emoji",
      "date": "YYYY-MM-DD",
      "author": "string"
    }
  ]
}
```

## Current categories

| ID | Label | Icon |
|----|-------|------|
| projects | Projects | 📂 |
| areas | Areas | 📖 |
| resources | Resources | 📚 |
| archives | Archives | 📦 |
