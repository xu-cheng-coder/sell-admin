//导入defineStore  方法  创建一个 store实例对象并单个暴露出去

import {defineStore} from 'pinia'

//函数式编程 只要是函数 以 useXXX开头  
//defineStore  参数1： 唯一的模块标记  不同的stores中的模块文件  不能重复 
export const useHeader = defineStore('header',{
    //状态
    state:()=>({
        useInfo:{

        }
    }),
     //行为： 修改状态方法 的  定义
    actions:{
       changeMusic(newHeader){
           this.header = newHeader;
       }
    },
    //装饰器
    getters:{
        
    },
    //插件：数据持久化 （关闭浏览器后 再次打开 有之前的数据）
    Plugins:{
    }
                                    
})
