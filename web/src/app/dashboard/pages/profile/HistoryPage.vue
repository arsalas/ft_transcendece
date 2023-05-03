<template>
  <div class="overview-container">
    <div v-for="i in 5" class="user">
      <div class="media">
        <img
          src="https://cdnb.artstation.com/p/users/avatars/000/272/313/medium/947dd2575788d5366e38f91fc1deed59.jpg?1681406726" />
        <div class="username-rival">aramirez</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 59px - 50px);
  width: 100vw;
 // background-color: yellow;
}

.media {
  margin: 1rem;
}

</style>
