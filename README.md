<h3 align="center">Any draggable layout supported based muuri for react.</h3>

<p align="center">Thanks For Your Star ⭐️</p>

<p align="center">
  <img src="https://badgen.net/npm/types/tslib" />
  <img src="https://badgen.net/npm/v/ruuri" />
  <img src="https://badgen.net/npm/dm/ruuri" />
  <a href="https://openbase.com/js/ruuri?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge">
    <img src="https://badges.openbase.com/js/rating/ruuri.svg?token=61xZVs6+HDgwhr3rKasOf9EW+xOZiVq/VYZPuBrn6po=" />
  </a>
  
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/19839331/181693587-7e0f62f6-11d9-4a34-826d-06caf6dde6ed.gif" />
</p>

## Features

- ✅ [All features](https://github.com/haltu/muuri#:~:text=on%20the%20website.-,Features,-Fully%20customizable%20layout) of [`muuri`](https://github.com/haltu/muuri) are supported.
- ✅ Drag between different containers.(see [Example](#examples))
- ✅ Flexible API, easy to understand, It's React style.
- ✅ TypeScript support.
- ✅ ESM, CommonJS support.
- ✅ Almost all React versions are supported, such as React 16.8, React 17, React 18 or newer.
- ✅ New technology enthusiasts, we will keep it updated if needed.

## News

ruuri v2 will be released soon, migration from v1 checkout [here](./CHANGELOG.md)

## Table of Content

- [Motivation](#motivation)
- [Get Started](#get-started)
- [Additional](#additional)
- [Examples](#examples)
- [License](#license)

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
import DraggableGrid from 'ruuri';

...
  <DraggableGrid
    // put your data here
    data={[
      {
        id: 'id-1',
        ...
      },
      {
        id: 'id-2',
        ...
      }
    ]}
    renderItem={itemData => (<div>{ // your custom content here }</div>)}
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
  />
...
```

## Additional

- Use handler
  > Get current muuri grid instance or container dom element by `ref`.

```tsx
import DraggableGrid, { DraggableGridHandle } from 'ruuri';
import { useRef } from 'react';

...
  const ref = useRef<DraggableGridHandle | null>(null)

  // get muuri grid instance
  // @see https://github.com/haltu/muuri#grid-methods
  // ref.current?.grid?.getElement()

  // get muuri container dom element
  // ref.current?.container

...
  <DraggableGrid ref={ref} data={[]} />
```

## Examples

### ruuri v2 examples

- [Drag between diffrent containers with React 18](https://codesandbox.io/s/drag-between-grids-v2-3jvvnr?file=/src/App.js)

### ruuri v1 examples

- [With React 16.8](https://codesandbox.io/s/react-16-8-sxds98)
- [With React 17](https://codesandbox.io/s/ruuri-on-react17-pf1px5)
- [Drag between different containers](https://codesandbox.io/s/drag-between-grids-vxmu62)

## License

Copyright © 2022-2023 [vingeray](https://github.com/vingeraycn) Licensed under the [MIT license](https://github.com/vingeraycn/ruuri/blob/main/LICENSE).
