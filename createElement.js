export default function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "object") {
          return child;
        } else {
          // 如果子元素是原始类型，类似字符串或者数字，则创建的一个不包含其他元素的文本元素
          return createTextElement(child);
        }
      })
    }
  };
}

// 创建文本节点，文本节点不包含其他的子元素，所以 children 为空数组
export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}