//导入defineStore  方法  创建一个 store实例对象并单个暴露出去

import {defineStore} from 'pinia'

//函数式编程 只要是函数 以 useXXX开头  
//defineStore  参数1： 唯一的模块标记  不同的stores中的模块文件  不能重复 
export const userStore = defineStore('user',{
    //状态
    state:()=>({
        useInfo:"1",
        userInfoState:true,
    }),
     //行为： 修改状态方法 的  定义
    actions:{
       changesstate(){
           this.userInfoState = !this.userInfoState;

           //保持持久化可以采用将数据保存到本地存储中，在页面刷新时重新获取，需要时取出
        //    localStorage.setItem('userInfoState', this.userInfoState)
       },
       changeuserInfo(newUserInfo){
           this.useInfo = newUserInfo;
       }
    },
    //装饰器
    getters:{
        
    },
    //插件：数据持久化 （关闭浏览器后 再次打开 有之前的数据）
    // persist: {
    //     enabled: true,
    //   },
                                    
})
