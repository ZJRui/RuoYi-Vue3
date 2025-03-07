<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别 (1: 男, 2: 女, 3: 其他)" prop="gender">
        <el-input
          v-model="queryParams.gender"
          placeholder="请输入性别 (1: 男, 2: 女, 3: 其他)"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入电子邮件"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable  style="width: 240px">
          <el-option
            v-for="dict in customerstatus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['customer:customer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['customer:customer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['customer:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['customer:customer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="客户姓名" align="center" prop="name" />
      <el-table-column label="性别 (1: 男, 2: 女, 3: 其他)" align="center" prop="gender" />
      <el-table-column label="电子邮件" align="center" prop="email" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="customerstatus" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['customer:customer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['customer:customer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="customerRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="性别 (1: 男, 2: 女, 3: 其他)" prop="gender">
          <el-input v-model="form.gender" placeholder="请输入性别 (1: 男, 2: 女, 3: 其他)" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮件" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="dict in customerstatus"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Customer">
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/customer/customer";

const { proxy } = getCurrentInstance();
const { customerstatus } = proxy.useDict('customerstatus');

const customerList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    gender: null,
    email: null,
    phone: null,
    address: null,
    status: null
  },
  rules: {
    name: [
      { required: true, message: "客户姓名不能为空", trigger: "blur" }
    ],
    gender: [
      { required: true, message: "性别 (1: 男, 2: 女, 3: 其他)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户列表 */
function getList() {
  loading.value = true;
  listCustomer(queryParams.value).then(response => {
    customerList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    gender: null,
    email: null,
    phone: null,
    address: null,
    status: null
  };
  proxy.resetForm("customerRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCustomer(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["customerRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCustomer(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCustomer(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除客户编号为"' + _ids + '"的数据项？').then(function() {
    return delCustomer(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('customer/customer/export', {
    ...queryParams.value
  }, `customer_${new Date().getTime()}.xlsx`)
}

getList();
</script>
