export const startTransition = (callback: () => void) => {
  if (document.startViewTransition) {
    document.startViewTransition(callback)
  } else {
    callback()
  }
}
