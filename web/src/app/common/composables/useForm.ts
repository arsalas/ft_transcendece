
interface Event<T = EventTarget> {
	target: T;
}

const createImageFromFile = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = function () {
			const image = reader.result as string;
			resolve(image);
		}
		reader.readAsDataURL(file);
	})
}


export const useForm = () => {

	const createImageFromInput = async (e: Event<HTMLInputElement>): Promise<string> => {
		const file = e.target.files![0];
		return await createImageFromFile(file);
	}

	return {
		createImageFromInput
	}
}