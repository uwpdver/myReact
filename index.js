import commitWork from "./commitWork.js";
import reconcileChildren from "./reconcile.js";
import createElement, { createTextElement } from "./createElement.js";
import { createDomByFiber, isFunctionComponent } from './utils.js'

// 工作循环
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = processUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function processUnitOfWork(fiber) {
  if(isFunctionComponent(fiber)){
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 选择下一个工作单元
  if (fiber.child) {
    return fiber.child;
  } else {
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      } else {
        nextFiber = nextFiber.parent;
      }
    }
  }
}

function updateFunctionComponent(fiber) {
  // 函数组件本身没有 DOM 节点
  // 通过调用函数组件的 type 方法来获取该组件生成的元素
  const children = [fiber.type(fiber.props)] // type 方法的返回值只有一个元素，不是数组，所以要将其作为数组的元素 
  reconcileChildren(fiber, children, deletions)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDomByFiber(fiber);
  }
  reconcileChildren(fiber, fiber.props.children, deletions);
}

function commitRoot() {
  // 先删除所有待删除的节点
  deletions.forEach(commitWork)
  commitWork(wipRoot.child);
  // 工作完成之后将 currentRoot 指向刚完成的工作树
  currentRoot = wipRoot;
  // 工作完成之后将工作树置空
  wipRoot = null;
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot
  };
  // 每次渲染都要重置待删除 fiber 节点列表。
  deletions = [];
  // 触发工作循环
  nextUnitOfWork = wipRoot;
}

requestIdleCallback(workLoop);

export default {
  createElement,
  createTextElement,
  render
};