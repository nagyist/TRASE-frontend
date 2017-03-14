import connect from 'connect';
import Search from 'components/tooltip.component.js';

const mapMethodsToState = (state) => ({
  checkTooltip: state.app.tooltipCheck,
});

export default connect(Search, mapMethodsToState);
