<template>
  <div class="chat pattern" v-bind="chat">
    <Chat
      v-if="chat"
      :id="chat.id"
      :type="chat.type"
      :messages="chat.messages"
      :name="chat.name"
      :users="[]" />
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
import { IResponseChatRoom } from '../../../interfaces';
import { useRoute } from 'vue-router';
import { ChatService } from '../services/ChatService';

const Chat = defineAsyncComponent(
  () => import('../../common/components/Chat.vue'),
);

const chatService = inject<ChatService>('chatService')!;

const route = useRoute();

const chat = ref<IResponseChatRoom>();

const chatId = computed(() => route.params.chatId as string);
watch(chatId, () => {
  fetchData();
});

const fetchData = async () => {
  try {
    chat.value = await chatService.getChat(chatId.value);
	console.log(chat.value)
  } catch (error) {}
};

onMounted(() => fetchData());

</script>

<style lang="scss" scoped>
.chat {
  height: 100%;
}
</style>
