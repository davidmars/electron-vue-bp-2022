<template>
  <div class="version-manager">

    <!-- message-->
    <div style="margin-right: auto;">
      <div>
        We are
        <template v-if="$manager.onLine">
          ONLINE
        </template>
        <template v-else>
          OFFLINE
        </template>
      </div>
    </div>

    <!-- version -->
    <div>version {{$manager.version}}</div>

    <!-- exe / web ? -->
    <div class="btn" @contextmenu="$manager.toggleDevTools()">
      {{$manager.isElectron?'exe':'web'}}
    </div>

    <!-- localhost ? -->
    <template v-if="$manager.isLocalhost">
      <div>localhost</div>
    </template>

  </div>
</template>

<script>
export default {
  name: "version-manager"
}
</script>

<style lang="scss">
.version-manager{
  font-size: 13px;
  font-family: sans-serif;
  user-select: none;
  pointer-events: none;
  padding: 15px;
  display: flex;
  align-items: center;
  >*{
    margin: 0.5rem;
    opacity: 0.8;
  };
  button{
    cursor: pointer;
    pointer-events:auto;
    background: #ddd;
    color: #333;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 11px;
    border: 0px solid transparent;
    padding: 6px 16px;
    border-radius: 16px;
    opacity: 1;
    text-transform: uppercase;
  }

  .btn{
    pointer-events: auto;
    cursor: pointer;
  }

}
</style>