# ruuri

Any draggable layout supported based muuri for react.

## Features

- ✅ [All features](https://github.com/haltu/muuri#:~:text=on%20the%20website.-,Features,-Fully%20customizable%20layout) of `muuri` are supported.
- ✅ Drag between different containers.
- ✅ Flexible API, easy to understand, It's React style.
- ✅ TypeScript support.
- ✅ ESM, UMD support.
- ✅ React 16.8+, React 17 and React 18 support.
- ✅ New technology enthusiasts, we will keep it updated if needed.

## Motivation

To be honest, there was already a library called [muuri-react](https://github.com/paol-imi/muuri-react) that did a React adaptation for [muuri](https://github.com/haltu/muuri) before this library came out, but it hadn't been updated for years and his examples and code didn't work with the latest React versions, and there were users in the community asking for help every year.

In fact we wanted to handle drag and drop only and not rely on a specific muuri or React version, so our product will not contain muuri or React code, the library will rely on the React and muuri versions referenced by the applicable project.

We hope that this library will turn the muuri API into something like React, a simple idea, implemented in a simple way, resulting in very low maintenance. If there are any subsequent breaking updates to muuri or the React features used, feel free to raise an issue or open a pull request.

## Get Started

1. Add `ruuri` and `muuri` as dependencies.

```bash
yarn add ruuri muuri
```

2. Import `ruuri` Component.

```jsx
import { DraggableGrid, DraggableItem } from 'ruuri';

...
  <DraggableGrid
    // pass grid options
    // see more options docs at https://github.com/haltu/muuri#-grid-options
    dragEnabled
    dragSort
    layout={
      {
        fillGaps: true
      }
    }

    // pass event handlers
    // see more event docs at https://github.com/haltu/muuri#-grid-events
    onSend={data => {
      // write your code here
    }}
    onDragStart={(data, event) => {
      // write your code here
    }}
  >
    <DraggableItem>
      {/* write other code */}
    </DraggableItem>
  </DraggableGrid>
...
```

## Additional

- Use handler
  > Get current muuri grid instance or container dom element by `ref`.

```tsx
import { DraggableGrid, DraggableItem, DraggableGridHandle } from 'ruuri';
import { useRef } from 'react';

...
  const ref = useRef<DraggableGridHandle | null>(null)

  // get muuri grid instance
  // @see https://github.com/haltu/muuri#grid-methods
  // ref.current?.grid?.getElement()

  // get muuri container dom element
  // ref.current?.container

...
  <DraggableGrid ref={ref}>
    <DraggableItem>
      {/* write other code */}
    </DraggableItem>
  </DraggableGrid>
```
