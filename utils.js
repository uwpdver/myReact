export const isNew = (prev, next) => key => prev[key] !== next[key];
export const isEvent = key => key.startsWith('on');
export const isProperty = key => key !== "children" && !isEvent(key);
export const isGone = (prev, next) => key => !(key in next);

export const isFunctionComponent = fiber => fiber.type instanceof Function;

export function createDomByFiber(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const { children, ...restProps } = fiber.props;

  for (let propName in restProps) {
    if (restProps.hasOwnProperty(propName)) {
      dom[propName] = restProps[propName];
    }
  }

  return dom;
}