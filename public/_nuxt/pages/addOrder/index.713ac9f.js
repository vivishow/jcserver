(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{312:function(t,e,n){var content=n(315);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(63).default)("7afd15d9",content,!0,{sourceMap:!1})},314:function(t,e,n){"use strict";var o=n(312);n.n(o).a},315:function(t,e,n){(e=n(62)(!1)).push([t.i,'.container{margin:0 auto;min-height:100vh;display:flex;justify-content:center;align-items:normal;text-align:center}.title{font-family:"Quicksand","Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;display:block;font-weight:300;font-size:100px;color:#35495e;letter-spacing:1px}.subtitle{font-weight:300;font-size:42px;color:#526488;word-spacing:5px;padding-bottom:15px}.links{padding-top:15px}',""]),t.exports=e},318:function(t,e,n){"use strict";n.r(e);n(47);var o=n(3),r=(n(29),n(15),n(64),n(184),n(0).default.extend({data:function(){return{date:"",textarea:"",titles:{job:"任务号",customer:"客户名称",project:"工程名称",strenth:"砼强度",position:"施工部位",transport:"输送方式",machineSandNo1:"1#机制砂",yelloSandNo2:"2#黄沙",smallStoneNo3:"3#小石子",slicesStoneNo4:"4#瓜子片",cementNo1:"1#水泥",cementNo2:"2#水泥",flyAshNo3:"3#粉煤灰",slagPowderNo4:"4#矿粉",water:"水",admixtureNo1:"1#外加剂",admixtureNo2:"2#外加剂",cementNo5:"5#水泥",sewage:"污水",bigStoneNo6:"6#大中石",consumption:"材料总消耗",cans:"罐数",numOfcars:"累计车数",volume:"数量"},orders:[]}},methods:{parseData:function(){var t=this;this.textarea?function(){for(var e=t.textarea.split("\n").map((function(t){return t.split("\t")})),n=function(n){var o={date:t.date};Object.keys(t.titles).map((function(t,i){o[t]=e[n][i]})),t.orders.push(o)},o=0;o<e.length;o++)n(o)}():this.$notify.error({title:"错误",message:"请输入相关数据",duration:2e3})},deleteData:function(){this.orders=[]},postData:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){var data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$axios.$post("api/addOrder",t.orders,{headers:{"Content-Type":"application/json"}});case 2:data=e.sent,t.$alert(data.msg,"提示",{comfirmButtonText:"确定",callback:function(e){t.$router.push("/orders")}});case 4:case"end":return e.stop()}}),e)})))()}}})),l=(n(314),n(39)),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",[n("h1",[t._v("君诚建材")]),t._v(" "),n("el-input",{attrs:{type:"textarea",autosize:{minRows:2,maxRows:4},placeholder:"请粘贴消耗单数据"},model:{value:t.textarea,callback:function(e){t.textarea=e},expression:"textarea"}}),t._v(" "),n("el-date-picker",{attrs:{type:"date",placeholder:"选择日期",format:"yyyy 年 MM 月 dd 日","value-format":"yyyy-MM-dd"},model:{value:t.date,callback:function(e){t.date=e},expression:"date"}}),t._v(" "),n("el-button",{attrs:{type:"primary",plain:""},on:{click:t.parseData}},[t._v("处理数据")]),t._v(" "),n("el-button",{attrs:{type:"danger",plain:""},on:{click:t.deleteData}},[t._v("清除数据")])],1),t._v(" "),t.orders.length?n("div",[n("el-table",{staticStyle:{width:"100%"},attrs:{data:t.orders,border:"",stripe:"","max-height":"450","show-summary":""}},[n("el-table-column",{attrs:{prop:"date",label:"日期",fixed:""}}),t._v(" "),t._l(t.titles,(function(title,t,e){return n("el-table-column",{key:e,attrs:{prop:t,label:title,fixed:e<4}})}))],2),t._v(" "),n("el-button",{attrs:{type:"primary",plain:""},on:{click:t.postData}},[t._v("提交数据")])],1):t._e()])}),[],!1,null,null,null);e.default=component.exports}}]);