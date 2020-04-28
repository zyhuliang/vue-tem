<template>
	<el-row class="container" id="bm-griffin-tenant-tenant">

		<el-col :span="24" class="main">

			<!-- content -->
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<router-view></router-view>
					</el-col>
				</div>
			</section>
		</el-col>

		<!-- header -->
		<el-col :span="24" class="header">
				<div class="flexibleNav" @click.prevent="collapse">
					<i :class="collapsed?'icon iconfont icon-ir-navRight':'icon iconfont icon-ir-navLeft'"></i>
				</div>
			<!-- 面包屑 -->
			<div class="breadcrumb-container">
				<span class="title">{{$route.name}}</span>
				<el-breadcrumb separator=">" class="breadcrumb-inner">
					<el-breadcrumb-item v-for="item in $route.matched" :key="item.path" :to="item.path">
						{{ item.name }}
					</el-breadcrumb-item>
				</el-breadcrumb>
			</div>

			<!-- user -->
			<div class="ir-user">

				<!--<el-input id="bm-griffin-tenant-list-seachAll" class="seachAll" placeholder="搜索">-->
					<!--<i slot="prefix" class="el-input__icon el-icon-search"></i>-->
				<!--</el-input>-->
				<!--<span class="el-dropdown-link userinfo-message">-->
						<!--<el-badge :value="3" class="item"><i class="icon iconfont icon-ir-user-message"></i></el-badge>-->
				<!--</span>-->
				<el-dropdown trigger="hover" @command="otherOperations">
					<span class="el-dropdown-link userinfo-operation"><b><i class="icon iconfont icon-ir-user"></i></b></span>
					<el-dropdown-menu slot="dropdown" class="ir-dropdown">
						<!--<el-dropdown-item id="bm-griffin-tenant-list-info" command="passwordEdit"><i class="icon iconfont icon-ir-text-user"></i> 我的信息</el-dropdown-item>-->
						<el-dropdown-item id="bm-griffin-tenant-list-pwd" command="passwordEdit"><i class="icon iconfont icon-ir-password"></i> 修改密码</el-dropdown-item>
						<el-dropdown-item id="bm-griffin-tenant-list-logout" divided @click.native="logout"><i class="icon iconfont icon-ir-logout"></i> 退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</el-col>
	</el-row>
</template>

<script>
    export default {
        data() {
            return {
                collapsed:false,
            }
        },
        methods: {
            //退出登录
            logout: function () {
               this.$confirm("确认退出吗?", "提示", {
					type: 'warning'
				}).then(() => {
					this.revokeLogout()
				})
			},
			revokeLogout () {
				// 不管成不成功 都直接退出
				this.serverApi({
					interface: 'revoke',
					success: () => {
						this.logoutSet()
					},
					error: () => {
						this.logoutSet()
					}
				})
			},
			logoutSet () {
				clearInterval(this.timer)
				this.__removeItem("x-auth-token");
				this.$router.push("/login");
			},
            //折叠导航栏
            collapse:function(){
                this.collapsed=!this.collapsed;
            },
            passwordEdit: function () {
				this.$router.push({path: '/changePassword'})
            },
            otherOperations: function (type) {
                if(type == 'passwordEdit'){
                    this.passwordEdit();
                }
            }
        },
        mounted() {
        }
    }

</script>

