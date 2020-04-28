<template>
    <div id='bm-ch-col-step3-tmp' class="step3">
        <el-form id="bm-ds-step3-form" label-position="top" ref="step3Form" :model="step3Form" class="demo-step3">
            <el-form-item>
                <div class="center">
                    <div class="row top-buffer">
                        <div class="col-md-4 "></div>
                        <div class="col-md-6" style="text-align: center">
                            <el-button name="bm-ch-step3Form-autoMatch-button" type="button"
                                       class="el-button el-button--primary" @click="autoMatch()">
                                自动匹配
                            </el-button>
                            <el-button name="bm-ch-step3Form-allMatch-button" type="button"
                                       class="el-button el-button--primary" @click="allMatch()">
                                原样匹配
                            </el-button>
                        </div>
                        <div class="col-md-3"></div>
                        <div class="col-md-9 step3Table">
                            <div class="col-md-12">
                                <table id="bm-ds-step3-mapping-table">
                                    <thead>
                                    <tr>
                                        <th class="col-md-3"> 源头表(字段)</th>
                                        <th class="col-md-2"></th>
                                        <th class="col-md-3"> 目标表(字段)</th>
                                        <th class="col-md-1"></th>
                                        <th class="col-md-3"> 字段处理</th>
                                    </tr>
                                    </thead>
                                    <tbody v-for="(item,index) in step3Form.fieldMapping " :key="item.sourceField+index"
                                           style="height:20px;">
                                    <tr>
                                        <td>
                                            <el-select v-model="item.sourceField" placeholder="数据源表字段" :disabled="item.encrypt == 'CHECKSUM'">
                                                <el-option value="" label=""></el-option>
                                                <el-option
                                                        v-for="(sfitem,i) in sf"
                                                        :key="sfitem+i"
                                                        :name="sfitem+i"
                                                        :label="sfitem"
                                                        :value="sfitem">
                                                </el-option>
                                            </el-select>
                                        </td>
                                        <td style="font-size:30px;color:#00BFFF;text-align:center">&harr;</td>

                                        <td>
                                            <el-input
                                                    type="text" name="item.targetField"
                                                    class="form-control warning_placeholder"
                                                    v-model="item.targetField"
                                            ></el-input>
                                        </td>
                                        <td></td>
                                        <td>
                                            <!--字段处理-->
                                            <el-select class="form-control select-placeholder"
                                                       v-model="item.encrypt"
                                                       :disabled="item.encrypt == 'ENCRYPT'"
                                                       @visible-change="changeEncrypt($event, step3Form.fieldMapping[index].encrypt, index)"
                                            >
                                                <el-option value="" label=""></el-option>
                                                <el-option v-for="(item,i) in rulers"
                                                           :key="item+i"
                                                           :name="item.value"
                                                           :label="item.name"
                                                           :value="item.value"
                                                           :disabled="item.disable"
                                                ></el-option>
                                                <el-option value="ENCRYPT" label="加密" :disabled=true></el-option>
                                            </el-select>
                                            <el-tooltip placement="right">
                                                <div slot="content">
                                                    校验和字段:<br/>
                                                    &nbsp;&nbsp;1.只允许选择一次<br/>
                                                    &nbsp;&nbsp;2.对应源表字段为空<br/>
                                                    &nbsp;&nbsp;3.对应目标表字段为string类型<br/>
                                                    <br/>
                                                    加密字段:<br/>
                                                    &nbsp;&nbsp;由数据集更新过来，不允许修改
                                                </div>

                                                <i class="el-icon-info"></i>
                                            </el-tooltip>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <el-input type="textarea"
                                  v-if="step3Form.countCheckField > 0"
                                  placeholder="请输入加密字段的密钥！"
                                  v-model="step3Form.dataStore.encryptKey"
                                  class="encryptKey"
                                  maxlength="10">
                        </el-input>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import task from '@jsTask/taskStep.js';

    export default {
        components: {},
        name: 'step3',
        data: function () {
            return {
                sf: [],
                rulers: [
                    {name: '去除数据', value: 'BLANK', disable: false},
                    {name: '用*隐藏', value: 'MIX', disable: false},
                    {name: '校验和', value: 'CHECKSUM', disable: false}],
                step3Form: {
                    fieldMapping: [{sourceField: "", sourceType: "", targetField: "", targetType: "", encrypt: ""}],
                },
                changeEncryptArr: []// 字段处理的修改操作，第一个元素存放之前的值，第二个元素，存放修改之后的值
            }
        },

        methods: {
            // 字段处理修改
            changeEncrypt: function (visible, value, index) {
                //visible 为 true就是下拉，下拉只存值，收回做判断
                if (visible) {
                    this.changeEncryptArr[0] = value
                    this.rulers[2].disable = (this.step3Form.hasCheckSum == 0 && this.step3Form.fieldMapping[index].sourceField == "" && this.step3Form.fieldMapping[index].targetType == "string") ? false : true
                } else {
                    this.changeEncryptArr[1] = value
                    // 选中加密，countCheckField+1，加密改成其他countCheckField -1，根据countCheckField 》0判断是否显示key文本框
                    if (this.changeEncryptArr[0] === 'ENCRYPT' && this.changeEncryptArr[1] !== 'ENCRYPT') {
                        this.step3Form.countCheckField -= 1
                    } else if (this.changeEncryptArr[1] === 'ENCRYPT' && this.changeEncryptArr[0] !== 'ENCRYPT') {
                        this.step3Form.countCheckField += 1
                    } else if (this.changeEncryptArr[0] === 'CHECKSUM' && this.changeEncryptArr[1] !== 'CHECKSUM') {
                        this.step3Form.hasCheckSum -= 1
                    } else if (this.changeEncryptArr[1] === 'CHECKSUM' && this.changeEncryptArr[0] !== 'CHECKSUM') {
                        this.step3Form.hasCheckSum += 1
                    }
                }
            },
            //初始化数据源，数据集的字段
            init: function () {
                var that = this;
                //获取数据源的schema字段列表
                that.sf.length = 0;
                this.$set(that.step3Form, 'countCheckField', 0);
                this.$set(that.step3Form, 'hasCheckSum', 0);
                if (that.step3Form.fieldMapping.length < 100) {
                    this.rulers[2].disable = false
                    for (let i = 0; i < that.step3Form.fieldMapping.length; i++) {
                        if (that.step3Form.fieldMapping[i].encrypt === 'ENCRYPT') {
                            that.step3Form.countCheckField++;
                        }
                        if (that.step3Form.fieldMapping[i].encrypt === 'CHECKSUM') {
                            that.step3Form.hasCheckSum++;
                            this.rulers[2].disable = true
                        }
                    }
                }
                //添加一个数据源空字段
                if (that.step3Form.mappingSource.length < 100) {
                    for (var i = 0; i < that.step3Form.mappingSource.length; i++) {
                        that.sf[i] = that.step3Form.mappingSource[i].sourceField
                    }
                }
            },
            //  自动同步
            autoMatch: function () {
                let that = this;
                //自动匹配字段长度不能大于100
                if (that.step3Form.fieldMapping.length < 100) {
                    for (let i = 0; i < that.step3Form.fieldMapping.length; i++) {
                        for (let j = 0; j < that.sf.length; j++) {
                            //如果数据源的字段和mapping的targetField字段相等就匹配成功
                            if (that.step3Form.fieldMapping[i].targetField.toLowerCase() === that.sf[j].toLowerCase() && that.step3Form.fieldMapping[i].encrypt != 'CHECKSUM') {
                                that.step3Form.fieldMapping[i].sourceField = that.sf[j];
                            }
                        }
                    }
                }
            },
            //  自动同步
            allMatch: function () {
                this.$confirm('确认源字段和目标字段完全一致？', '提示', {}).then(() => {
                    for (let i = 0; i < this.step3Form.fieldMapping.length; i++) {
                        this.step3Form.fieldMapping[i].sourceField = this.step3Form.fieldMapping[i].targetField;
                        this.step3Form.fieldMapping[i].sourceType = this.step3Form.fieldMapping[i].targetType;
                    }
                })
            },
            //构建mapping结构
            builedMapping: function () {
                //拼成mapping
                if (this.step3Form.mappingSource) {
                    for (let i = 0; i < this.step3Form.fieldMapping.length; i++) {
                        if(this.step3Form.fieldMapping[i].encrypt == 'CHECKSUM'){
                            this.step3Form.dataStore.checksumColumn = this.step3Form.fieldMapping[i].targetField
                        }
                        for (let x = 0; x < this.step3Form.mappingSource.length; x++) {
                            //如果mapping的字段名等于数据源的字段名将数据源的type存入mapping
                            if (this.step3Form.fieldMapping[i].sourceField == this.step3Form.mappingSource[x].sourceField) {
                                this.step3Form.fieldMapping[i].sourceType = this.step3Form.mappingSource[x].sourceType
                                // this.step3Form.fieldMapping[i].encrypt = this.step3Form.fieldMapping[i].encrypt
                                break;
                            } else {
                                this.step3Form.fieldMapping[i].sourceType = ""
                            }
                        }
                    }
                }
            },
        },
        mounted() {
            if (localStorage.taskEntity) {
                //获取全局的entity
                this.step3Form = JSON.parse(localStorage.taskEntity);
                //获取采集器的id
                let httpArr = window.location.href.split('/')
                this.step3Form.collecterId = httpArr[httpArr.indexOf('step3') + 1]
                this.step3Form.resourceId = httpArr[httpArr.indexOf('step3') + 2]
                this.init();
            }
        },
        beforeRouteLeave: function (to, from, next) {
            let that = this;
            if (localStorage.taskEntity) {
                //构建mapping结构
                if (that.step3Form.fieldMapping.length < 100) {
                    that.builedMapping();
                }
                //获取全局的entity
                let entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step3Form = Object.assign(entity, that.step3Form)
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step3Form);
            }
            //如果在向导中跳转
            if (to.path.substr(0, 16) == '/taskWizard/step') {
                //如果验证都通过才可以下一步
                //获取从第几步到第几步
                let fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                let toStep = to.path.charAt(to.path.indexOf('taskWizard/step') + 15)
                if (fromStep > toStep) {
                    next();
                } else {
                    //映射字段不能为空
                    let notNollMapping = true;
                    for (let i = 0; i < that.step3Form.fieldMapping.length; i++) {
                        if (that.step3Form.fieldMapping[i].sourceField) {
                            notNollMapping = false;
                            break;
                        }
                    }
                    //如果有加密字段，key就要有值
                    let encryptNoKey = true;
                    if (this.step3Form.countCheckField > 0) {
                        if (this.step3Form.dataStore.encryptKey) {
                            encryptNoKey = false;
                        }
                    }else {
                        encryptNoKey = false;
                    }
                    //根据mapping是否出现异常判断能否进入下一步
                    if (notNollMapping || encryptNoKey) {
                        let message = notNollMapping ? "映射字段不能为空！" : encryptNoKey ? '有加密处理，加密字段必填' : "映射字段不能为空！有加密处理，加密字段必填"
                        that.$message({
                            message: message,
                            type: 'error'
                        })
                        task.$emit('taskNextStep', fromStep)
                    } else next();
                }
            } else {
                localStorage.removeItem('taskEntity');
                next();
            }
        },
    }
</script>
<style scoped lang="scss">
    .step3 {
        height: calc(100vh - 187px);
        overflow-y: auto;

        .demo-step3 {
            margin-left: 25%;
            width: 50%;
        }
    }
    .encryptKey {
        width: 70%;
    }
    .step3Table {
        padding-top: 8px;
        height: calc(100vh - 335px);
        overflow: auto;

        table {
            height: 100px;
            overflow: auto;
        }
    }
</style>
