<!-- To cast a string to Date
const str = '2024-07-21';
const date = new Date(str);
date.toDateString(); -->

<template>
    <div class="chat-container">
        <div class="chat">
            <div class="conversation-start">
                <span>Today, 9:00 PM</span>
            </div>

            <div class="bubble" :class="chat.login == 'amurcia-' ? 'me' : 'other'" v-for="chat in chats">
                <div v-if="chat.login != 'amurcia-'" class="username">{{ chat.login }}</div>
                {{ chat.message }}

            </div>


            <button @click="addMsg">ADD</button>

        </div>
    </div>
</template>

<script lang='ts' setup>
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface IChat {
    login: string;
    message: string;
    date: string;
}

const addMsg = () => {
    chats.value.push({
        login: "amurcia-",
        message: "Hola Alberto",
        date: "10.05.2023",
    })
}

const chats = ref<IChat[]>([// const y no let para que no pierda la reactividad
    {
        login: "amurcia-",
        message: "Hola Alberto",
        date: "10.05.2023",
    },
    {
        login: "aramirez",
        message: "Hola Alicia",
        date: "11.05.2023",
    }
]);


</script>

<style lang='scss' scoped>
.chat-container {
    display: flex;
    height: 100vh;
    color: var(--color-text-primary);


    & .chat {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        height: 50vh;
        width: calc((100vw) / 2);
        background: rgb(193, 255, 250);
        border: 1px solid #333;
        overflow: auto;
        padding: 0.5rem;


        & .conversation-start {
            position: relative;
            width: 100%;
            margin-bottom: 2rem;
            text-align: center;
            align-items: center;
            justify-content: space-between;

            span {
                font-size: 1rem;
                padding: 0.5rem 2rem;
                display: inline-block;
                background: white;
                color: black;
                border: 1px black;
                border-radius: 5px;
            }
        }

        & .bubble {
            font-size: 1rem;
            position: relative;
            display: inline-block;
            clear: both;
            margin-bottom: 1rem;
            padding: 1rem 1rem;
            vertical-align: top;
            border-radius: 1rem;
            border-top-left-radius: 0rem;
            box-shadow: -1px 2px 0px rgb(0, 0, 0);



            & .username {
                font-size: 0.8rem;
                font-weight: bold;
            }
        }

        & .other {
            float: left;
            color: rgba(0, 0, 128, 0.931);
            background-color: rgb(4, 223, 223);
            animation-name: slideFromLeft;

        }

        & .me {
            float: right;
            color: rgb(115, 8, 115);
            background-color: rgb(255, 158, 255);
            animation-name: slideFromRight;
        }
    }


}
</style>