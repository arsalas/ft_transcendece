import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  IFriend,
  IFriendMessages,
  IFriendProfile,
} from '../interfaces/friends';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriendMessages[]>([]);

  const friendsMsg = ref<IFriendMessages[]>([]);

  const online = computed<IFriendMessages[]>(() =>
    friendsMsg.value.filter(
      (f) => f.activedAt && f.profile.status != 'offline',
    ),
  );

  const offline = computed<IFriendMessages[]>(() => {
    console.log({ j: friends.value });
    return friendsMsg.value.filter(
      (f) => f.activedAt && f.profile.status == 'offline',
    );
  });

  const pending = computed<IFriendMessages[]>(() =>
    friendsMsg.value.filter((f) => !f.activedAt && !f.isSender),
  );

  const sending = computed<IFriendMessages[]>(() =>
    friendsMsg.value.filter((f) => !f.activedAt && f.isSender),
  );

  const block = computed<IFriendMessages[]>(() =>
    friendsMsg.value.filter((f) => f.isBlock),
  );

  const setFriends = (
    friendsData: IFriend[],
    noRead: {
      userId: string;
      count: number;
    }[],
  ) => {
    friendsMsg.value = friendsData.map((f) => {
      const counter = noRead.find((nr) => nr.userId == f.profile.login);
      const agroupData: IFriendMessages = {
        ...f,
        noRead: counter ? counter.count : 0,
      };
      return { ...agroupData };
    });
    console.log({ f1: friends.value });
    friends.value = friendsMsg.value;
  };

  const resetUserMessages = (userId: string) => {
    const index = friendsMsg.value.findIndex(
      (nr) => nr.profile.login == userId,
    );
    friendsMsg.value[index].noRead = 0;
  };

  const userIncrementMessages = (userId: string) => {
    const index = friendsMsg.value.findIndex(
      (nr) => nr.profile.login == userId,
    );
    friendsMsg.value[index].noRead++;
  };

  return {
    friends,
    online,
    offline,
    pending,
    resetUserMessages,
    userIncrementMessages,
    sending,
    block,
    setFriends,
  };
});
