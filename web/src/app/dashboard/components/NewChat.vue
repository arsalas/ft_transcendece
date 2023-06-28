<template>
  <!-- TIPO
	PASSWORD
	NOMBRE -->

  <div class="cont container">
    <form @submit.prevent="handleSubmit" action="">
      <div class="field">
        <div class="control">
          <input
            v-model.trim="name"
            type="text"
            class="input"
            placeholder="Chat name" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <div class="select is-fullwidth text">
            <select v-model="type">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="protected">Protected</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field" v-if="type == 'protected'">
        <div class="control">
          <input
            v-model.trim="password"
            type="password"
            class="input"
            placeholder="password" />
        </div>
      </div>

      <div class="field">
        <button
          type="submit"
          class="button is-primary is-fullwidth"
          :class="{ 'is-loading': isLoading }">
          Create
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';


const isLoading = ref<boolean>(false);
const name = ref<string>('');
const password = ref<string>('');
const type = ref<'public' | 'private' | 'protected'>('public');

const handleSubmit = () => {
  if (name.value.length == 0) return;
  if (type.value == 'protected' && password.value.length == 0) return;
};
</script>
<style lang="scss" scoped>
.cont {
  width: 100%;
  padding: 2rem;
}
</style>
