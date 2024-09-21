<template>
  <TheHeader />
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2 d-none d-sm-flex">
        <a-list bordered style="width: 100%">
          <template #header>
            <div>BẢNG ĐIỀU KHIỂN</div>
          </template>
          <TheMenuProfile />
        </a-list>
      </div>
      <div class="col-sm-10 col-12">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup>
import TheHeader from '../components/TheHeader.vue';
import TheMenuProfile from '../components/TheMenuProfile.vue';
</script>
