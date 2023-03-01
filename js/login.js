import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

//燈入及登入狀態、取得產品列表
const site = "https://vue3-course-api.hexschool.io/v2";
const path = "yuling202202";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      console.log(this.user);
      const url = `${site}/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          console.log(res);
          // 一般寫法:有可能更名
          // const expired =res.data.expired;
          // const token =res.data.token;
          // 解構寫法:將相同屬性取出來寫至右邊
          const { expired, token } = res.data;
          console.log(expired, token);
          document.cookie = `hexToken=${token}; expeires=${new Date(expired)};`;
          // 轉址
          window.location = "w4-products.html";
        })
        // 切換network->Ferch/XHR:可看到錯誤回傳
        .catch((err) => {
          console.log(err);
        });
    },
  },
  // 測試
  // mounted() {
  //   console.log("mounted");
  //   console.log(`${site}admin/signin`);
  // },
});
app.mount("#app");
