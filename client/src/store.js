import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)
import { Toast, Dialog} from 'vant'
const store = new Vuex.Store({
    state:{
        msg: '我是vuex',
        regEmail: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
    },
    mutations: {

    },
    actions:{

    }
})


export default store