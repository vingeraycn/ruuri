import { css } from '@emotion/react'
import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {}

export default function DraggableItem({
  className,
  ...props
}: DraggableItemProps) {
  return (
    <div
      css={css`
        user-select: none;
        position: absolute;
        z-index: 1;
        cursor: pointer;

        &.muuri-item-positioning {
          z-index: 2;
        }

        &.muuri-item-dragging,
        &.muuri-item-releasing {
          z-index: 3;
        }

        &.muuri-item-dragging {
          cursor: move;
        }

        &.muuri-item-hidden {
          z-index: 0;
        }
      `}
    >
      <div className={clsx(className, 'draggable-item-content')} {...props} />
    </div>
  )
}
