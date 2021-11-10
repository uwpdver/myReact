import updateDom from './updateDom.js'
import { isEvent } from './utils.js';

export default function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    // 组合 DOM 节点
    let domParentFiber = fiber.parent;
    // 向上找到一个有 DOM 的 fiber，也就是 hostComponent;
    while (!domParentFiber.dom) domParentFiber = domParentFiber.parent;

    const domParent = domParentFiber.dom;

    if (
        fiber.effectTag === "PLACEMENT" &&
        fiber.dom != null
    ) {
        const props = fiber.props;
        Object.keys(props)
        .filter(isEvent)
        .forEach(key => {
            let eventType = key
                .toLowerCase()
                .substring(2);
            fiber.dom.addEventListener(
                eventType,
                props[key]
            );
        })
        domParent.appendChild(fiber.dom)
    } else if (
        fiber.effectTag === "UPDATE" &&
        fiber.dom != null
    ) {
        updateDom(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
        )
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent)
    }

    // 提交其他相关的 fiber
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}


function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        document.removeChild(fiber)
    } else {
        commitDeletion(fiber.child, domParent)
    }
}