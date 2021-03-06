import { invokeLifecycle } from './lifecycle';

export let NotificationController = class NotificationController {
  constructor(renderer, settings) {
    this._renderer = renderer;
    this.settings = settings;
  }

  close() {
    clearTimeout(this.timer);

    return invokeLifecycle(this.viewModel, 'canDeactivate').then(canDeactivate => {
      if (canDeactivate) {
        invokeLifecycle(this.viewModel, 'deactivate').then(() => {
          return this._renderer.hideNotification(this);
        }).then(() => {
          return this._renderer.destroyNotificationHost(this);
        }).then(() => {
          this.controller.unbind();
        });
      }
    });
  }
};