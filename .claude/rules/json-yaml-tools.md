# JSON and YAML/XML/TOML Tools

When parsing or manipulating data files from the command line, prefer these specialized tools over manual editing or scripting:

## JSON Files

Use `jq` for querying and manipulating JSON:

```bash
# Query a value
jq '.key.nested' file.json

# Update a value
jq '.version = "1.0.0"' file.json > tmp.json && mv tmp.json file.json

# Add a new key
jq '. + {"newKey": "value"}' file.json

# Filter arrays
jq '.items[] | select(.active == true)' file.json
```

### Very complex queries or modifications

If the action you're trying to perofrm is very complex and cannot be solved with multiple `jq` commands, create a temporary node.js script to perform the action.

### Fixing broken JSON files

Use `jsonrepair` to fix malformed or broken JSON files:

```bash
# Repair a broken JSON file
jsonrepair file.json

# Repair and output to a new file
jsonrepair file.json > fixed.json
```

## YAML, XML, and TOML Files

Use `yq` for querying and manipulating YAML, XML, and TOML:

```bash
# YAML
yq '.key.nested' file.yaml
yq -i '.version = "1.0.0"' file.yaml

# XML
yq -p xml '.root.element' file.xml
yq -p xml -o xml '.root.element = "value"' file.xml

# TOML
yq -p toml '.section.key' file.toml
yq -p toml -o toml '.section.key = "value"' file.toml
```

## Why These Tools?

- **Preserve formatting**: Maintain structure and comments where possible
- **Complex queries**: Support filtering, mapping, and transformations
- **Avoid errors**: Less prone to mistakes than sed/awk for structured data
