import { BaseForm, BaseView } from '../internals';
import { loc, createCallout } from 'okta';

export const Body = BaseForm.extend({
  title: function() {
    if (this.isPasswordRecoveryFlow())  {
      return loc('password.reset.title.generic', 'login');
    }
    return loc('oie.select.authenticators.verify.title', 'login');
  },
  subtitle: function() {
    if (this.isPasswordRecoveryFlow())  {
      return loc('oie.password.reset.verification', 'login');
    }
    return loc('oie.select.authenticators.verify.subtitle', 'login');
  },
  isPasswordRecoveryFlow() {
    return this.options.appState.get('isPasswordRecovery');
  },
  noButtonBar: true,
  showMessages() {
    const messagesObj = this.options.appState.get('messages');
    if (messagesObj?.value.length) {
      const displayMessageObj = messagesObj.value[0];
      const messageCallout = createCallout({
        content: displayMessageObj.message,
        type: (displayMessageObj.class || '').toLowerCase(),
      });
      this.introspectMessage = this.add(messageCallout, '.o-form-error-container').last();
    }
  },
});

export default BaseView.extend({
  Body,
});
