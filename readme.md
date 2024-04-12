# miviewer 项目解释

## 使用方法
使用方法，以模组的方式引入脚本中的empower_miviewer函数，然后传递一个容器，然后本模组就会给这个容器里的所有图片或视频资源都施加效果——点击就会打开一个展示界面。

另外，empower_miviewer 还可以接受第二个参数，这个参数是 JSON 对象，其中可以给定 filter 属性，其值必须为一个函数，此函数接受一个参数，并返回 true 或 false的函数，该函数用于过滤不想要被加入到 miviewer 中的 img 或 video 元素资源。