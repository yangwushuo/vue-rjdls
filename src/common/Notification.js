import {
  Notification
} from '@arco-design/web-vue'
import {
  nanoid
} from 'nanoid'
import {
  h
} from 'vue'


const NotificationSuccess = (config) => {
  Notification.success({
    id: nanoid(),
    closable: true,
    position: 'bottomRight',
    duration: 3000,
    icon: (e) => {
      return h("span", {
        class: "material-symbols-sharp",
        innerHTML: 'done'
      })
    },
    ...config
  })
}

const NotificationError = (config) => {
  Notification.error({
    id: nanoid(),
    closable: true,
    position: 'bottomRight',
    duration: 3000,
    icon: (e) => {
      return h("span", {
        class: "material-symbols-sharp",
        innerHTML: 'close'
      })
    },
    ...config
  })
}

export {
  NotificationSuccess,
  NotificationError
}