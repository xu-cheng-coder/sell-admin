import request from '../utils/axios';

// 首页报表接口（特殊功能echarts）
export function getHomeReport() {
    return request({
        url: '/order/totaldata',
        method: 'GET'
    });
}

// 订单报表接口（特殊功能echarts）
export function getOrderReport(date) {
    return request({
        url: '/order/ordertotal',
        method: 'GET',
        params: {
            date
        }
    });
}
    