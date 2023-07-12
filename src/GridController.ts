import { compact, debounce, difference } from 'lodash-es'
import Grid, { Item } from 'muuri'

export default class GridController {
  private grid: Grid
  private container: HTMLElement
  private registeredElements: WeakSet<HTMLElement>

  constructor(grid: Grid, container: HTMLElement) {
    this.grid = grid
    this.container = container
    this.registeredElements = new WeakSet(this.getGridItemElements())
  }

  private getId(element: HTMLElement) {
    return element.dataset.ruuriId
  }

  private getGridItemElements(items?: Item[]) {
    return compact(this.grid.getItems(items).map((item) => item.getElement()))
  }

  private getUnregisteredElements() {
    return compact(
      Array.from<HTMLElement>(this.container.querySelectorAll('[data-ruuri-id]')).filter(
        (element) => !this.registeredElements.has(element),
      ),
    )
  }

  private registerElements(elements: HTMLElement[]): void {
    if (!elements.length) {
      return
    }
    this.grid.add(elements, {})
    elements.forEach((element) => this.registeredElements.add(element))
  }

  private unregisterItems(items: Item[]) {
    if (!items.length) {
      return
    }
    this.grid.remove(items, {})
    this.getGridItemElements(items).forEach((element) => this.registeredElements.delete(element))
  }

  private unregisterByIds(ids: string[]) {
    const staleItems = this.grid.getItems().filter((item) => {
      const element = item.getElement()
      const elementId = element && this.getId(element)
      return elementId && ids.includes(elementId)
    })

    this.unregisterItems(staleItems)
  }

  public sync = debounce((ids: string[]) => {
    const gridItemElements = this.getGridItemElements()
    const gridItemElementIds = compact(gridItemElements.map((item) => this.getId(item)))
    const staleIds = difference(gridItemElementIds, ids)
    const newElements = this.getUnregisteredElements()

    this.unregisterByIds(staleIds)
    this.registerElements(newElements)
  }, 50)
}
