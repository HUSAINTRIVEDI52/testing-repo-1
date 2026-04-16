module.exports = {
  reactScriptsVersion: 'react-scripts' /* (default value) */,
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
              @import "./src/assets/scss/global.scss";
              // @import "./src/assets/scss/variables.scss";
              // @import "/src/assets/scss/components.scss";
            `,
      },
    },
  },
};
