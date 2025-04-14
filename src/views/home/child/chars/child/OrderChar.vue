<template>
    <el-card style="max-width: 100%;height: 684px;">
        <template #header>
            <div class="card-header">
                <span>订单统计</span>
            </div>
        </template>
        <div id="main" style="width: 100%; height: 594px;"></div>

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
            data: ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周', '第七周']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '订单数量',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '订单金额',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310]
            }
        ]
    };
    myChart.setOption(option);

});
</script>

<style scoped></style>