<template>
  <div class="notfound" @click="back">  
    <div class="messig">
        <el-alert :title="'页面将'+time.num+'s后返回上一页'" :closable="false"type="success" />
    </div>
 </div> 
</template>
 
<script setup>
import {useRouter} from 'vue-router'
import {reactive,onUnmounted} from 'vue'
const router=useRouter();
const time=reactive({
    num:5
})
const timer =setInterval(() => {
    time.num--;
    console.log(time.num);
    
    if(time.num==0){
        router.go(-1);
    }
}, 1000);
 const back = () => {
    //  router.go(-1);
     router.back();
 }
 //销毁时清除定时器
 onUnmounted(()=>{
    clearInterval(timer);
   
 })
</script>
 
<style lang='less' scoped>
 .notfound{
    width: 100%;
    height: 100%;
    background: url('@/assets/imgs/404.png') no-repeat center center;
    background-size: 100%;
    display: flex;
    justify-content: center;

}
 .messig{
    width: 20%;
    margin-top: 60px;
 }
</style>