import Tooltip from 'tether-tooltip';
import 'styles/components/tooltip.scss';

export default class {
  onCreated() {
    this._loadTooltip();
  }

  checkTooltip() {
    this._loadTooltip();
  }

  _loadTooltip() {
    this.tooltips = Array.prototype.slice.call(document.querySelectorAll('.js-tooltip:not([data-tooltip-load])'), 0);

    this.tooltips.forEach(tooltip => {
      new Tooltip({
        target: tooltip,
        content: tooltip.getAttribute('data-tooltip-text'),
        classes: 'c-tooltip',
        position: 'bottom left'
      });

      /*new Tooltip(tooltip, {
        title: tooltip.getAttribute('data-tooltip-text'),
        trigger: 'click',
        template: '<div	class="c-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      });*/
      tooltip.setAttribute('data-tooltip-load', '1');
    });
  }
}
