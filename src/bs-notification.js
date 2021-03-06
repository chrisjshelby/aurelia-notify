import {inject} from 'aurelia-framework';

import {NotificationController} from './notification-controller';

@inject(NotificationController)
export class BSNotification {
  constructor(controller: NotificationController) {
    this.controller = controller;
  }

  activate(model: any) {
    this.level = model.level;
    this.notification = model.notification;
  }
}
