<template>
  <div class="ace">
    <editor
      ref="myEditor"
      v-model="value"
      class="editor"
      :lang="'sql'"
      :theme="'chrome'"
      :width="'100%'"
      :height="sqlConfig.height"
      :options="options"
      :autoComplete="true"
      v-loading="sqlConfig.loading"
      :name="value"
      @init="editorInit"
    />
    <el-dialog v-dialog-drag
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @close="closeDialog"
    >
      <div
        v-for="(item, index) in dictionary"
        :key="index"
      >
        <div class="tableNames"
            v-if="isUseTableName"
        >
          {{ index }}
        </div>
        <el-checkbox
          v-model="item.checkStatus.checkAll"
          :indeterminate="item.checkStatus.isIndeterminate"
          @change="handleCheckAllChange(item)"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="item.checkStatus.checkedWord"
          @change="handleCheckedWordChange(item)"
        >
          <el-checkbox
            v-for="word in item.schemas"
            :key="item + word"
            :label="word"
          >
            {{ word }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="getText"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/**
 * 组件描述
 * @height 控制高度
 * @defaultsql sql编辑器的默认值
 * @isUseTableName 控制是否使用提示，默认使用true， 不使用 false
 * dictionaries ：{
 *  table1: { 表名
      schemas: ['id', 'name', 'age', 'tel', 'date', 'code']
    },
    table2: {
      schemas: ['tel', 'date', 'code']
    }
 * }
 * 
 * 实现：
 * 1、能提供默认值
 * 2、实时修改 sql 内容传递给父组件   this.$emit('getValue', this.sqlConfig.sqlValue)
 * 3、代码格式化  快捷键：Ctrl-Shift-F  如果父组件有格式化按钮调用：sqlFormatter()  this.$emit('methods', this.sqlFormatter, this.dialog)
 * 4、是否使用提示 快捷键：Ctrl-Shift-I 如果父组件有提示按钮调用：dialog() this.$emit('methods', this.sqlFormatter, this.dialog)
 */

// 编写 语句
import Vue from 'vue'
import editor from 'vue2-ace-editor'
import 'brace/mode/sql'
import 'brace/theme/chrome'
// 格式化 sql
import sqlFormatter from 'sql-formatter'
var ace = require('brace')
export default {
  components: { editor },
  props: {
    // 是否使用弹出框
    isUseTableName: {
      type: Boolean,
      default: true
    },
    // 默认sql
    sqlConfig: {
      type: Object,
      default: () => {
        return {
          height: '150',
          loadding: false
        }
      }
    },
    defaultsql: {
      type: String,
      default: ''
    },
    // data
    dictionaries: {
        type: Object,
        default: () => {}
    }
  },
  data () {
    return {
      dictionary: {},
      fields: [],
      dialogVisible: false,
      editor: '',
      value: '',
      // 编辑器配置
      options: {
        useSoftTabs: true,
        tabSize: 2,
        showLineNumbers: true,
        fontSize: '14px',
        // enableBasicAutocompletion: true,
        // enableSnippets: true,
        enableLiveAutocompletion: true,
         wrap: true,  // 自动换行
      },
    }
  },
  created () {
    // 添加复选框属性
    this.checkboxDefault()
    // 判断父页面是传递表名加字段
  },
  mounted () {
    this.dictionary = JSON.parse(JSON.stringify(this.dictionaries))
    this.value = this.defaultsql
    this.checkboxDefault()
    // 判断父页面是否传递表名加字段
    this.$emit('methods', this.sqlFormatter, this.dialog)
  },
  methods: {
    closeDialog(){
      this.dialogVisible = false;  
      this.$emit("removeElement");
    },
    editorInit: function (editor) {
      this.editor = editor
      this.editor.setShowPrintMargin(false)
      require('brace/ext/language_tools')
      require('brace/mode/sql')
      require('brace/theme/chrome')
      // require('brace/snippets/sql')
      // 注册快捷键
      this.ShortcutKeys(editor)
       // 删除的时候能实时监听到
      this.editor.getSession().on('change', (e) => {
        this.$emit('getValue', this.value)
      });
    },
    // 设置快捷键 格式化、提示插入、删除
    ShortcutKeys (editor) {
      // 不管 需不需要弹窗都要注册事件， 因为会调起浏览器的默认快捷键
        editor.commands.addCommand({
          name: 'Ctrl-Shift-Alt-I',
          bindKey: { win: 'Ctrl-Shift-Alt-I', mac: 'Ctrl-Shift-Alt-I' },
          exec: (editor) => {
            this.dialog()
          },
          readOnly: true
        })
      // 格式化
      editor.commands.addCommand({
        name: 'Ctrl-Shift-Alt-F',
        bindKey: { win: 'Ctrl-Shift-Alt-F', mac: 'Ctrl-Shift-Alt-F' },
        exec: (editor) => {
          this.sqlFormatter()
        },
        readOnly: true
      })
      // 撤回
      editor.commands.addCommand({
        name: 'Ctrl-Z',
        bindKey: { win: 'Ctrl-Z', mac: 'Command-Z' },
        exec: (editor) => {
          this.editor.undo()
        },
        readOnly: true
      })
    },
    // 插入值
    getText () {
      // 在不需要弹框的时候不处理
      this.dialogVisible = false
      let keys = Object.keys(this.dictionary)
      for (let key of keys) {
        for (let checkedWord of this.dictionary[key]['checkStatus']['checkedWord']) {
          if (!this.isUseTableName) {
            this.editor.insert(checkedWord + ', ')
          }else {
            this.editor.insert("`"+key +"`" + '.'+" `" + checkedWord+"` " + " , ");
          }
        }
      }
      this.editor.focus()
      this.editor.removeWordLeft()
      this.editor.removeWordLeft()
      this.editor.insert(' ')
      // 确定之后初始化值
      this.checkboxDefault();

      this.$emit("removeElement");
    },
    // 全选
    // 1、这里多加了一个 toggle 的属性， 因为 全选函数是一个回调函数，默认是 Boolean
    // 2、全选又是循环出来的，所以把全选回调的参数改成当前对象
    // 3、使用 toggle 属性来改变状态
    handleCheckAllChange (item) {
      item.checkStatus = Object.assign({}, item.checkStatus, {
        checkedWord: !item.checkStatus.toggle ? item.schemas : [],
        isIndeterminate: false,
        toggle: !item.checkStatus.toggle
    })
    },
    // 选择单个 注意必须，toogle =  checkedCount === item.schemas.length
    handleCheckedWordChange (item) {
      let checkedCount = item.checkStatus.checkedWord.length
      item.checkStatus = Object.assign({}, item.checkStatus, {
        checkAll: checkedCount === item.schemas.length,
        isIndeterminate: checkedCount > 0 && checkedCount < item.schemas.length,
        toggle: checkedCount === item.schemas.length
      })
    },
    // 添加默认值
    checkboxDefault () {
        let tableName = Object.keys(this.dictionary)
        for (let index in tableName) {

          // 設置初始值
          this.$set(this.dictionary[tableName[index]], 'checkStatus', {
            checkAll: false,
            checkedWord: [],
            toggle: false,
            isIndeterminate: false
          })
        }
    },
    // 格式化代码
    sqlFormatter () {
      if (!this.value) {
        this.$message.error('请输入sql');
        return
      }
      this.value = sqlFormatter.format(this.value)
    },
    dialog () {
      // 调用弹框
      this.dialogVisible = true
    },
    getFocus () {
      this.editor.focus()
      this.editor.setValue(this.editor.getValue())
    }
  },
  watch: {
    dictionaries:{
      handler:function(newValue){
        this.dictionary = JSON.parse(JSON.stringify(newValue))
        this.checkboxDefault()
      },
      deep:true
    },
     defaultsql:{
      handler:function(newValue){
        this.value = newValue
      },
      deep:true
    }
  }
}
</script>
<style lang="scss" scoped>
  .ace{
    width: 100%;
    height: 100%;
  }
  .tableNames{
      padding: 15px 0 10px 0;
  }
</style>
