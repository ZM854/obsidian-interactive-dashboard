import { App, PluginSettingTab } from 'obsidian';
import InteractiveDashboardPlugin from './main';

export interface InteractiveDashboardPluginSettings {
	dailyNotesFolder: string;
}

export const DEFAULT_SETTINGS: InteractiveDashboardPluginSettings = {
	dailyNotesFolder: 'Daily Notes/Daily',
};

export class InteractiveDashboardSettingTab extends PluginSettingTab {
	plugin: InteractiveDashboardPlugin;

	constructor(app: App, plugin: InteractiveDashboardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions() {
		return [
			{
				name: 'Daily notes folder',
				desc: 'Folder containing your daily notes.',
				control: {
					type: 'folder',
					key: 'dailyNotesFolder',
					placeholder: 'Daily',
				},
			},
		];
	}

	declare display: () => void;
}
