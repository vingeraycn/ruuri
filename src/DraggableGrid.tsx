import { css } from '@emotion/react'
import { forEach, lowerFirst, merge, omit, pick } from 'lodash-es'
import Grid, { GridEvents, GridOptions } from 'muuri'
import { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST,
  DRAGGABLE_GRID_OPTIONS_KEY_LIST,
  DRAGGABLE_GRID_PROP_KEY_LIST,
} from './config'

const DEFAULT_GRID_OPTIONS: GridOptions = {
  dragEnabled: true,
}

function bindGridEvents(grid: Grid, handlers: GridEventHandlerProps) {
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

function unbindEvents(grid: Grid, handlers: GridEventHandlerProps) {
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

export interface GridEventHandlerProps {
  onSynchronize?: GridEvents['synchronize']
  onLayoutStart?: GridEvents['layoutStart']
  onLayoutEnd?: GridEvents['layoutEnd']
  onLayoutAbort?: GridEvents['layoutAbort']
  onAdd?: GridEvents['add']
  onRemove?: GridEvents['remove']
  onShowStart?: GridEvents['showStart']
  onShowEnd?: GridEvents['showEnd']
  onHideStart?: GridEvents['hideStart']
  onHideEnd?: GridEvents['hideEnd']
  onFilter?: GridEvents['filter']
  onSort?: GridEvents['sort']
  onMove?: GridEvents['move']
  onSend?: GridEvents['send']
  onBeforeSend?: GridEvents['beforeSend']
  onReceive?: GridEvents['receive']
  onBeforeReceive?: GridEvents['beforeReceive']
  onDragInit?: GridEvents['dragInit']
  onDragStart?: GridEvents['dragStart']
  onDragMove?: GridEvents['dragMove']
  onDragScroll?: GridEvents['dragScroll']
  onDragEnd?: GridEvents['dragEnd']
  onDragReleaseStart?: GridEvents['dragReleaseStart']
  onDragReleaseEnd?: GridEvents['dragReleaseEnd']
  onDestroy?: GridEvents['destroy']
}

export type DraggableGridHandle = {
  grid: Grid | undefined
  container: HTMLDivElement | null
}

export interface DraggableGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandlerProps>,
    GridOptions,
    GridEventHandlerProps {}

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
      css={css`
        position: relative;
      `}
      {...(omit(props, DRAGGABLE_GRID_PROP_KEY_LIST) as unknown as HTMLAttributes<HTMLDivElement>)}
    />
  )
})

DraggableGrid.displayName = 'DraggableGrid'
export default DraggableGrid
