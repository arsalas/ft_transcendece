<template>
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
              <option :value="EChatType.Public">Public</option>
              <option :value="EChatType.Private">Private</option>
              <option :value="EChatType.Protected">Protected</option>
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
import { inject, ref } from 'vue';
import { ChatService } from '../services/ChatService';
import { EChatType } from '../../../interfaces';
import { useChatStore } from '../../../stores/chats';
import { storeToRefs } from 'pinia';

const isLoading = ref<boolean>(false);
const name = ref<string>('');
const password = ref<string>('');
const type = ref<EChatType>(EChatType.Public);

const chatStore = useChatStore();
const { chats } = storeToRefs(chatStore);
const chatService = inject<ChatService>('chatService')!;

interface ChatPayload {
  name: string;
  type: EChatType;
  password?: string;
}

const emits = defineEmits(['close']);

const handleSubmit = async () => {
  try {
    if (name.value.length == 0) return;
    if (type.value == 'protected' && password.value.length == 0) return;

    const payload: ChatPayload = {
      name: name.value,
      type: type.value,
    };
    if (type.value == EChatType.Protected) payload.password = password.value;
    const response = await chatService.createChat(payload);
    chats.value.push(response);
	emits('close')
  } catch (error) {}
};
</script>
<style lang="scss" scoped>
.cont {
  width: 100%;
  padding: 2rem;
}
</style>
