import { Position } from '../positionMonitor/index';
import { DragEventProps, DragType, PositionType } from '../interface/index';
import { getChild } from '../utils/index';


export class DragEvent {
  private $container: HTMLElement;
  private $mouse_down_Dom: Position;
  private childList: Position[];


  constructor(props: DragEventProps) {
    this.init(props);
  }

  init = (props: DragEventProps) => {
    this.initialProps(props);
    this.bindMouseEvent();
  }

  initialProps = (props: DragEventProps) => {
    const { $container, childList } = props;
    this.$container = $container;
    this.childList = childList;
  }


  bindMouseEvent = () => {
    this.$container.addEventListener('mousedown', this.mouseDownEvent, false);
    this.$container.addEventListener('mousemove', this.mouseMoveEvent, false);
    this.$container.addEventListener('mouseup', this.mouseUpEvent, false);
  }

  removeMouseEvent = () => {
    this.$container.removeEventListener('mousedown', this.mouseDownEvent);
    this.$container.removeEventListener('mousemove', this.mouseMoveEvent);
    this.$container.removeEventListener('mouseup', this.mouseUpEvent);
  }



  reset_mouse = () => {
    this.$mouse_down_Dom.setMouseMove(0, 0);
    this.$mouse_down_Dom = null;
  }

  mouseDownEvent = e => {
    const child = getChild(e.target.id, this.childList);
    if (!child) return;
    this.$mouse_down_Dom = child;
    this.$mouse_down_Dom.onMouseDown(e.clientX, e.clientY);
  }

  mouseMoveEvent = e => {
    if (!this.$mouse_down_Dom) return;
    this.$mouse_down_Dom.onMouseMove(e);
  }

  mouseUpEvent = e => {
    const child = getChild(e.target.id, this.childList);
    if (!child) return;

    this.$mouse_down_Dom.onMouseUp();
    this.reset_mouse();
  }
}