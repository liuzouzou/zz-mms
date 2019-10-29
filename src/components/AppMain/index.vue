<template>
  <div class="main">
        <!--  -->
    <app-link></app-link>
    
    <!-- 组件渲染的出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
// 导入子组件
import AppLink from './Link.vue'

export default {
      components: {AppLink} // 注意有s
}
</script>
