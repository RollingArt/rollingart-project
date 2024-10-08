module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "react-native",
    "prettier",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],
    "react/no-unknown-property": ["error", { ignore: ["position", "args", "map", "rotation", "intensity", "castShadow", "receiveShadow", "object", "transparent", "testID"] }],
    "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["texture", "child", "landRef","dynamicTexture"]}],
    "no-unused-vars": "error",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
    "array-callback-return": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-no-bind": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-use-before-define": "off",
    "react/prop-types": "off",
    "react/style-prop-object": "off",
    "react-native/no-color-literals": "off",
    "react-native/sort-styles": "off",
    "func-names": "off",
    "global-require": "off",
    "react-native/no-inline-styles": "off",
    "no-plusplus": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "react/jsx-props-no-spreading": "off"
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    },
  },
};
