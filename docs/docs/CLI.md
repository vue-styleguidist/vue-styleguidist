# CLI commands and options

## Commands

- `vue-styleguidist server`: Run dev server.
- `vue-styleguidist build`: Generate a static HTML style guide.

## Options

| Option            | Description                              |
| ----------------- | ---------------------------------------- |
| `--config <file>` | Specify path to a config file            |
| `--open`          | Open Styleguidist in the default browser |
| `--verbose`       | Print debug information                  |

## Usage

Add these commands into your `package.json`’s `scripts` section:

```json
{
  "scripts": {
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  }
}
```
