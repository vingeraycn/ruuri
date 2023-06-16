# v2.0.0

## Breaking Changes

### Deprecated API

- `DraggableGridProps.children` and `DraggableItem` component is deprecated and removed from export content. We don't need it anymore, use property `DraggableGridProps.renderItem` instead.

### New API

- `DraggableGridProps.data`

  > Array type, Required.

  Property `data` is data source for this grid, every item of data should have unique key for uniquely identify, and you can use property `uniKey` to define which is your data item unique key name.

- `DraggableGridProps.renderItem`

  > Function type, Optional. Default to undefined.

  Functions for rendering items with item of data as parameter.

- `DraggableGridProps.uniKey`

  > String type, Optional.
  > Default to 'id'

  Property `uniKey` is the unique key for every data items.
  The default value is `'id'`, you can pass it with lodash-like pathname, such as `content.id`

## Bugfixes and Reasons

- Scroll position lost: Dynamic add or remove grid items will re-construct the grid.
- Grid items can't delete dynamicly: Views are not bind with grid instance data model.
