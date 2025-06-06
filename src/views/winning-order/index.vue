<template>
  <div class="winning-order-list-v2">
    <div class="content">
      <div class="render-content">
        <div
          class="kv"
          ref="kv"
          :style="{
            backgroundColor: form.color,
          }"
        >
          <img :src="form.imgUrl" alt="" v-if="form.imgUrl" />
          <div class="mask"></div>
          <div
            class="store"
            :style="{
              color: form.fontColor,
            }"
          >
            {{ form.store }}
          </div>
          <div
            class="title"
            :style="{
              color: form.fontColor,
            }"
          >
            {{ form.title }}
          </div>
          <div
            class="sub-title"
            :style="{
              color: form.fontColor,
            }"
          >
            {{ form.subTitle }}
          </div>
        </div>
        <template v-if="parsedArray.length > 0">
          <div
            class="list-box-wrapper"
            v-for="(listItem, index) in parsedArray"
            :key="index"
          >
            <div
              class="list-box"
              :style="{
                borderColor: form.color,
              }"
              :ref="(el) => domList.push(el)"
            >
              <div
                v-if="index % 8 === 0"
                class="title-box"
                :style="
                  !form.withName
                    ? {
                        display: 'grid',
                        'grid-template-columns': 'repeat(4,1fr)',
                      }
                    : {}
                "
              >
                <template v-if="form.withName">
                  <div class="title-item">订单号</div>
                  <div class="title-item">姓名</div>
                  <div class="title-item">订单号</div>
                  <div class="title-item">姓名</div>
                </template>
                <template v-else>
                  <div class="title-item" v-for="item in 4" :key="item">
                    订单号
                  </div>
                </template>
              </div>
              <div
                class="order-box"
                v-for="(orderItem, subIndex) in splitArray(
                  listItem,
                  form.withName ? 2 : 4
                )"
                :key="subIndex"
                :style="
                  !form.withName
                    ? {
                        display: 'grid',
                        'grid-template-columns': 'repeat(4,1fr)',
                        'grid-gap': '8px',
                      }
                    : {}
                "
              >
                <template v-if="form.withName">
                  <div
                    class="order-box-item"
                    v-for="item in orderItem"
                    :key="`${item[0]}${item[1]}`"
                  >
                    <div class="order-item">{{ item[0] }}</div>
                    <div class="order-item">{{ item[1] }}</div>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="item in orderItem"
                    :key="`${item[0]}`"
                    :style="{
                      fontSize: '13px',
                    }"
                  >
                    {{ item[0] }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <el-card class="panel">
      <el-form :model="form" label-position="left" label-width="auto">
        <el-form-item label="店铺">
          <el-input v-model="form.store"></el-input>
        </el-form-item>
        <el-form-item label="主标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subTitle"></el-input>
        </el-form-item>
        <el-form-item label="表格内容">
          <el-input v-model="form.value" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="带中奖姓名">
          <el-switch v-model="form.withName" @change="parseArray"> </el-switch>
        </el-form-item>
        <el-form-item label="标题字色">
          <el-color-picker v-model="form.fontColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="页面底色">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="KV图片">
          <el-upload
            action="1"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleChange"
            accept=".jpg,.jpeg,.png"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="action-box">
        <el-button
          type="primary"
          @click="render"
          :disabled="parsedArray.length === 0"
          :loading="loading"
          >{{ loading ? "生成中" : "生成图片" }}</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import domtoimage from "dom-to-image-more";
  import FileSaver from "file-saver";
  import JSZip from "jszip";
  import { ref, watch } from "vue";
  import { excelString2Array } from "@/utils";

  const form = ref({
    store: "迪卡侬旗舰店",
    title: "双11预售抽奖",
    subTitle: "获奖名单公示",
    value: "",
    color: "#3643ba",
    fontColor: "#ffffff",
    imgUrl: "",
    withName: true,
  });
  const dataList = ref([]);
  const parsedArray = ref([]);
  const loading = ref(false);
  const kv = ref();
  const domList = ref([]);

  const render = async () => {
    loading.value = true;
    try {
      let zip = new JSZip();
      const kvDataUrl = await domtoimage.toJpeg(kv.value);
      zip.file(`kv.jpg`, kvDataUrl.replace(/^data:image\/jpeg;base64,/, ""), {
        base64: true,
      });
      for (let i = 0; i < domList.value.length; i++) {
        const dataUrl = await domtoimage.toJpeg(domList.value[i]);
        zip.file(
          `${i + 1}.jpg`,
          dataUrl.replace(/^data:image\/jpeg;base64,/, ""),
          {
            base64: true,
          }
        );
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `Winning List.zip`);
      });
    } catch (error) {
      console.log(error);
      this.$message.error("图片生成失败");
    } finally {
      loading.value = false;
    }
  };

  const handleChange = async (e) => {
    try {
      form.value.imgUrl = await fileToBase64(e.raw);
    } catch (error) {
      console.log(error);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const splitArray = (array, length) => {
    if (length <= 0) throw new Error("Length must be greater than 0");

    const result = [];
    for (let i = 0; i < array.length; i += length) {
      result.push(array.slice(i, i + length));
    }
    return result;
  };
  const parseArray = () => {
    const result = [];
    let index = 0;
    const arr = [...dataList.value];
    while (arr.length > 0) {
      if (index % 8 === 0) {
        result[index] = arr.splice(
          0,
          Math.floor((1000 - 60 - 70) / 20) * (form.value.withName ? 2 : 4)
        );
      } else {
        result[index] = arr.splice(
          0,
          Math.floor((1000 - 60) / 20) * (form.value.withName ? 2 : 4)
        );
      }
      ++index;
    }
    parsedArray.value = result;
  };

  watch(
    () => form.value.value,
    (value) => {
      if (value) {
        dataList.value = excelString2Array(value);
        parseArray();
      }
    }
  );
</script>

<style lang="less" scoped>
  #app {
    overflow: hidden;
  }
  .winning-order-list-v2 {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    .content {
      width: 100%;
      height: auto;
      padding: 20px 0;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      .render-content {
        width: 750px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        * {
          font-family: "Decathlon Display", "Source Han Sans CN" !important;
          color: #101010;
        }
        .kv {
          width: 750px;
          height: 1000px;
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
          .mask {
            width: 100%;
            height: 320px;
            position: absolute;
            left: 0;
            bottom: 0;
            background-image: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(22, 16, 16, 0.8) 100%
            );
          }
          img {
            display: block;
            width: 100%;
          }
          .store {
            width: 100%;
            height: 35px;
            line-height: 35px;
            font-size: 42px;
            font-weight: normal;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 232px;
          }
          .title {
            width: 100%;
            height: 73px;
            line-height: 73px;
            font-weight: normal;
            font-size: 88px;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 143px;
          }
          .sub-title {
            width: 100%;
            height: 76px;
            line-height: 76px;
            font-size: 90px;
            font-weight: 900;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 53px;
          }
        }
        .list-box-wrapper {
          margin-top: 10px;
        }
        .list-box {
          width: 750px;
          height: 1000px;
          padding: 25px 0;
          border: 10px solid;
          background-color: #fff;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          overflow: hidden;
          .title-box {
            width: 650px;
            height: 51px;
            margin: 0 auto 20px;
            background-color: #101010;
            font-size: 25px;
            font-weight: bold;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            .title-item {
              color: #fff;
              &:nth-child(2n + 1) {
                width: 193px;
              }
              &:nth-child(2n) {
                width: 132px;
              }
            }
          }
          .order-box {
            width: 650px;
            font-size: 14px;
            line-height: 12px;
            height: 12px;
            margin: 0 auto;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            flex-shrink: 0;
            & + .order-box {
              margin-top: 8px;
            }
            .order-box-item {
              width: 325px;
              display: flex;
              flex-wrap: nowrap;
              flex-shrink: 0;
              .order-item:first-child {
                width: 193px;
                white-space: nowrap;
              }
              .order-item:last-child {
                width: 132px;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .panel {
      width: 300px;
      position: fixed;
      right: 20px;
      top: 20px;
    }
  }
</style>
