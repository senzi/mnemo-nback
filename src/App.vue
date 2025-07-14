<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-md w-full">
      <div class="card-body">
        <h1 class="card-title text-2xl text-center justify-center mb-4">
          M-nback 记忆训练
        </h1>
        
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">用户名</span>
          </label>
          <input 
            type="text" 
            placeholder="请输入用户名" 
            class="input input-bordered w-full"
            v-model="username"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">N值选择</span>
          </label>
          <select class="select select-bordered w-full" v-model="nValue">
            <option disabled selected>请选择N值</option>
            <option v-for="n in 9" :key="n" :value="n">N{{ n }}</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">训练模式</span>
            <select class="select select-bordered" v-model="mode">
              <option value="12">12题模式</option>
              <option value="unlimited">无限模式</option>
            </select>
          </label>
        </div>

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-primary w-full" @click="startTraining">
            开始训练
          </button>
        </div>

        <div class="text-center mt-4">
          <div class="badge badge-secondary">daisyUI 样式已启用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const nValue = ref('')
const mode = ref('12')

const startTraining = () => {
  console.log('开始训练:', { username: username.value, nValue: nValue.value, mode: mode.value })
}
</script>
