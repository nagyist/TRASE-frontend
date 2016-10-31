import Dropdown from 'scripts/components/dropdown.component';
import 'styles/factsheets.scss';
import AreaStack from 'scripts/components/graphs/area-stack.component';
import 'scripts/components/tables/area-tables';

const _renderAreaStack = () => {
  const el = document.querySelector('.js-municipalities-top');

  new AreaStack({
    el
  });
};

const _renderAreaStackSecond = () => {
  const el = document.querySelector('.js-destination-top');

  new AreaStack({
    el
  });
};

const defaults = {
  exporter: 'Brazil',
  commodity: 'Soy',
};

const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;
};

const exporterDropdown = new Dropdown('exporter', _onSelect);
const commodityDropdown = new Dropdown('commodity', _onSelect);

exporterDropdown.setTitle(defaults.exporter);
commodityDropdown.setTitle(defaults.commodity);

_renderAreaStack();
_renderAreaStackSecond();
