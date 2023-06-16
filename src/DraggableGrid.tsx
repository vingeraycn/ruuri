import clsx from 'clsx'
import { forEach, lowerFirst, merge, omit, pick } from 'lodash-es'
import Grid, { GridEvents, GridOptions } from 'muuri'
import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import GridController from './GridController'
import {
  DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST,
  DRAGGABLE_GRID_OPTIONS_KEY_LIST,
  DRAGGABLE_GRID_PROP_KEY_LIST,
} from './config'
import injectStyle from './injectStyle'

export type GridEventHandler = {
  [eventName in keyof GridEvents as `on${Capitalize<string & eventName>}`]?: GridEvents[eventName]
}

export type DraggableGridHandle = {
  grid: Grid | undefined
  container: HTMLDivElement | null
}

const DEFAULT_GRID_OPTIONS: GridOptions = {
  dragEnabled: true,
  items: '.ruuri-draggable-item',
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

export interface DraggableGridProps<T extends { id: string }>
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandler>,
    GridOptions,
    GridEventHandler {
  data: T[]
  renderItem?: (data: T) => ReactNode
}

const DraggableGrid = forwardRef<DraggableGridHandle, DraggableGridProps<any>>(
  ({ data, renderItem, ...props }, ref) => {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const gridRef = useRef<Grid>()
    const gridControllerRef = useRef<GridController | null>(null)
    const options = useMemo(() => pick(props, DRAGGABLE_GRID_OPTIONS_KEY_LIST), [props])
    const handlers = useMemo(() => pick(props, DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST), [props])

    const init = useCallback(
      (container: HTMLElement) => {
        const grid = new Grid(container, merge({}, DEFAULT_GRID_OPTIONS, options))
        bindGridEvents(grid, handlers)
        return grid
      },
      [handlers, options],
    )

    const cleanup = useCallback(
      (grid: Grid) => {
        unbindEvents(grid, handlers)
        grid.destroy()
      },
      [handlers],
    )

    const renderContent = useCallback(() => {
      return (
        <>
          {data.map((item) => (
            <div
              className="ruuri-draggable-item draggable-item"
              data-ruuri-id={item.id}
              key={item.id}
            >
              <div className="draggable-item-content">{renderItem?.(item)}</div>
            </div>
          ))}
        </>
      )
    }, [data, renderItem])

    useEffect(() => {
      const container = rootRef.current
      if (!container) {
        return
      }

      const grid = init(container)
      gridRef.current = grid
      gridControllerRef.current = new GridController(grid, container)

      return () => {
        cleanup(grid)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => ({
      get grid() {
        return gridRef.current
      },
      get container() {
        return rootRef.current
      },
    }))

    useEffect(() => {
      gridControllerRef.current?.sync(data.map((item) => item.id))
    }, [data])

    return (
      <div
        ref={rootRef}
        {...(omit(
          props,
          DRAGGABLE_GRID_PROP_KEY_LIST,
        ) as unknown as HTMLAttributes<HTMLDivElement>)}
        className={clsx('ruuri-draggable-grid', props.className)}
      >
        {renderContent()}
      </div>
    )
  },
)

DraggableGrid.displayName = 'DraggableGrid'
export default DraggableGrid

injectStyle()
