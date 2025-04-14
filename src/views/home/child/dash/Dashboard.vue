<template>
    <div class="dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>今日订单</span>
                <el-icon><ShoppingCart /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">128</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>12%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>今日营业额</span>
                <el-icon><Money /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">¥12,800</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>8%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>用户数量</span>
                <el-icon><User /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">2,450</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>5%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>菜品数量</span>
                <el-icon><Food /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">156</div>
              <div class="trend down">
                <el-icon><ArrowDown /></el-icon>
                <span>2%</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>店铺评分</span>
                <el-icon><Star /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">4.8</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>0.2</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>月访问量</span>
                <el-icon><View /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">12.5K</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>15%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>文章数量</span>
                <el-icon><Document /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">48</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>3%</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <template #header>
              <div class="card-header">
                <span>评论数量</span>
                <el-icon><ChatDotRound /></el-icon>
              </div>
            </template>
            <div class="card-content">
              <div class="number">326</div>
              <div class="trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>8%</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import {
    ShoppingCart,
    Money,
    User,
    Food,
    ArrowUp,
    ArrowDown,
    Star,
    View,
    Document,
    ChatDotRound
  } from '@element-plus/icons-vue'
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