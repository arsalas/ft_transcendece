<template>
  <div class="chat pattern is-hidden-mobile" v-bind="chat">
    <Chat
      v-if="!isLoading && chat"
      :id="chat.id"
      :type="chat.type"
      :messages="chat.messages"
      :name="chat.name"
      :users="chat.users" />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  inject,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { ChatService } from '../services/ChatService';
import { useChatStore } from '../../../stores/chats';
import { storeToRefs } from 'pinia';

const Chat = defineAsyncComponent(
  () => import('../../common/components/Chat.vue'),
);

const chatService = inject<ChatService>('chatService')!;

const chatStore = useChatStore();
const { password, chat } = storeToRefs(chatStore);
const route = useRoute();

const isLoading = ref<boolean>(false);

const chatId = computed(() => route.params.chatId as string);
watch(chatId, () => {
  fetchData();
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    chat.value = await chatService.getChat(
      chatId.value,
      password.value.length > 0 ? password.value : '123',
    );
    isLoading.value = false;
  } catch (error) {}
};

onMounted(() => fetchData());
</script>

<style lang="scss" scoped>
.chat {
  height: 100%;
}
</style>
