// 可以帶入{{pages}}，確認是否有讀取到
export default {
  props: ["pages", "getProducts"],
  template: `<nav aria-label="Page navigation example"> 
  <ul class="pagination">

    <li class="page-item" :class="{disabled:!pages.has_pre}">
      <a class="page-link" href="#" aria-label="Previous" @click="getProducts(pages.current_page-1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>


    <li class="page-item" :class="{active: page === pages.current_page}" v-for="page in pages.total_pages" :key="page+'page'">
    <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
    </li>

    <li class="page-item" :class="{disabled:!pages.has_next}">
      <a class="page-link" href="#" aria-label="Next" @click="getProducts(pages.has_next+1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`,
  mounted() {
    console.log("page", this.page);
  },
};
// <!-- 總共幾頁就跑幾次迴圈 -->
// <!-- 當前page為currentpage值為同時則顯示藍色填滿 -->
// 如果沒有前一頁(has_pre)時會顯示灰色

// emit

/* <li class="page-item" :class="{active: page === pages.current_page}" v-for="page in pages.total_pages" :key="page+'page'">
<a class="page-link" href="#" @click.prevent="$emit('change-page',page)">{{page}}</a>
</li> */
