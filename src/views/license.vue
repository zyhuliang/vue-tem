<template>
	<section class="licenseBody">
		<el-container id="licenseBody">
			<el-header class="licenseHeader">
				<h1>激活许可证</h1>
			</el-header>
			<el-main class="licenseMain">
				<el-form id="bm-license-form" class="licenseForm" ref="form" :model="form">
					<el-form-item class="titleClass" label="主键">
						<el-input v-model="form.id" :disabled="licenseId"></el-input>
					</el-form-item>
					<el-form-item :label="this.webInforaation?'许可证到期:'+this.webInforaation.notAfter:'许可证'">
						<el-input class="textareaClass" type="textarea" placeholder="请将许可证粘贴此处" v-model="form.license"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button :disabled="form.license==''" type="primary" @click="submitForm()">激活</el-button>
						<el-button :disabled="form.license==''" @click="resetForm()">重置</el-button>
						<el-button @click="returnLogin()">返回</el-button>
					</el-form-item>
				</el-form>
			</el-main>
		</el-container>
	</section>
</template>

<script>
    import {getLicenseSid,activateLicense} from '@api';
	export default {
        data() {
            return {
                form: {
                    id: '',
                    license: ''
                },
                licenseId: true,
                webInforaation:""
            }

        },
        methods: {
            submitForm() {
                // console.log(this.form.license)
				this.activate(this.form);
            },
            resetForm() {
                this.form.license = ''
            },
            returnLogin() {
                if(this.webInforaation){
                    this.$router.go(-1);

                }else{
                    this.$router.push({ path: '/login' });
                }
               
            },
            getSid:function getSid(){
                getLicenseSid().then(data => {
                    this.form.id= data.sid;
                }, err => {
                    var _this = this;
                    if(err.response.status == 500){
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
					}

                })
            },
            activate:function activate(parameter){
                activateLicense(parameter).then(data => {
                    this.$message({
                        message: '恭喜你，激活成功！',
                        type: 'success'
                    });
                    this.$router.push({ path: '/login' });
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }).catch(error =>{
                    var _this = this;
                    if(err.response.start == 500) {
                        _this.$message({
                            message: '激活失败！',
                            type: 'error'
                        });
                    }
				})
            },
        },
        mounted() {
            this.getSid()

               this.webInforaation = JSON.parse(this.__getItem("webInforaation", "sessionStorage"));

    console.log("this.webInforaation license",this.webInforaation);
        },
	}
</script>

<style>
	.licenseBody{
		width: 100%;
		height: 100%;
		background: #f0f0f9;
	}
	.licenseMain{
		background: #ffffff;
	}
	.licenseHeader{
		height: 50px!important;
		line-height: 50px;
		background: #3e98fe;
		color: #ffffff;
	}
	.licenseHeader h1{
		margin: 0px;
	}
	.licenseForm{
		float: left;
		width: 50%;
	}
	.licenseForm label{
		font-weight: bold;
	}
	.textareaClass textarea{
		min-height: 200px!important;
		border-color: hotpink;
	}
</style>