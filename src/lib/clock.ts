type Listener = () => void

const listeners = new Set<Listener>()
let intervalId: ReturnType<typeof setInterval> | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null

function tick() {
  listeners.forEach(fn => fn())
}

function start() {
  if (intervalId !== null || timeoutId !== null) return
  // Align the first tick to the next whole second on the wall clock
  const msUntilNextSecond = 1000 - (Date.now() % 1000)
  timeoutId = setTimeout(() => {
    timeoutId = null
    tick()
    intervalId = setInterval(tick, 1000)
  }, msUntilNextSecond)
}

function stop() {
  if (timeoutId !== null) { clearTimeout(timeoutId); timeoutId = null }
  if (intervalId !== null) { clearInterval(intervalId); intervalId = null }
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  if (listeners.size === 1) start()
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0) stop()
  }
}
