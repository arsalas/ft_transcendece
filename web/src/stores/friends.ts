import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { IFriend,IFriendProfile } from '../interfaces/friends';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriend[]>([]);

  const online = computed<IFriend[]>(() =>
    friends.value.filter((f) => f.activedAt && f.profile.status != 'offline'),
  );

  const offline = computed<IFriend[]>(() =>
    friends.value.filter((f) => f.activedAt && f.profile.status == 'out'),
  );

  const pending = computed<IFriend[]>(() =>
    friends.value.filter((f) => !f.activedAt && !f.isSender),
  );

  const sending = computed<IFriend[]>(() =>
    friends.value.filter((f) => !f.activedAt && f.isSender),
  );

  return { friends, online, offline, pending, sending };
});
