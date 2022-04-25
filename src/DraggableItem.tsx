import clsx from 'clsx'
import { HTMLAttributes } from 'react'
import './DraggableItem.css'

export interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {}

export default function DraggableItem({ className, ...props }: DraggableItemProps) {
  return (
    <div className="draggable-item">
      <div className={clsx(className, 'draggable-item-content')} {...props} />
    </div>
  )
}
