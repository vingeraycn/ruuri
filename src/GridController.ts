import { compact, difference } from 'lodash-es'
import Grid, { Item } from 'muuri'

export default class GridController {
  private grid: Grid
  private container: HTMLElement

  constructor(grid: Grid, container: HTMLElement) {
    this.grid = grid
    this.container = container
  }

  private getId(element: HTMLElement) {
    return element.dataset.ruuriId
  }

  private getRegisteredElements() {
    return compact(this.grid.getItems().map((item) => item.getElement()))
  }

  private getUnregisteredElements() {
    return compact(
      Array.from<HTMLElement>(
        this.container.querySelectorAll('.ruuri-draggable-item:not(.muuri-item)'),
      ),
    )
  }

  private toItem(element: HTMLElement): Item | undefined {
    const id = this.getId(element)
    return this.grid.getItems().find((item) => {
      const element = item.getElement()
      const itemId = element && this.getId(element)
      return itemId === id
    })
  }

  private elementsToItems(elements: HTMLElement[]): Item[] {
    return compact(elements.map((element) => this.toItem(element)))
  }

  private unregisterItems(elements: HTMLElement[]) {
    const staleItems = this.elementsToItems(elements)

    if (!staleItems.length) {
      return
    }
    this.grid.remove(staleItems, {
      removeElements: true,
      layout: true,
    })
  }

  private registerItems(elements: HTMLElement[]) {
    if (!elements.length) {
      return
    }
    this.grid.add(elements)
  }

  public sync(ids: string[]) {
    const registeredElements = this.getRegisteredElements()
    const registeredElementIds = compact(registeredElements.map(this.getId))
    const unregisteredElements = this.getUnregisteredElements()

    // need to remove item ids
    const staleIds = difference(registeredElementIds, ids)
    const staleElements = registeredElements.filter((element) => {
      const id = this.getId(element)
      return id && staleIds.includes(id)
    })
    const newElements = unregisteredElements

    this.unregisterItems(staleElements)
    this.registerItems(newElements)
  }
}
