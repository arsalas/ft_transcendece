<template>
  <header class="navbar">
    <div class="left">
      <div class="brand">
        <div class="menu mr-4 is-hidden-desktop">
          <span class="icon text">
            <i class="fa-solid fa-bars"></i>
          </span>
        </div>
        <div class="text">CYBERP<i class="fa-solid fa-circle"></i>NG</div>
      </div>
      <nav class="is-hidden-touch">
        <ul>
          <li>
            <router-link :to="{ name: 'selectGame' }">
              <span class="icon-text text">
                <span class="icon">
                  <i class="fa-solid fa-table-tennis-paddle-ball"></i>
                </span>
                <span>Play</span>
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'chat' }">
              <span class="icon-text text">
                <span class="icon">
                  <i class="fa-sharp fa-solid fa-comments"></i>
                </span>
                <span>Chats</span>
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'ladder' }">
              <span class="icon-text text">
                <span class="icon">
                  <i class="fa-solid fa-table"></i>
                </span>
                <span>Ladder</span>
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'achivements' }">
              <span class="icon-text text">
                <span class="icon">
                  <i class="fa-solid fa-trophy"></i>
                </span>
                <span>Achivements</span>
              </span>
            </router-link>
          </li>

          <li>
            <router-link
              :to="{
                name: 'profileUser',
                params: { username: user.username || user.login },
              }">
              <span class="icon-text text">
                <span class="icon">
                  <i class="fa-solid fa-user"></i>
                </span>
                <span>Profile</span>
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
      <!-- </div>
		<aside class="right"> -->
      <!-- <div class="right"> -->

      <div class="media-object right">
        <MediaObject
          :click="changeStatus"
          :image="user.avatar!"
          :image-fallback="user.avatar42!"
          :name="user.username || user.login"
          :status="user.status"
          width="2.7rem" />
        <div>
          <router-link :to="{ name: 'editProfile' }" class="is-hidden-mobile">
            <span class="icon text" style="font-size: 1rem; margin-left: 1rem">
              <i class="fa-solid fa-gear"></i>
            </span>
          </router-link>
          <span
            @click="logout"
            class="icon text is-clickable is-hidden-mobile"
            style="font-size: 1rem; margin-left: 1rem">
            <i class="fa-solid fa-right-from-bracket"></i>
          </span>
        </div>
      </div>
      <!-- </div> -->
      <!-- </aside> -->
    </div>
  </header>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUserStore, useAuthStore } from '../../../../stores';
import Image from '../images/Image.vue';
import { useSockets, useSocketsGame } from '../../../../sockets';
import MediaObject from '../MediaObject.vue';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { socketNotifications } = useSockets();
const { socketGame } = useSocketsGame();

const changeStatus = () => {
  if (user.value.status == 'online') user.value.status = 'away';
  else user.value.status = 'online';
  socketNotifications.emit('change-status', user.value.status);
};
const logout = () => {
  socketGame.value?.emit('force-diconnect', user.value.login);
  authStore.logOut();
  router.push({ name: 'signin' });
};
</script>
<style lang="scss" scoped>
.navbar {
  height: var(--header-h);
  background-color: var(--bg-dark-0);
  display: flex;
  padding: 0rem 0rem;
  justify-content: space-between;
  position: sticky;
  top: 0;
  border-bottom: var(--border);
  z-index: 1;
}

.left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //   padding: 0rem 1rem;
  color: var(--color-text-primary);
  width: 100%;
}

.right {
  //   padding: 0.4rem 2rem;
  width: var(--aside-w);
  display: flex;
  justify-content: space-between;
  padding: 0rem 1rem;
}

.brand {
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  padding-left: 1rem;

  & .text {
    font-size: 1.5rem;
  }

  & i {
    padding: 0;
    margin: 0;
  }

  & img {
    height: 100%;
  }
}

nav {
  transition: 300ms;
  height: 100%;
  & ul {
    display: flex;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & li {
      cursor: pointer;
      //   flex:1;
      height: 100%;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      & .icon-text {
        font-size: 1rem;
        transition: 300ms;
      }
      &:hover {
        //   color: rgba(255, 255, 255, 0.5);
        background-image: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(var(--color-primary-rgb), 0.2)
        );
      }

      & a {
        color: var(--color-text-primary);
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0rem 1rem;
      }

      & .router-link-active {
        // color: rgba(255, 255, 255, 0.4);
        // background-color: rgba(var(--color-primary-rgb), 0.5);
        background-image: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(var(--color-primary-rgb), 0.7)
        );
        // border-bottom: 1px solid red;
        // height: 100%;
      }
    }
  }
}

aside {
  height: 100%;
  padding: 0.3rem 0rem;
}

.media-object {
  height: 100%;
  display: flex;
  align-items: center;

  & .media-text {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-text-primary);

    & .name {
      font-weight: 600;
    }

    & .status {
      font-weight: 600;
      color: greenyellow;
    }
  }
}

.avatar {
  height: 100%;
  border-radius: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border: 2px solid var(--color-online-0);
}
</style>
