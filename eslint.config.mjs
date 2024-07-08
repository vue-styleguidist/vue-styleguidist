import compat from "eslint-plugin-compat";
import _import from "eslint-plugin-import";
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import cypress from "eslint-plugin-cypress";
import mocha from "eslint-plugin-mocha";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/node_modules",
        "@types/*",
        "examples/*/styleguide/*",
        "examples/*/dist/*",
        "examples/**/*.ts",
        "packages/*/lib/**/*",
        "packages/*/dist/**/*",
        "coverage/*",
        "docs/dist/**/*",
        "test/cli-packages",
        "**/dangerfile.js",
        "**/cypress.config.ts",
    ],
}, ...compat.extends("eslint:recommended"), {
    plugins: {
        compat,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
    },

    settings: {
        "import/resolver": {
            node: {
                paths: [
                    "packages/vue-styleguidist/src/client",
                    "node_modules/react-styleguidist/lib/client",
                ],

                extensions: [".ts", ".tsx", ".js", ".d.ts"],
            },
        },
    },

    rules: {
        "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
        "compat/compat": "error",
        "import/export": "error",
        "import/no-named-as-default-member": "error",
        "import/no-mutable-exports": "error",
        "import/no-amd": "error",
        "import/first": ["error", "absolute-first"],
        "import/no-duplicates": "error",

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            ts: "never",
            tsx: "never",
        }],

        "import/newline-after-import": "error",
        "import/no-named-default": "error",
    },
}, ...fixupConfigRules(compat.extends("plugin:react/recommended")).map(config => ({
    ...config,
    files: ["packages/vue-styleguidist/src/client/**/*.*"],
})), {
    files: ["packages/vue-styleguidist/src/client/**/*.*"],

    plugins: {
        compat,
        import: fixupPluginRules(_import),
    },

    settings: {
        "import/resolver": {
            node: {
                paths: [
                    "packages/vue-styleguidist/src/client",
                    "node_modules/react-styleguidist/lib/client",
                ],

                extensions: [".ts", ".tsx", ".js", ".d.ts"],
            },
        },
    },
}, {
    files: ["packages/**/*.{ts,tsx}"],

    languageOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "no-unused-vars": 0,
        "no-console": "error",
    },
}, ...compat.extends("tamia/typescript-react").map(config => ({
    ...config,
    files: ["packages/vue-styleguidist/**/*.{ts,tsx}"],
})), {
    files: ["packages/vue-styleguidist/**/*.{ts,tsx}"],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },

    settings: {
        "import/resolver": {
            typescript: {},

            node: {
                extensions: [".ts", ".tsx", ".js", ".d.ts"],
            },
        },
    },

    rules: {
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "no-unused-vars": "off",
        "typescript/no-unused-vars": "off",
        "import/no-unresolved": "error",
        "import/no-extraneous-dependencies": "off",
    },
}, {
    files: ["**/vue-docgen-api/**"],

    languageOptions: {
        globals: {},
    },

    rules: {
        "compat/compat": "off",
    },
}, {
    files: ["test/setup.ts", "packages/**/*.{spec,test}.{vue3.,}{ts,tsx,js}"],

    languageOptions: {
        globals: {
            describe: false,
            vi: false,
            it: false,
            test: false,
            beforeAll: false,
            expect: false,
            beforeEach: false,
            afterEach: false,
        },

        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "compat/compat": "off",
        "no-unused-vars": 0,
    },
}, ...compat.extends("plugin:cypress/recommended").map(config => ({
    ...config,

    files: [
        "packages/**/*.cy.{ts,tsx,js}",
        "packages/**/*.cy.vue3.{ts,tsx,js}",
        "test/cypress/**/*.{ts,tsx,js}",
    ],
})), {
    files: [
        "packages/**/*.cy.{ts,tsx,js}",
        "packages/**/*.cy.vue3.{ts,tsx,js}",
        "test/cypress/**/*.{ts,tsx,js}",
    ],

    plugins: {
        cypress,
        mocha,
    },

    languageOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "mocha/no-exclusive-tests": "error",
    },
}];