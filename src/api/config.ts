/**
 * API 客户端配置
 */

export const API_CONFIG = {
  // 基础 URL，开发环境通过 Vite 代理
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  // 请求超时时间 (毫秒)
  timeout: 30000,

  // 重试次数
  retries: 3,

  // 重试延迟 (毫秒)
  retryDelay: 1000,
};

// API 端点路径
export const API_ENDPOINTS = {
  // 插件相关
  plugins: {
    base: '/api/plugins',
    list: '/api/plugins/',
    detail: (name: string) => `/api/plugins/${name}`,
    start: (name: string) => `/api/plugins/${name}/start`,
    stop: (name: string) => `/api/plugins/${name}/stop`,
    restart: (name: string) => `/api/plugins/${name}/restart`,
    status: (name: string) => `/api/plugins/${name}/status`,
    statusAll: '/api/plugins/status/all',
    config: (name: string) => `/api/plugins/${name}/config`,
    logs: (name: string, lines = 100) => `/api/plugins/${name}/logs?lines=${lines}`,
    health: (name: string) => `/api/plugins/${name}/health`,
  },

  // 系统相关
  system: {
    base: '/api/system',
    info: '/api/system/info',
    resources: '/api/system/resources',
    processes: '/api/system/processes',
    uptime: '/api/system/uptime',
  },

  // 通用
  health: '/health',
  root: '/',
} as const;
