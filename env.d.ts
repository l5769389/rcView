interface ImportMetaEnv {
  readonly MAIN_VITE_ROLE: string
  readonly RENDERER_VITE_ROLE: string
  readonly MAIN_VITE_ROLE_TEST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
