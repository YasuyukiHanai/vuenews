"use strict";

const BaseUrl = "https://newsapi.org/v2/top-headlines?country=jp&category=";
const ApiKey = config.KEY;
const SECTIONS = ", business, entertainment, health, science, sports, technology"; // From newsapi

function buildUrl (url) {
    return BaseUrl + url + "&apiKey=" + ApiKey;
}

Vue.component('news-list', {
  props: ['results'],
  template: `
    <section>
      <div class="row" v-for="posts in processedPosts">
        <div class="columns large-3 medium-6" v-for="post in posts">
          <div class="card">
          <div class="card-divider">
          {{ post.title }}
          </div>
          <div class="card-img">
            <a :href="post.url" target="_blank"><img :src="post.urlToImage"></a>
          </div>
          <div class="card-section">
            <p>{{ post.description }}</p>
          </div>
          <div class="card-section">
            <a :href="post.url" target="_blank"><p>{{ post.source.name }}</p></a>
          </div>
        </div>
        </div>
      </div>
  </section>
  `,
  computed: {
    processedPosts() {
      let posts = this.results;

      // Add image_url attribute
      posts.map(post => {
        let imgObj = post.urlToImage;
        post.urlToImage = imgObj ? imgObj : "http://placehold.it/300x200?text=N/A";
      });

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 4;
      for (i=0, j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i,i+chunk);
      }
      return chunkedArray;
    }
  }
});

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    sections: SECTIONS.split(', '), // create an array of the sections
    section: '', // set default section to 'category=all'
    loading: true,
    title: ''
  },
  mounted () {
    this.getPosts('');
  },
  methods: {
    getPosts(section) {
      let url = buildUrl(section);
      axios.get(url).then((response) => {
        console.log(response.data.articles)
        // console.log(response.data.totalResults)

        this.loading = false;
        this.results = response.data.articles;
        let title = this.section !== '' ? "Top stories in '"+ this.section + "' today" : "Top stories today";
        this.title = title + "(" + response.data.totalResults+ ")";
      }).catch((error) => { console.log(error); });
    }
  }
});


if (window.addEventListener || window.history || window.requestAnimationFrame || document.getElementsByClassName) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}