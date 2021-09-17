import path from 'path'
import {defineConfig} from 'vite'

const ROOT_PATH = path.join(__dirname, '..')

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@transclusion/vdom',
        replacement: path.resolve(ROOT_PATH, 'src'),
      },
    ],
  },
})
