import { Position } from '../positionMonitor/index';

export const default_width = 300;
export const default_height = 300;

export const getElementByType = (type: string) => {
  if (type === 'div') {
    return document.createElement('div');
  }
}

export const setElementStyle = (el: HTMLElement, attrs: { [key: string]: any }) => {
  attrs && Object.keys(attrs).forEach((key: string) => {
    el.style[key] = attrs[key];
  });
}

export const setElementClassName = (el: HTMLElement, className: string) => {
  className && (el.className = className);
}

export const setWidthHeight = (el: HTMLElement, width: number, height: number) => {
  el.style.width = (width || default_width) + 'px';
  el.style.height = (height || default_height) + 'px';
}

export const setElementId = (el: HTMLElement, id: number, type: string) => {
  el.id = `${type}-${id}`;
}

export const appendChild = ($parent: HTMLElement, $child: HTMLElement) => {
  $parent.appendChild($child);
}

export const getChild = (child_id: string, childList: Position[]) => {
  return childList.filter(item => item.$el.id === child_id)[0];
}

