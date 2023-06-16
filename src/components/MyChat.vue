<template>
    <div>
        <div class="my-avatar-container">
            <img class="avatar" src="../assets/logo.png" />
        </div>
        <div class="text-container">
            <div class="my-text">
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyChat',
    props: {
        text: {
            type: String,
            default: ''
        },
    },
}
</script>

<style scoped>
.my-avatar-container {
    float: right;
    margin-left: 0.5rem;
}
.avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1.5px solid #46ac94;
}
.text-container {
    border:  1.5px solid #6cd153;
    border-radius: 0.5rem;
}
.my-text {
    text-align: left;
    line-height: 1.7rem;
    margin: 0.3rem;
}
</style>
