// @flow

type Listeners = {
  [type: string]: any
}

const addListeners = (
  node: Node,
  listeners: Listeners,
  handleMsg: Function
) => {
  Object.keys(listeners).forEach(type => {
    const handler = (event: Event) => {
      if (listeners[type].preventDefault) {
        event.preventDefault()
      }

      handleMsg(listeners[type])
    }

    node.addEventListener(type, handler)
  })
}

export default addListeners
