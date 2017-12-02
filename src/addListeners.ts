import {EventHandler, IEventValues} from './types'

export function addListeners(element: Element, eventValues: IEventValues, handleEvent: EventHandler) {
  const eventHandlers = ((element as any).__vdomEventHandlers = (element as any).__vdomEventHandlers || {})

  // Remove previous event handlers
  if (eventHandlers) {
    Object.keys(eventHandlers).forEach(eventType => {
      element.removeEventListener(eventType, eventHandlers[eventType])
    })
  }

  // Add event listeners
  Object.keys(eventValues).forEach(eventType => {
    const handler = (event: Event) => {
      handleEvent(eventValues[eventType], event)
    }
    eventHandlers[eventType] = handler
    element.addEventListener(eventType, handler)
  })
}
