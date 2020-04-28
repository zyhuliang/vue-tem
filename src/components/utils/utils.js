exports.install = function (Vue, options) {
    // 取两个日期之间的所有日期
    Vue.prototype.getAll = function (begin,end){
        var resultDate=[];
        if(begin.indexOf("T") > 0){
            begin = begin.split("T")[0];
            end = end.split("T")[0];
        }
        var ab = begin.split("-");
        var ae = end.split("-");
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
        var unixDb=db.getTime();
        var unixDe=de.getTime();
        var i=0;
        for(var k=unixDb;k<unixDe;){
            resultDate[i++]=(new Date(parseInt(k))).format();
            k=k+24*60*60*1000;
        }
        return resultDate;
    }
    Vue.prototype.getWeek = function () {
        //设置日期，当前日期的前七天
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - 7);
        var dateArray = [];
        var dateTemp;
        for (var i = 0; i <= 7; i++) {
            dateTemp = myDate.setDate(myDate.getDate() + 1);
            //格式化时间
            var date = new Date(dateTemp);
            // dateArray[i]=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+'T16:00:00Z';
            dateArray[i]=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        }
        return dateArray;
    }
    Date.prototype.format=function (){
        var s='';
        s+=this.getFullYear()+'';          // 获取年份。
        if((this.getMonth()+1)>9){
            s+=(this.getMonth()+1)+"";         // 获取月份。
        }else{
            s+='0'+(this.getMonth()+1)+"";
        }
        if(this.getDate()>=10){
            s+= this.getDate();                 // 获取日。
        }else{
            s+='0'+this.getDate();
        }
        return(s);                          // 返回日期。
    };
    Vue.prototype.InitializeData = function (length) {
        var dataArray=[];
        for(var i=0;i<length;i++){
            dataArray[i] =0;
        }
        return dataArray;
    };
    Vue.prototype.getHours=function(days){
        var hours=[];
        var k=0;
        for(var i=0;i<days.length;i++){
            for(var j=0;j<24;j++){
                (j<10) ? hours[k++]=days[i]+'0'+j : hours[k++]=days[i]+''+j;
            }
        }
        return hours;
    }
    Vue.prototype.byField = function (prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop];
            var val2 = obj2[prop];if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    //  画图前格式化X轴的日期格式
    Vue.prototype.Dataformate=function(dates){
        for(var i=0;i<dates.length;i++){
            var d=dates[i];
            if(d.length<=6){
                dates[i]=d.substring(0,4)+'/'+d.substring(4,6);
            }else if(d.length>6 && d.length<=8){
                dates[i]=d.substring(0,4)+'/'+d.substring(4,6)+'/'+d.substring(6,8);
            }else if(d.length>8 && d.length<=10){
                dates[i]=d.substring(4,6)+'/'+d.substring(6,8)+' '+d.substring(8,10);
            }else if(d.length>10 && d.length<=12){
                dates[i]=d.substring(4,6)+'/'+d.substring(6,8)+' '+d.substring(8,10)+':'+d.substring(10,12);
            }
        }
        return dates;
    }
    // 获取当前时间
    Vue.prototype.getCurrentTime = function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    // 截取指定字符后的字符串
    Vue.prototype.interceptedStr = function (str) {
        var index=str.lastIndexOf("\/");
        str=str.substring(index+1,str.length);
        return str;
    }

    Vue.prototype.getTaskHistoryData=function(days,array,success){
        for(var i=0;i<days.length;i++){
            for(var j=0;j<array.length;j++){
                if(days[i] === array[j].name){
                    success[i]=array[j].count;
                    break;
                }
            }
        }
        return success;
    }
}
