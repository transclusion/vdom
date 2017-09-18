import {EventHandler, EventType, IListeners} from './types'

export const addListeners = (
  element: Element,
  listeners: IListeners,
  handleEvent: EventHandler
) => {
  const eventHandlers = ((element as any).__vdomEventHandlers =
    (element as any).__vdomEventHandlers || {})

  // Remove previous event handlers
  if (eventHandlers) {
    Object.keys(eventHandlers).forEach(eventType => {
      element.removeEventListener(eventType, eventHandlers[eventType])
    })
  }

  // Add event listeners
  Object.keys(listeners).forEach((eventType: EventType) => {
    const handler = (event: Event) => {
      handleEvent(eventType, event, listeners[eventType])
    }
    eventHandlers[eventType] = handler
    element.addEventListener(eventType, handler)
  })
}
