<!--  design节点设置 组件  -->
<template>
  <div id="bm-nodeset-form">
    <el-dialog
      v-if="nodeSet.nodeSetVisible"
      v-dialog-drag
      title="设置"
      id="nodeSetDialog"
      class="designDialog"
      :visible.sync="nodeSet.nodeSetVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        class="elForm"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-form-item label="节点名称" prop="newName">
          <el-tooltip class="priorityMes" placement="top" effect="dark">
            <div slot="content">["节点显示名称，最长100"]</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-input v-model="ruleForm.newName" name="newName"></el-input>
        </el-form-item>
        <div v-loading="loading" id="bm-com-design-draw-node-set-dataflow-table"></div>
        <div class="nodeSetTab">
          <el-tabs
            v-model="activeName2"
            type="card"
            :before-leave="leaveTab"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="(ns, index) in nodeSetTab"
              :key="ns.key"
              :name="ns.title"
              :label="ns.title"
              :disabled="disable[index]"
            >
              <!--<span slot="lgitabel"><i :class="ns.icon"></i></span>-->
              <div slot="label">
                <i :class="ns.icon"></i>
                {{ns.title}}
              </div>
              <!-- 输入 -->
              <!-- {{inputFields}} -->
              <div
                v-if="ns.name == inputTab.id"
                v-for="(inputTab,keyIp,index) in inputFields"
                :key="keyIp"
                id="bm-nodeset-input"
              >
                <!-- {{nodeSetData.inputConfigurations}}<br> -->
                <div id="input" class="nodeTable">
                  <div class="block__list block__list_words blockLeft">
                    <div class="block__list-title">
                      备选字段
                      <el-input
                        class="fieldsInput"
                        placeholder="请输入字段名称"
                        prefix-icon="el-icon-search"
                        v-model="inputLeftSearch"
                        v-on:focus="(value) => inputLeftFocus(value,keyIp)"
                        v-on:keydown="(value) => inputLeftKeydown(value,keyIp)"
                      ></el-input>
                      <i
                        @click="addInpSelField(keyIp)"
                        v-if="btnStatus"
                        title="新增已选字段"
                        class="ns_fields1 el-icon-plus"
                      ></i>
                      <i
                        @click="inputFieldsImport(keyIp)"
                        v-if="btnStatus"
                        title="导入表格内字段"
                        class="ns_fields3 icon iconfont icon-ir-copy"
                      ></i>
                    </div>
                    <ol>
                      <template>
                        <el-table
                          ref="multipleTable"
                          :data="inputFields[keyIp].fields.slice((inputLeftCurrentPage-1)*inputLeftPagesize,inputLeftCurrentPage*inputLeftPagesize)"
                          style="width: 100%;"
                          @selection-change="(value) => inputLefthandleSelectionChange(value,keyIp)"
                          :row-key="getInputRow"
                        >
                          <el-table-column
                            fixed
                            type="index"
                            width="60"
                            :index="inputLeftIndexMethod"
                          ></el-table-column>
                          <el-table-column prop="column" label="字段名"></el-table-column>
                          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                        </el-table>
                      </template>
                    </ol>
                    <el-pagination
                      small
                      @size-change="inputLeftHandleSizeChange"
                      @current-change="inputLeftHandleCurrentChange"
                      :current-page="inputLeftCurrentPage"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="inputLeftPagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="inputFields[keyIp].fields&&inputFields[keyIp].fields.length"
                    ></el-pagination>
                  </div>
                  <div class="block__list block__list_words blockRight">
                    <!-- <div hidden="hidden">{{nodeSetData}}</div> -->
                    <!-- {{nodeSetData}} -->
                    <!-- {{nodeSetData.inputConfigurations}} -->
                    <div class="block__list-title">
                      <span>已选字段</span>
                      <el-input
                        class="fieldsInput"
                        placeholder="请输入字段名称"
                        prefix-icon="el-icon-search"
                        v-model="inputRightSearch"
                        v-on:focus="(value) => inputRightFocus(value,keyIp)"
                        v-on:keydown="(value) => inputRightKeydown(value,keyIp)"
                        @keyup.delete="(value) => inputRightKeyDelete(value,keyIp)"
                      ></el-input>
                      <el-button
                        v-if="inputErrorArr.length>0&&!btnStatus"
                        @click="mapData({inputTab:inputTab,keyIp:keyIp,index:index,inputFields:inputFields})"
                        name="dialog-cancel"
                      >映射</el-button>
                      <span
                        class="removeAllFields"
                        @click="removeInpSelAllField(keyIp)"
                        v-if="btnStatus"
                        title="删除全部已选字段"
                      >
                        <i class="fa fa-trash-o"></i>
                      </span>
                      <span
                        class="removeAllFields pr20"
                        v-if="btnStatus"
                        @click="removeInpVerification(keyIp)"
                        title="删除已选的非法字段"
                      >
                        <i class="fa fa-strikethrough"></i>
                      </span>
                      <a
                        class="getSchema"
                        v-if="(nodeSetFlowType == 'sink'|| nodeSetFlowType == 'lookupTable' || nodeSetFlowType == 'cache') && btnStatus "
                        @click="getSchema(keyIp)"
                        title="提取schema"
                      >
                        <i class="fa fa-external-link"></i>
                      </a>
                    </div>
                    <div v-if="nodeSetData.inputConfigurations[keyIp]">
                      <ol id="input-2">
                        <template>
                          <el-table
                            :data="nodeSetData.inputConfigurations[keyIp].fields&&nodeSetData.inputConfigurations[keyIp].fields.slice((inputRightCurrentPage-1)*inputRightPagesize,inputRightCurrentPage*inputRightPagesize)"
                            style="width: 100%"
                          >
                            <el-table-column
                              fixed
                              type="index"
                              width="60"
                              :index="inputRightIndexMethod"
                            ></el-table-column>
                            <el-table-column prop="column" label="字段名" width="180">
                              <template slot-scope="scope">
                                <span
                                  :class="{ 'red': inputErrorArr.indexOf(scope.row.column) !== -1}"
                                >{{scope.row.column}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="alias" label="别名">
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.alias"
                                  placeholder="别名"
                                  @input="(value) => inpAlias(value,keyIp,inputRightPagesize * (inputRightCurrentPage - 1) + scope.$index,nodeSetData.inputConfigurations[keyIp].fields)"
                                ></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="60">
                              <template slot-scope="scope">
                                <el-col :span="3" class="removeFields">
                                  <i
                                    class="el-icon-close"
                                    v-if="btnStatus"
                                    @click="(value) => removeInpSelThisField(scope.row.column,keyIp,inputRightPagesize * (inputRightCurrentPage - 1) + scope.$index,nodeSetData.inputConfigurations[keyIp].fields)"
                                  ></i>
                                </el-col>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </ol>
                      <el-pagination
                        @size-change="inputRightHandleSizeChange"
                        @current-change="inputRightHandleCurrentChange"
                        :current-page="inputRightCurrentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="inputRightPagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="nodeSetData.inputConfigurations[keyIp].fields&&nodeSetData.inputConfigurations[keyIp].fields.length"
                      ></el-pagination>
                    </div>
                  </div>
                  <div style="clear: both"></div>
                  <br />
                  <el-row>
                    <el-col :span="24">提示：别名允许的字符包括字母,数字和下划线.</el-col>
                  </el-row>
                  <el-row v-if="ns.name == inputTab.id" :key="keyIp">
                    <el-col v-if="inputErrorArr.length > 0" :span="24">
                      非法字段:
                      <p class="red word-wrap maxHeight">{{inputErrorArr.toString()}}</p>
                    </el-col>
                    <el-col v-if="inputdeficiency.length>0 > 0" :span="24">
                      缺失字段:
                      <p class="red word-wrap maxHeight">{{inputdeficiency.toString()}}</p>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <!-- 参数 -->

              <div v-if="ns.name == 'parameter'" class="peForm" id="bm-nodeset-pamer">
                <div hidden="hidden">{{nodeSetData.otherConfigurations}}</div>
                <!-- 基础参数 引入各类型组件-->
                <!-- {{nodeSetData.otherConfigurations}} -->
                <component
                  :is="nodes"
                  :nodeSetData="nodeSetData.otherConfigurations"
                  :datasetType="nodeSet.datasetType"
                  :getSelFields="getInpFields"
                  :nodeSetLine="nodeSetLines"
                  @definesteps="definesteps"
                  @nodeSetNewName="getNewname"
                  @tabstatus="tabstatus"
                  @sourceOutput="sourceOutputdata"
                  :schemas="dictionaries"
                  @modifynodeSetData="modifynodeSetData"
                ></component>
                <!--dataFlow IO-->
                <!--<div v-for="(app,keyNo,index) in nodes">-->
                <!--{{app}}-->
                <!--<app :key="keyNo" :is="app.source" v-if="nodeSetFlowType == 'source'"  :nodeSetData="nodeSetData" :datasetType="nodeSet.datasetType"></app>-->
                <!--</div>-->

                <!-- 高级参数-->
                <el-form label-width="170px" v-if="nodeSetFlowType == 'sink'">
                  <el-collapse id="advancedOptions" accordion>
                    <el-collapse-item>
                      <template slot="title">
                        <i class="fa fa-sort-amount-asc"></i>&nbsp;&nbsp;高级选项
                      </template>
                      <!-- dataflow IO sink -->
                      <!-- dataflow IO sink nullValue-->
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' && nodeSetData.otherConfigurations.type=='HDFS'"
                        :label="'nullValue'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="当字段值为null时, 替换为指定字符串"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input
                          v-model="nodeSetData.otherConfigurations.nullValue"
                          placeholder="nullValue"
                          @input="nullValueVal"
                          name="nullValue"
                        ></el-input>
                      </el-form-item>
                      <!-- dataflow IO sink maxFileSize-->
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' && nodeSetData.otherConfigurations.type=='HDFS'"
                        :label="'maxFileSize'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="1. 输出文件大小。参数可以使用单位GB,MB,KB,B。例如:  2. 256MB 3. 1GB 4. 最终输出的文件大小会可能稍大于该值"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input
                          v-model="nodeSetData.otherConfigurations.maxFileSize"
                          placeholder="maxFileSize"
                          @input="maxFileSizeVal"
                          name="maxFileSize"
                        ></el-input>
                      </el-form-item>
                      <!-- dataflow IO sink maxFileNumber-->
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' && nodeSetData.otherConfigurations.type=='HDFS'"
                        :label="'maxFileNumber'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="输出的文件数量,必须是整数值"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input
                          v-model="nodeSetData.otherConfigurations.maxFileNumber"
                          placeholder="maxFileNumber"
                          @input="maxFileNumberVal"
                          name="maxFileNumber"
                        ></el-input>
                      </el-form-item>
                      <!-- dataflow IO sink expiredTime -->
                      <el-form-item v-if="nodeSetFlowType == 'sink'" :label="'expiredTime'| cn">
                        <el-tooltip class="item" effect="dark" content="有效时间" placement="top">
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input
                          placeholder="expiredTime"
                          v-model="exTimeVal"
                          class="input-with-select"
                          @input="expiredTimeValue"
                        >
                          <el-select
                            class="expiredTimeSelect"
                            v-model="expiredTimeSelect"
                            slot="append"
                            placeholder="请选择"
                            @change="expiredTimeSelVal"
                          >
                            <el-option label="天" value="d" name="d"></el-option>
                            <el-option label="小时" value="h" name="h"></el-option>
                            <el-option label="分" value="m" name="m"></el-option>
                            <el-option label="秒" value="s" name="s"></el-option>
                          </el-select>
                        </el-input>
                        <!--<el-input v-model="nodeSetData.otherConfigurations.expiredTime" placeholder="expiredTime" @change="expiredTimeVal"></el-input>-->
                      </el-form-item>
                      <!-- dataflow IO sink sliceTimeColumn -->
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' && nodeSetData.otherConfigurations.type=='HDFS'"
                        :label="'sliceTimeColumn'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="sink-sliceTimeColumn"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select
                          class="elSelect"
                          placeholder="请选择内容"
                          v-model="nodeSetData.otherConfigurations.sliceTimeColumn"
                          @change="sliceTimeColumnVal"
                        >
                          <el-option value></el-option>
                          <div v-if="inputFields.length!=0">
                            <el-option
                              v-for="(cmInput,cmKey) in inputFields[0].fields"
                              :key="cmKey"
                              v-model="cmInput.column"
                              :name="cmInput.column"
                            ></el-option>
                          </div>
                        </el-select>
                      </el-form-item>
                      <!-- dataflow IO sink sliceTypeVal-->
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' && nodeSetData.otherConfigurations.type=='HDFS'"
                        :label="'sliceType'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="sink-sliceType"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select
                          class="elSelect"
                          placeholder="请选择内容"
                          v-model="nodeSetData.otherConfigurations.sliceType"
                          @change="sliceTypeVal"
                          name="elSelect"
                        >
                          <el-option value="1"></el-option>
                          <el-option value="5"></el-option>
                          <el-option value="Q"></el-option>
                          <el-option value="F"></el-option>
                          <el-option value="H"></el-option>
                          <el-option value="D"></el-option>
                        </el-select>
                      </el-form-item>

                      <!-- 通用高级选项 -->
                      <!-- lookupTable singleRowCache -->
                      <el-form-item
                        :label="'singleRowCache'| cn"
                        v-if="nodeSetFlowType == 'lookupTable' || nodeSetFlowType == 'cache'"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="singleRowCache"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select
                          class="elSelect"
                          v-model="advancedParameters.singleRowCache"
                          placeholder="请选择"
                          @change="singleRowCacheValue"
                        >
                          <el-option value="true" label="true" name="true"></el-option>
                          <el-option value="false" label="false" name="false"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        v-if="nodeSetFlowType == 'sink' "
                        :label="'countWrittenRecord'| cn"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="sink-countWrittenRecord"
                          placement="top"
                        >
                          <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select
                          class="elSelect"
                          placeholder="请选择内容"
                          v-model="countWrittenRecordVal"
                          @change="selCountWrittenRecordVal"
                        >
                          <el-option value="false" label="false" name="false"></el-option>
                          <el-option value="true" label="true" name="true"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                </el-form>
              </div>
              <!-- 输出 -->

              <div
                v-if="ns.name == outputTab.id"
                v-for="(outputTab,keyOt,index) in outputFields"
                :key="keyOt"
                id="bm-nodeset-output"
              >
                <!-- {{nodeSetData.outputConfigurations}}<br> -->
                <!-- {{outputFields}} -->
                <div id="output" class="nodeTable">
                  <div class="block__list block__list_words blockLeft">
                    <div class="block__list-title">
                      备选字段
                      <el-input
                        class="fieldsInput"
                        placeholder="请输入字段名称"
                        prefix-icon="el-icon-search"
                        v-model="outputLeftSearch"
                        v-on:focus="(value) => outputLeftFocus(value,keyOt)"
                        v-on:keydown="(value) => outputLeftKeydown(value,keyOt)"
                      ></el-input>
                      <i
                        @click="addOutSelField(keyOt)"
                        v-if="btnStatus"
                        title="新增已选字段"
                        class="ns_fields1 el-icon-plus"
                      ></i>
                      <i
                        @click="ouputFieldsImport(keyOt)"
                        v-if="btnStatus"
                        title="导入表格内字段"
                        class="ns_fields3 icon iconfont icon-ir-copy"
                      ></i>
                    </div>
                    <ol>
                      <template>
                        <el-table
                          ref="multipleTable"
                          :data="outputFields[keyOt].fields&&outputFields[keyOt].fields.slice((outputLeftCurrentPage-1)*outputLeftPagesize,outputLeftCurrentPage*outputLeftPagesize)"
                          style="width: 100%"
                          @selection-change="(value) => outputLefthandleSelectionChange(value,keyOt)"
                          :row-key="getOutputRow"
                        >
                          <el-table-column
                            fixed
                            type="index"
                            width="60"
                            :index="outputLeftIndexMethod"
                          ></el-table-column>
                          <el-table-column prop="name" label="字段名"></el-table-column>
                          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                        </el-table>
                      </template>
                    </ol>
                    <el-pagination
                      small
                      @size-change="outputLeftHandleSizeChange"
                      @current-change="outputLeftHandleCurrentChange"
                      :current-page="outputLeftCurrentPage"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="outputLeftPagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="outputFields[keyOt].fields&&outputFields[keyOt].fields.length"
                    ></el-pagination>
                  </div>

                  <div class="block__list block__list_words blockRight">
                    <div class="block__list-title">
                      <span>已选字段</span>
                      <el-input
                        class="fieldsInput"
                        placeholder="请输入字段名称"
                        prefix-icon="el-icon-search"
                        v-model="outputRightSearch"
                        v-on:focus="(value) => outputRightFocus(value,keyOt)"
                        v-on:keydown="(value) => outputRightKeydown(value,keyOt)"
                        @keyup.delete="(value) => outputRightKeyDelete(value,keyOt)"
                      ></el-input>
                      <el-button
                        v-if="outputErrorArr.length>0&&!btnStatus"
                        @click="mapDataOut({inputTab:outputTab,keyIp:keyOt,index:index,inputFields:outputFields})"
                        name="dialog-cancel"
                      >映射</el-button>
                      <span
                        class="removeAllFields"
                        @click="removeOutSelAllField(keyOt)"
                        v-if="btnStatus"
                        title="删除全部的已选字段"
                      >
                        <i class="fa fa-trash-o"></i>
                      </span>
                      <span
                        class="removeAllFields pr20"
                        @click="removeOutpVerification(keyOt)"
                        v-if="btnStatus"
                        title="删除已选的非法字段"
                      >
                        <i class="fa fa-strikethrough"></i>
                      </span>
                    </div>
                    <ol id="output-2">
                      <template>
                        <el-table
                          :data="nodeSetData.outputConfigurations[keyOt].fields&&nodeSetData.outputConfigurations[keyOt].fields.slice((outputRightCurrentPage-1)*outputRightPagesize,outputRightCurrentPage*outputRightPagesize)"
                          style="width: 100%"
                        >
                          <el-table-column
                            fixed
                            type="index"
                            width="60"
                            :index="outputRightIndexMethod"
                          ></el-table-column>
                          <el-table-column prop="column" label="字段名" width="180">
                            <template slot-scope="scope">
                              <span
                                :class="{ 'red': outputErrorArr.indexOf(scope.row.column) !== -1}"
                              >{{scope.row.column}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="column" label="别名">
                            <template slot-scope="scope">
                              <el-input
                                v-model="scope.row.alias"
                                placeholder="别名"
                                @input="(value) => outAlias(value,keyOt,outputRightPagesize * (outputRightCurrentPage - 1) + scope.$index,nodeSetData.outputConfigurations[keyOt].fields)"
                              ></el-input>
                            </template>
                          </el-table-column>
                          <el-table-column fixed="right" label="操作" width="60">
                            <template slot-scope="scope">
                              <el-col :span="3" class="removeFields">
                                <i
                                  class="el-icon-close"
                                  v-if="btnStatus"
                                  @click="(value) => removeOutSelThisField(scope.row.column,keyOt,outputRightPagesize * (outputRightCurrentPage - 1) + scope.$index,nodeSetData.outputConfigurations[keyOt].fields)"
                                ></i>
                              </el-col>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </ol>
                    <el-pagination
                      @size-change="outputRightHandleSizeChange"
                      @current-change="outputRightHandleCurrentChange"
                      :current-page="outputRightCurrentPage"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="outputRightPagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="nodeSetData.outputConfigurations[keyOt].fields&&nodeSetData.outputConfigurations[keyOt].fields.length"
                    ></el-pagination>
                  </div>
                  <div style="clear: both"></div>
                  <br />
                  <el-row>
                    <el-col :span="24">提示：别名允许的字符包括字母,数字和下划线.</el-col>
                  </el-row>
                  <el-row v-if="ns.name == outputTab.id" :key="keyOt">
                    <!-- {{keyOt}} -->
                    <el-col v-if="outputErrorArr.length > 0" :span="24">
                      非法字段:
                      <p class="red word-wrap maxHeight">{{outputErrorArr.toString()}}</p>
                    </el-col>
                    <el-col v-if="outputdeficiency.length>0 > 0" :span="24">
                      缺失字段:
                      <p class="red word-wrap maxHeight">{{outputdeficiency.toString()}}</p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- 提取schema弹出层 -->
          <div v-if="dialogGetSchemaVisible == true" class="dialogInterceptor" id="bm-new-schema">
            <div class="diHeader">
              <h3>新建 {{'Schema'| cn}}</h3>
              <span @click="dialogGetSchemaVisible = false" class="el-icon-close"></span>
            </div>
            <schema-add :fields="schemaField" @closeSchema="closeSchema"></schema-add>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="nodeSetSubmit('form')"
          type="primary"
          v-if="btnStatus"
          name="footer-sure"
        >确定</el-button>
        <el-button @click="nodeSetCancle" name="footer-cancel">取消</el-button>
      </div>
    </el-dialog>
    <div>
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="40%" center>
        <div v-if="JSON.stringify(errorlist)!== '{}'">
          <p class="red">错误信息</p>
          <!-- {{errorlist}} -->
          <div v-for="(item1,key) in errorlist">
            <p class="pl40 red">{{key}}</p>
            <p v-for="(qs,index) in item1" class="pl60 red">{{index}}:{{qs}}</p>
          </div>
        </div>
        <div v-if="JSON.stringify(warninglist)!== '{}'">
          <p class="red">警告信息</p>
          <!-- {{warninglist}} -->
          <div v-for="(item,key) in warninglist">
            <p class="pl40 red">{{key}}</p>
            <p v-for="(wn,index) in item" class="pl60 red">{{index}}:{{wn}}</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false" name="dialog-sure">确 定</el-button>
          <el-button @click="centerDialogVisible = false" name="dialog-cancel">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";
import interceptorInq from "@interceptorInq/interceptorInquire.vue";
import vue from "vue";

//add schema
import schemaAdd from "@components/schemaInq/schemaAdd.vue";
import customize from "@components/design/typeParameter/dataflow/definesteps/customize.vue";
import {
  outputDataFlow,
  errorOutputDataFlow,
  designChildList,
  submitDesign,
  parseinit,
  parseresult,
  analyzeresultSql,
  analyzeinitSql,
  validateinit,
  validateresult,
  outputInit,
  outputresult,
  defineConfDetail
} from "@api";
import {
  deepCopy,
  filterId,
  transformArr,
  isContained
} from "@function/comFunction";
import { nodeComp, nodeClass } from "@function/nodeSetStreamflow";
import designSubmitVue from "./designSubmit.vue";
import store from "@store/index";

export default {
  computed: {
    ...mapState(["pk", "dataflow"])
  },
  data() {
    return {
      cloneDeep: _.cloneDeep,
      CheckedFieldsList: [],
      centerDialogVisible: false, //错误信息对话框
      errorlist: {}, //错误信息
      warninglist: {}, //警告信息
      nodeSetData: {
        //存储传参 节点设置信息
        otherConfigurations: { countWrittenRecord: "false" } //？？？
      },
      nodeSetFlowType: "", //节点类型
      activeName2: "", //tab切换默认选项
      nodeSetTab: [], //存储传参 节点切换选项内容
      nodeSetLines: {}, //存储 节点左右输入输出线
      advancedParameters: {
        //高级选项
        // interceptor:"",             //interceptor
      },
      adSesValue: "", //高级选项的 sessionCache默认选项值
      dialogInterceptorVisible: false, //高级选项的 interceptor 弹出框 显示/隐藏 验证
      labelPosition: "left", //表单域标签的位置
      getSelValInterceptorId: "", //存储 interceptor选择的ID
      getSelValInterceptorName: "", //存储 interceptor选择的Name
      outputFields: [], //存储 节点输出的备选字段
      inputFields: [], //存储 节点输入的备选字段
      expiredTimeSelect: "", //存储 dataflow IO sink 高级选项值 expiredTime 默认值
      exTimeVal: "", //存储 dataflow IO sink 高级选项值 exTimeVal 默认值
      cpexpiredTimeVal: "", //存储 dataflow IO sink 高级选项值 cpexpiredTimeVal 默认值
      loading: false, //节点输出项 接口加载状态
      getInpFields: [], //存储当前节点的输入已选字段 便于 参数选项内 引入该数组字段
      countWrittenRecordVal: "false", //存储 dataflow IO sink 高级选项值 countWrittenRecord 默认值
      dialogGetSchemaVisible: false, //sink 节点 提取schema 提示框 显示/隐藏 验证
      schemaField: [], //sink 节点 提取schema 存储schema字段
      dataflowOutData: [], //存储 dataflow中的输出数据 ？？？？
      dataflowInData: [], //存储 dataflow中的输入数据 ？？？？
      disable: [false, false, false, false, false, false], //???????????
      dictionaries: {
        //存储输入的已选字段
      },
      ruleForm: {
        //定义表单验证字段
        newName: "" //节点名称
      },
      rules: {
        //节点表单验证
        newName: [
          //新名称验证
          { required: true, message: "节点名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "节点显示名称，最长100",
            trigger: "blur"
          }
        ]
      },
      valid: true, //节点设置 确认表单 验证
      nodes: {}, //节点组件
      timer1: "",
      timer2: "",
      statementId: "", //sqlSourceId
      clusterId: "",
      bsk: true, //开关(防止连击sqlSource输出多次请求接口)
      inputErrorArr: [], //节点输入 非法字段
      inputdeficiency: [], //节点输入 缺失字段
      outputErrorArr: [], //节点输入 非法字段
      outputdeficiency: [], //节点输入 缺失字段
      tabName: "", //切换tab的title
      reName: true,
      stepsSubmitStatus: true, //防止多次点击节点确定发送多个接口
      inputLeftCurrentPage: 1,
      inputLeftPagesize: 10,
      inputRightCurrentPage: 1,
      inputRightPagesize: 10,
      outputLeftCurrentPage: 1,
      outputLeftPagesize: 10,
      outputRightCurrentPage: 1,
      outputRightPagesize: 10,
      inputAddInpSelField: [], //输入存储选中字段
      outputAddInpSelField: [], //输出存储选中字段
      inputLeftSearch: "",
      inputLeftIndex: "",
      inputRightSearch: "",
      inputRightIndex: "", //tab点击输入index值
      outputLeftSearch: "",
      outputLeftIndex: "",
      outputRightSearch: "",
      outputRightIndex: "",
      thisInputConfigurations: [], //存储当前的所有输入已选字段
      thisOutputConfigurations: [],
      copyInputData: {},
      copyOutputLoadingData: [], //存储当前输出接口的数据
      btnStatus: true
    };
  },
  components: {
    interceptorInq,
    schemaAdd,
    customize
  },
  props: ["nodeSet"],
  watch: {
    nodeSet: {
      handler(newValue) {
        this.btnStatus = newValue.btnStatus;
        var val = JSON.parse(JSON.stringify(newValue));
        this.nodeSetData = val.thisNodeData;
        this.copyInputData = JSON.parse(JSON.stringify(newValue.inputData));
        if (newValue.thisNodeData.inputConfigurations) {
          this.thisInputConfigurations = JSON.parse(
            JSON.stringify(newValue.thisNodeData.inputConfigurations)
          );
        }
        if (newValue.thisNodeData.outputConfigurations) {
          this.thisOutputConfigurations = JSON.parse(
            JSON.stringify(newValue.thisNodeData.outputConfigurations)
          );
        }
        // if(val.inputData.length!= this.thisInputConfigurations.length||val.inputData.length>1){//判断多输入与前一个节点匹配
        //     this.nodeSetData.inputConfigurations = val.inputData
        // }
        if (val.dbStatus == "1") {
          this.nodeSetTab = val.nodeSetTab;
          this.nodeSetLines = val.nodeLine;
          //高级选项如果有值，显示值，如果没有值，默认为空
          // this.advancedParameters.interceptor = ""
          this.adSesValue = "";
          // this.advancedParameters.interceptor = val.thisNodeData.otherConfigurations.interceptor;
          // if(this.advancedParameters.interceptor){        //判断是否存在高级参数interceptor
          //     this.advancedParameters.interceptor = val.thisNodeData.otherConfigurations.interceptor;
          //     this.adSesValue = val.thisNodeData.otherConfigurations.sessionCache;
          //     this.countWrittenRecordVal = val.thisNodeData.otherConfigurations.countWrittenRecord
          // }
          if (this.nodeSet.nodeSetVisible == false) {
            this.loading = false;
          }
          this.nodeSetFlowType = val.thisNodeData.type; //当前节点的类型
          this.ruleForm.newName = JSON.parse(JSON.stringify(val.newName));
          this.drawNodeTabs();
          this.adParameters();
          this.nodeSetData = val.thisNodeData;
          this.filterExpiredTime();
          if (typeof val.thisNodeData.otherConfigurations != "undefined") {
            this.countWrittenRecordVal =
              val.thisNodeData.otherConfigurations.countWrittenRecord;
          }
          this.nodeSetTab = [];
          this.nodeSetTab = this.nodeSet.nodeSetTab;

          this.inputFields = val.inputData;
          this.outputFields = val.outputData;
          let inputIdArr = this.inputFields.map(item => {
            return item.id;
          });
          let inputFieldsId = this.thisInputConfigurations.map(item => {
            return item.id;
          });
          let sameId = [];
          inputIdArr.forEach(item => {
            if (inputFieldsId.indexOf(item) == -1) {
              sameId.push(item); //把不一样的id 存起来
            }
          });
          // //以inputData为基准 把一样的id重新赋值  不一样的id值清空
          let inputFieldsNewArr = [];
          for (let i = 0; i < this.inputFields.length; i++) {
            for (let m = 0; m < this.thisInputConfigurations.length; m++) {
              if (
                this.inputFields[i].id == this.thisInputConfigurations[m].id
              ) {
                inputFieldsNewArr.push(this.thisInputConfigurations[m]); //把一样的id值存起来
              }
            }
          }
          let inputCole = JSON.parse(JSON.stringify(val.inputData));
          inputCole.forEach(item => {
            inputFieldsNewArr.forEach(item1 => {
              if (item.id == item1.id) {
                item.fields = item1.fields;
              }
            });
          });
          inputCole.forEach(item => {
            sameId.forEach(item1 => {
              if (item.id == item1) {
                item.fields = [];
              }
            });
          });
          this.nodeSetData.inputConfigurations = inputCole;
          this.thisInputConfigurations = inputCole;
          //判断验证信息
          if (
            this.nodeSetFlowType == "lookupTable" ||
            this.nodeSetFlowType == "cache"
          ) {
            this.advancedParameters.singleRowCache = this.nodeSetData.otherConfigurations.singleRowCache;
          }
          if (val.flowData.flowType !== "workflow") {
            this.inputFieldVerification(this.nodeSetData);
          }

          let comp = nodeComp(); //节点组件
          this.nodes = comp[this.nodeSetFlowType];
          this.nodeSet.dbStatus = "1";

          if (typeof this.$refs.multipleTable !== "undefined") {
            for (let m = 0; m < this.$refs.multipleTable.length; m++) {
              this.$refs.multipleTable[m].clearSelection();
            }
          }
        }
      },
      deep: true
    },
    nodeSetData: {
      handler: function(val) {
        if (!this.nodeSet.nodeSetVisible) {
          return;
        }
        this.$emit("modifynodeSet", val);
      },
      deep: true
    },
    ruleForm: {
      handler: function(val) {
        if (val.newName == "") {
          this.valid = false;
        } else {
          this.valid = true;
        }
      },
      deep: true
    },
    inputLeftSearch: function() {
      this.inputLeftKeydown(this.inputLeftSearch, this.inputLeftIndex);
    },
    inputRightSearch: function() {
      this.inputRightKeydown(this.inputRightSearch, this.inputRightIndex);
    },
    outputLeftSearch: function() {
      this.outputLeftKeydown(this.outputLeftSearch, this.outputLeftIndex);
    },
    outputRightSearch: function() {
      this.outputRightKeydown(this.outputRightSearch, this.outputRightIndex);
    },
    advancedParameters(val) {
      this.nodeSetData.advancedParameters = {
        singleRowCache: val.singleRowCache
      };
    }
  },
  filters: {},
  methods: {
    ...mapActions([
      "getAllLinks",
      "insertLinks",
      "getDataFlow",
      "inserSubtLinks",
      "setlinksId",
      "getSubFlowSteps",
      "setSetting"
    ]),
    modifynodeSetData(val) {
      this.nodeSetData = {
        ...this.nodeSetData,
        otherConfigurations: val
      };
      this.$emit("modifynodeSet", this.nodeSetData);
    },
    definesteps(val) {
      this.nodeSetData.otherConfigurations = val[0];
    },
    stepsBase64(val) {
      let base64NodesetData = JSON.parse(JSON.stringify(val));
      return base64NodesetData;
    },
    mapData(val) {
      let inputFieldsLeft = val.inputTab.fields;

      let inputFieldsRight = _.find(
        this.nodeSetData.inputConfigurations,
        item => {
          return item.id == val.inputTab.id;
        }
      ).fields;

      this.nodeSetData.inputConfigurations = _.map(
        this.nodeSetData.inputConfigurations,
        (item, index) => {
          if (item.id == val.inputTab.id) {
            return {
              fields: _.map(inputFieldsRight, (s, sIndex) => {
                let fieldItemKey = inputFieldsLeft[sIndex]
                  ? sIndex
                  : _.random(inputFieldsLeft.length - 1);
                return {
                  column: inputFieldsLeft[fieldItemKey]["column"],
                  alias: inputFieldsLeft[sIndex] ? s.column : s.column
                };
              }),
              id: val.inputTab.id
            };
          } else {
            return item;
          }
        }
      );

      this.inputFieldVerification(this.nodeSetData, val.keyIp);

      this.getSubFlowSteps(this.nodeSetData);
    },

    mapDataOut(val) {
      let inputFieldsLeft = val.inputTab.fields;

      let inputFieldsRight = _.find(
        this.nodeSetData.outputConfigurations,
        item => {
          return item.id == val.inputTab.id;
        }
      );

      this.nodeSetData.outputConfigurations = _.map(
        this.nodeSetData.outputConfigurations,
        (item, index) => {
          if (item.id == val.inputTab.id) {
            return {
              fields: _.map(inputFieldsRight.fields, (s, sIndex) => {
                let fieldItemKey = inputFieldsLeft[sIndex]
                  ? sIndex
                  : _.random(inputFieldsLeft.length - 1);
                return {
                  column: inputFieldsLeft[fieldItemKey]["name"],
                  alias: inputFieldsLeft[sIndex] ? s.column : s.column
                };
              }),
              id: val.inputTab.id
            };
          } else {
            return item;
          }
        }
      );

      this.outputFieldVerification(this.nodeSetData, val.keyOt);
      this.getSubFlowSteps(this.nodeSetData);
    },
    getCheckedFieldsList(val) {
      this.CheckedFieldsList = val;
      return this.CheckedFieldsList;
    },
    //输入字段表格操作
    inputLeftHandleSizeChange(val) {
      this.inputLeftPagesize = val;
    },
    inputLeftHandleCurrentChange(val) {
      this.inputLeftCurrentPage = val;
    },
    inputLeftIndexMethod(index) {
      return (
        this.inputLeftPagesize * (this.inputLeftCurrentPage - 1) + index + 1
      );
    },
    inputRightHandleSizeChange(val) {
      this.inputRightPagesize = val;
    },
    inputRightHandleCurrentChange(val) {
      this.inputRightCurrentPage = val;
    },
    inputRightIndexMethod(index) {
      return (
        this.inputRightPagesize * (this.inputRightCurrentPage - 1) + index + 1
      );
    },
    inputLefthandleSelectionChange(row, index) {
      this.inputAddInpSelField = row;
    },
    //输出字段表格操作
    outputLeftHandleSizeChange(val) {
      this.outputLeftPagesize = val;
    },
    outputLeftHandleCurrentChange(val) {
      this.outputLeftCurrentPage = val;
    },
    outputLeftIndexMethod(index) {
      return (
        this.outputLeftPagesize * (this.outputLeftCurrentPage - 1) + index + 1
      );
    },
    outputRightHandleSizeChange(val) {
      this.outputRightPagesize = val;
    },
    outputRightHandleCurrentChange(val) {
      this.outputRightCurrentPage = val;
    },
    outputRightIndexMethod(index) {
      return (
        this.outputRightPagesize * (this.outputRightCurrentPage - 1) + index + 1
      );
    },
    outputLefthandleSelectionChange(row, index) {
      this.outputAddInpSelField = row;
    },
    inputLeftKeydown(val, index) {
      var _this = this;
      this.inputLeftCurrentPage = 1;
      this.inputLeftPagesize = 10;
      if (_this.inputFields != "") {
        _this.inputFields[index].fields = _this.copyInputData[
          index
        ].fields.filter(
          item => ~item.column.toLowerCase().indexOf(val.toLowerCase())
        );
      }
    },
    inputLeftFocus(val, index) {
      this.inputLeftIndex = index;
    },
    inputRightKeydown(val, index) {
      this.inputRightCurrentPage = 1;
      this.inputRightPagesize = 10;
      this.inputRightIndex = index;
      if (typeof this.inputRightIndex != "string") {
        this.nodeSetData.inputConfigurations[index].fields = JSON.parse(
          JSON.stringify(
            this.thisInputConfigurations[index].fields.filter(
              item => ~item.column.toLowerCase().indexOf(val.toLowerCase())
            )
          )
        );
      }
    },
    inputRightFocus(val, index) {
      var _this = this;
      _this.inputRightIndex = index;
      if (_this.inputRightSearch == "") {
        _this.thisInputConfigurations[index].fields = JSON.parse(
          JSON.stringify(_this.nodeSetData.inputConfigurations[index].fields)
        );
      }
    },
    inputRightKeyDelete(val, index) {
      this.inputRightCurrentPage = 1;
      this.inputRightPagesize = 10;
      this.nodeSetData.inputConfigurations[index].fields = JSON.parse(
        JSON.stringify(
          this.thisInputConfigurations[index].fields.filter(
            item => ~item.column.toLowerCase().indexOf(val.toLowerCase())
          )
        )
      );
    },
    outputLeftKeydown(val, index) {
      var _this = this;
      this.outputLeftCurrentPage = 1;
      this.outputLeftPagesize = 10;
      if (_this.outputFields != "") {
        _this.outputFields[index].fields = _this.copyOutputLoadingData[
          index
        ].fields.filter(
          item => ~item.name.toLowerCase().indexOf(val.toLowerCase())
        );
      }
    },
    outputLeftFocus(val, index) {
      this.outputLeftIndex = index;
    },
    outputRightKeydown(val, index) {
      if (index === "") return false;
      this.outputRightCurrentPage = 1;
      this.outputRightPagesize = 10;
      this.nodeSetData.outputConfigurations[
        index
      ].fields = this.thisOutputConfigurations[index].fields.filter(
        item => ~item.column.toLowerCase().indexOf(val.toLowerCase())
      );
    },
    outputRightFocus(val, index) {
      var _this = this;
      _this.outputRightIndex = index;
      if (_this.outputRightSearch == "") {
        _this.thisOutputConfigurations[index].fields = JSON.parse(
          JSON.stringify(_this.nodeSetData.outputConfigurations[index].fields)
        );
      }
    },
    outputRightKeyDelete(val, index) {
      this.outputRightCurrentPage = 1;
      this.outputRightPagesize = 10;
      this.nodeSetData.inputConfigurations[index].fields = JSON.parse(
        JSON.stringify(
          this.thisInputConfigurations[index].fields.filter(
            item => ~item.column.toLowerCase().indexOf(val.toLowerCase())
          )
        )
      );
    },
    getInputRow(row) {
      return row.column;
    },
    getOutputRow(row) {
      return row.name;
    },
    //cancle
    nodeSetCancle() {
      this.nodeSet.nodeSetVisible = false;
      this.nodeSetRest();
      this.loading = false;
    },
    // 获取source output数据
    sourceOutputdata(data) {
      this.nodeSetData.outputConfigurations = [];
      this.nodeSetData.outputConfigurations.push({
        id: "output",
        fields: data
      });
    },
    /**
     * 禁止点击其他位置关闭当前的弹出层
     * ------------------------------------------------------------------
     */
    handleClose(done) {
      this.nodeSet.nodeSetVisible = false;
      this.nodeSetRest();
      // this.$emit("resetNodeSet")
    },
    //将对象数组转换成字符串
    objectArrayToString(arr) {
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += arr[i].name + ":" + arr[i].value + ",";
      }
      return str.substring(0, str.length - 1);
    },
    /**
     * 节点点击确定按钮验证方法
     * ------------------------------------------------------------------
     */
    nodeSetSubmit: function(formName) {
      if (this.outputRightSearch || this.inputRightSearch) {
        this.inputRightSearch = "";
        this.outputRightSearch = "";
        this.outputRightKeydown(this.outputRightSearch, this.outputRightIndex);
        this.inputRightKeydown(this.inputRightSearch, this.inputRightIndex);
      }

      var _this = this;
      var val = JSON.parse(JSON.stringify(this.nodeSetData));
      if (
        val.otherConfigurations.sourceFields &&
        typeof this.nodeSetData.otherConfigurations.sourceFields == Object
      ) {
        val.otherConfigurations.sourceFields = this.objectArrayToString(
          this.nodeSetData.otherConfigurations.sourceFields
        );
        val.otherConfigurations.edgeFields = this.objectArrayToString(
          this.nodeSetData.otherConfigurations.edgeFields
        );
        val.otherConfigurations.targetFields = this.objectArrayToString(
          this.nodeSetData.otherConfigurations.targetFields
        );
      }

      // var reName = true;
      this.reName = true;
      var schemaData = [];
      if (this.valid) {
        for (var s = 0; s < _this.nodeSet.flowData.steps.length; s++) {
          if (
            _this.ruleForm.newName === _this.nodeSet.flowData.steps[s].name &&
            _this.nodeSet.oldName !== _this.ruleForm.newName
          ) {
            _this.$message({
              message: "当前版本设计节点名称重复！",
              type: "error"
            });
            _this.nodeSet.nodeSetVisible = true;
            return false;
            this.reName = false;
          }
        }
        if (val.type == "sink") {
          val.outputConfigurations = null;
        }
        if (val.type == "sqlsource") {
          _this.nodeSet.nodeSetVisible = false;

          if (this.reName !== false) {
            $("#designMain .designIconBig").each(function() {
              if ($(this).attr("data-sign") == _this.nodeSet.oldName) {
                $(this).attr("data-sign", _this.ruleForm.newName);
                $(this)
                  .find("h4")
                  .text(_this.ruleForm.newName);
                $(this)
                  .find("h4")
                  .attr("title", _this.ruleForm.newName);
              }
            });

            var dfTrue = false;
            for (var i = 0; i < _this.nodeSet.flowData.steps.length; i++) {
              if (
                _this.nodeSet.oldName == _this.nodeSet.flowData.steps[i].name
              ) {
                _this.nodeSet.flowData.steps[i].name = _this.ruleForm.newName;
                dfTrue = true;
              }
            }
            if (dfTrue == false) {
              _this.nodeSet.flowData.steps.push(this.nodeSetData);
            }
            // _this.getDesignSteps();
            var nodeName = _this.nodeSetData.name;
            var nodeId = _this.nodeSetData.id;
            for (var j = 0; j < _this.nodeSet.flowData.steps.length; j++) {
              if (_this.nodeSet.flowData.steps[j].id === nodeId) {
                _this.nodeSet.flowData.steps[j] = _this.nodeSetData;
                _this.nodeSet.flowData.steps[j].name = _this.ruleForm.newName;
              }
            }
          }
          for (var i = 0; i < _this.nodeSet.flowData.steps.length; i++) {
            if (_this.thisStepId == _this.nodeSet.flowData.steps[i].id) {
              for (var j = 0; j < _this.copySteps.length; j++) {
                if (_this.thisStepId == _this.copySteps[j].id) {
                  _this.copySteps[j] = JSON.parse(
                    JSON.stringify(_this.nodeSet.flowData.steps[i])
                  );
                }
              }
            }
          }
          _this.getDataFlow(_this.nodeSet.flowData);
        } else {
          //submitDesign(_this.nodeSet.flowData.flowType,val).then((data)=>{
          this.loading = true;
          let base64NodesetData = this.stepsBase64(val);
          validateinit(_this.nodeSet.flowData.flowType, base64NodesetData).then(
            data => {
              //嵌套接口
              this.loading = false;
              this.statementId = data.statementId;
              this.clusterId = data.clusterId; //嵌套接口
              this.validateresultData();
            },
            err => {
              this.loading = false;
              this.$message({
                message: err.response.data.detailMsg,
                type: "error",
                duration: 1500
              });
              _this.nodeSet.nodeSetVisible = true;
            }
          );
        }
      } else {
        _this.$message({
          message: "提交失败，请完善节点名称！",
          type: "error"
        });
        return false;
      }
    },
    //节点确认 二层嵌套
    validateresultData() {
      var _this = this;
      var timerValidate = setTimeout(() => {
        validateresult(
          this.nodeSet.flowData.flowType,
          this.statementId,
          this.clusterId
        ).then(
          data => {
            this.loading = false;
            var Valitatedata = data.content;
            var res = data.statement;
            if (
              res === "running" ||
              res === "waiting" ||
              res === "error" ||
              res === "ready"
            ) {
              clearTimeout(timerValidate);
              this.validateresultData();
            } else {
              if (
                Valitatedata.hasOwnProperty("errorList") &&
                Valitatedata.hasOwnProperty("warningList") == false
              ) {
                this.errorlist = Valitatedata.errorList;
                this.centerDialogVisible = true;
                _this.nodeSet.nodeSetVisible = true;
              } else if (
                Valitatedata.hasOwnProperty("warningList") &&
                Valitatedata.hasOwnProperty("errorList") == false
              ) {
                this.warninglist = Valitatedata.warningList;
                this.centerDialogVisible = true;
                _this.nodeSet.nodeSetVisible = true;
              } else if (
                Valitatedata.hasOwnProperty("errorList") &&
                Valitatedata.hasOwnProperty("warningList")
              ) {
                this.errorlist = Valitatedata.errorList;
                this.warninglist = Valitatedata.warningList;
                this.centerDialogVisible = true;
              } else {
                this.nodeSet.nodeSetVisible = false;

                //--------------------------------------
                if (this.reName !== false) {
                  $("#designMain .designIconBig").each(function() {
                    if ($(this).attr("data-sign") == _this.nodeSet.oldName) {
                      $(this).attr("data-sign", _this.ruleForm.newName);
                      $(this)
                        .find("h4")
                        .text(_this.ruleForm.newName);
                      $(this)
                        .find("h4")
                        .attr("title", _this.ruleForm.newName);
                    }
                  });
                  var dfTrue = false;
                  for (
                    var i = 0;
                    i < _this.nodeSet.flowData.steps.length;
                    i++
                  ) {
                    if (
                      _this.nodeSet.oldName ==
                      _this.nodeSet.flowData.steps[i].name
                    ) {
                      _this.nodeSet.flowData.steps[i].name =
                        _this.ruleForm.newName;
                      dfTrue = true;
                    }
                  }
                  if (dfTrue == false) {
                    _this.nodeSet.flowData.steps.push(this.nodeSetData);
                  }
                  // _this.getDesignSteps();
                  var nodeName = _this.nodeSetData.name;
                  var nodeId = _this.nodeSetData.id;
                  for (
                    var j = 0;
                    j < _this.nodeSet.flowData.steps.length;
                    j++
                  ) {
                    if (_this.nodeSet.flowData.steps[j].id === nodeId) {
                      _this.nodeSet.flowData.steps[j] = _this.nodeSetData;
                      _this.nodeSet.flowData.steps[j].name =
                        _this.ruleForm.newName;
                    }
                  }
                }
                for (var i = 0; i < _this.nodeSet.flowData.steps.length; i++) {
                  if (_this.thisStepId == _this.nodeSet.flowData.steps[i].id) {
                    for (var j = 0; j < _this.copySteps.length; j++) {
                      if (_this.thisStepId == _this.copySteps[j].id) {
                        _this.copySteps[j] = JSON.parse(
                          JSON.stringify(_this.nodeSet.flowData.steps[i])
                        );
                      }
                    }
                  }
                }
                _this.getDataFlow(_this.nodeSet.flowData);
              }
            }
          },
          err => {
            this.loading = false;
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        );
      }, 500);
    },
    /**
     * 节点输入备选字段和已选字段验证
     * ------------------------------------------------------------------
     */
    inputFieldVerification(data, index) {
      //data    this.nodeSetData
      var _this = this;
      var inputFieldsArr = []; //输入备选字段
      var inputOtherArr = []; //输入已选字段
      index = index ? index : 0;
      if (data.inputConfigurations && data.inputConfigurations.length != 0) {
        //判断是否有输入
        // for(var i=0; i<this.inputFields[index].fields.length;i++){
        //     inputFieldsArr.push(this.inputFields[index].fields[i].column)
        // }
        for (var i = 0; i < this.copyInputData[index].fields.length; i++) {
          inputFieldsArr.push(this.copyInputData[index].fields[i].column);
        }
        if (_this.inputRightSearch != "") {
          for (
            var j = 0;
            j < this.thisInputConfigurations[index].fields.length;
            j++
          ) {
            inputOtherArr.push(
              this.thisInputConfigurations[index].fields[j].column
            );
          }
        } else {
          for (
            var i = 0;
            i < this.nodeSetData.inputConfigurations[index].fields.length;
            i++
          ) {
            inputOtherArr.push(
              data.inputConfigurations[index].fields[i].column
            );
          }
        }

        this.inputErrorArr = []; // 检查已选字段中是否有非法字段
        this.inputdeficiency = []; // 检查已选字段中是否缺失字段
        for (var k = 0; k < inputOtherArr.length; k++) {
          if (inputFieldsArr.indexOf(inputOtherArr[k]) == "-1") {
            this.inputErrorArr.push(inputOtherArr[k]);
          }
        }
        for (var j = 0; j < inputFieldsArr.length; j++) {
          if (inputOtherArr.indexOf(inputFieldsArr[j]) == "-1") {
            this.inputdeficiency.push(inputFieldsArr[j]);
          }
        }
      }
    },
    /**
     * 节点输出备选字段和已选字段验证
     * ------------------------------------------------------------------
     */
    outputFieldVerification(data, index) {
      //data    this.nodeSetData
      var _this = this;
      var outputFieldsArr = []; //输出备选字段
      var outputOtherArr = []; //输出已选字段
      index = index ? index : 0;
      if (data.outputConfigurations && data.outputConfigurations.length > 0) {
        //判断是否有输入
        for (
          var i = 0;
          i < this.copyOutputLoadingData[index].fields.length;
          i++
        ) {
          outputFieldsArr.push(
            this.copyOutputLoadingData[index].fields[i].name
          );
        }

        if (_this.outputRightSearch != "") {
          for (
            var j = 0;
            j < this.thisOutputConfigurations[index].fields.length;
            j++
          ) {
            outputOtherArr.push(
              this.thisOutputConfigurations[index].fields[j].column
            );
          }
        } else {
          for (
            var i = 0;
            i < this.nodeSetData.outputConfigurations[index].fields.length;
            i++
          ) {
            outputOtherArr.push(
              data.outputConfigurations[index].fields[i].column
            );
          }
        }
        this.outputErrorArr = []; // 检查已选字段中是否有非法字段
        this.outputdeficiency = []; // 检查已选字段中是否缺失字段
        for (var k = 0; k < outputOtherArr.length; k++) {
          if (outputFieldsArr.indexOf(outputOtherArr[k]) == "-1") {
            this.outputErrorArr.push(outputOtherArr[k]);
          }
        }
        for (var j = 0; j < outputFieldsArr.length; j++) {
          if (outputOtherArr.indexOf(outputFieldsArr[j]) == "-1") {
            this.outputdeficiency.push(outputFieldsArr[j]);
          }
        }
      }
    },
    nodeSetRest: function() {
      var _this = this;
      //_this.nodeSet.nodeSetVisible = false;
      this.inputLeftSearch = "";
      this.inputRightSearch = "";
      this.outputLeftSearch = "";
      this.outputRightSearch = "";
    },
    schemasFilter() {
      if (
        this.nodeSetData.inputConfigurations == "" ||
        !this.nodeSetData.inputConfigurations
      ) {
        return;
      } else {
        // 设置sql 编辑器 需要的 数据
        let schemas = this.nodeSetData.inputConfigurations[0].fields;
        let fields = [];
        for (let val of schemas) {
          fields.push(val.column);
        }
        this.dictionaries = {
          ["custom"]: {
            schemas: fields
          }
        };
        return this.dictionaries;
      }
    },
    // 获取dataflow中的输入和输出字段
    getdataflow(data) {
      var _this = this;
      var dataflowOut = data.outputs;
      var dataflowInp = data.inputs;
      if (dataflowInp !== undefined) {
        _this.nodeSetTab.unshift({
          title: "输入",
          name: "input",
          icon: "fa fa-sign-in"
        });
        _this.nodeSetData.inputConfigurations = [
          {
            id: "input",
            fields: []
          }
        ];
        _this.inputFields = [
          {
            id: "input",
            fields: []
          }
        ];
      } else {
        for (let i = 0; i < _this.nodeSetTab.length; i++) {
          if (_this.nodeSetTab[i].name == "input") {
            _this.nodeSetTab.splice(i, 1);
          }
        }
      }
      if (dataflowOut !== undefined) {
        _this.nodeSetTab.push({
          title: "输出",
          name: "output",
          icon: "fa fa-sign-out"
        });
      } else {
        for (let i = 0; i < _this.nodeSetTab.length; i++) {
          if (_this.nodeSetTab[i].name == "output") {
            _this.nodeSetTab.splice(i, 1);
          }
        }
      }
    },
    // 获取workflow的选择dataflowId新名字
    getNewname(name) {
      this.ruleForm.newName = name;
    },
    tabstatus(data) {
      this.getdataflow(data);
    },
    //获取子组件的interceptor
    // getSelectInterceptorVal(data){
    //     this.getSelValInterceptorId = data.id;
    //     this.getSelValInterceptorName = data.name;
    // },
    //source 第二层嵌套循环  请求输出接口
    getstepsout() {
      var _this = this;
      var timer = setTimeout(() => {
        outputresult(this.statementId, this.clusterId).then(
          data => {
            if (
              data.statement === "running" ||
              data.statement === "waiting" ||
              data.statement === "error" ||
              data.statement === "ready"
            ) {
              clearTimeout(timer);
              this.getstepsout();
            } else {
              for (
                var i = 0;
                i < _this.nodeSetData.outputConfigurations.length;
                i++
              ) {
                if (this.tabName.name == "输出") {
                  _this.outputFields = [
                    {
                      id: "output",
                      fields: data.content
                    }
                  ];
                }
              }
              _this.loading = false;
              _this.copyOutputLoadingData = JSON.parse(
                JSON.stringify(_this.outputFields)
              );
              this.outputFieldVerification(
                this.nodeSetData,
                this.tabName.index - 1
              );
            }
          },
          err => {
            _this.loading = false;
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        );
      }, 1000);
    },
    //其他节点 第二层嵌套循环  请求输出接口
    getDefaultStepsOut() {
      var _this = this;
      var timerSteps = setTimeout(() => {
        outputresult(this.statementId, this.clusterId).then(
          data => {
            if (
              data.statement === "running" ||
              data.statement === "waiting" ||
              data.statement === "error" ||
              data.statement === "ready"
            ) {
              clearTimeout(timerSteps);
              this.getDefaultStepsOut();
            } else {
              _this.outputFields = [];
              var thisOutput = [];
              var copyThisOutput = deepCopy(_this.nodeSetData);
              thisOutput = copyThisOutput;
              if (!thisOutput.outputConfigurations) {
                thisOutput.outputConfigurations = [
                  {
                    id: "output",
                    fields: []
                  }
                ];
              }
              for (var i = 0; i < thisOutput.outputConfigurations.length; i++) {
                _this.outputFields.push({
                  id: thisOutput.outputConfigurations[i].id,
                  fields: data.content
                });
              }
              _this.loading = false;
              _this.copyOutputLoadingData = JSON.parse(
                JSON.stringify(_this.outputFields)
              );
              if (
                _this.nodeSetFlowType == "join" ||
                _this.nodeSetFlowType == "minus" ||
                _this.nodeSetFlowType == "productjoin" 
              ) {
                this.outputFieldVerification(this.nodeSetData, 0);
              } else if (_this.nodeSetFlowType == "union") {
                this.outputFieldVerification(this.nodeSetData);
              } else {
                this.outputFieldVerification(
                  this.nodeSetData,
                  this.tabName.index - 2
                );
              }
            }
          },
          err => {
            _this.loading = false;
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        );
      }, 1000);
    },
    //监听tab切换前
    leaveTab() {
      var _this = this;
      if (nodeClass(_this.nodeSetFlowType) == "classD_A") {
        this.outputLeftSearch = "";
        this.outputRightSearch = "";
      } else if (nodeClass(_this.nodeSetFlowType) == "classD_B") {
        this.inputLeftSearch = "";
        this.inputRightSearch = "";
      } else {
        this.inputLeftSearch = "";
        this.inputRightSearch = "";
        this.outputLeftSearch = "";
        this.outputRightSearch = "";
        if (typeof this.inputLeftIndex == "number") {
          _this.inputLeftKeydown(_this.inputLeftSearch, _this.inputLeftIndex);
        }
        if (typeof this.inputRightIndex == "number") {
          _this.inputRightKeydown(
            _this.inputRightSearch,
            _this.inputRightIndex
          );
        }
        if (typeof this.outputLeftIndex == "number") {
          _this.outputLeftKeydown(
            _this.outputLeftSearch,
            _this.outputLeftIndex
          );
        }
        if (typeof this.outputRightIndex == "number") {
          _this.outputRightKeydown(
            _this.outputRightSearch,
            _this.outputRightIndex
          );
        }
      }
    },
    // 请求输出接口
    handleClick(tab, event) {
      if (typeof this.$refs.multipleTable !== "undefined") {
        for (let m = 0; m < this.$refs.multipleTable.length; m++) {
          this.$refs.multipleTable[m].clearSelection();
        }
      }
      var ouputClassName = tab.name;
      this.tabName = tab;
      var _this = this;

      if (ouputClassName !== "参数") {
        _this.inputLeftCurrentPage = 1;
        _this.inputLeftPagesize = 10;
        _this.inputRightCurrentPage = 1;
        _this.inputRightPagesize = 10;
        _this.inputAddInpSelField = [];
        _this.outputLeftCurrentPage = 1;
        _this.outputLeftPagesize = 10;
        _this.outputRightCurrentPage = 1;
        _this.outputRightPagesize = 10;
        _this.outputAddInpSelField = [];
      }
      if (ouputClassName === "参数") {
        _this.getSelInputFields();
        //获取输入的已选字段
        _this.schemasFilter();
        this.loading = false;
      }
      if (
        (ouputClassName == "输出" &&
          _this.nodeSetFlowType != "sqlsource" &&
          _this.nodeSetFlowType != "source" &&
          _this.nodeSetFlowType != "dataflow") ||
        ouputClassName == "yes" ||
        ouputClassName == "no" ||
        ouputClassName == "ok" ||
        ouputClassName == "error"
      ) {
        var thisInput = [];
        for (var i = 0; i < _this.nodeSetData.inputConfigurations.length; i++) {
          for (
            var j = 0;
            j < _this.nodeSetData.inputConfigurations[i].fields.length;
            j++
          ) {
            thisInput.push(_this.nodeSetData.inputConfigurations[i].fields[j]);
          }
        }
        var thisOutput = [];
        var copyThisOutput = deepCopy(_this.nodeSetData);
        thisOutput = copyThisOutput;
        if (_this.nodeSetData.inputConfigurations.length != 0) {
          if (_this.nodeSetData.inputConfigurations[0].id != "input") {
          } else {
            thisOutput.inputConfigurations[0].id = "input";
          }
        }

        if (ouputClassName == "yes" || ouputClassName == "no") {
          thisOutput.outputConfigurations = [
            {
              id: "yes",
              fields: thisInput
            },
            {
              id: "no",
              fields: thisInput
            }
          ];
        } else if (ouputClassName == "ok" || ouputClassName == "error") {
          thisOutput.outputConfigurations = [
            {
              id: "ok",
              fields: thisInput
            },
            {
              id: "error",
              fields: thisInput
            }
          ];
        } else {
          thisOutput.outputConfigurations = [
            {
              id: "output",
              fields: thisInput
            }
          ];
        }

        //仅判断lookupTable类型的参数
        if (this.nodeSetFlowType == "lookupTable") {
          thisOutput.type = "cache";
        }

        if (ouputClassName == "error") {
          this.loading = true;
          let base64NodesetData = this.stepsBase64(thisOutput);
          errorOutputDataFlow("error", base64NodesetData).then(
            data => {
              this.statementId = data.statementId;
              this.clusterId = data.clusterId;
              this.getDefaultStepsOut();
            },
            err => {
              _this.outputFields = "";
              this.loading = false;
              this.$message({
                message: err.response.message,
                type: "error",
                duration: 1500
              });
            }
          );
        } else {
          _this.loading = true;
          let base64NodesetData = this.stepsBase64(_this.nodeSetData);
          outputInit(base64NodesetData).then(
            data => {
              this.statementId = data.statementId;
              this.clusterId = data.clusterId;
              this.getDefaultStepsOut();
            },
            err => {
              _this.outputFields = "";
              _this.loading = false;
              this.$message({
                message: err.response.message,
                type: "error",
                duration: 1500
              });
            }
          );
        }
      } else {
        if (_this.nodeSetFlowType == "source" && ouputClassName !== "参数") {
          if (_this.nodeSetData.otherConfigurations.dataset == "") {
            _this.$message({
              message: "参数数据集为空",
              type: "error",
              duration: 1500
            });
            return false;
          } else {
            _this.loading = true;
            _this.nodeSetData.outputConfigurations[0].id = "output";
            let base64NodesetData = this.stepsBase64(_this.nodeSetData);
            outputInit(base64NodesetData).then(data => {
              this.statementId = data.statementId;
              this.clusterId = data.clusterId;
              this.getstepsout();
            });
          }
        } else if (
          _this.nodeSetFlowType == "sqlsource" &&
          ouputClassName !== "参数"
        ) {
          _this.nodeSetData.outputConfigurations[0].id = "output";
          let paramsData = {
            sql: this.nodeSetData.otherConfigurations.sql
          };
          _this.outputFields = [
            {
              id: "output",
              fields: []
            }
          ];
          _this.loading = true;
          if (this.bsk) {
            _this.bsk = false;
            let base64NodesetData = this.stepsBase64(_this.nodeSetData);
            parseinit("dataflow", base64NodesetData).then(
              data => {
                //一层嵌套请求
                this.statementId = data.statementId;
                this.clusterId = data.clusterId;
                this.parseresultSql();
              },
              err => {
                clearTimeout(this.timer1);
                _this.loading = false;
                this.$message({
                  message: err.response.message,
                  type: "error",
                  duration: 1500
                });
                _this.bsk = true;
              }
            );
          }
        } else if (_this.nodeSetFlowType == "dataflow") {
          _this.loading = false;
        } else {
          if (
            (_this.nodeSetFlowType == "minus" ||
              _this.nodeSetFlowType == "intersect" ||
              _this.nodeSetFlowType == "join" ||
              _this.nodeSetFlowType == "productjoin" ||
              _this.nodeSetFlowType == "union" ||
              _this.nodeSetFlowType == "starjoin" ) &&
            ouputClassName != "参数"
          ) {
            this.inputFieldVerification(this.nodeSetData, tab.index);
          }
        }
      }
    },
    //sql 第二次请求接口
    parseresultSql() {
      this.timer1 = setTimeout(() => {
        var _this = this;
        parseresult(this.statementId, this.clusterId).then(
          data => {
            //二层嵌套请求
            if (
              data.statement === "running" ||
              data.statement === "waiting" ||
              data.statement === "error" ||
              data.statement === "ready"
            ) {
              clearTimeout(this.timer1);
              this.parseresultSql();
            } else {
              let datasetsData = {
                dataset: data.dataset.toString(),
                sql: this.nodeSetData.otherConfigurations.sql
              };
              this.nodeSetData.otherConfigurations.dataset =
                datasetsData.dataset;
              let base64NodesetData = this.stepsBase64(_this.nodeSetData);
              analyzeinitSql("dataflow", base64NodesetData).then(
                data => {
                  //三层嵌套请求 (添加nodesetData flowtype)
                  this.statementId = data.statementId;
                  this.clusterId = data.clusterId;
                  this.analyzeresultSqlFour();
                },
                err => {
                  this.$message({
                    message: err.response.data.detailMsg,
                    type: "error",
                    duration: 1500
                  });
                  _this.loading = false;
                  _this.bsk = true;
                }
              );
            }
          },
          err => {
            this.$message({
              message: err.response.data.detailMsg,
              type: "error",
              duration: 1500
            });
            _this.loading = false;
            _this.bsk = true;
          }
        );
      }, 1000);
    },
    //sql 第四次请求接口
    analyzeresultSqlFour() {
      this.timer2 = setTimeout(() => {
        var _this = this;
        analyzeresultSql(this.statementId, this.clusterId).then(
          data => {
            //四层嵌套请求
            if (
              data.statement === "running" ||
              data.statement === "waiting" ||
              data.statement === "error" ||
              data.statement === "ready"
            ) {
              clearTimeout(this.timer2);
              this.analyzeresultSqlFour();
            } else {
              var data = data.content;
              for (var j = 0; j < data.length; j++) {
                var regex = /\`(.+?)\`/g;
                var result;
                while ((result = regex.exec(data[j].name)) != null) {
                  data[j].name = result[1];
                }
              }
              for (
                var i = 0;
                i < _this.nodeSetData.outputConfigurations.length;
                i++
              ) {
                if (this.tabName.name == "输出") {
                  _this.outputFields = [
                    {
                      id: "output",
                      fields: data
                    }
                  ];
                }
              }
              _this.copyOutputLoadingData = JSON.parse(
                JSON.stringify(_this.outputFields)
              );
              _this.loading = false;
              this.outputFieldVerification(
                this.nodeSetData,
                this.tabName.index - 1
              );
              _this.bsk = true;
            }
          },
          err => {
            clearTimeout(this.timer1);
            _this.loading = false;
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
            _this.bsk = true;
          }
        );
      }, 1000);
    },
    adParameters: function() {
      var type = this.nodeSetFlowType;
    },
    drawNodeTabs: function() {
      var _this = this;
      var type = this.nodeSetFlowType;
      var flowType = this.$route.query.type;
      _this.activeName2 = this.nodeSetTab[0].title;
    },

    //singleRowCache 取值
    singleRowCacheValue: function(val) {
      this.nodeSetData.otherConfigurations.singleRowCache = val;
    },
    //dataflow IO sink 高级取值
    selCountWrittenRecordVal: function(val) {
      this.nodeSetData.otherConfigurations.countWrittenRecord = val;
    },
    nullValueVal: function(val) {
      this.nodeSetData.otherConfigurations.nullValue = val;
    },
    maxFileSizeVal: function(val) {
      this.nodeSetData.otherConfigurations.maxFileSize = val;
    },
    maxFileNumberVal: function(val) {
      this.nodeSetData.otherConfigurations.maxFileNumber = val;
    },
    expiredTimeValue: function(val) {
      let exSel = this.expiredTimeSelect;
      this.exTimeVal = val;
      if (exSel == "s") {
        this.cpexpiredTimeVal = val;
      } else if (exSel == "m") {
        this.cpexpiredTimeVal = val * 60;
      } else if (exSel == "h") {
        this.cpexpiredTimeVal = val * 3600;
      } else if (exSel == "d") {
        this.cpexpiredTimeVal = val * 86400;
      }
      if (this.nodeSetData.otherConfigurations) {
        this.nodeSetData.otherConfigurations.expiredTime = this.cpexpiredTimeVal;
      }
    },
    expiredTimeSelVal: function(val) {
      let nexVal = this.exTimeVal;
      let nexSelVal = "";
      if (val == "s") {
        nexSelVal = nexVal;
      } else if (val == "m") {
        nexSelVal = nexVal * 60;
      } else if (val == "h") {
        nexSelVal = nexVal * 3600;
      } else if (val == "d") {
        nexSelVal = nexVal * 86400;
      }
      this.cpexpiredTimeVal = nexSelVal;
      this.nodeSetData.otherConfigurations.expiredTime = this.cpexpiredTimeVal;
    },
    //过滤类型为SINK内expiredTime的时间值
    filterExpiredTime: function() {
      let eTimeVal = this.nodeSetData.otherConfigurations.expiredTime;
      let nexVal = "";
      if (60 > eTimeVal && eTimeVal > -1) {
        nexVal = eTimeVal;
        this.exTimeVal = nexVal;
        this.expiredTimeSelect = "s";
      } else if (59 < eTimeVal && eTimeVal < 3600) {
        nexVal = eTimeVal / 60;
        this.exTimeVal = nexVal;
        this.expiredTimeSelect = "m";
      } else if (86400 > eTimeVal && eTimeVal > -3599) {
        nexVal = eTimeVal / 3600;
        this.exTimeVal = nexVal;
        this.expiredTimeSelect = "h";
      } else if (eTimeVal > 86399) {
        nexVal = eTimeVal / 86400;
        this.exTimeVal = nexVal;
        this.expiredTimeSelect = "d";
      } else {
        this.exTimeVal = 0;
        this.expiredTimeSelect = "d";
      }
    },
    sliceTimeColumnVal: function(val) {
      this.nodeSetData.otherConfigurations.sliceTimeColumn = val;
    },
    sliceTypeVal: function(val) {
      this.nodeSetData.otherConfigurations.sliceType = val;
    },
    //已选字段 获取别名的值
    inpAlias: function(val, index, index1) {
      var _this = this;
      this.nodeSetData.inputConfigurations[index].fields[index1].alias = val;
      var inputRightVal = this.nodeSetData.inputConfigurations[index].fields[
        index1
      ].column;
      for (
        var i = 0;
        i < _this.thisInputConfigurations[index].fields.length;
        i++
      ) {
        if (
          _this.thisInputConfigurations[index].fields[i].column == inputRightVal
        ) {
          _this.thisInputConfigurations[index].fields[i].alias = val;
        }
      }
    },
    outAlias: function(val, index, index1) {
      var _this = this;
      this.nodeSetData.outputConfigurations[index].fields[index1].alias = val;
      var outputRightVal = this.nodeSetData.outputConfigurations[index].fields[
        index1
      ].column;
      for (
        var i = 0;
        i < _this.thisOutputConfigurations[index].fields.length;
        i++
      ) {
        if (
          _this.thisOutputConfigurations[index].fields[i].column ==
          outputRightVal
        ) {
          _this.thisOutputConfigurations[index].fields[i].alias = val;
        }
      }
    },
    //已选字段 删除当前字段
    removeInpSelThisField: function(val, index, index1, rows) {
      var _this = this;
      rows.splice(index1, 1);
      for (
        var i = 0;
        i < _this.thisInputConfigurations[index].fields.length;
        i++
      ) {
        if (_this.thisInputConfigurations[index].fields[i].column == val) {
          _this.thisInputConfigurations[index].fields.splice(i, 1);
        }
      }
      this.inputFieldVerification(_this.nodeSetData, index);
      this.removeInpVerification1(val, index);
    },
    removeOutSelThisField: function(val, index, index1, rows) {
      var _this = this;
      rows.splice(index1, 1);
      for (
        var i = 0;
        i < _this.thisOutputConfigurations[index].fields.length;
        i++
      ) {
        if (_this.thisOutputConfigurations[index].fields[i].column == val) {
          _this.thisOutputConfigurations[index].fields.splice(i, 1);
        }
      }
      this.outputFieldVerification(this.nodeSetData, index);
      this.removeOutpVerification1(val, index);
      this.updateSubFlowSteps(this.nodeSetData);
    },
    //提取schema
    getSchema: function(index) {
      var field = this.nodeSetData.inputConfigurations[index].fields;
      this.schemaField = [];
      //构建schema的字段
      for (var i = 0; i < field.length; i++) {
        this.schemaField.push({
          name: field[i].alias ? field[i].alias : field[i].column,
          type: field[i].type ? field[i].type : "string",
          alias: "",
          description: ""
        });
      }
      //打开新建schema的dialog
      this.dialogGetSchemaVisible = true;
    },
    closeSchema: function() {
      this.dialogGetSchemaVisible = false;
    },
    //已选字段 删除全部字段
    removeInpSelAllField: function(index) {
      var _this = this;
      this.$confirm("确认删除全部字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.nodeSetData.inputConfigurations[index].fields = [];
          _this.inputFieldVerification(_this.nodeSetData, index);
          _this.thisInputConfigurations = JSON.parse(
            JSON.stringify(_this.nodeSetData.inputConfigurations)
          );
        })
        .catch(() => {});
    },
    removeOutSelAllField: function(index) {
      var _this = this;
      this.$confirm("确认删除全部字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.nodeSetData.outputConfigurations[index].fields = [];
          _this.outputFieldVerification(_this.nodeSetData, index);
          _this.thisOutputConfigurations = JSON.parse(
            JSON.stringify(_this.nodeSetData.outputConfigurations)
          );
          this.updateSubFlowSteps(_this.nodeSetData);
        })
        .catch(() => {});
    },
    //输入已选字段   删除非法字段
    removeInpVerification(index) {
      var val = this.nodeSetData.inputConfigurations[index].fields;
      for (var i = 0; i < val.length; i++) {
        for (var k = 0; k < this.inputErrorArr.length; k++) {
          if (val[i].column == this.inputErrorArr[k]) {
            val.splice(i, 1);
            i--;
            break;
          }
        }
      }
      this.thisInputConfigurations = JSON.parse(
        JSON.stringify(this.nodeSetData.inputConfigurations)
      );
      this.inputFieldVerification(this.nodeSetData, index);
    },
    removeInpVerification1(value, index) {
      var val = this.nodeSetData.inputConfigurations[index].fields;
      for (var i = 0; i < val.length; i++) {
        for (var k = 0; k < this.inputErrorArr.length; k++) {
          if (val[i].column == value) {
            val.splice(i, 1);
            i--;
            break;
          }
        }
      }
      this.inputFieldVerification(this.nodeSetData, index);
    },
    //输出已选字段  删除非法字段
    removeOutpVerification(index) {
      var val = this.nodeSetData.outputConfigurations[index].fields;
      for (var i = 0; i < val.length; i++) {
        for (var k = 0; k < this.outputErrorArr.length; k++) {
          if (val[i].column == this.outputErrorArr[k]) {
            val.splice(i, 1);
            i--;
            break;
          }
        }
      }
      this.thisOutputConfigurations = JSON.parse(
        JSON.stringify(this.nodeSetData.outputConfigurations)
      );
      this.outputFieldVerification(this.nodeSetData, index);
    },
    removeOutpVerification1(value, index) {
      var _this = this;
      var val = this.nodeSetData.outputConfigurations[index].fields;
      for (var i = 0; i < val.length; i++) {
        for (var k = 0; k < this.outputErrorArr.length; k++) {
          if (val[i].column == value) {
            val.splice(i, 1);
            i--;
            break;
          }
        }
      }
      this.outputFieldVerification(this.nodeSetData, index);
    },
    //输入备选字段 全部导入 已选字段
    inputFieldsImport: function(index) {
      var _this = this;
      this.$confirm("确认导入当前表格内的所有字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (_this.inputFields.length == 1) {
            _this.inputFields[index].id = "input";
          }
          _this.nodeSetData.inputConfigurations[index].id = JSON.parse(
            JSON.stringify(_this.inputFields)
          )[index].id;
          if (
            _this.nodeSetData.inputConfigurations.length > 1 &&
            _this.inputFields.length == 1
          ) {
            for (
              var k = 0;
              k < _this.nodeSetData.inputConfigurations.length;
              k++
            ) {
              if (_this.nodeSetData.inputConfigurations[k].id == "input") {
                _this.nodeSetData.inputConfigurations[0] =
                  _this.nodeSetData.inputConfigurations[k];
                _this.nodeSetData.inputConfigurations.length = 1;
              }
            }
          }
          _this.inputRightKeydown("", index);
          var columnVal = [];
          _this.thisInputConfigurations[index].fields.forEach(function(item) {
            columnVal.push(item.column);
          });
          var turnValue = [];
          var falseValue = [];
          for (
            var i =
              JSON.parse(JSON.stringify(_this.inputFields))[index].fields
                .length - 1;
            i >= 0;
            i--
          ) {
            if (
              columnVal.indexOf(_this.inputFields[index].fields[i].column) == -1
            ) {
              _this.nodeSetData.inputConfigurations[index].fields.unshift({
                column: _this.inputFields[index].fields[i].column,
                alias: _this.inputFields[index].fields[i].alias
              });
              falseValue.push(_this.inputFields[index].fields[i].column);
            } else {
              turnValue.push(_this.inputFields[index].fields[i].column);
            }
          }
          _this.thisInputConfigurations = JSON.parse(
            JSON.stringify(_this.nodeSetData.inputConfigurations)
          );
          _this.inputRightSearch = "";
          _this.inputFieldVerification(_this.nodeSetData, index);

          _this.nodeSetData.outputConfigurations = [
            {
              id: "output",
              fields: _this.thisInputConfigurations[index].fields
            }
          ];
        })
        .catch(() => {});
    },
    //输出备选字段 全部导入 已选字段
    ouputFieldsImport: function(index) {
      //this.$emit('getWorkDataflowName','我是从子组件传过来的内容！！！');
      var _this = this;
      this.$confirm("确认导入当前表格内的所有字段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.nodeSetData.outputConfigurations[index].id = JSON.parse(
            JSON.stringify(_this.outputFields)
          )[index].id;
          _this.outputRightKeydown("", index);
          var columnVal = [];
          _this.thisOutputConfigurations[index].fields.forEach(function(item) {
            columnVal.push(item.column);
          });
          var turnValue = [];
          var falseValue = [];
          for (
            var i =
              JSON.parse(JSON.stringify(_this.outputFields))[index].fields
                .length - 1;
            i >= 0;
            i--
          ) {
            if (
              columnVal.indexOf(_this.outputFields[index].fields[i].name) == -1
            ) {
              _this.nodeSetData.outputConfigurations[index].fields.unshift({
                column: _this.outputFields[index].fields[i].name,
                alias: _this.outputFields[index].fields[i].alias
              });
              falseValue.push(_this.outputFields[index].fields[i].name);
            } else {
              turnValue.push(_this.outputFields[index].fields[i].name);
            }
          }
          _this.thisOutputConfigurations = JSON.parse(
            JSON.stringify(_this.nodeSetData.outputConfigurations)
          );
          _this.outputRightSearch = "";
          _this.outputFieldVerification(_this.nodeSetData, index);
          this.updateSubFlowSteps(_this.nodeSetData);
        })
        .catch(() => {});
    },
    updateSubFlowSteps(data) {
      this.$emit("updateSubFlowSteps", data);
    },
    //input 备选字段操作
    addInpSelField: function(index) {
      var _this = this;
      this.inputRightKeydown("", index);
      var columnVal = [];
      _this.thisInputConfigurations[index].fields.forEach(function(item) {
        columnVal.push(item.column);
      });
      for (var i = _this.inputAddInpSelField.length - 1; i >= 0; i--) {
        if (columnVal.indexOf(_this.inputAddInpSelField[i].column) == -1) {
          _this.nodeSetData.inputConfigurations[index].fields.unshift({
            column: _this.inputAddInpSelField[i].column,
            alias: ""
          });
        }
      }

      if (this.inputAddInpSelField.length === 0) {
        this.$message({
          message: "sorry，请选择备选字段",
          type: "error"
        });
      }
      this.thisInputConfigurations = JSON.parse(
        JSON.stringify(this.nodeSetData.inputConfigurations)
      );
      this.inputRightSearch = "";
      this.inputFieldVerification(this.nodeSetData, index);

      this.nodeSetData.outputConfigurations = [
        {
          id: "output",
          fields: this.thisInputConfigurations[index].fields
        }
      ];
    },
    //ouput 备选字段操作
    addOutSelField: function(index) {
      var _this = this;
      this.outputRightKeydown("", index);
      var columnVal = [];
      _this.thisOutputConfigurations[index].fields.forEach(function(item) {
        columnVal.push(item.column);
      });

      for (var i = _this.outputAddInpSelField.length - 1; i >= 0; i--) {
        if (columnVal.indexOf(_this.outputAddInpSelField[i].name) == -1) {
          _this.nodeSetData.outputConfigurations[index].fields.unshift({
            column: _this.outputAddInpSelField[i].name,
            alias: ""
          });
        } else {
        }
      }

      if (this.outputAddInpSelField.length === 0) {
        this.$message({
          message: "sorry，请选择备选字段",
          type: "error"
        });
      }
      this.thisOutputConfigurations = JSON.parse(
        JSON.stringify(this.nodeSetData.outputConfigurations)
      );
      this.outputRightSearch = "";
      this.outputFieldVerification(this.nodeSetData, index);
      this.updateSubFlowSteps(_this.nodeSetData);
    },
    getSelInputFields: function() {
      var _this = this;
      if (nodeClass(_this.nodeSetFlowType) != "classD_A") {
        _this.getInpFields = transformArr(
          deepCopy(_this.nodeSetData.inputConfigurations)
        );
        for (var i = 0; i < _this.getInpFields.length; i++) {
          for (var j = 0; j < _this.getInpFields[i].fields.length; j++) {
            if (
              _this.getInpFields[i].fields[j].alias === "" ||
              typeof _this.getInpFields[i].fields[j].alias == "undefined"
            ) {
              _this.getInpFields[i].fields[j].alias = "";
              _this.getInpFields[i].fields[j].alias =
                _this.getInpFields[i].fields[j].column;
            }
          }
        }
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.block {
  opacity: 1;
  position: absolute;
}

.nodeTable {
  float: left;
  width: 100%;
  max-height: 100%;
}

.blockLeft {
  width: 39%;
  float: left;
}

.blockLeft li {
  cursor: pointer;
}

.blockRight {
  position: relative;
  width: 60%;
  float: left;
  margin-left: 1%;
}

.block__list {
  box-sizing: border-box;
  border: 1px solid #bce8f1;
}

.block__list ul {
  margin: 0px;
  padding: 0px;
}

.block__list-title {
  padding: 5px 10px 5px 10px;
  text-align: left;
  color: #31708f;
  background: #dae6ec;
}

.block__list_words li {
  padding: 10px;
}

.block__list_words .sortable-ghost {
  opacity: 0.4;
  background-color: #f4e2c9;
}

.block__list_tags:after {
  clear: both;
  content: "";
  display: block;
}

.block__list_tags li {
  color: #fff;
  float: left;
  margin: 8px 20px 10px 0;
  padding: 5px 10px;
  min-width: 10px;
  background-color: #5f9edf;
  text-align: center;
}

.block__list_tags li:first-child:first-letter {
  text-transform: uppercase;
}

.parIcon {
  position: absolute;
  left: -20px;
  top: 14px;
}

.elSelect {
  width: 100%;
}

.ele-input {
  margin-top: -10px;
}

.dialogInterceptor {
  position: fixed;
  left: 50%;
  top: 10%;
  width: 80%;
  height: calc(80vh);
  margin-left: -40%;
  background-color: #ffffff;
  z-index: 2002;
}

.dialogInterceptor .diHeader {
  z-index: 100;
  float: left;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #4c4c51;
}

.dialogInterceptor .diHeader h3 {
  float: left;
  margin: 0px;
  width: 60%;
  padding: 0px 0px 0px 20px;
  font-weight: normal;
  color: #ffffff;
}

.dialogInterceptor .diHeader span {
  color: #ffffff;
  float: right;
  margin-right: 20px;
  margin-top: 14px;
  font-size: 16px;
  cursor: pointer;
}

.dialogInterceptor .diFooter {
  float: right;
  width: 100%;
  border-top: 1px solid #eeeeee;
  padding: 15px;
  box-sizing: border-box;
  text-align: right;
  bottom: 0px;
}

.dialogInterceptor .diContent {
  float: left;
  width: 100%;
  height: calc(90% - 50px);
  padding-top: 5px;
  box-sizing: border-box;
}

@media screen and (max-height: 500px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 18vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (min-height: 500px) and (max-height: 599px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 20vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (min-height: 600px) and (max-height: 699px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 26vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (min-height: 700px) and (max-height: 799px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 31vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (min-height: 800px) and (max-height: 900px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 34vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@media screen and (min-height: 901px) {
  ol {
    margin: 0px;
    min-height: 70px;
    max-height: 38vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.removeFields {
  text-align: center;
}

.removeFields i {
  cursor: pointer;
  color: #ff4949;
  font-weight: bold;
}

.liFieldsClass {
  float: left;
  width: 95%;
}

.selectClass {
  margin-top: -10px;
  width: 100%;
}

.removeAllFields {
  float: right;
  margin: 8px 10px 0px 0px;
}

.removeAllFields:hover {
  color: #ff4949;
  cursor: pointer;
}

.getSchema {
  float: right;
  margin: 9px 20px 0px 0px;
}

.getSchema:hover {
  color: #ff4949;
  cursor: pointer;
}

.expiredTimeSelect {
  width: 100px;
}

.ns_fields1,
.ns_fields2 {
  float: right;
  font-size: 16px;
  height: 18px;
  line-height: 18px;
  margin: 7px 5px 0px 0px;
  font-weight: bold;
  cursor: pointer;
}

.ns_fields2 {
  margin-right: 10px;
}

.ns_fields3 {
  margin-left: 10px;
  font-size: 16px;
  line-height: 10px;
  cursor: pointer;
}

.ns_fields1:hover,
.ns_fields2:hover,
.ns_fields3:hover {
  color: #ff4e4e;
}

.peForm {
  padding: 10px;
  overflow-y: auto;
  margin: 0px 0px 25px 0px;
  max-height: calc(55vh - 95px);
}

.word-wrap {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}

.priorityMes {
  position: absolute;
  top: 13px;
  color: #333;
  left: -20px;
}

.elForm {
  margin: 0px 0px 10px 0px;
}

.red {
  color: red;
}

.pr20 {
  padding-right: 10px;
}
.pl40 {
  padding-left: 40px;
}

ol {
  width: 100%;
}

.pl60 {
  padding-left: 60px;
}
.maxHeight {
  max-height: 35px;
  overflow-y: auto;
}

.el-notification__content {
  width: 200px;
}
</style>
