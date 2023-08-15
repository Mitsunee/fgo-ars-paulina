module.exports = {
  parserOptions: { sourceType: "module" },
  extends: [
    "foxkit/strict",
    "foxkit/react",
    "foxkit/ts-strict",
    "next",
    "prettier"
  ],
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      plugins: ["@typescript-eslint"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname
      }
    },
    {
      files: ["**/*.mjs", "**/*.js?(x)", "**/*.ts?(x)"],
      plugins: ["simple-import-sort"],
      extends: ["plugin:import/recommended", "plugin:import/typescript"],
      rules: {
        "sort-imports": "off",
        "simple-import-sort/imports": [
          "warn",
          {
            groups: [
              [
                // Side effect imports.
                "^\\u0000",
                "^\\u0000.+\\.css$"
              ],
              [
                // node built-ins
                `^(${require("module").builtinModules.join("|")})(/|$)`,
                // external packages (types last)
                "^react",
                "^@?\\w",
                // internal packages
                "^~",
                // Parent imports. Put `..` last.
                "^\\.\\.\\/",
                // Same-folder imports and `.` last.
                "^\\.\\/",
                // Style imports.
                "^.+\\.module\\.css$"
              ]
            ]
          }
        ],
        "import/order": "off",
        "import/first": "warn",
        "import/newline-after-import": "warn",
        "import/no-unresolved": "off"
      }
    }
  ]
};
