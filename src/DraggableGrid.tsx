import clsx from 'clsx'
import { merge, omit, pick } from 'lodash-es'
import Grid, { GridOptions } from 'muuri'
import { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import {
  DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST,
  DRAGGABLE_GRID_OPTIONS_KEY_LIST,
  DRAGGABLE_GRID_PROP_KEY_LIST,
} from './config'
import './DraggableGrid.css'
import { GridEventHandlerProps } from './types'
import { bindGridEvents, unbindEvents } from './utils'

const DEFAULT_GRID_OPTIONS: GridOptions = {
  dragEnabled: true,
}

export type DraggableGridHandle = {
  getGrid: () => Grid | undefined
  getDOM: () => HTMLDivElement | null
}

export interface DraggableGridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandlerProps>,
    GridOptions,
    GridEventHandlerProps {}

const DraggableGrid = forwardRef<DraggableGridHandle, DraggableGridProps>(
  ({ className, ...props }, ref) => {
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
      getGrid: () => gridRef.current,
      getDOM: () => rootRef.current,
    }))

    return (
      <div
        ref={rootRef}
        className={clsx(className, 'draggable-grid')}
        {...(omit(
          props,
          DRAGGABLE_GRID_PROP_KEY_LIST,
        ) as unknown as HTMLAttributes<HTMLDivElement>)}
      />
    )
  },
)

DraggableGrid.displayName = 'DraggableGrid'
export default DraggableGrid
