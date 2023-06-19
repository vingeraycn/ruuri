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

  private getGridItemElements() {
    return compact(this.grid.getItems().map((item) => item.getElement()))
  }

  private getRegisteredElements() {
    return compact(
      Array.from<HTMLElement>(this.container.querySelectorAll('.ruuri-draggable-item.muuri-item')),
    )
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

  private toItems(elements: HTMLElement[]): Item[] {
    return compact(elements.map((element) => this.toItem(element)))
  }

  /**
   * registerItems and unregisterItems is sync to the grid model.
   * registerItems is add items to the grid model.
   * @param elements
   * @returns
   */
  private registerItems(elements: HTMLElement[]) {
    if (!elements.length) {
      return
    }
    this.grid.add(elements)
  }

  /**
   *
   * registerItems and unregisterItems is sync to the grid model.
   * unregisterItems is remove items from the grid model, and remove elements from dom tree.
   * @param elements
   * @returns
   */
  private unregisterItems(elements: HTMLElement[]) {
    const staleItems = this.toItems(elements)

    if (!staleItems.length) {
      return
    }
    this.grid.remove(staleItems, {
      removeElements: true,
      layout: true,
    })
  }

  public sync(ids: string[]) {
    const registeredElements = this.getRegisteredElements()
    const registeredElementIds = compact(registeredElements.map(this.getId))
    const newElements = this.getUnregisteredElements()

    // need to remove item ids
    const staleIds = difference(registeredElementIds, ids)
    const staleElements = registeredElements.filter((element) => {
      const elementId = this.getId(element)
      return elementId && staleIds.includes(elementId)
    })

    this.unregisterItems(staleElements)
    this.registerItems(newElements)
  }
}
