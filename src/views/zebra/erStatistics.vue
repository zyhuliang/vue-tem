<template>
  <section id="bm-qa-erStatistics">
    <el-row class="btnClass">
        <div class="btn-left">
            <div class="ers-pattern">
                <h4>统计方式</h4>
                <el-select v-model="selVal" @change="currentSel(selVal)" class="sel">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="ers-item">
                <h4>统计项</h4>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox @change="handlequalityRank" checked label="质量评级"></el-checkbox>
                    <el-checkbox @change="handlebadRatio" checked label="坏数据占比"></el-checkbox>
                </el-checkbox-group>
            </div>
            <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
            <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
        </div>

    </el-row>

    <el-row class="rf-swap">
      <el-tabs class="er-tabs" type="border-card" v-model="activeName" ref="tabs">
        <el-tab-pane label="数据列表" name="dataList">

          <el-table
          		  id="bm-qa-erStatistics-table"
                  v-loading = "loading"
                  :data="table.content"
                  key="table.content"
                  tooltip-effect="dark"
                  style="width: 100%"
                  height="calc(100vh - 330px)">
            <el-table-column                    
                    label="主键">
              <template slot-scope="scope">
                {{scope.row._$ROWID}}
              </template>
            </el-table-column>
            <el-table-column                    
                    label="质量评级"
                    width="100">
            </el-table-column>
            <el-table-column                    
                    label="总数"
                    className="qualityRankClass"
                    show-overflow-tooltip>
	            <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showData">{{scope.row.Total.qualityRank.sum}}</span>
	                <span v-if="scope.row.processDataId && showData">{{scope.row.processDataId.qualityRank.sum}}</span>
	                <span v-if="scope.row.modelName && showData">{{scope.row.modelName.qualityRank.sum}}</span>
	                <span v-if="scope.row.datamon && showData">{{scope.row.datamon.qualityRank.sum}}</span>
	                <span v-if="scope.row.dataday && showData">{{scope.row.dataday.qualityRank.sum}}</span>
	            </template>  
                    
            </el-table-column>
            <el-table-column                    
                    label="平均值"
                    className="qualityRankClass"
                    show-overflow-tooltip>
                    
		            <template slot-scope="scope">                
		                <span v-if="scope.row.Total && showData">{{scope.row.Total.qualityRank.mean}}</span>
		                <span v-if="scope.row.processDataId && showData">{{scope.row.processDataId.qualityRank.mean}}</span>
		                <span v-if="scope.row.modelName && showData">{{scope.row.modelName.qualityRank.mean}}</span>
		                <span v-if="scope.row.datamon && showData">{{scope.row.datamon.qualityRank.mean}}</span>
		                <span v-if="scope.row.dataday && showData">{{scope.row.dataday.qualityRank.mean}}</span>
		            </template>  
                                        
            </el-table-column>
            <el-table-column                    
                    label="最大值"
                    className="qualityRankClass"
                    show-overflow-tooltip>
	            <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showData">{{scope.row.Total.qualityRank.max}}</span>
	                <span v-if="scope.row.processDataId && showData">{{scope.row.processDataId.qualityRank.max}}</span>
	                <span v-if="scope.row.modelName && showData">{{scope.row.modelName.qualityRank.max}}</span>
	                <span v-if="scope.row.datamon && showData">{{scope.row.datamon.qualityRank.max}}</span>
	                <span v-if="scope.row.dataday && showData">{{scope.row.dataday.qualityRank.max}}</span>
	            </template>  
                                      
            </el-table-column>
            <el-table-column                    
                    label="最小值"
                    className="qualityRankClass"
                    show-overflow-tooltip>
                    
              <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showData">{{scope.row.Total.qualityRank.min}}</span>
	                <span v-if="scope.row.processDataId && showData">{{scope.row.processDataId.qualityRank.min}}</span>
	                <span v-if="scope.row.modelName && showData">{{scope.row.modelName.qualityRank.min}}</span>
	                <span v-if="scope.row.datamon && showData">{{scope.row.datamon.qualityRank.min}}</span>
	                <span v-if="scope.row.dataday && showData">{{scope.row.dataday.qualityRank.min}}</span>
	            </template> 
                    
            </el-table-column>
            <el-table-column                   
                    label="坏数据占比"
                    width="100">                    
            </el-table-column>
            <el-table-column                    
                    label="总数"
                    className="badRatioClass"
                    show-overflow-tooltip>
                    
              <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showBadData">{{scope.row.Total.badRatio.sum}}</span>
	                <span v-if="scope.row.processDataId && showBadData">{{scope.row.processDataId.badRatio.sum}}</span>
	                <span v-if="scope.row.modelName && showBadData">{{scope.row.modelName.badRatio.sum}}</span>
	                <span v-if="scope.row.datamon && showBadData">{{scope.row.datamon.badRatio.sum}}</span>
	                <span v-if="scope.row.dataday && showBadData">{{scope.row.dataday.badRatio.sum}}</span>
	            </template>  
                    
            </el-table-column>
            <el-table-column                    
                    label="平均值"
                    className="badRatioClass"
                    show-overflow-tooltip>
                    
              <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showBadData">{{scope.row.Total.badRatio.mean}}</span>
	                <span v-if="scope.row.processDataId && showBadData">{{scope.row.processDataId.badRatio.mean}}</span>
	                <span v-if="scope.row.modelName && showBadData">{{scope.row.modelName.badRatio.mean}}</span>
	                <span v-if="scope.row.datamon && showBadData">{{scope.row.datamon.badRatio.mean}}</span>
	                <span v-if="scope.row.dataday && showBadData">{{scope.row.dataday.badRatio.mean}}</span>
	            </template>   
                    
            </el-table-column>
            <el-table-column                    
                    label="最大值"
                    className="badRatioClass"
                    show-overflow-tooltip>
                <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showBadData">{{scope.row.Total.badRatio.max}}</span>
	                <span v-if="scope.row.processDataId && showBadData">{{scope.row.processDataId.badRatio.max}}</span>
	                <span v-if="scope.row.modelName && showBadData">{{scope.row.modelName.badRatio.max}}</span>
	                <span v-if="scope.row.datamon && showBadData">{{scope.row.datamon.badRatio.max}}</span>
	                <span v-if="scope.row.dataday && showBadData">{{scope.row.dataday.badRatio.max}}</span>
	            </template>
                    
            </el-table-column>
            <el-table-column                    
                    label="最小值"
                    className="badRatioClass"
                    show-overflow-tooltip>
              <template slot-scope="scope">                
	                <span v-if="scope.row.Total && showBadData">{{scope.row.Total.badRatio.min}}</span>
	                <span v-if="scope.row.processDataId && showBadData">{{scope.row.processDataId.badRatio.min}}</span>
	                <span v-if="scope.row.modelName && showBadData">{{scope.row.modelName.badRatio.min}}</span>
	                <span v-if="scope.row.datamon && showBadData">{{scope.row.datamon.badRatio.min}}</span>
	                <span v-if="scope.row.dataday && showBadData">{{scope.row.dataday.badRatio.min}}</span>
	            </template>
            </el-table-column>
          </el-table>
						<!--增加分页-->
						<el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10,30,50,100]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="table.total">
          </el-pagination>



        </el-tab-pane>
        
        	<el-tab-pane  label="图形"  name="graphical"> 
        		
        				<div class="typeSel">聚合类型
        				
	        				<el-select v-model="typeSelVal" @change="selType">
                    <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
        				
        				</div>
        				
        				
        					 <div id="chartLine" style="width:1100px; height:400px;" ref="charts"></div>
        				
                            
        	</el-tab-pane>
       
        	 
        
                
      </el-tabs>
    </el-row>

  </section>
