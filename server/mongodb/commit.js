const mongoose = require('mongoose')

const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/slose", { useNewUrlParser: true })

var commitSchema = new Schema({
    infoId:{
        type: String,
        required: true
    },
    fromId:{
        type: String,
        required: true
    },
    toId:{
        type: String,
        required: true
    },
    commit:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('commit', commitSchema)


{/* <div class="commit-wrap">
<div class="c-in">
    <van-field v-show="reject_replay" :placeholder="commitHolder"
        @focus="reject_replay = false">
        <van-button slot="button" size="small" type="info" 
            v-show="toId" 
        >取消回复</van-button>
    </van-field>

    <van-field v-model="commit" v-show="!reject_replay" :placeholder="commitHolder"
        type="textarea"
        autosize
        rows="1"
        @focus="reject_replay = false"
        @blur="reject_replay = true">
            <van-button slot="button" size="small" type="info">发表</van-button>
    </van-field>
</div>
</div> */}