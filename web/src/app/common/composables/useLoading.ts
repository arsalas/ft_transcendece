import { ref } from "vue"


export const useLoading = () => {

	const isLoading = ref<boolean>(false);

	return {
		isLoading
	}
}