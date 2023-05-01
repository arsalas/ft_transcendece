<!-- To cast a string to Date
const str = '2024-07-21';
const date = new Date(str);
date.toDateString(); -->

<template>
    <div class="chat-container" @click="handleClick">
        <header>
            <div class="left">
                <MediaObject avatar="https://cdn.intra.42.fr/users/61da00534362577f043e040efaf1a1e7/aramirez.jpg"
                    status="conectado" username="aramirez" />
            </div>
            <div class="right">
                <button class="mybutton" @click="closeChat">CLOSE</button>
                <button class="mybutton" @click="minimizeChat">ADD</button>
                <div class="dropdown" :class="{ 'is-active': isOpen }">
                    <div class="dropdown-trigger">
                        <button class="mybutton" @click="isOpen = !isOpen" aria-controls="dropdown-menu1">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>

                    <div class="dropdown-menu" id="dropdown-menu1" role="menu">
                        <div class="dropdown-content">
                            <a class="dropdown-item">
                                Contact data
                            </a>
                            <hr class="dropdown-divider">
                            <a href="#" class="dropdown-item">
                                Block
                            </a>
                            <hr class="dropdown-divider">
                            <a href="#" class="dropdown-item">
                                Silence
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="chat" id="chat">
            <div class="conversation-start">
                <span>Today, 9:00 PM</span>
            </div>
            <div class="bubble" :class="chat.login == 'amurcia-' ? 'me' : 'other'" v-for="chat in chats">
                <div v-if="chat.login != 'amurcia-'" class="username">{{ chat.login }}</div>
                <!-- si el usuario no soy yo, printa el nombre del login  -->
                {{ chat.message }}
            </div>
        </div>
        <footer>
            <form @submit.prevent="sendMsg()">
                <input v-model.trim="message" type="text" placeHolder="Enviar mensaje" class="input">
            </form>
        </footer>
    </div>
</template>

<script lang='ts' setup>
import { defineStore } from 'pinia'
import { computed, defineAsyncComponent, ref } from 'vue'

const isOpen = ref<boolean>(false)
const MediaObject = defineAsyncComponent(() => import('../../common/components/MediaObject.vue'))

interface IChat {
    isOpenOptions: boolean;
    open: boolean;
    login: string;
    message: string;
    date: string;
}

const handleClick = (e: PointerEvent) => {
    console.log(e.srcElement.id)

    console.log( e.target);
    console.log((e.target as HTMLElement).id)
}

const message = ref<string>("");

const sendMsg = () => {
    if (message.value.length > 0) {
        chats.value.push({
            isOpenOptions: false,
            open: true,
            login: "amurcia-",
            message: message.value,
            date: "10.05.2023",
        })
        message.value = "";
        setTimeout(scrollOk, 1);
    }
}

const scrollOk = () => {
    var objDiv = document.getElementById("chat");
    console.log(objDiv);
    objDiv.scrollTop = objDiv.scrollHeight;
}

const closeChat = () => {
    while (chats.value.length > 0) {
        chats.value.pop();
    }
}

const minimizeChat = () => {
    chats.value.push({
        isOpenOptions: false,
        open: true,
        login: "amurcia-",
        message: "Hola Alberto",
        date: "10.05.2023",
    })
}

const openOptions = (pos: number) => {

    if (!chats.value[pos].isOpenOptions) {
        chats.value[pos].isOpenOptions = true;
    }
    else {
        chats.value[pos].isOpenOptions = false;
    }
}

const chats = ref<IChat[]>([// const y no let para que no pierda la reactividad
    {
        isOpenOptions: false,
        open: true,
        login: "amurcia-",
        message: "Hola Alberto",
        date: "10.05.2023",
    },
    {
        isOpenOptions: false,
        open: true,
        login: "aramirez",
        message: "Hola Alicia",
        date: "11.05.2023",
    }
]);


</script>

<style lang='scss' scoped>
.chat-container {
    height: 100%;
    width: 100%;
    color: var(--color-text-primary);
    display: flex;
    flex-direction: column;


    & header {
        height: 50px;
        background-color: var(--color-bg-primary);
        display: flex;
        justify-content: space-between;

        & .left {
            display: flex;
            height: 100%;
            padding: 0.2rem;
        }

        & .right {
            height: 100%;
            padding: 0.2rem;
            display: flex;
            justify-content: flex endl;
        }

        & .mybutton {
            margin-left: 1rem;
        }
    }

    & footer {
        height: 50px;
        background-color: pink;

        & form,
        input {
            height: 100%;
        }
    }


    & .chat {
        flex: 1;
        background: var(--color-bg-secondary);
        border: 1px solid #333;
        overflow: auto;
        padding: 0.5rem;

        & .input {
            position: relative;
            align-items: center;
            vertical-align: bottom;

        }

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
            padding: 0.2rem 0.5rem;
            vertical-align: top;
            border-radius: 1rem;
            border-top-left-radius: 0rem;



            & .username {
                font-size: 0.8rem;
                font-weight: bold;
            }
        }

        #message-input {
            height: 3rem;
            width: 70%;
            border: 1px solid #8e8888;
            border-radius: 0.5rem;
            padding: 0.5rem;
            margin-right: 1rem;
        }

        & .other {
            float: left;
            color: var(--color-bg-primary);
            background-color: var(--color-box-other);
            animation-name: slideFromLeft;
            box-shadow: -1px 2px 0px var(--color-bg-primary);
        }

        & .me {
            float: right;
            color: var(--color-bg-primary);
            background-color: var(--color-box-me);
            animation-name: slideFromRight;
            box-shadow: -1px 2px 0px var(--color-bg-primary);

        }
    }
}
</style>