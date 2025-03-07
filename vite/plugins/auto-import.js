import autoImport from "unplugin-auto-import/vite";

export default function createAutoImport() {
  return autoImport({
    imports: ["vue", "vue-router", "pinia"],
    //dts 参数的值为 false，表示在创建自动导入（auto-import）时不生成 TypeScript 类型声明文件（.d.ts 文件）。
    //在这段代码中，通过将 dts 参数设置为 false，告诉 autoImport 函数不生成类型声明文件。这意味着在自动导入过程中，不会生成 .d.ts 文件来提供类型信息
    dts: false,
  });
}
