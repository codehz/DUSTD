System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "image": "github:systemjs/plugin-image@0.1.0",
    "immutable": "npm:immutable@3.8.2",
    "json": "github:systemjs/plugin-json@0.3.0",
    "text": "github:systemjs/plugin-text@0.0.11"
  }
});
