import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {}

export default function DraggableItem({ className, ...props }: DraggableItemProps) {
  return (
    <div className={clsx('ruuri-draggable-item', 'draggable-item')}>
      <div className={clsx(className, 'draggable-item-content')} {...props} />
    </div>
  )
}
