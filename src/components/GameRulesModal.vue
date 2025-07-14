<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-base-100 z-10 pb-4 border-b border-base-300 mb-6">
        <h3 class="font-bold text-lg sm:text-xl text-center">训练规则说明</h3>
        <button 
          class="btn btn-sm btn-circle btn-ghost absolute right-0 top-0" 
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <div class="space-y-6">
        <!-- N-back 游戏规则 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-primary">一、N-back 游戏规则</h4>
          
          <div class="space-y-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <h5 class="font-medium mb-2">什么是 N-back？</h5>
              <p class="text-sm leading-relaxed">
                在 N-back 训练中，你需要记住前 N 个题目的答案，并在每一道题中，回忆 N 步之前的答案并作答。
                比如 N=2 时，第 5 题需要回忆第 3 题的答案。
              </p>
            </div>

            <div class="bg-info/10 p-3 sm:p-4 rounded-lg border border-info/20">
              <h5 class="font-medium mb-3 text-info">示例演示（N=2）：</h5>
              <div class="space-y-2 text-xs sm:text-sm font-mono">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-base-100 rounded gap-1">
                  <span>第1题: 2+3 = 5</span>
                  <span class="badge badge-ghost badge-sm">记忆阶段</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-base-100 rounded gap-1">
                  <span>第2题: 1+4 = 5</span>
                  <span class="badge badge-ghost badge-sm">记忆阶段</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-primary/10 rounded border border-primary/30 gap-1">
                  <span>第3题: 2+2 = 4 ← 当前显示</span>
                  <span class="badge badge-primary badge-sm">
                    <span class="hidden sm:inline">选择第1题的答案（5）</span>
                    <span class="sm:hidden">选第1题(5)</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h5 class="font-medium">特殊说明：</h5>
              <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                <li>前 N 题为"记忆区"，不需作答，专注记住答案</li>
                <li>模式分为 <strong>12题挑战</strong> 和 <strong>无限练习</strong></li>
                <li>12题模式：完成12道作答题目即结束</li>
                <li>无限模式：可持续练习，累计答错 5 次或主动退出为止</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 计分规则说明 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-secondary">二、计分规则说明</h4>
          
          <div class="space-y-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <h5 class="font-medium mb-2">总分构成因素：</h5>
              <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>正确率</strong>：答对越多，得分越高</li>
                <li><strong>答题速度</strong>：越快加分越多</li>
                <li><strong>难度加权</strong>：N 越高分数乘以更高系数</li>
              </ul>
            </div>

            <div class="bg-warning/10 p-4 rounded-lg border border-warning/20">
              <h5 class="font-medium mb-3 text-warning">计分公式：</h5>
              <div class="bg-base-100 p-3 rounded font-mono text-sm mb-3">
                分数 = [100 × (正确题数 ÷ 时间秒数)^0.8 × (正确率)^2] × (1 + (N - 1)/5)
              </div>
              <div class="text-sm">
                <strong>示例：</strong>N=3，答对10题，用时60秒，正确率83.3%<br>
                计算：[100 × (10 ÷ 60)^0.8 × (0.833)^2] × (1 + 2/5) ≈ <strong>29.3 分</strong>
              </div>
            </div>

            <div class="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="text-sm">
                <strong>重要提醒：</strong>过快但错误率高会显著拉低分数，建议在保证准确率的前提下提升速度。
              </span>
            </div>
          </div>
        </section>

        <!-- 训练建议 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-accent">三、训练建议</h4>
          <div class="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <ul class="list-disc list-inside space-y-1 text-sm ml-4">
              <li>初学者建议从 N=1 开始，逐步提升难度</li>
              <li>专注记忆前 N 题的答案，为后续作答做准备</li>
              <li>保持节奏稳定，避免过于急躁导致错误</li>
              <li>定期查看统计数据，分析错误模式并改进</li>
            </ul>
          </div>
        </section>
      </div>

      <div class="modal-action mt-6 pt-4 border-t border-base-300">
        <button class="btn btn-primary" @click="closeModal">我知道了</button>
      </div>
    </div>
    <div class="modal-backdrop" @click="closeModal"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: -1;
}
</style>
