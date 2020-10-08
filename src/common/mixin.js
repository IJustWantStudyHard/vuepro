import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { MessageBox } from 'element-ui'

import { parseTime, formatTime } from './filter'
import { apiBtn } from '@/api/default'

/**
 *该混入组件只用于定义全局复用方法
 * 不书写业务逻辑
 */
Vue.mixin({
  methods: {
    // 请求
    apiBtn,
    // 格式化时间
    parseTime,
    formatTime,
    // 二次提示封装
    defalultConfirm(msg, callBack, catchBack) {
      MessageBox.confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callBack()
      }).catch(() => {
        if (catchBack) catchBack()
      })
    },
    // 通过path跳转
    toRedirect(name, query) {
      var path = store.getters.btnPage[name]
      router.push({
        path,
        query
      })
    },
    // 通过name跳转 刷新后params参数会丢失
    toRedirectByName(name, params) {
      router.push({
        name: name,
        params
      })
    },
    // 删除属性为空的值
    removeProperty(object) {
      for (const prop in object) {
        // if (object[prop] === 0) break
        if ((!object[prop] || object[prop].length === 0) && object[prop] !== 0) {
          delete object[prop]
        }
        if (typeof (object[prop]) === 'object') this.removeProperty(object[prop])
      }
      return object
    },
    // 深度拷贝
    deepClone(obj) {
      const _toString = Object.prototype.toString

      // null, undefined, non-object, function
      if (!obj || typeof obj !== 'object') {
        return obj
      }

      // DOM Node
      if (obj.nodeType && 'cloneNode' in obj) {
        return obj.cloneNode(true)
      }

      // Date
      if (_toString.call(obj) === '[object Date]') {
        return new Date(obj.getTime())
      }

      // RegExp
      if (_toString.call(obj) === '[object RegExp]') {
        const flags = []
        if (obj.global) { flags.push('g') }
        if (obj.multiline) { flags.push('m') }
        if (obj.ignoreCase) { flags.push('i') }

        return new RegExp(obj.source, flags.join(''))
      }

      const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

      for (const key in obj) {
        result[key] = this.deepClone(obj[key])
      }

      return result
    }
  }
})
