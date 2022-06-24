export function runReactIfWindowExists(fn: () => void): void {
  if (windowExists()) {
    fn()
  }
}

export function windowExists(): boolean {
  return typeof window !== 'undefined'
}