import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_DASHBOARD = 'dashboard';

export class DashboardView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_DASHBOARD;
	}

	getDisplayText(): string {
		return 'Dashboard';
	}

	protected async onOpen(): Promise<void> {
		this.contentEl.createEl('h1', {
			text: 'Dashboard',
		});
	}
	async onClose(): Promise<void> {}
}
