# Vue-next简单实现

## TOC
- render-div        
    - 渲染文本div
- render-children   
    - 渲染带有子节点的div
- render-props      
    - 渲染带有属性的div

- set-state         
    - 简单更新,全部重新渲染
- proxy             
    - effect的set时触发渲染
- track-trigger     
    - effect下的get/track和set/trigger

- component         
    - setup返回render结果
- diff-props        
    - container->oldVNode->oldEl->oldPros与newProps比较
- diff-children     
    - array->string,string->string,string->array,array->array
- diff-array
    - patchKeyedChildren最长上升子序列 

## 0 框架环境
[hello分支](https://github.com/codediy/vue-next-diy/tree/hello)

## 1 renderDiv
[render-div分支](https://github.com/codediy/vue-next-diy/tree/render-div)

## 1.2 mountChildren
[mount-children分支](https://github.com/codediy/vue-next-diy/tree/mount-children)
### 挂载子节点
- 递归挂载子节点children

## 1.3 patchProps
[patch-props分支](https://github.com/codediy/vue-next-diy/tree/patch-props)

### props的处理
- 变量props进行相应处理

## 2 setState
[set-state分支](https://github.com/codediy/vue-next-diy/tree/set-state)

### setState的处理
- 重新生成Vnode
- 渲染新的Vnode,删除旧的已渲染，重新挂载

### 修复问题
- moutn-children分支下的mountChildren参数错误

## 2.2 proxy
[proxy分支](https://github.com/codediy/vue-next-diy/tree/proxy)

### proxy实现
- proxy的set中重新渲染

## 2.3 effect
[effect分支](https://github.com/codediy/vue-next-diy/tree/effect)

### effect实现
- effect注册副作用函数
- reactive的代理中数据变化，再次调用副作用函数 


## 2.4 track-trigger
[track-trigger分支](https://github.com/codediy/vue-next-diy/tree/track-trigger)


### track-trigger
- track注册effect到targetMap
- trigger查找targetMap中的effect并执行

## 3 Component
[component分支](https://github.com/codediy/vue-next-diy/tree/component)

### component实现
- render()中调用patch()
- patch()中根据type类型进行不同的处理
- Component的setUp()返回的render()可以生成虚拟dom树
 

## 4 patchProps
[propsPatch分支](https://github.com/codediy/vue-next-diy/tree/props-patch)

### patchProps
- 前面的1.3patchProps实际是renderProps.对props的首次渲染
- 这里的patchProps是props更新后的重新比较渲染
- 实现获取container->oldVNode->oldEl->oldProps,并与newProps比较

## 4.1 patchChildren
[samplePatchChildren分支](https://github.com/codediy/vue-next-diy/tree/sample-patch-children)

### patchChildren
- 子节点的比较分为四种
- array->string,string->string,string->array,array->array
- 这里只是简单前3种
    - array->string,string->string,先删除旧的array,然后挂载新的string
    - string->array 先删除旧的string,再挂载新的array

## 4.2 tow-array
[twoArray分支](https://github.com/codediy/vue-next-diy/tree/tow-array)

### two-array
- patchChildren最后一种array->array
- 这里使用Key作为子节点唯一
- 分为四种情况，
    - 删除旧key子节点
    - 更新旧key子节点,位置不变
    - 新增key子节点
    - 更新旧key子节点,移动位置

## 参考
- [vue-next-write](https://github.com/ruige24601/vue-next-write.git)

- [vue-next-write视频](https://www.bilibili.com/video/BV1nT4y1779z)
