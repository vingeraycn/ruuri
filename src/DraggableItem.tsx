import clsx from 'clsx'
import { HTMLAttributes } from 'react'
import { ruuriDraggableItem } from './styles.module.css'

export interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {}

export default function DraggableItem({ className, ...props }: DraggableItemProps) {
  return (
    <div className={clsx(ruuriDraggableItem, 'draggable-item')}>
      <div className={clsx(className, 'draggable-item-content')} {...props} />
    </div>
  )
}
