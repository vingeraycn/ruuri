export const DRAGGABLE_GRID_OPTIONS_KEY_LIST = [
  'items',
  'showDuration',
  'showEasing',
  'visibleStyles',
  'hideDuration',
  'hideEasing',
  'hiddenStyles',
  'layout',
  'layoutOnResize',
  'layoutOnInit',
  'layoutDuration',
  'layoutEasing',
  'sortData',
  'dragEnabled',
  'dragHandle',
  'dragContainer',
  'dragStartPredicate',
  'dragAxis',
  'dragSort',
  'dragSortHeuristics',
  'dragSortPredicate',
  'dragRelease',
  'dragCssProps',
  'dragPlaceholder',
  'dragAutoScroll',
  'containerClass',
  'itemClass',
  'itemVisibleClass',
  'itemHiddenClass',
  'itemPositioningClass',
  'itemDraggingClass',
  'itemReleasingClass',
  'itemPlaceholderClass',
]

export const DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST = [
  'onSynchronize',
  'onLayoutStart',
  'onLayoutEnd',
  'onLayoutAbort',
  'onAdd',
  'onRemove',
  'onShowStart',
  'onShowEnd',
  'onHideStart',
  'onHideEnd',
  'onFilter',
  'onSort',
  'onMove',
  'onSend',
  'onBeforeSend',
  'onReceive',
  'onBeforeReceive',
  'onDragInit',
  'onDragStart',
  'onDragMove',
  'onDragScroll',
  'onDragEnd',
  'onDragReleaseStart',
  'onDragReleaseEnd',
  'onDestroy',
]

export const DRAGGABLE_GRID_PROP_KEY_LIST = [
  ...DRAGGABLE_GRID_OPTIONS_KEY_LIST,
  ...DRAGGABLE_GRID_EVENT_HANDLER_KEY_LIST,
]
