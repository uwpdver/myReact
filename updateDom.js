import {
    isNew,
    isEvent,
    isProperty,
    isGone,
} from './utils.js';

export default function updateDom(dom, prevProps, nextProps) {
    // 将 nextProps 中不存在的属性在 DOM 中移除
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => dom[name] = '')

    // 将 nextProps 中新增的属性添加到 DOM 中
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => dom[name] = nextProps[name])

    // 移除无用的事件订阅
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
        .forEach(key => {
            let eventType = key
                .toLowerCase()
                .substring(2);
            dom.removeEventListener(
                eventType,
                prevProps[key]
            );
        })

    // 添加新的事件订阅
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(key => {
            let eventType = key
                .toLowerCase()
                .substring(2);
            dom.addEventListener(
                eventType,
                nextProps[key]
            );
        })
}
