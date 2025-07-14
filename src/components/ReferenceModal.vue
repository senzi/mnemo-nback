<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-base-100 z-10 pb-4 border-b border-base-300 mb-6">
        <h3 class="font-bold text-lg sm:text-xl text-center">研究背景与来源</h3>
        <button 
          class="btn btn-sm btn-circle btn-ghost absolute right-0 top-0" 
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <div class="space-y-6">
        <!-- 来源与致敬 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-primary">来源与致敬</h4>
          
          <div class="space-y-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <p class="text-sm leading-relaxed mb-4">
                本训练工具基于工作记忆研究中经典的 N-back 任务构建，灵感参考：
              </p>
              
              <div class="bg-base-100 p-4 rounded-lg border-l-4 border-primary">
                <p class="text-sm font-medium mb-2">
                  Mandrick, K., Peysakhovich, V., Rémy, F., Lepron, E., & Causse, M. (2016).
                </p>
                <p class="text-sm italic mb-3">
                  Neural and psychophysiological correlates of human performance under stress and high mental workload.
                </p>
                <p class="text-sm text-base-content/70 mb-3">
                  Biological Psychology, 121, 62–73.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-2">
                  <a 
                    href="http://dx.doi.org/10.1016/j.biopsycho.2016.10.002" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn btn-sm btn-outline btn-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    DOI 入口
                  </a>
                  <a 
                    href="https://openscience.isae-supaero.fr/digitalCollection/DigitalCollectionAttachmentDownloadHandler.ashx?documentId=10852&parentDocumentId=3950&skipCopyright=true&skipWatermark=true" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="btn btn-sm btn-outline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF 下载
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-info/10 p-4 rounded-lg border border-info/20">
              <h5 class="font-medium mb-2 text-info">📝 作者开放获取说明</h5>
              <p class="text-sm leading-relaxed">
                作者在 ISAE-SUPAERO 的开放平台提供了论文全文，支持学术研究和教育用途的自由访问。
              </p>
            </div>
          </div>
        </section>

        <!-- N-back 任务背景 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-secondary">N-back 任务背景</h4>
          
          <div class="space-y-4">
            <div class="bg-base-200 p-4 rounded-lg">
              <h5 class="font-medium mb-2">工作记忆研究</h5>
              <p class="text-sm leading-relaxed">
                N-back 任务是认知心理学和神经科学中广泛使用的工作记忆测试范式。它能够有效评估和训练大脑的工作记忆容量，
                特别是在高认知负荷和压力环境下的表现。
              </p>
            </div>

            <div class="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <h5 class="font-medium mb-2 text-accent">应用价值</h5>
              <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                <li>认知能力评估与训练</li>
                <li>注意力和专注力提升</li>
                <li>学习效率优化</li>
                <li>压力环境下的认知表现研究</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 致谢说明 -->
        <section>
          <h4 class="text-lg font-semibold mb-3 text-warning">致谢说明</h4>
          <div class="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <p class="text-sm leading-relaxed">
              本工具的设计和实现受到上述研究的启发，旨在为用户提供科学、有效的工作记忆训练体验。
              我们感谢原作者们在认知科学领域的贡献，以及开放科学精神的践行。
            </p>
          </div>
        </section>
      </div>

      <div class="modal-action mt-6 pt-4 border-t border-base-300">
        <button class="btn btn-primary" @click="closeModal">我了解了</button>
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
