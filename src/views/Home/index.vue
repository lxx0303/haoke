<template>
  <div>
    <!-- 搜索框 -->
    <Search></Search>
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in swipesImg" :key="item.id">
        <img :src="'http://liufusong.top:8080' + item.imgSrc" :alt="item.alt" />
      </van-swipe-item>
    </van-swipe>
    <!-- 中间导航栏 -->
    <!-- <van-grid :border="false" :column-num="4" class="nav">
      <van-grid-item v-for="item in navImgs" :key="item.id">
        <van-image :src="item.src" width="50" height="50" />
        <p class="title">{{ item.title }}</p>
      </van-grid-item>
    </van-grid> -->
    <van-grid>
      <van-grid-item icon="wap-home-o" text="整租" />
      <van-grid-item icon="friends-o" text="合租" />
      <van-grid-item icon="location-o" text="地图找房" />
      <van-grid-item icon="home-o" text="去出租" />
    </van-grid>
    <!-- <router-view></router-view> -->
    <!-- 主体部分 -->
    <van-grid :border="false" :column-num="2" class="house_list">
      <van-grid-item v-for="item in areaList" :key="item.id">
        <div class="img">
          <van-image :src="'http://liufusong.top:8080' + item.imgSrc" />
          <div class="text">
            <p>{{ item.title }}</p>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";
import { getSwipes, getGroups } from "@/api/home";

export default {
  components: {
    Search,
  },
  data() {
    return {
      swipesImg: [],
      // navImgs: [
      //   { id: "001", src: require("@/assets/img-nav/1.png"), title: "整租" },
      //   { id: "002", src: require("@/assets/img-nav/2.png"), title: "合租" },
      //   {
      //     id: "003",
      //     src: require("@/assets/img-nav/3.png"),
      //     title: "地图找房",
      //   },
      //   { id: "004", src: require("@/assets/img-nav/4.png"), title: "去出租" },
      // ],
      areaList: [],
      area: "AREA%7C88cff55c-aaa4-e2e0",
    };
  },
  mounted() {
    this.onGroups();
    this.onSwipes();
  },
  methods: {
    async onGroups() {
      const { data } = await getGroups({ area: this.area });
      // console.log(data, "data");
      this.areaList = data.body;
    },
    async onSwipes() {
      const { data } = await getSwipes();
      this.swipesImg = data.body;
    },
  },
};
</script>

<style scoped lang="less">
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  height: 400px;
}
.van-swipe-item img {
  width: 100%;
}
.nav .title {
  margin: 12px 0;
  font-size: 24px;
}
.house_list {
  padding: 0 10px;
  /deep/.van-grid-item {
    border-radius: 10px;
    padding: 0;
    border: 0;
    height: 120px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .img {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      .text {
        font-size: 16px;
      }
    }
  }
}
/deep/.van-image__img {
  width: 100px;
  height: 100px;
  margin-right: 30px;
}
</style>
