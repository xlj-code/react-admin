//按需引入antd组件库的样式
const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#44cef6" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: [
      ["import", { libraryName: "antd", libraryDirectory: "es", style: true }],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
    ],
  },
};
