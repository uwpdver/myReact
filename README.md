这是一个根据文章 [Build you own react](https://pomb.us/build-your-own-react/) 实现的一个简易版 react。实现了 react 的部分功能，包括：  
* 创建元素；  
* 根据元素生成 DOM 并渲染到屏幕上；  
* fiber，将渲染过程分片，平且在空闲时执行工作单元；  
* 协调，对比前后 fiber 树，更新必要的 DOM 节点；  
* 通过声明 props 添加事件；  

这是一个非常简单的版本，仅供学习和参考。