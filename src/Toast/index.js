import React from 'react';
import './styles.scss';

const Toast = () => (
  <div class="container-for-toast-message success-toast">
    <div class="close">
      <p>X</p>
    </div>
    <div class="inner-content">
      <p class="text">Successfully logged in</p>
    </div>
    <div class="indicator">
      <div class="progress-indicator"></div>
    </div>
  </div>
);

export default Toast;
