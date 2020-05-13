import {
  setElementStyle
} from './index';
import { LinePosition } from '../positionMonitor/index';


export const drawLine = (type: LinePosition, arr: any, delta: number) => {

  const draw = (x: number, y: number, len: number, type: LinePosition) => {
    const line = document.createElement('span');
    line.className = `line-demo line-${x}-${y}`;
    let props = {};
    if (type === LinePosition.VERTICAL) {
      props = {
        'width': `${len}px`,
        'height': '1px',
      }
    } else if (type === LinePosition.HORIZONTAL) {
      props = {
        'width': '1px',
        'height': `${len}px`,
      }
    }
    setElementStyle(line, {
      'position': 'absolute',
      'top': `${y}px`,
      'left': `${x}px`,
      'color': 'red',
      'backgroundColor': 'red',
      ...props
    })
    document.querySelector('.container').appendChild(line);
  }

  switch (type) {
    case LinePosition.VERTICAL: {
      arr.forEach(item => {
        if (item.delta === delta) {
          const source_hr = item.source.box.hr.pos;
          const source_hl = item.source.box.hl.pos;
          const target_hl = item.target.box.hl.pos;
          const target_hr = item.target.box.hr.pos;
          const source_y = item.source.pos;
          if (target_hl >= source_hr) {
            draw(source_hr, source_y, target_hl - source_hr, type);
          } else {
            draw(target_hr, source_y, source_hl - target_hr, type);
          }
        }
      })
    }
    case LinePosition.HORIZONTAL: {
      arr.forEach(item => {
        if (item.delta === delta) {
          const source_vt = item.source.box.vt.pos;
          const source_vb = item.source.box.vb.pos;
          const target_vt = item.target.box.vt.pos;
          const target_vb = item.target.box.vb.pos;
          const source_x = item.source.pos;
          if (target_vb >= source_vt) {
            draw(source_x, source_vb, target_vt - source_vb, type);
          } else {
            draw(source_x, target_vb, source_vt - target_vb, type);
          }
        }
      })
    }

    default: {
      return;
    }
  }
}


export const removeAllLine = () => {
  const lineDomList = document.querySelectorAll('.line-demo');
  const container = document.querySelector('.container');
  Array.from(lineDomList).forEach(dom_item => {
    container.removeChild(dom_item);
  })
}
