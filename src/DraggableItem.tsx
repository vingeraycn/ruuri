import clsx from 'clsx'
import { forwardRef, HTMLAttributes } from 'react'

export interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {}

const DraggableItem = forwardRef<HTMLDivElement, DraggableItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={clsx('ruuri-draggable-item', 'draggable-item')} ref={ref}>
        <div className={clsx(className, 'draggable-item-content')} {...props} />
      </div>
    )
  },
)
DraggableItem.displayName = 'DraggableItem'

export default DraggableItem
