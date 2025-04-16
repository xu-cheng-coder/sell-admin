<template>
    <div class="block">
        <span class="demonstration">时间范围：</span>
        <el-date-picker v-model="timedate" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" :shortcuts="shortcuts" :size='large' />
        <el-button style="margin-left: 10px;" @click="getReport()" type="primary">查询</el-button>

    </div>
    <el-card style="max-width: 100%;height: 584px;">
        <template #header>
            <div class="card-header">
                <span>商品统计</span>
            </div>
        </template>
        <div id="main" style="width: 100%; height: 494px;"></div>

    </el-card>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { getOrderReport } from '@/api/chars';
import { ElMessage } from 'element-plus'

//获取报表信息
const optiondata = ref([])
const getReport = async () => {
    const res = await getOrderReport(
        ["2019-10-01 00:00:00", "2019-10-10 00:00:00"]
    );
    console.log(res);
    if (res.data === 200) {
        optiondata.value = res.data.data;
        console.log(optiondata.value);
        ElMessage.success('获取订单详情成功')
    } else {
        ElMessage.error('获取订单详情失败')
    }

}
onMounted(() => {
    getReport();
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['海鲜', '水果', '肉类', '蔬菜', '饮品']
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
            data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '海鲜',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '水果',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '肉类',
                type: 'line',
                stack: 'Total',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '蔬菜',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '饮品',
                type: 'line',
                stack: 'Total',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    };
    myChart.setOption(option);

});
const shortcuts = [
    {
        text: 'Last week',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Last month',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: 'Last 3 months',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
</script>

<style scoped>
.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.block {
    margin: 10px 0;

}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}</style>