import { Editor } from './core/index';

const el = document.getElementById('root');

new Editor({
  container: {
    $parent: el,
    type: 'div',
    _id: 1,
    w: 1200,
    h: 600,
    style: {
      'position': 'relative',
      'border': '1px solid black'
    },
    className: "container"
  },
  childList: [
    {
      type: 'div',
      _id: 1,
      w: 30,
      h: 20,
      position: {
        x: 100,
        y: 50
      },
      style: {
        'border': '1px solid black'
      }
    },
    {
      type: 'div',
      _id: 2,
      w: 50,
      h: 20,
      position: {
        x: 200,
        y: 50
      },
      style: {
        'border': '1px solid black'
      }
    },
    {
      type: 'div',
      _id: 3,
      w: 50,
      h: 30,
      position: {
        x: 100,
        y: 100
      },
      style: {
        'border': '1px solid black'
      }
    },
    {
      type: 'div',
      _id: 4,
      w: 50,
      h: 50,
      position: {
        x: 300,
        y: 200
      },
      style: {
        'border': '1px solid black'
      }
    }
  ]
})