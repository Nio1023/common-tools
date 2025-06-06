<template>
  <div class="check-page">
    <a-spin tip="环境检测中..." v-if="envChecking" />
    <a-card title="环境检测结果" v-else>
      <a-space direction="vertical" fill :size="20">
        <a-card title="Chrome浏览器">
          <template #extra>
            <a-space>
              <a-button
                type="primary"
                :status="isChrome ? 'success' : 'danger'"
              >
                <template #icon>
                  <i class="ri-check-line" v-if="isChrome"></i>
                  <i class="ri-close-line" v-else></i>
                </template>
              </a-button>
              <a-button
                @click="open('https://www.google.cn/intl/zh-CN/chrome/')"
                v-if="!isChrome"
                >去下载</a-button
              >
            </a-space>
          </template>
          请使用Chrome浏览器使用此工具。
        </a-card>
        <a-card title="字体 - 思源黑体">
          <template #extra>
            <a-space>
              <a-button
                type="primary"
                :status="isSourceHanSansSCAvailable ? 'success' : 'danger'"
              >
                <template #icon>
                  <i
                    class="ri-check-line"
                    v-if="isSourceHanSansSCAvailable"
                  ></i>
                  <i class="ri-close-line" v-else></i>
                </template>
              </a-button>
              <a-button
                @click="
                  open(
                    'https://dkt-picture-library.oss-cn-shanghai.aliyuncs.com/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93.zip'
                  )
                "
                v-if="!isSourceHanSansSCAvailable"
                >去下载</a-button
              >
            </a-space>
          </template>
          下载并安装
          <span style="color: rgb(var(--danger-6))">所有的</span>
          思源黑体字体，作为生成内容的中文默认字体
        </a-card>
        <a-card title="字体 - Decathlon VF">
          <template #extra>
            <a-space>
              <a-button
                type="primary"
                :status="isDecathlonVFAvailable ? 'success' : 'danger'"
              >
                <template #icon>
                  <i class="ri-check-line" v-if="isDecathlonVFAvailable"></i>
                  <i class="ri-close-line" v-else></i>
                </template>
              </a-button>
              <a-button
                @click="
                  open(
                    'https://dkt-picture-library.oss-cn-shanghai.aliyuncs.com/fonts/Display.zip'
                  )
                "
                v-if="!isDecathlonVFAvailable"
                >去下载</a-button
              >
            </a-space>
          </template>
          下载并安装
          <span style="color: rgb(var(--danger-6))">所有的</span>
          DecathlonVF字体，作为生成内容的英文/数字默认字体
        </a-card>
        <a-alert v-if="showAlert"
          >安装字体包后请在新标签页重新重启浏览器，刷新不会更新检测结果</a-alert
        >
      </a-space>
    </a-card>
  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";
  import { isFontWeightAvailable, isChromeBrowser, sleep } from "@/utils";
  import { useRouter, useRoute } from "vue-router";

  const router = useRouter();
  const route = useRoute();
  const envChecking = ref(true);
  const isSourceHanSansSCAvailable = ref(false);
  // const isInterAvailable = ref(false);
  const isDecathlonVFAvailable = ref(false);
  const isChrome = ref(false);
  const showAlert = ref(false);

  const checkFunc = async () => {
    envChecking.value = true;
    isDecathlonVFAvailable.value = isFontWeightAvailable(
      "Decathlon Display",
      [400, 500, 600, 700]
    );
    isSourceHanSansSCAvailable.value = isFontWeightAvailable(
      "Source Han Sans CN",
      [400, 500, 700]
    );
    isChrome.value = isChromeBrowser();
    if (
      isDecathlonVFAvailable.value &&
      isSourceHanSansSCAvailable.value &&
      isChrome.value
    ) {
      console.log(route.query.redirectUri);
      if (route.query.redirectUri) {
        const query = { ...route.query };
        delete query.redirectUri;
        router.replace({
          name: route.query.redirectUri,
          query: {
            ...query,
          },
        });
        return;
      } else {
        router.replace({
          name: "404",
        });
        return;
      }
    }
    await sleep(500);
    envChecking.value = false;
  };

  const open = (url) => {
    if (
      url.startsWith("https://dkt-picture-library.oss-cn-shanghai.aliyuncs.com")
    ) {
      showAlert.value = true;
    }
    window.open(url, "_blank");
  };

  onMounted(async () => {
    checkFunc();
  });
</script>
<style lang="less" scoped>
  .check-page {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
