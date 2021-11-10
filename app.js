
import { createTextElement } from './createElement.js';
import MyReact from './index.js'

const handleOnInput = (e) => {
  MyReact.render(AppComponent({ value: '啥都没有', text: e.target.value }), rootContainer);
}

function InputComponent(props){
  const { children, ...rest } = props;
  return MyReact.createElement('input', rest)
}

function TitleComponent(props){
  const { children, ...rest } = props;
  return MyReact.createElement('h1', rest, createTextElement(children))
}

function AppComponent(props){
  return MyReact.createElement(
    'div',
    props,
    TitleComponent({ children: props.text }),
    InputComponent({ value: props.value, onInput: handleOnInput })
  )
}

const rootContainer = document.getElementById("root");
MyReact.render(AppComponent({ value: '啥都没有', text: 'hello world' }), rootContainer);