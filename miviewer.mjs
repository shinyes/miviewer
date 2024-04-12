import { getAllDescendants } from "./base_mods/access_node.mjs"

/* 下面三行用于获取当前脚本的目录 */
const currentScriptUrl = import.meta.url;
const curr_script_path = new URL(currentScriptUrl).pathname;
const curr_script_dir_path = curr_script_path.substring(0, curr_script_path.lastIndexOf('/'));

export async function empower_miviewer(miviewer_container, options = { filter: null }) {
    // 获取 miviewer_container 的所有类名含有 miviewer-item 的子孙元素，并存储到 arr_of_miviewer_item 中
    let arr_of_miviewer_item = getAllDescendants(miviewer_container, options.filter)

    // 为每一个 miviewer-item 元素添加事件监听器，这个事件监听器的功能是点击后就打开 miviewer_player，并且 miviewer_player 中就会展览 arr_of_miviewer_item 中的所有图片或视频
    arr_of_miviewer_item.forEach(miviewer_item => {
        // 这个监听器是一个闭包，会把 miviewer_item 保留下来，就算 empower_miviewer 结束运行
        miviewer_item.addEventListener('click', event => {
            // 打开 miviewer_container
            pop_up_miviewer_container(event.target, arr_of_miviewer_item, options)
        })
    });
}

/* miviewer_container 是在一个网页中式唯一的，当点击视频后，弹出，并播放 */
let miviewer_container = document.createElement('div')
miviewer_container.id = 'miviewer-container'

/* 创建顶部条、展览框和底部阅览条的元素 */
let top_bar = document.createElement('div')
top_bar.id = 'top-bar'
miviewer_container.appendChild(top_bar)

/* 这个元素放在 miviewer_container 的右上角，点击之后关闭 miviewer_container */
let close_miviewer_btn = document.createElement('img')
close_miviewer_btn.src = curr_script_dir_path + '/' + 'assets/times.svg'
close_miviewer_btn.id = 'close-miviewer'
top_bar.appendChild(close_miviewer_btn)

// 创建中间容器
let mid_bar = document.createElement('div')
mid_bar.id = 'mid-bar'
miviewer_container.appendChild(mid_bar)

let left_column = document.createElement('div')
left_column.id = 'left-column'
mid_bar.appendChild(left_column)

let showcase = document.createElement('div')
showcase.id = 'showcase'
mid_bar.appendChild(showcase)

let right_column = document.createElement('div')
right_column.id = 'right-column'
mid_bar.appendChild(right_column)

let btm_bar = document.createElement('div')
btm_bar.id = 'btm-bar'
miviewer_container.appendChild(btm_bar)

let angle_left = document.createElement('img')
angle_left.id = 'angle-left'
angle_left.src = curr_script_dir_path + '/' + 'assets/angle-left.svg'
let angle_right = document.createElement('img')
angle_right.id = 'angle-right'
angle_right.src = curr_script_dir_path + '/' + 'assets/angle-right.svg'
left_column.appendChild(angle_left)
right_column.appendChild(angle_right)

/* 
展览 arr_of_miviewer_item 中的图片或视频
*/
function pop_up_miviewer_container(target, arr_of_miviewer_item, options = {}) {
    arr_of_miviewer_item.forEach(item => {
        // 复制一份新的节点，方便展示
        let t = item.cloneNode()
        // 点击的那个图片/视频显示，其他的不显示
        if (item !== target) {
            t.style.display = 'none'
        }
        // 打开视频元素的控件
        if (t instanceof HTMLVideoElement) {
            item.pause()
            t.controls = true
        }
        showcase.appendChild(t)
    });
    document.body.appendChild(miviewer_container)
    miviewer_container.style.display = 'block'
}

/* 
关闭 miviewer
*/
function close_miviewer() {
    // 清空 showcase
    showcase.innerHTML = ''
    document.body.removeChild(miviewer_container)
}

/* 
实现在弹出 miviewer_container 时，按下 ESC 键就关闭弹出的界面
*/
document.addEventListener('keydown', event => {
    if (event.key === "Escape" && miviewer_container.style.display == 'block') {
        close_miviewer()
    }
});

/*
实现按下 close_miviewer_btn 时，关闭 miviewer_container
*/
close_miviewer_btn.addEventListener('click', event => {
    close_miviewer()
})

/*
返回当前正在展示的资源
*/
function get_current_show_resc() {
    let rescs = showcase.children
    for (let index = 0; index < rescs.length; index++) {
        const element = rescs[index];
        if (element.style.display !== 'none') {
            return element
        }
    }
}

/* 当点击左箭头时，如果前面还有资源，就显示前面一个资源 */
angle_left.addEventListener('click', event => {
    let curr_show_resc = get_current_show_resc()
    let previousElementSibling = curr_show_resc.previousElementSibling
    if (previousElementSibling !== null) {
        curr_show_resc.style.display = 'none'
        previousElementSibling.style.display = 'block'
    }
})

/* 当点击右箭头时，如果后面还有资源，就显示后面一个资源 */
angle_right.addEventListener('click', event => {
    let curr_show_resc = get_current_show_resc()
    let nextElementSibling = curr_show_resc.nextElementSibling
    if (nextElementSibling !== null) {
        curr_show_resc.style.display = 'none'
        nextElementSibling.style.display = 'block'
    }
})