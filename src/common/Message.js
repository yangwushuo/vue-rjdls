import {
  Message
} from '@arco-design/web-vue';
import {
  nanoid
} from 'nanoid';
import {
  h
} from 'vue';

const MessageSuccess = (config) => {
  Message.success({
    id: nanoid(),
    showIcon: true,
    closable: true,
    duration: 3000,
    resetOnHover: true,
    icon: (e) => {
      return h("span", {
        class: "material-symbols-sharp",
        innerHTML: 'done'
      })
    },
    position: 'top',
    ...config
  })
}

const MessageWarning = (config) => {
  Message.warning({
    id: nanoid(),
    showIcon: true,
    closable: true,
    duration: 3000,
    resetOnHover: true,
    icon: (e) => {
      return h("span", {
        class: "material-symbols-sharp",
        innerHTML: 'warning'
      })
    },
    position: 'top',
    ...config
  })
}

export {
  MessageSuccess,
  MessageWarning
}