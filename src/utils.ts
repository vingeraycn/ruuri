import { forEach, lowerFirst } from 'lodash-es'
import Grid, { GridEvents } from 'muuri'
import { GridEventHandlerProps } from './types'

export function bindGridEvents(grid: Grid, handlers: GridEventHandlerProps) {
  if (!grid) {
    return
  }

  forEach(handlers, (handler, key) => {
    if (!handler) {
      return
    }

    grid.on(lowerFirst(key.replace('on', '')) as keyof GridEvents, handler)
  })
}

export function unbindEvents(grid: Grid, handlers: GridEventHandlerProps) {
  if (!grid) {
    return
  }

  forEach(handlers, (handler, key) => {
    if (!handler) {
      return
    }

    grid.off(lowerFirst(key.replace('on', '')) as keyof GridEvents, handler)
  })
}
