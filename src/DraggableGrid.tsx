import clsx from 'clsx'
import { forEach, lowerFirst, merge, omit, pick } from 'lodash-es'
import Grid, { GridEvents, GridOptions } from 'muuri'
import { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST,
  DRAGGABLE_GRID_OPTIONS_KEY_LIST,
  DRAGGABLE_GRID_PROP_KEY_LIST,
} from './config'
import { ruuriDraggableGrid } from './styles.module.css'

export type GridEventHandler = {
  [eventName in keyof GridEvents as `on${Capitalize<string & eventName>}`]?: GridEvents[eventName]
}

export type DraggableGridHandle = {
  grid: Grid | undefined
  container: HTMLDivElement | null
}

const DEFAULT_GRID_OPTIONS: GridOptions = {
  dragEnabled: true,
}

function bindGridEvents(grid: Grid, handlers: GridEventHandler) {
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

function unbindEvents(grid: Grid, handlers: GridEventHandler) {
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

export interface DraggableGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandler>,
    GridOptions,
    GridEventHandler {}

const DraggableGrid = forwardRef<DraggableGridHandle, DraggableGridProps>((props, ref) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<Grid>()
  const options = useMemo(() => pick(props, DRAGGABLE_GRID_OPTIONS_KEY_LIST), [props])
  const handlers = useMemo(() => pick(props, DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST), [props])

  useEffect(() => {
    if (!rootRef.current) {
      return
    }

    const grid = new Grid(rootRef.current, merge({}, DEFAULT_GRID_OPTIONS, options))

    gridRef.current = grid
    bindGridEvents(grid, handlers)

    return () => {
      unbindEvents(grid, handlers)
      grid.destroy()
    }
  }, [handlers, options])

  useImperativeHandle(ref, () => ({
    get grid() {
      return gridRef.current
    },
    get container() {
      return rootRef.current
    },
  }))

  return (
    <div
      ref={rootRef}
      {...(omit(props, DRAGGABLE_GRID_PROP_KEY_LIST) as unknown as HTMLAttributes<HTMLDivElement>)}
      className={clsx(ruuriDraggableGrid, props.className)}
    />
  )
})

DraggableGrid.displayName = 'DraggableGrid'
export default DraggableGrid
