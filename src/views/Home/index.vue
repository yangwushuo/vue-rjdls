<template>
  <div>
    <BSSubHeader
      icon="home_app_logo"
      iconClass="material-symbols-sharp"
      title="主页"
    >
    </BSSubHeader>
    <BSCard>
      <template #content>
        <div class="wrapper">
          <div class="title"><span>软件产品代理商系统</span></div>
          <div class="carousel">
            <a-carousel
              :autoPlay="true"
              animation-name="card"
              show-arrow="never"
              indicator-position="outer"
              :style="{
                width: '100%',
                height:'65vh',
              }"
            >
              <a-carousel-item
                v-for="(image, index) in images"
                :key="index"
                :style="{ width: '60%' }"
              >
                <img
                  :src="image"
                  :style="{
                    width: '100%',
                  }"
                />
              </a-carousel-item>
            </a-carousel>
          </div>
        </div>
      </template>
    </BSCard>
  </div>
</template>

<script>
export default {
  name: "Home",
  setup() {
    const images = [
      "https://bs-medical-oss.oss-cn-hangzhou.aliyuncs.com/product/1%20(1).jpg",
      "https://bs-medical-oss.oss-cn-hangzhou.aliyuncs.com/product/1%20(2).jpg",
      "https://bs-medical-oss.oss-cn-hangzhou.aliyuncs.com/product/1%20(3).jpg",
      "https://bs-medical-oss.oss-cn-hangzhou.aliyuncs.com/product/1%20(4).jpg",
    ];
    return {
      images,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";
.wrapper{


  & .title{
    padding: 1rem;
    font-family:Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 6rem;
    text-align: center;
    background-image:linear-gradient(0deg,#30cfd0 0%, #330867 100%);
    color:transparent;
    background-clip:text;
  }

  & .carousel{
    padding: 1rem;
  }

}
</style>
