<template>
  <div class="page-404">
    <el-result icon="primary" title="404" sub-title="Page Not Found">
      <template #extra> </template>
    </el-result>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="less" scoped>
  .page-404 {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
  }
</style>
