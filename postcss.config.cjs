module.exports = {
  plugins: {
    "@csstools/postcss-global-data": {
      files: ["src/styles/media.css"]
    },
    "postcss-preset-env": {
      autoprefixer: { flexbox: "no-2009" },
      stage: 2,
      features: {
        "custom-properties": false,
        "nesting-rules": true,
        "custom-media-queries": true
      }
    }
  }
};
