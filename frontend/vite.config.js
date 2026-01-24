import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensure assets are loaded correctly in Electron
  
  // 性能优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', 'framer-motion'],
          'utils': ['jszip', 'file-saver', 'react-hot-toast']
        }
      }
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000
  },
  
  // 开发服务器优化
  server: {
    hmr: {
      overlay: false // 减少HMR开销
    }
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', 'framer-motion']
  }
})
