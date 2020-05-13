import { Position } from '../positionMonitor/index';
type childType = 'div' | 'span' | string;

export type PositionType = {
  x: number;
  y: number;
}

export type ChildDomType = {
  /**
   * dom品种
   */
  type: childType;
  /**
   * dom的id
   */
  _id: number;
  /**
   * dom对象的宽度
   */
  w: number;
  /**
   * dom对象的长度
   */
  h: number;
  /**
   * dom的位置
   */
  position: PositionType;
  style?: { [key: string]: any },
  className?: string,
}

export type ContainerDomType = {
  /**
   * dom对象的
   */
  $parent: HTMLElement;
  /**
   * dom的种类
   */
  type: string;
  /**
   * dom的id
   */
  _id: number;
  /**
   * 容器的宽度
   */
  w: number;
  /**
   * 容器的高度
   */
  h: number;
  style?: { [key: string]: any };
  className?: string;
}

export interface IEditorProps {
  container: ContainerDomType;
  childList: ChildDomType[];
}


export interface IPosition {
  /**
   * dom
   */
  $el: HTMLElement;
  /**
   * 
   */
  position: PositionType;
  container_w: number;
  container_h: number;
}



export type DragType = {
  $el: HTMLElement,
  x: number;
  y: number;
  w: number;
  h: number;
}

export type DragEventProps = {
  $container: HTMLElement;
  container_w: number;
  container_h: number;
  childList: Position[],
}