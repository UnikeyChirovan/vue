<template>
  <TheHeader />
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3 d-none d-sm-flex">
        <a-list bordered style="width: 100%">
          <template #header>
            <div>BẢNG ĐIỀU KHIỂN</div>
          </template>
          <TheMenu />
        </a-list>
      </div>
      <div class="col-sm-9 col-12">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup>
import TheHeader from '../components/TheHeader.vue';
import TheMenu from '../components/TheMenu.vue';
</script>
