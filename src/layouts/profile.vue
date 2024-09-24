<template>
  <TheHeader />
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2 d-none d-sm-flex m-0 p-0">
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
    <div class="row">
      <div class="col-12 footer">Footer</div>
    </div>
  </div>
</template>
<script setup>
import TheHeader from '../components/TheHeader.vue';
import TheMenuProfile from '../components/TheMenuProfile.vue';
</script>
<style>
    .footer {
      height: 4vh;
      background-color: lightcoral;
      box-sizing: border-box;
    }
</style>
