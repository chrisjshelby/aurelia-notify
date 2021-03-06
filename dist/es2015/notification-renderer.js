import { ViewSlot } from 'aurelia-templating';

import { BSNotification } from './bs-notification';

export let globalSettings = {
  append: false,
  containerSelector: 'body',
  timeout: 0,
  viewModel: BSNotification,
  limit: 5
};

export let NotificationRenderer = class NotificationRenderer {

  constructor() {
    this.defaultSettings = globalSettings;

    this.notificationControllers = [];
  }

  createNotificationHost(notificationController) {
    let settings = notificationController.settings;
    let notificationHost = document.createElement('notification-host');
    let notificationContainer = this.getNotificationContainer(settings.containerSelector);

    if (settings.append === true) {
      notificationContainer.appendChild(notificationHost);
    } else {
      notificationContainer.insertBefore(notificationHost, notificationContainer.firstChild);
    }

    notificationController.slot = new ViewSlot(notificationHost, true);
    notificationController.slot.add(notificationController.view);

    notificationController.showNotification = () => {
      this.notificationControllers.push(notificationController);

      if (this.notificationControllers.length >= settings.limit + 1) {
        this.notificationControllers[0].close(this.notificationControllers[0]);
      }

      notificationController.slot.attached();

      if (settings.timeout > 0) {
        notificationController.timer = setTimeout(notificationController.close.bind(notificationController), settings.timeout);
      }

      return Promise.resolve();
    };

    notificationController.hideNotification = () => {
      let i = this.notificationControllers.indexOf(notificationController);
      if (i !== -1) {
        this.notificationControllers.splice(i, 1);
      }

      return Promise.resolve();
    };

    notificationController.destroyNotificationHost = () => {
      notificationContainer.removeChild(notificationHost);
      notificationController.slot.detached();

      return Promise.resolve();
    };

    return Promise.resolve();
  }

  showNotification(notificationController) {
    return notificationController.showNotification();
  }

  hideNotification(notificationController) {
    return notificationController.hideNotification();
  }

  destroyNotificationHost(notificationController) {
    return notificationController.destroyNotificationHost();
  }

  getNotificationContainer(containerSelector) {
    let notificationContainer = document.querySelector(containerSelector);
    if (notificationContainer === null) {
      notificationContainer = document.body;
    }

    return notificationContainer;
  }
};