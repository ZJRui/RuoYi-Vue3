import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
/**
 * 
 * 插件支持在 script标签上定义组件名称
 * <script lang="ts" setup name="App" inheritAttrs="false">
 */

export default function createSetupExtend() {
    return setupExtend({})
}
