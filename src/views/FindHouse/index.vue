<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="nav-bar" left-arrow @click-left="onClickLeft">
      <template #right>
        <Search class="findhouse-search"></Search>
      </template>
    </van-nav-bar>

    <!-- 下拉列表 -->
    <van-dropdown-menu active-color="#1989fa">
      <!-- 区域 -->
      <van-dropdown-item title="区域">
        <van-picker
          toolbar-position="bottom"
          show-toolbar
          :columns="areaList"
          value-key="label"
        />
      </van-dropdown-item>
      <!-- 方式 -->
      <van-dropdown-item title="方式">
        <van-picker
          toolbar-position="bottom"
          show-toolbar
          :columns="rentType"
          value-key="label"
        />
      </van-dropdown-item>
      <!-- 租金 -->
      <van-dropdown-item title="租金">
        <van-picker
          toolbar-position="bottom"
          show-toolbar
          :columns="rentPrice"
          value-key="label"
        />
      </van-dropdown-item>
      <!-- 筛选 -->
      <van-dropdown-item title="筛选" @open="show = true"> </van-dropdown-item>
    </van-dropdown-menu>
    <!-- 筛选 -->
    <van-popup
      v-model="show"
      position="right"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="popup_box">
        <div class="filterBtn">
          <p class="text">户型</p>
          <van-grid :column-num="2">
            <div class="hx-box">
              <span
                class="huxing"
                v-for="item in roomType"
                :key="item.value"
                :class="item.checked ? 'actived' : ''"
                @click="onChecked('roomType', item)"
              >
                {{ item.label }}
              </span>
            </div>
          </van-grid>
          <p class="text">朝向</p>
          <van-grid :column-num="2">
            <div class="hx-box">
              <span
                class="huxing"
                v-for="item in oriented"
                :key="item.value"
                :class="item.checked ? 'actived' : ''"
                @click="onChecked('oriented', item)"
              >
                {{ item.label }}
              </span>
            </div>
          </van-grid>
          <p class="text">楼层</p>
          <van-grid :column-num="2">
            <div class="hx-box">
              <span
                class="huxing"
                v-for="item in floor"
                :key="item.value"
                :class="item.checked ? 'actived' : ''"
                @click="onChecked('floor', item)"
              >
                {{ item.label }}
              </span>
            </div>
          </van-grid>
          <p class="text">房屋亮点</p>
          <van-grid :column-num="2">
            <div class="hx-box">
              <span
                class="huxing"
                v-for="item in characteristic"
                :key="item.value"
                :class="item.checked ? 'actived' : ''"
                @click="onChecked('characteristic', item)"
              >
                {{ item.label }}
              </span>
            </div>
          </van-grid>
        </div>
        <div class="btn">
          <van-button type="default" class="close-btn">取消</van-button>
          <van-button type="primary" class="agree-btn">确认</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 租房列表 -->
    <div class="scroll">
      <van-list
        v-if="houseList.length"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-card
          v-for="(item, index) in houseList"
          :key="index + item.title"
          :price="item.price"
          :desc="item.desc"
          :title="item.title"
          :thumb="'http://liufusong.top:8080' + item.houseImg"
        >
          <template #tags>
            <van-tag plain type="danger" text-color="#39becd">{{
              item.tags[0]
            }}</van-tag>
          </template>
        </van-card>
      </van-list>
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";
import { getAreas, getHouseList } from "@/api/area";
export default {
  components: {
    Search,
  },
  data() {
    return {
      id: "AREA|88cff55c-aaa4-e2e0",

      areaList: [],
      isClose: false,
      rentType: [],
      rentPrice: [],

      cityId: "AREA|dbf46d32-7e76-1196",
      houseList: [],
      start: 1,
      end: 10,
      list: [],
      loading: false,
      finished: false,

      show: false,

      roomType: [],
      oriented: [],
      floor: [],
      characteristic: [],
    };
  },
  created() {
    this.ongetAreas();
    this.onHouseList();
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    async ongetAreas() {
      const { data } = await getAreas({ id: this.id });
      // 区域，地铁
      data.body.area.children[0].children = [];
      this.areaList.push(data.body.area, data.body.subway);

      // 方式
      this.rentType = data.body.rentType;
      // console.log(this.rentType);
      // 租金
      this.rentPrice = data.body.price;
      // 筛选
      // 户型
      data.body.roomType.forEach((e) => {
        e.checked = false;
      });
      this.roomType = data.body.roomType;
      // 朝向
      data.body.oriented.forEach((e) => {
        e.checked = false;
      });
      this.oriented = data.body.oriented;
      // 楼层
      data.body.floor.forEach((e) => {
        e.checked = false;
      });
      this.floor = data.body.floor;
      // 房屋楼层
      data.body.characteristic.forEach((e) => {
        e.checked = false;
      });
      this.characteristic = data.body.characteristic;
    },
    async onHouseList() {
      try {
        const { data } = await getHouseList({
          cityId: this.cityId,
          start: this.start,
          end: this.end,
        });
        this.houseList = this.houseList.concat(data.body.list);
        this.loading = false;
        // 优化：数据都加载完毕之后，显示”没有更多了“
        if (this.houseList.length >= data.body.count) {
          this.finished = true;
        }
      } catch (error) {
        this.loading = false;
        this.finished = true;
      }
    },
    onLoad() {
      this.start = this.end + 1;
      this.end = this.end + 10;
      this.onHouseList();
    },
    onChecked(name, item) {
      this[name].forEach((e) => {
        if (e.value === item.value) {
          e.checked = !e.checked;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.scroll {
  height: 1150px;
  overflow: scroll;
}
.findhouse-search {
  width: 700px;
  margin-left: 50px;
  margin-top: -15px;
}
.nav-bar {
  height: 100px;
}
.van-card__title {
  font-weight: 700;
  font-size: 30px;
}
.van-card__desc {
  color: #afb2b3;
}
.text {
  font-size: 32px;
  margin-left: 30px;
  color: #333;
}
.hx-box {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;
  margin-left: 120px;
  .huxing {
    display: inline-block;
    margin: 0 30px 30px 0;
    width: 150px;
    height: 70px;
    border: 1px solid #ddd;
    text-align: center;
    color: #888;
    font-size: 28px;
    line-height: 70px;
  }
}
.btn {
  .close-btn {
    width: 30%;
    height: 100px;
  }
  .agree-btn {
    width: 70%;
    height: 100px;
  }
}
.van-hairline--top::after {
  border: 0;
}
.popup_box {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  height: 100vh;
  .filterBtn {
    flex: 1;
    overflow: auto;
  }
  .btn {
    height: 100px;
    width: 100%;
  }
  .actived {
    border: 1px solid #21b97a;
    color: #21b97a;
    background-color: #defaef;
  }
}
</style>
