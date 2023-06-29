export default function injectStyle() {
  if (
    typeof window?.document?.createElement === 'undefined' ||
    document.querySelector('#ruuri-style') !== null
  ) {
    return
  }

  const style = document.createElement('style')

  style.id = 'ruuri-style'
  style.innerHTML = `
    .ruuri-draggable-grid {
      position: relative;
    }
    
    .ruuri-draggable-item {
      user-select: none;
      position: absolute;
      z-index: 1;
      cursor: pointer;

      pointer-events: none;
      opacity: 0;
    }

    .ruuri-draggable-item.muuri-item-positioning {
      z-index: 2;
    }
    
    .ruuri-draggable-item.muuri-item-dragging,
    .ruuri-draggable-item.muuri-item-releasing {
      z-index: 3;
    }
    
    .ruuri-draggable-item.muuri-item-dragging {
      cursor: move;
    }
    
    .ruuri-draggable-item.muuri-item-hidden {
      z-index: 0;
    }

    .ruuri-draggable-item.muuri-item-shown {
      pointer-events: auto;
      opacity:1;
    }
  `
  document.head.appendChild(style)
}
