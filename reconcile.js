// 协调子元素，为子元素生成 fiber，并且与最近一次提交的 fiber 树中对应节点做对比，为其添加相应的标记。
export default function reconcileChildren(wipFiber, elements, deletions) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 备份节点，从第一个子节点开始
  let prevSibling = null; // 用于连接 sibling 关系

  // 遍历当前 fiber.props.children
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber = createNewFiber(oldFiber, element, wipFiber, deletions);

    // 建立 children fiber 之间的联系
    if (index === 0) {
      // 设置当前 fiber 的 child 指针
      wipFiber.child = newFiber;
    } else if (prevSibling) {
      // 连接相邻的子 fiber
      prevSibling.sibling = newFiber;
    }

    // 更新迭代变量
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    prevSibling = newFiber;
    index++;
  }
}

function createNewFiber(oldFiber, element, parent, deletions) {
  const isSameType = oldFiber && element && oldFiber.type === element.type;

  if (isSameType) {
    return {
      type: oldFiber.type,
      props: element.props,
      dom: oldFiber.dom,
      parent: parent,
      alternate: oldFiber,
      effectTag: "UPDATE",
    };
  } else {
    // 有可能是没有旧 fiber，也有可能是有旧 fiber， 但是两者类型不一样。这两种情况都需要创建一个新 fiber。
    if (element) {
      // 如果类型相同，则尽可能复用旧 fiber，只需更新 props。
      return {
        type: element.type,
        props: element.props,
        dom: null,
        parent: parent,
        alternate: null, // 因为是新的 fiber，所以没有备份
        effectTag: "PLACEMENT",
      };
    }

    // 如果旧 fiber 存在，则有可能是新 fiber 不存在，这种情况需要删除旧 fiber，并且移除掉对应的 DOM 。
    // 也有可能是新 fiber 存在，但是两者类型不一样。这种情况需要用新 fiber 替换掉旧 fiber，这种情况在上一个 if 语句中已经创建了新 fiber，所以在这里只用删除旧 fiber即可。
    if (oldFibe) {
      oldFiber.effectTag = 'DELETION';
      // 因为需要删除的节点不会存在于新的 working in process 树中，所以，需要一个列表收集待删除的节点，以便在提交阶段删除对应的 DOM。 
      deletions.push(oldFiber)
      return null
    }
  }
}