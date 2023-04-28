import { ref } from "vue"


const isOpen = ref<boolean>(false);
const message = ref<string>("")

export const useNotifications = () => {


	const open = (msg: string) => {
		message.value = msg;
		isOpen.value = true;
	}

	const success = (msg: string) => {
		open(msg);
	}

	const error = (msg: string) => {
		open(msg);
	}

	const info = (msg: string) => {
		open(msg);
	}

	const close = () => {
		isOpen.value = false;
		message.value = "";
	}


	return {
		message,
		isOpen,
		success,
		error,
		info,
		close
	}
}