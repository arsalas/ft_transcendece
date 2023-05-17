import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { IFriend, IFriendProfile } from '../interfaces/friends';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriend[]>([]);

  const online = computed<IFriend[]>(() =>
    friends.value.filter((f) => f.activedAt && f.profile.status != 'offline'),
  );

  const offline = computed<IFriend[]>(() =>
    friends.value.filter((f) => f.activedAt && f.profile.status == 'offline'),
  );

  const pending = computed<IFriend[]>(() =>
    friends.value.filter((f) => !f.activedAt && !f.isSender),
  );

  const sending = computed<IFriend[]>(() =>
    friends.value.filter((f) => !f.activedAt && f.isSender),
  );

  const block = computed<IFriend[]>(() =>
    friends.value.filter((f) => f.isBlock),
  );

  return { friends, online, offline, pending, sending, block };
});
