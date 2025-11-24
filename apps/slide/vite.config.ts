import { defineConfig } from 'vite'
import path from 'path'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  base: '/slide/',
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? '/api'
        : 'http://localhost:8788/api'
    )
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@components': path.resolve(__dirname, './components'),
    },
  },
  plugins: [
    Components({
      // 重要: __dirname を使って「絶対パス」で指定します
      // これにより、どこからこの設定ファイルが読み込まれても正しく参照できます
      dirs: [path.resolve(__dirname, 'components')],

      // Slidevで必要な拡張子
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: false,
    }),
  ],
})