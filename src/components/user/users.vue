<template>
    <div>
        <!--        面包屑导航-->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!--            <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>-->
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区-->
        <el-card>
            <!--            栅格布局-->
            <el-row :gutter="10" type="flex" justify="space-between">
                <!--                搜索区布局-->
                <el-col :span="8">
                    <el-input clearable @clear="getUserList" placeholder="请输入内容" class="input-with-select"
                              v-model="queryInfo.userName">

                    </el-input>
                </el-col>
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="getUserList">查询</el-button>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" @click="insertVisible =true">新增用户</el-button>
                    </div>
                </el-col>
            </el-row>
            <!--            表格-->
            <el-table :data="userList" style="width: 100%" border>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                </el-table-column>
                <el-table-column prop="userName" label="用户名">
                </el-table-column>
                <el-table-column prop="userEmail" label="邮件地址">
                </el-table-column>
                <el-table-column prop="userSex" label="状态">

                    <template slot-scope="scope">
                        <el-switch v-model='scope.row.userSex==1?open:close' @change="changesWitch(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" :enterable="true">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="updateUser(scope.row.id+'')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--            分页组件-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[10,15,20,25 ]"
                    :page-size="queryInfo.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--        新增弹出框-->
        <el-dialog
                title="新增用户"
                :visible.sync="insertVisible"
                width="50%">
            <el-form :model="RegistForm" :rules="registRules" ref="registFormRef" label-width="70px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="RegistForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="RegistForm.passWord" type="passWord"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="RegistForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="RegistForm.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertUser">确 定</el-button>
           </span>
        </el-dialog>

        <!--        修改弹出框-->
        <el-dialog
                title="修改用户"
                :visible.sync="updateVisible"
                width="50%" @close="updateClose">
            <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="updateForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="updateForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="updateForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="updateVisible = false">取 消</el-button>
    <el-button type="primary" @click="commitUpdateUser">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        created() {
            this.getUserList();
        },
        data() {
            // 验证邮箱的规则
            var checkEmail = (rule, value, cb) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

                if (regEmail.test(value)) {
                    // 合法的邮箱
                    return cb()
                }

                cb(new Error('请输入合法的邮箱'))
            }

            // 验证手机号的规则
            var checkMobile = (rule, value, cb) => {
                // 验证手机号的正则表达式
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

                if (regMobile.test(value)) {
                    return cb()
                }

                cb(new Error('请输入合法的手机号'))
            }
            return {
                // 修改的状态
                updateVisible: false,
                open: true,
                //新增的状态
                insertVisible: false,
                close: false,
                queryInfo: {
                    page: 1,
                    limit: 10,
                    userName: ''
                },
                userList: [],
                total: 0,
                // 新增用户数据
                RegistForm: {
                    userName: '',
                    passWord: '',
                    email: '',
                    phone: ''
                },
                //修改的数据
                updateForm: {
                    userName: '',
                    passWord: '',
                    email: '',
                    phone: '',
                    id:'',
                    userEmail:''
                },
                updateFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                registRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur'}
                    ],
                    passWord: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 根据Id删除对应的用户信息
            async removeUserById(id) {
                // 弹框询问用户是否删除数据
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                // 如果用户确认删除，则返回值为字符串 confirm
                // 如果用户取消了删除，则返回值为字符串 cancel
                // console.log(confirmResult)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                var data = await this.$http.get('deleteUserById?id=' + id)

                if (data.data.code !== 200) {
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                this.getUserList()
            },
            //通过id查询数据并打开修改页面赋值进去
            async updateUser(id) {
                console.log(id)
                var data = await this.$http.get('/queryUser?id='+id)
                if (data.data.code != 200) return this.$message.error(data.data.msg);
                console.log(data.data.data)
                this.updateForm.userName = data.data.data.userName
                this.updateForm.email = data.data.data.userEmail
                this.updateForm.phone = data.data.data.phone
                this.updateForm.id = data.data.data.id
                this.updateForm.userEmail = data.data.data.userEmail
                this.updateVisible=true
            },
            //提交修改
            commitUpdateUser(){
                //预校验
                this.$refs.updateFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('updateUser', this.updateForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('修改成功')
                    this.$refs.updateFormRef.resetFields()
                    this.updateVisible = false
                    this.getUserList()
                })
            },
            //修改页面关闭后清空数据
            updateClose(){
                this.$refs.updateFormRef.resetFields()
            },
            // 新增用户
            insertUser() {
                //预校验
                this.$refs.registFormRef.validate(async valid => {
                    if (!valid) return;
                    var data = await this.$http.post('insert', this.RegistForm);
                    if (data.data.code != 200) return this.$message.error(data.data.msg);
                    this.$message.success('注册成功')
                    this.$refs.registFormRef.resetFields()
                    this.insertVisible = false
                    this.getUserList()
                })
            },
            changesWitch(stage) {
                if (stage.userSex == 0) {
                    stage.userSex = 1
                } else {
                    stage.userSex = 0
                }
            },
            // 分页组件中的条数的变更
            handleSizeChange(size) {
                this.queryInfo.limit = size
                this.getUserList()
            },
            // 分页组件中当前页码的变化
            handleCurrentChange(page) {
                this.queryInfo.page = page
                this.getUserList()
            },
            async getUserList() {
                var data = await this.$http.get('/getUserList', {params: this.queryInfo})
                this.userList = data.data.data.rows
                this.total = data.data.data.total
            }
        }

    }
</script>
<!--scoped 代表当前页面生效-->
<style lang="less" scoped>
    .el-table {
        margin-top: 15px;
    }

    .nopadding {
        margin-right: 50px;
    }

</style>
