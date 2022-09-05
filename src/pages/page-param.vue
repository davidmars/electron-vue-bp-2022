<template>
<div class="page page-page">
  <h1>Page param</h1>
  <h2>param {{$route.params.param}}</h2>
</div>
</template>

<script>
export default {
  name: "page-veille"
}
</script>

<style lang="scss">
  .page-param{
    h1 {
      color: #0000ff;
    }
    h2 {
      color: #000088;
    }
  }
</style>