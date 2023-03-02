import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

// 載入多國語系
loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

// 設定
configure({
  generateMessage: localize("zh_TW"),
  //validateOnInput: true, // 此項為true時，輸入文字就會立即進行驗證
});

VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yuling202202";

const productModal = {
  // 當id變動時，取得遠端資料，呈現modal
  props: ["id", "addToCart", "openModal"],
  data() {
    return {
      // 需實體化深層拷貝??
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: "#userProductModal",
  //   內層傳入，如何知道id變動:監聽
  watch: {
    id() {
      console.log("productModal:", this.id);
      if (this.id) {
        axios
          .get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
          .then((res) => {
            console.log("單一產品:", res.data.product);
            this.tempProduct = res.data.product;
          })
          .catch((err) => {
            console.log(err.data.message);
          });
        this.modal.show();
      }
    },
  },
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // this.modal.show();
    // 監聽DOM，當modal關閉時，要做其他事情
    this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
      // do something...
      console.log("Modal被關閉了");
      this.openModal("");
    });
  },
};

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "",
      cart: "",
      //   修正(讀取效果，wach錯誤)
      loadingItem: "", //存ID
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          console.log("產品列表:", res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
      console.log("外層帶入productId:", id);
    },
    addToCart(product_id, qty = 1) {
      //當沒有傳入該參數，會使用預設值
      const data = {
        product_id,
        qty,
      };
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((res) => {
          console.log("加入購物車:", res.data);
          this.getCarts();
          this.$refs.productModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    getCarts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          console.log("購物車:", res.data);
          this.cart = res.data.data;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    updataCartItem(item) {
      //帶入購物車id、產品id
      const data = {
        product_id: item.product.id,
        qty: item.qty,
      };
      //console.log(data, item.id);
      this.loadingItem = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          console.log("更新購物車:", res.data);
          this.getCarts();
          this.loadingItem = "";
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    deleteItem(item) {
      this.loadingItem = item.id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
        .then((res) => {
          console.log("刪除購物車:", res.data);
          alert(`刪除購物車商品:${item.product.title}`);
          this.getCarts();
          this.loadingItem = "";
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    deleteAllCarts() {
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          console.log("清除購物車全部商品:", res.data.message);
          alert("清除購物車全部商品已完成");
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createOrder() {
      const order = this.form;
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
        .then((res) => {
          console.log("已建立訂單:", res);
          alert(`已建立訂單，訂單總金額:${res.data.total}`);
          this.$refs.form.resetForm();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  //   區域註冊
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});
// 全欲註冊 app.component('productModal',productModal)
// app.component("VForm", VeeValidate.Form);
// app.component("VField", VeeValidate.Field);
// app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
