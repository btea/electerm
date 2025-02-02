// from https://zhuanlan.zhihu.com/p/112564936

const { screen } = require('electron')
const {
  isLinux
} = require('../common/runtime-constants')

let mouseStartPosition = { x: 0, y: 0 }
let movingInterval = null
let dragCount = 0

function windowMove (canMoving) {
  const { win } = global
  const size = win.getBounds()
  const scr = screen.getDisplayNearestPoint(size)
  if (canMoving) {
    win.setResizable(false)
    mouseStartPosition = screen.getCursorScreenPoint()

    if (movingInterval) {
      clearInterval(movingInterval)
    }

    movingInterval = setInterval(() => {
      dragCount = dragCount + 1
      if (dragCount > 1000) {
        dragCount = 1000
      }
      const cursorPosition = screen.getCursorScreenPoint()
      const x = size.x + cursorPosition.x - mouseStartPosition.x
      const y = size.y + cursorPosition.y - mouseStartPosition.y
      const { workAreaSize } = scr
      let nw = size.width
      let nh = size.height
      if (
        isLinux &&
        dragCount > 200 &&
        size.width === workAreaSize.width &&
        size.height === workAreaSize.height
      ) {
        nw = size.width - 100
        nh = size.height - 100
      }
      win.setBounds({
        width: nw,
        height: nh,
        x,
        y
      })
    }, 1)
  } else {
    win.setResizable(true)
    dragCount = 0
    clearInterval(movingInterval)
  }
}

module.exports = windowMove
