// Redecalare forwardRef to restore type inference on the forwarded component
// see: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/#generic-forwardrefs
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

import { useDeepCompareEffect } from '@react-hookz/web'
import clsx from 'clsx'
import { forEach, get, lowerFirst, merge, omit, pick } from 'lodash-es'
import Grid, { GridEvents, GridOptions } from 'muuri'
import {
  ComponentPropsWithoutRef,
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
import { LiteralUnion } from 'type-fest'
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

// omit key as it is assigned internally
export type GetItemProps<T> = (
  itemData: T,
  index: number,
) => Omit<ComponentPropsWithoutRef<'div'>, 'key'>

// omit key as it is assigned internally
export type GetItemContentProps<T> = (
  itemData: T,
  index: number,
) => Omit<ComponentPropsWithoutRef<'div'>, 'key'>

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

export interface DraggableGridProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof GridEventHandler | 'children'>,
    GridOptions,
    GridEventHandler {
  /**
   * data source for grid.
   *
   */
  data: T[]

  /**
   * merges returned props into the wrapper item's props
   *
   * @param itemData item of the data source
   * @param index index of the current item
   */
  getItemProps?: GetItemProps<T>

  /**
   * merges returned props into the item content's props
   *
   * @param itemData item of the data source
   * @param index index of the current item
   */
  getItemContentProps?: GetItemContentProps<T>

  // Using the LiteralUnion type gives us autocomplete for the
  // first depth of keys
  /**
   * Unique key for every data item in the grid.
   * It supports lodash-like properties path names, such as 'content.id', the uni key must be string type.
   *
   * @default 'id'
   */
  uniKey?: LiteralUnion<keyof T, string>

  /**
   * grid item renderer
   * @param data item of data source
   *
   * @returns ReactNode
   */
  renderItem?: (data: T) => ReactNode
}

function DraggableGrid<T>(
  {
    data,
    getItemProps,
    getItemContentProps,
    renderItem,
    uniKey = 'id',
    ...props
  }: DraggableGridProps<T>,
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
      {data.map((item, index) => {
        const id = get(item, uniKey)

        if (!(typeof id === 'string' || typeof id === 'number')) {
          throw new TypeError(
            `The value of the ${String(uniKey)} property must be a string or number`,
          )
        }

        const itemProps = getItemProps?.(item, index)
        const itemClassName = clsx('ruuri-draggable-item draggable-item', itemProps?.className)

        const itemContentProps = getItemContentProps?.(item, index)
        const itemContentClassName = clsx('draggable-item-content', itemContentProps?.className)

        return (
          <div {...itemProps} className={itemClassName} data-ruuri-id={id} key={id}>
            <div {...itemContentProps} className={itemContentClassName}>
              {renderItem?.(item)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default forwardRef(DraggableGrid)

injectStyle()
