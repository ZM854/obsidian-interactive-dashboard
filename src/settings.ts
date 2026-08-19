import { App, PluginSettingTab } from 'obsidian';
import InteractiveDashboardPlugin from './main';

export interface InteractiveDashboardPluginSettings {
	dailyNotesFolder: string;
	daysToDisplay: number;
}

export const DEFAULT_SETTINGS: InteractiveDashboardPluginSettings = {
	dailyNotesFolder: 'Daily Notes/Daily',
	daysToDisplay: 7,
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
			{
				name: 'Days to display',
				desc: 'Number of days displayed on the dashboard.',
				control: {
					type: 'number',
					key: 'daysToDisplay',
					placeholder: '7',
					min: 1,
				},
			},
		];
	}

	declare display: () => void;
}
