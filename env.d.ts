interface ImportMetaEnv {
  readonly MAIN_VITE_ROLE: string
  readonly RENDERER_VITE_ROLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