</template>
<script>
    import { erallgetDate,dataSta } from '@api';
		import echarts from 'echarts'
		import {queryObject,createParameter} from '@components/function/queryParameter';
    //var parameter={filter:"flowStatus=SUCCEEDED",limit:"8",offset:"0",query:"",sorts:"-createTime"};
    		var parameter={
						"fieldList": [
					{
					           "fieldName": "flowStatus",  
					           "fieldValue": "SUCCEEDED",
					           "comparatorOperator": "EQUAL"
					    }
					],
						"sortObject": {
							"field": "createTime",
							"orderDirection": "ASC"
						},
						"offset": 0,
						"limit": 10
					};
					//var selVal='Total';
    export default {
        data() {
            return {
            	  searchInput:'',
            	  orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                options: [{
                    value: 'Total',
                    label: '总计'
                },
                {
                    value: 'processDataId',
                    label: '按分析数据统计'
                }, {
                    value: 'modelName',
                    label: '按模板统计'
                }, {
                    value: 'datamon',
                    label: '按月统计'
                }, {
                    value: 'dataday',
                    label: '按日统计'
                }],
                typeOptions:[
	                {
	                	value:'sum',
	                	label:'总数'
	                },
	                {
	                	value:'mean',
	                	label:'平均值'
	                },
	                {
	                	value:'max',
	                	label:'最大值'
	                },
	                {
	                	value:'min',
	                	label:'最小值'
	                }
                ],
                selVal:'Total',
                typeSelVal:'mean',
                label:'',
                table:[],
                dateValue: '',
                startTime: false,
                endTime:false,
                currentPage:1,
                pagesize:10,
                value:'',
                checkList: [],
                //复选框控制数据的显示隐藏
                showData:true,
                showBadData:true,
                activeName:'dataList',
                loading: true,
                
                chart: null,
                //折线图
                getSetOption:{
                toolbox:{
            			show:true,
	                feature:{
	                    dataView:{
	
	                    },
	                    magicType:{
	                        type:['line','bar']                                
	                    },
	                    restore:{
	
	                    },
	                    saveAsImage: {
	
	                    }
	                    
	                }
            		},
                	
                	tooltip: {
                        trigger: 'axis'
                    },
                	title:{
                		text:null
                	},
                	legend: {
                        data: ['qualityRank','badRatio']
                    },
                	saveAsImage: {
                        show: true
                    },
                    
                   grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                	
                	xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:[],
                        /*解决x轴名称过长显示不全的问题*/
                        axisLabel :{
						                interval:0,
						                rotate:-30,
						                alignWithLabel:true
						            },
						           
                  },
                  grid: { // 控制图的大小，调整下面这些值就可以，
				             x: 40,
				             x2: 100,
				             y2: 150,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
				         },
                  yAxis: {
                        type: 'value',
                        /*解决y轴名称过长显示不全的问题*/
                        axisLabel :{
						                interval:0,
						                rotate:-35,
						                alignWithLabel:true
						            }
                    },
                    
                                                            
                  series: [
                        {
                            name:'qualityRank' ,
                            type: 'line',
                            /*stack: '总量',*/
                            data: []
                        },
                        {
                            name:'badRatio' ,
                            type: 'line',
                           /* stack: '总量',*/
                            data: []
                        }
                    ]

                }
                 
                
                
                
            }
        },
        methods: { 
        	
        	handleSizeChange(size){
        		this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
        	},
        	handleCurrentChange(currentPage){
        		this.currentPage = currentPage;
        		this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput);
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
        	},
        	 buildParameters:function(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                //var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                /*if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
                }*/
                if(this.dateValue){
                    if(this.dateValue!= '' && this.dateValue.length != 0 ){
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }    
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
        	
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
               /* var startTime=this.$refs.startTime.innerText.replace("\"","").replace("\"","");
                var endTime=this.$refs.endTime.innerText.replace("\"","").replace("\"","");
                var dateTime=startTime.replace(".000","")+" TO "+endTime.replace(".000","");*/
            
                //var parameter={filter:"flowStatus=SUCCEEDED&createTime=["+dateTime+"]",limit:"8",offset:"0",query:"",sorts:"-createTime"};
                /*var parameter={
																"fieldList": [
															{
															           "fieldName": "flowStatus",  
															           "fieldValue": "SUCCEEDED",
															           "comparatorOperator": "EQUAL"
															    },
															{
															      "fieldName": "createTime",
															      "fieldValue":Number(this.dateValue[0]),
															      "comparatorOperator": "GREATER_THAN"
															    },
																{
															      "fieldName": "createTime",
															      "fieldValue":Number(this.dateValue[1]),
															      "comparatorOperator": "LESS_THAN"
															    }
															],
																"sortObject": {
																	"field": "createTime",
																	"orderDirection": "ASC"
																},
																"offset": 0,
																"limit": 10
															}*/
															
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //checkbox选中事件
            handlequalityRank:function (val) {
                if(val == true){
//										console.log('选中')
										this.showData=true;
                }else {
//										console.log('未选中')
										this.showData=false;
                }
            },
            handlebadRatio:function (val) {
                if(val == true){
										this.showBadData=true;
//										console.log('选中')
                }else {
										this.showBadData=false;
//										console.log('未选中');
                }
            },
            listTable:function listTable(parameter){

                dataSta(this.selVal,parameter).then(data => {
                    this.loading = false
                    this.table = data;
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    }
                )

            },
            
            /*hideTab(){
            	this.$refs.tabs.$children[1].$el.style.display = 'none';
            },*/
            
            drawLineChart(){
            	
            	
            	
            	
            	this.chart = echarts.init(this.$refs.charts);
            	this.chart.setOption(this.getSetOption);
            },
            //下拉框值的切换
            currentSel(selVal){
            	this.selVal=selVal;
            	
            	this.typeSelVal='mean';
            	//找到下拉框选中所对应的label值
            let obj={};
            	obj = this.options.find((item)=>{
                return item.value === selVal;
            });
            	
            	//根据下拉框选中内容动态改变图形标题
            	this.getSetOption.title.text='数据质量:'+obj.label;   //标题
            	this.chart = echarts.init(this.$refs.charts);
                // 把配置和数据放这里
                this.chart.setOption(this.getSetOption)
                
                
                
            	/*if(this.selVal=='Total'){
            		this.$refs.tabs.$children[2].$el.style.display = 'none';
            	}*/
            	//this.getSetOption.title.text=this.selVal;
            	//console.log(this.$refs.tabs.$children[2]);
            	//默认进入数据列表选项卡
            	 //this.activeName='dataList';


            	 	//下拉框选中不同内容，渲染不同表格
            	 	dataSta(this.selVal,parameter).then(data => {
                    this.loading = false
                    this.table = data;
                   // console.log(data.content[1][selVal].qualityRank.sum+'下拉框切换请求到的值');
                    this.getSetOption.xAxis.data=[] ;   
                    this.getSetOption.series[0].data=[]; 
                    this.getSetOption.series[1].data=[];
                    for(var i=0;i<data.content.length;i++){
                    	//arr.push(data.content[i][selVal].qualityRank.sum);
                    	this.getSetOption.xAxis.data.push(data.content[i]._$ROWID);  //ID集合
                    	//动态改变折线图中series的值
                    	this.getSetOption.series[0].data.push(data.content[i][selVal].qualityRank.mean); //质量评级下的平均数集合
                    	this.getSetOption.series[1].data.push(data.content[i][selVal].badRatio.mean);  //坏数据占比下的平均数集合
                    }                 
                    
                    
                  
                     this.chart.setOption(this.getSetOption);
                }, err => {
                        var _this = this;
                        if(err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    }
               )             	 	            	 	            	             	                  	                  	                   	       
            },
            
            //聚合类型下拉框值的选择
	            selType(selTypeVal){
	            	 this.typeSelVal=selTypeVal;
	            	 //下拉框选中不同内容，渲染不同表格
            	 	dataSta(this.selVal,parameter).then(data => {
                    this.loading = false
                    this.table = data;
                   // console.log(data.content[1][selVal].qualityRank.sum+'下拉框切换请求到的值');
                    //this.getSetOption.xAxis.data=[] ;   
                    this.getSetOption.series[0].data=[]; 
                    this.getSetOption.series[1].data=[];
                    for(var i=0;i<data.content.length;i++){
                    	//arr.push(data.content[i][selVal].qualityRank.sum);
                    	//this.getSetOption.xAxis.data.push(data.content[i]._$ROWID);  //ID集合
                    	//动态改变折线图中series的值
                    	this.getSetOption.series[0].data.push(data.content[i][this.selVal].qualityRank[selTypeVal]); //质量评级下的集合
                    	this.getSetOption.series[1].data.push(data.content[i][this.selVal].badRatio[selTypeVal]);  //坏数据占比下的集合
                    }                 
                    
                    
                  
                     this.chart.setOption(this.getSetOption);
                }, err => {
                        var _this = this;
                        if(err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    }
               ) 
	            	 
	            	  

	            },
	            
	            //页面初次加载默认显示总计下的平均值	            
	            getDefault(){
	            	this.getSetOption.title.text='数据质量:总计';   //标题
	
	            	// 把配置和数据放这里
                this.chart.setOption(this.getSetOption)
                
                dataSta('Total',parameter).then(data => {
                    this.loading = false
                    this.table = data;
                   // console.log(data.content[1][selVal].qualityRank.sum+'下拉框切换请求到的值');
                    this.getSetOption.xAxis.data=[] ;   
                    this.getSetOption.series[0].data=[]; 
                    this.getSetOption.series[1].data=[];
                    for(var i=0;i<data.content.length;i++){
                    	//arr.push(data.content[i][selVal].qualityRank.sum);
                    	this.getSetOption.xAxis.data.push(data.content[i]._$ROWID);  //ID集合
                    	//动态改变折线图中series的值
                    	this.getSetOption.series[0].data.push(data.content[i].Total.qualityRank.mean); //质量评级下的平均数集合
                    	this.getSetOption.series[1].data.push(data.content[i].Total.badRatio.mean);  //坏数据占比下的平均数集合
                    }                 
                    
                    
                  
                     this.chart.setOption(this.getSetOption);
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    }
               )  
                

                
	            }
            
            
            
            
            
        },
        mounted() {        	
            this.listTable(parameter)
            this.drawLineChart();
           //this.hideTab();
            this.getDefault();
        },
        beforeDestroy() {
            if (!this.chart) { return }
            this.chart.dispose();
            this.chart = null;
        }
    };

</script>

<style scoped>
  .con-module .el-row{
    float: left;
    width: 100%;
  }
  .con-module .el-row .el-button i{
    font-size: 13px;
  }

  .el-table{
    float: left;
    margin-top: 15px;
  }

  .ers-pattern{
    float: left;
    width: 300px;
    height: 40px;
    line-height: 40px;
  }

  .ers-pattern h4{
    margin: 0px;
    float: left;
  }
  .ers-pattern .el-select{
    float: left;
    margin-left: 10px;

  }
  .el-input--suffix .el-input__inner{
    padding: 1px 10px;
    height: 34px!important;
    line-height: 34px;
    right: 0px;
  }

  .ers-item{
    float: left;
    width: 300px;
    height: 40px;
    line-height: 40px;
    display: flex;
  }

  .ers-item h4{
      margin-right: 10px;
  }

  .er-tabs{
    margin: 0px 0px 0px 0px;
  }
    .btn-left{
        padding-left: 160px;
    }


.typeSel{
	float: left;
	margin-left: 850px;
	margin-bottom: 20px;
}
#chartLine{
	clear: both;
}

</style>