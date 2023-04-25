    <!-- // variable con los chats
    /*
    interfaz
     {
        login: string,
        message:string,
        date: string casts new Date() tiempo relativo,
    
     }
     */ -->
    
    <!-- </script>
    
    
    <style lang="scss" scoped>
    </style> -->


<template>
    <div class="chat-container">
        <div class="chat">
            <div class="conversation-start">
                <span>Today, 9:00 PM</span>
            </div>

            <div class="bubble other">
                <div class="username">Alberto</div>
                Hola Alicia
            </div>

            <div class="bubble me">
                Hola Alberto
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>


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
}</style>