<style lang="scss" scoped>
	@import '~scss_vars';

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			position: absolute;
			z-index: 99;
			height: 50px;
			line-height: 50px;
			background: #FFFFFF;
			color:#fff;
			width: 100%;
			height: 50px;
			border-bottom: 1px solid #cccccc;
			.logo {
				//width:230px;
				height:50px;
				font-size: 22px;
				background-color: #4b4c52;
				img {
					text-align: center;
					width: 30px!important;
					float: left;
					margin: 10px 15px 10px 15px;
				}

			}
			.logo-width{
				width:200px;
			}
			.logo-collapse-width{
				width:60px;
			}
			.flexibleNav{
				float: left;
				width: 50px;
				text-align: center;
				color: #666666;

				i{
					display: inline;
				}
			}

			.ir-user {
				float: right;
				height: 50px;
				margin: 0px 20px 0px 0px;
				line-height: 50px;

				.seachAll{
					width: 200px;


					.el-input__prefix{

						i{
							color: #999999;
						}

					}

					input{
						position: inherit;
						background-color: #e9eaf1;
						border-radius: 20px;
						height: 30px;
						text-align: center;
					}

				}

				.userinfo-operation{
					color: #4ea1ff;
					i {
						width: 24px;
						font-size: 24px;
						font-weight: bold;
						cursor: pointer;
						height: auto;
					}
					i:before{
						border-radius: 12px;
						background-color: #e6f2ff;

					}
				}

				.userinfo-inner {
					float: right;
					color: #666666;
					width: 110px;
					font-size: 24px;

					i {
						float: left;
						width: 20px;
						font-size: 20px;
						font-weight: bold;
						cursor: pointer;
						height: auto;
					}
					em{
						float: left;
						width: 80px;
						padding: 0px 5px 0px 5px;
						text-align: center;
						font-style:normal;
						font-size: 16px;
						white-space: nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
					}
				}
				.userinfo-message {
					float: right;
					position: relative;
					width: 24px;
					color: #666666;
					margin: 0 0 0 0;
					i {
						font-size: 20px;
						line-height: 20px;
						cursor: pointer;
					}

					.item {
						position: absolute;
					}
				}

				.el-dropdown {
					float: right;
					width: 24px;
					color: #666666;
					font-size: 24px;
					margin: 0 40px 0 0px;
					i {
						font-size: 24px;
						cursor: pointer;
						height: auto;
					}
				}
			}
		}
		.main {
			display: flex;
			// background: #324057;
			height: 100%;
			padding-top: 50px;
			box-sizing: border-box;
			bottom: 0px;

			aside {
				flex:0 0 200px;
				width: 200px;
				height: 100%;
				background-color: #4b4c52;

				.logo {
					height:120px;
					font-size: 22px;
					.img-square {
						text-align: center;
						width: 80px!important;
						float: left;
						margin: -20px 60px 10px 60px;
					}
					.img-rectangle {
						text-align: center;
						width: 120px!important;
						float: left;
						margin: -20px 60px 10px 40px;
					}
					h3{
						color:#fff;
						width: 100%;
						text-align: center;
						font-size: 24px;
						margin: 0;
					}
				}

				.logo-width{
					width:200px;
				}
				.logo-collapse-width{
					width:60px
				}
				.el-menu{
					border-right:none;
					height:auto;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				box-sizing:border-box;
				flex:0 0 200px;
				width: 200px;
			}
			.content-container {
				flex:1;
				overflow-y: auto;

				.el-breadcrumb__item__inner, .el-breadcrumb__item__inner a{
					color: #97a8be;
				}

				.el-breadcrumb__item__inner:hover, .el-breadcrumb__item__inner a:hover{
					color: #65768c;
				}

				.content-wrapper {
					box-sizing: border-box;
				}
			}
		}
	}

	i.nav{
		margin-right: 5px;
		font-size: 15px;
		width: 18px!important;
		line-height: 12px;
	}


	.el-submenu .is-active i.icon-ir-nav-close:before {
		content: "\e616";
		color: #47a3fd;
	}
	.el-dropdown-menu__item i{
		margin-right: 5px;
	}
	.el-menu{
		height: auto;
		background-color: #4b4c52;



		.el-menu-item:hover,.el-submenu__title:hover{
			background: #5c5d66;
		}

		.el-menu-item,.el-submenu__title{
			color: #FFFFFF;
			font-size: 16px;
		}

		ul,.is-opened{
			background: #535459;
		}

		.is-active{
			color: #47a3fd;
		}
	}
	.el-submenu__title i{
		color: #FFFFFF;
	}
	.el-menu-item i{
		color: #FFFFFF;
	}
	.el-menu-item:hover{
		outline:0;
	}
	.el-menu-item:focus{
		background-color:#535459!important;
	}

	.breadcrumb-container{
		float: left;
		margin: 0;
	}

	.breadcrumb-container .title{
		width: auto!important;
		margin-right: 20px;
		font-size: 16px;
		color: #000000!important;
	}
	.breadcrumb-inner{
		float: left!important;
	height: 50px;
		line-height: 50px;
	}

	.breadcrumb-container {

		.title {
			width: 200px;
			float: left;
			color: #475669;
		}
		.breadcrumb-inner {
			float: right;
		}
	}




</style>