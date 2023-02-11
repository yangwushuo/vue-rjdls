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
          <div class="title"><span>欢迎使用 RJDLS</span></div>
          <div class="carousel">
            <a-carousel
              :autoPlay="true"
              animation-name="card"
              show-arrow="never"
              indicator-position="outer"
              :style="{
                width: '100%',
                height: '450px',
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
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
      "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp",
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
    font-family:  "Chillax-Bold", '微软雅黑' ;
    font-weight: bold;
    font-size: 6rem;
    text-align: center;
  }

  & .carousel{
    padding: 1rem;
  }

}
</style>
