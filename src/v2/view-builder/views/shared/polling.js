import { _ } from 'okta';
import { MS_PER_SEC, MIN_POLL_INTERVAL } from '../../utils/Constants';

export default {
  startPolling(newRefreshInterval) {
    this.fixedPollingInterval = this.options.currentViewState.refresh;
    this.dynamicPollingInterval = newRefreshInterval;
    this.countDownCounterValue = Math.ceil(this.pollingInterval / MS_PER_SEC);
    // Poll is present in remediation form
    if (this.fixedPollingInterval) {
      this._startRemediationPolling();
    } else {
      // Poll is present in authenticator/ authenticator Enrollment obj.
      // Authenticator won't co-exists hence it's safe to trigger both.
      this._startAuthenticatorPolling();
    }
  },

  _startAuthenticatorPolling() {
    // Authenticator won't co-exists hence it's safe to trigger both.
    [
      'currentAuthenticator',
      'currentAuthenticatorEnrollment',
    ].some(responseKey => {
      if (this.options.appState.has(responseKey)) {
        const authenticator = this.options.appState.get(responseKey);
        const authenticatorPollAction = `${responseKey}-poll`;
        const pollInterval = this.dynamicPollingInterval || authenticator?.poll?.refresh;
        if (_.isNumber(pollInterval)) {
          this.polling = setInterval(()=>{
            this.options.appState.trigger('invokeAction', authenticatorPollAction);
          }, pollInterval >= MIN_POLL_INTERVAL ? pollInterval : MIN_POLL_INTERVAL);
        }
        return true;
      } else {
        return false;
      }
    });
  },

  _startRemediationPolling() {
    const pollInterval = this.dynamicPollingInterval || this.fixedPollingInterval;
    if (_.isNumber(pollInterval)) {
      this.polling = setInterval(() => {
        this.options.appState.trigger('saveForm', this.model);
      }, pollInterval >= MIN_POLL_INTERVAL ? pollInterval : MIN_POLL_INTERVAL);
    }
  },

  stopPolling() {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }
};
