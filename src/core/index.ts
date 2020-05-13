import {
  IEditorProps,
  ContainerDomType,
  ChildDomType,
  DragEventProps
} from './interface/index';
import {
  getElementByType,
  setElementStyle,
  setElementClassName,
  setWidthHeight,
  setElementId,
  appendChild
} from './utils/index';
import {
  DragEvent,
} from './eventBus/dragEvent';
import {
  Position
} from './positionMonitor/index';


export class Editor {
  private $parent: HTMLElement;
  private $container: HTMLElement;
  private $childList: ChildDomType[];
  private dragEvent: DragEvent;
  private container_w: number;
  private container_h: number;

  constructor(props: IEditorProps) {
    const { container, childList } = props;
    this.createContainerDom(container);
    this.createChildDom(childList);
  }
  /**
   * 初始化容器
   */
  createContainerDom(container: ContainerDomType) {
    const { $parent, type, _id, w, h, style, className } = container;
    const newElement = getElementByType(type);
    setElementStyle(newElement, style);
    setElementClassName(newElement, className);
    setWidthHeight(newElement, w, h);
    setElementId(newElement, _id, 'container');
    appendChild($parent, newElement)

    this.container_w = w;
    this.container_h = h;
    this.$parent = $parent;
    this.$container = newElement;
  }
  /**
   * 初始化子元素列表
   */
  createChildDom(childList: ChildDomType[]) {
    const childLen = childList.length;
    const eventProps: DragEventProps = {
      $container: this.$container,
      container_w: this.container_w,
      container_h: this.container_h,
      childList: [],
    }
    for (let i = 0; i < childLen; i++) {
      const child = childList[i];
      const { type, _id, w, h, position, style, className } = child;
      const newElement = getElementByType(type);
      setElementStyle(newElement, style);
      setElementClassName(newElement, className);
      setWidthHeight(newElement, w, h);
      setElementId(newElement, _id, 'child');
      appendChild(this.$container, newElement);
      eventProps.childList.push(new Position({
        $el: newElement,
        position,
        container_w: w,
        container_h: h,
      }))
    }


    this.dragEvent = new DragEvent(eventProps);
    this.$childList = childList;
  }

}


