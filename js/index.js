import createApp from "./main.js";
import {h} from './render.js'

const App = {
    data: {
        count: 0
    },
    render() {
        return h('div', null,[
            h('div', {class: 'count'}, `当前计数：${this.data.count}`),
            h('button', {
                onClick: () => {
                    this.data.count++
                }
            }, '+1')])
    }
}
createApp(App).mount('#app')