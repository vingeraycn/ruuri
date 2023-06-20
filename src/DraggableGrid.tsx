import clsx from 'clsx'
import { forEach, get, lowerFirst, merge, omit, pick } from 'lodash-es'
import Grid, { GridEvents, GridOptions } from 'muuri'
import {
  ForwardedRef,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { useDeepCompareEffect } from 'react-use'
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

export interface DraggableGridProps<T = any>
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandler | 'children'>,
  GridOptions,
  GridEventHandler {
  /**
   * data source for grid.
   *
   */
  data: T[]

  /**
   * Unique key for every data item in the grid.
   * It supports lodash-like properties path names, such as 'content.id', the uni key must be string type.
   *
   * @default 'id'
   */
  uniKey?: string

  /**
   * grid item renderer
   * @param data item of data source
   *
   * @returns ReactNode
   */
  renderItem?: (data: T) => ReactNode
}

function DraggableGrid(
  { data, renderItem, uniKey = 'id', ...props }: DraggableGridProps,
  ref: ForwardedRef<DraggableGridHandle>,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<Grid>()
  const gridControllerRef = useRef<GridController | null>(null)
  const handlers = useMemo(() => pick(props, DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST), [props])

  const init = useCallback(
    (container: HTMLElement) => {
      const options = pick(props, DRAGGABLE_GRID_OPTIONS_KEY_LIST)
      const grid = new Grid(container, merge({}, DEFAULT_GRID_OPTIONS, options))

      bindGridEvents(grid, handlers)
      return grid
    },
    [handlers, props],
  )

  const cleanup = useCallback(
    (grid: Grid) => {
      unbindEvents(grid, handlers)
      grid.destroy()
    },
    [handlers],
  )

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

  useDeepCompareEffect(() => {
    const controller = gridControllerRef.current
    controller?.sync(data.map((item) => get(item, uniKey)))
  }, [data])

  return (
    <div
      ref={rootRef}
      {...(omit(props, DRAGGABLE_GRID_PROP_KEY_LIST) as unknown as HTMLAttributes<HTMLDivElement>)}
      className={clsx('ruuri-draggable-grid', props.className)}
    >
      {data.map((item) => {
        const id = get(item, uniKey)
        return (
          <div
            className="ruuri-draggable-item ruuri-draggable-item-initial draggable-item"
            data-ruuri-id={id}
            key={id}
          >
            <div className="draggable-item-content">{renderItem?.(item)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default forwardRef(DraggableGrid)

injectStyle()
