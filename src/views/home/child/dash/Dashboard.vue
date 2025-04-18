<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总订单</span>
              <el-icon>
                <ShoppingCart />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ optiondata.totalOrder }}</div>
            <div class="trend up">
              <el-icon>
                <ArrowUp />
              </el-icon>
              <span>12%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
              <el-icon>
                <Money />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">¥{{ optiondata.totalAmount }}</div>
            <div class="trend up">
              <el-icon>
                <ArrowUp />
              </el-icon>
              <span>8%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
              <el-icon>
                <User />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ optiondata.todayOrder }}</div>
            <div class="trend up">
              <el-icon>
                <ArrowUp />
              </el-icon>
              <span>5%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
              <el-icon>
                <Money />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <div class="number">￥{{ optiondata.totayAmount }}</div>
            <div class="trend down">
              <el-icon>
                <ArrowDown />
              </el-icon>
              <span>2%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="max-width: 100%;height: 600px;padding: 10px 20px;">
      <template #header>
        <div class="card-header">
          <span>销售额统计</span>
        </div>
      </template>
      <div id="main" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import {
  ShoppingCart,
  Money,
  User,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getHomeReport } from '@/api/chars';
import { ElMessage } from 'element-plus'

const optiondata = ref({})
const option = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['订单数量', '订单金额']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '订单数量',
      type: 'line',
      stack: 'Total',
      data: []
    },
    {
      name: '订单金额',
      type: 'line',
      stack: 'Total',
      data: []
    }
  ]
});

//获取报表信息
const getReport = async () => {
  const res = await getHomeReport(JSON.stringify());
  console.log(res);
  if (res.status === 200) {
    Object.assign(optiondata.value, res.data)
    console.log(optiondata.value);
    // 更新图表配置项中的数据
    option.value.xAxis.data = optiondata.value.xData || []
    console.log(optiondata.value.amountData);
    console.log(optiondata.value.orderData);
    optiondata.value.amountData.forEach((item, index) => {
      option.value.series[0].data.push(item);

    });
    optiondata.value.orderData.forEach((item, index) => {
      option.value.series[1].data.push(item);

    });
    console.log(option.value.series);

    const myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(option.value);
    
    ElMessage.success('获取订单详情成功')
  } else {
    ElMessage.error('获取订单详情失败')
  }
}

onMounted(() => {
  getReport();
  // 基于准备好的dom，初始化echarts实例
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.data-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
}

.number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 10px 0;
}

.trend {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.trend.up {
  color: #67c23a;
}

.trend.down {
  color: #f56c6c;
}

.trend .el-icon {
  margin-right: 5px;
}
</style>