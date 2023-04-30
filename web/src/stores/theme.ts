import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Theme = "futuristic" | "calid" | "cold";

const themePersist = (localStorage.getItem('theme') || 'futuristic') as Theme;

export const useThemeStore = defineStore('theme', () => {
	const theme = ref<Theme>(themePersist);

	const loadTheme = () => {
		console.log(theme.value)
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

