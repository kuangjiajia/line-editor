import { IPosition } from '../interface/index';
import { setElementStyle } from '../utils/index';
import { drawLine, removeAllLine } from '../utils/line';

const vLines: Line[] = [];
const hLines: Line[] = [];

enum LineType {
  SOLID = 'SOLID'
}

export enum LinePosition {
  /**
   * 垂直
   */
  VERTICAL = "VERTICAL",
  /**
   * 水平
   */
  HORIZONTAL = "HORIZONTAL"
}


export interface Line {
  pos: number;
  type: LineType;
  box?: Position | null;
}

export const SCOPE = 3;


export class Position {
  /**
   * 当前拖拽的dom的x值
   */
  private current_x: number;
  /**
  * 当前拖拽的dom的y值
  */
  private current_y: number;
  /**
   * 鼠标距当前拖拽dom的x值的距离
   */
  private delta_x: number;
  /**
  * 鼠标距当前拖拽dom的y值的距离
  */
  private delta_y: number;
  /**
   * 鼠标移动的x值
   */
  private mouse_move_x: number;
  /**
   * 鼠标移动的y值
   */
  private mouse_move_y: number;
  /**
   * 鼠标按下的x值
   */
  private mouse_down_x: number;
  /**
   * 鼠标按下的y值
   */
  private mouse_down_y: number;
  /**
   * 是否吸附x轴
   */
  private adsorpt_x: boolean;
  /**
   * 是否吸附y轴
   */
  private adsorpt_y: boolean;
  /**
   * 吸附的x距离
   */
  private adsorpt_x_move: number;
  /**
  * 吸附的y距离
  */
  private adsorpt_y_move: number;
  /**
   * 容器的宽度
   */
  private container_w: number;
  /**
   * 容器的高度
   */
  private container_h: number;
  /**
   * 当前的dom元素
   */
  $el: HTMLElement;
  /**
   * 上方的参考线
   */
  vt: Line;
  /**
   * 中间的参考线
   */
  vm: Line;
  /**
   * 底部的参考线
   */
  vb: Line;
  /**
   * 左边的参考线
   */
  hl: Line;
  /**
   * 中间的参考线
   */
  hm: Line;
  /**
   * 右边的参考线
   */
  hr: Line;

  constructor(props: IPosition) {
    this.initialProps(props);
  }

  get x(): number {
    return this.current_x;
  }

  get y(): number {
    return this.current_y;
  }

  initialProps = (props: IPosition) => {
    const { $el, position, container_w, container_h } = props;
    const { x, y } = position;
    this.current_x = x;
    this.current_y = y;
    this.delta_x = 0;
    this.delta_y = 0;
    this.$el = $el;
    this.container_w = container_w;
    this.container_h = container_h;
    this.adsorpt_x = false;
    this.adsorpt_y = false;
    this.setLines(true);
    this.setElementPosition(true);
  }

  setLines = (initial?: boolean) => {
    this.setLine('vt', this.current_y, initial);
    this.setLine('vm', this.current_y + this.container_h / 2, initial);
    this.setLine('vb', this.current_y + this.container_h, initial);
    this.setLine('hl', this.current_x, initial);
    this.setLine('hm', this.current_x + this.container_w / 2, initial);
    this.setLine('hr', this.current_x + this.container_w, initial);
    if (!initial) return;
    vLines.push(this.vt, this.vm, this.vb);
    hLines.push(this.hl, this.hm, this.hr);
  }

  setLine = (props: string, pos: number, initial: boolean, type: LineType = LineType.SOLID) => {
    if (initial) {
      this[props] = {
        pos,
        type,
        box: this
      }
    } else {
      this[props]['pos'] = pos;
    }
  }

  setElementPosition = (initial?: boolean) => {
    let props = {};
    if (initial) {
      props = {
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
      }
    }
    setElementStyle(this.$el, {
      ...props,
      'transform': `translate(${this.x}px, ${this.y}px)`
    })
  }


  changePosition = () => {
    // 移动元素
    this.setElementPosition();

    this.calc();
  }

  onMouseDown = (x: number, y: number) => {
    this.setMouseDown(x, y);
    this.setDelta(x, y);
  }

