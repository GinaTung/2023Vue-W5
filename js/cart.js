import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "yuling202202";

const productModal = {
  // 當id變動時，取得遠端資料，呈現modal
  props: ["id", "addToCart"],
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
  },
};

const app = createApp({
  data() {
    return {
      products: [],
      productId: "",
      cart: "",
      //   修正(讀取效果，wach錯誤)
      loadingItem: "", //存ID
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
          this.getCarts();
          this.loadingItem = "";
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  //   區域註冊
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});
// 全欲註冊 app.component('productModal',productModal)
app.mount("#app");
