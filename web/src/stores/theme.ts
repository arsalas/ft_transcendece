import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = "purple" | "orange" | "blue" | "red" | "green";

const themePersist = (localStorage.getItem('theme') || 'purple') as Theme;

export const useThemeStore = defineStore('theme', () => {
	const theme = ref<Theme>(themePersist);

	const loadTheme = () => {
		document.documentElement.className = theme.value;
	}

	const setTheme = (newTheme: Theme) => {
		theme.value = newTheme;
		localStorage.setItem("theme", newTheme);
		loadTheme()
	}

	return {
		theme,
		loadTheme,
		setTheme
	}
})