  onMouseMove = e => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    this.setMouseMove(clientX, clientY);
    this.setCurrentPosition(clientX, clientY);
    this.changePosition();
  }

  onMouseUp = () => {
    removeAllLine();
  }

  setCurrentPosition = (x: number, y: number) => {
    const adsorpt_none = !this.adsorpt_x && !this.adsorpt_y;
    const adsorpt_all = this.adsorpt_x && this.adsorpt_y;
    const adsorpt_x = this.adsorpt_x;
    const adsorpt_y = this.adsorpt_y;

    if (adsorpt_none) {
      this.current_x = x - this.delta_x;
      this.current_y = y - this.delta_y;
    } else {
      if (adsorpt_all) {
        const abs_x = Math.abs(this.mouse_move_x - this.adsorpt_x_move);
        const abs_y = Math.abs(this.mouse_move_y - this.adsorpt_y_move);
        if (abs_x > SCOPE) {
          this.current_x = x - this.delta_x;
          this.adsorpt_x = false;
          this.adsorpt_x_move = 0;
        } else if (abs_y > SCOPE) {
          this.current_y = y - this.delta_y;
          this.adsorpt_y = false;
          this.adsorpt_y_move = 0;
        }
      } else {
        if (adsorpt_x) {
          const abs_x = Math.abs(this.mouse_move_x - this.adsorpt_x_move);
          this.current_y = y - this.delta_y;
          if (abs_x <= SCOPE) return;
          this.current_x = x - this.delta_x;
          this.adsorpt_x = false;
          this.adsorpt_x_move = 0;
        } else if (adsorpt_y) {
          const abs_y = Math.abs(this.mouse_move_y - this.adsorpt_y_move);
          this.current_x = x - this.delta_x;
          if (abs_y <= SCOPE) return;
          this.current_y = y - this.delta_y;
          this.adsorpt_y = false;
          this.adsorpt_x_move = 0;
        }
      }
    }
  }


  setDelta = (mouse_down_x: number, mouse_down_y: number) => {
    this.delta_x = mouse_down_x - this.x;
    this.delta_y = mouse_down_y - this.y;
  }

  setMouseMove = (x: number, y: number) => {
    this.mouse_move_x = x - this.mouse_down_x;
    this.mouse_move_y = y - this.mouse_down_y;
  }

  setMouseDown = (x: number, y: number) => {
    this.mouse_down_x = x;
    this.mouse_down_y = y;
  }

  moveDom = (type: LinePosition, dis: number) => {
    if (type === LinePosition.VERTICAL) {
      this.delta_y += dis;
      this.current_y -= dis;
    } else if (type === LinePosition.HORIZONTAL) {
      this.delta_x += dis;
      this.current_x -= dis;
    }
    this.setElementPosition();
  }

  calc = () => {
    this.setLines();
    removeAllLine();
    const v_arr: any[] = [];
    const h_arr: any[] = [];
    let v_delta_min = undefined;
    let v_diff = undefined;
    let h_delta_min = undefined;
    let h_diff = undefined;

    vLines.forEach(item => {
      if (item.box === this) return;
      ['vt', 'vm', 'vb'].forEach(v_item => {
        const shoudldDrawVLine = Math.abs(item.pos - this[v_item].pos) <= SCOPE;
        if (!shoudldDrawVLine) return;
        const v_delta = Math.abs(item.pos - this[v_item].pos);
        v_arr.push({
          source: item,
          target: this[v_item],
          type: 'solid',
          delta: v_delta,
        })
        const initial_delta_min = v_delta_min === undefined;
        if (initial_delta_min) {
          v_delta_min = v_delta;
          v_diff = this[v_item].pos - item.pos;
        } else if (v_delta < v_delta_min) {
          v_delta_min = v_delta;
          v_diff = this[v_item].pos - item.pos;
        }
      })
    })

    if (v_delta_min !== undefined) {
      drawLine(LinePosition.VERTICAL, v_arr, v_delta_min);
      if (!this.adsorpt_y) {
        this.moveDom(LinePosition.VERTICAL, v_diff);
        this.adsorpt_y = true;
        this.adsorpt_y_move = this.mouse_move_y;
        this.adsorpt_x_move = this.mouse_move_x;
      }
    }

    hLines.forEach(item => {
      if (item.box === this) return;
      ['hl', 'hm', 'hr'].forEach(h_item => {
        const shoudldDrawVLine = Math.abs(item.pos - this[h_item].pos) <= SCOPE;
        if (!shoudldDrawVLine) return;
        const h_delta = Math.abs(item.pos - this[h_item].pos);
        h_arr.push({
          source: item,
          target: this[h_item],
          type: 'solid',
          delta: h_delta,
        })
        const initial_delta_min = h_delta_min === undefined;
        if (initial_delta_min) {
          h_delta_min = h_delta;
          h_diff = this[h_item].pos - item.pos;
        } else if (h_delta < h_delta_min) {
          h_delta_min = h_delta;
          h_diff = this[h_item].pos - item.pos;
        }
      })
    })

    if (h_delta_min !== undefined) {
      drawLine(LinePosition.HORIZONTAL, h_arr, h_delta_min);
      if (!this.adsorpt_x) {
        this.moveDom(LinePosition.HORIZONTAL, h_diff);
        this.adsorpt_x = true;
        this.adsorpt_y_move = this.mouse_move_y;
        this.adsorpt_x_move = this.mouse_move_x;
      }
    }
  }

}


