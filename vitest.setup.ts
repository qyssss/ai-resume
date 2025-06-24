import { vi } from 'vitest'

// Mock CSS imports (for all .css files)
vi.stubGlobal('CSS', {})
