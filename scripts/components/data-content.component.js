import SelectorItemsTemplate from 'ejs!templates/data/selector-items.ejs';
import {
  getURLFromParams,
  GET_DATA_DOWNLOAD_FILE
} from 'utils/getURLFromParams';
export default class {
  onCreated() {
    this._setVars();
    this.downloadButton.addEventListener('click', () => this._downloadFile());
  }

  _setVars() {
    this.el = document.querySelector('.c-custom-dataset');
    this.downloadButton = this.el.querySelector('.js-custom-dataset-download-button');
    this.selectorCountries = this.el.querySelector('.js-custom-dataset-selector-countries');
    this.selectorCommodities = this.el.querySelector('.js-custom-dataset-selector-commodities');
    this.selectorYears = this.el.querySelector('.js-custom-dataset-selector-years');
    this.selectorCompanies = this.el.querySelector('.js-custom-dataset-selector-companies');
    this.selectorConsumptionCountries = this.el.querySelector('.js-custom-dataset-selector-consumption-countries');
    this.selectorIndicators = this.el.querySelector('.js-custom-dataset-selector-indicators');
    this.selectorOutputType = this.el.querySelector('.js-custom-dataset-selector-output-type');
    this.selectorFormatting = this.el.querySelector('.js-custom-dataset-selector-formatting');
    this.selectorFile = this.el.querySelector('.js-custom-dataset-selector-file');
  }

  fillContexts(contexts) {
    this.contexts = contexts;
    const items = contexts
      .map(context => ({
        id: context.countryId,
        name: context.countryName.toLowerCase(),
        group: 'countries',
        noSelfCancel: true
      }))
      .filter((elem, index, self) => self.findIndex((t) => {
        return t.id === elem.id;
      }) === index);
    this.selectorCountries.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorCountries);
    this._setSelectorEvents(this.selectorYears);
    this._setSelectorEvents(this.selectorOutputType);
    this._setSelectorEvents(this.selectorFormatting);
    this._setSelectorEvents(this.selectorFile);
  }

  fillExporters(exporters) {
    const items = exporters.map(exporter => ({
      id: exporter.id,
      name: exporter.name.toLowerCase(),
      group: 'companies',
      noSelfCancel: false
    }));
    this.selectorCompanies.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorCompanies);
  }

  fillConsumptionCountries(consumptionCountries) {
    const items = consumptionCountries.map(country => ({
      id: country.id,
      name: country.name.toLowerCase(),
      group: 'consumption-countries',
      noSelfCancel: false
    }));
    this.selectorConsumptionCountries.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorConsumptionCountries);
  }

  fillIndicators(indicators) {
    const items = indicators.map(indicator => ({
      id: indicator.name,
      name: `${indicator.frontendName}${indicator.unit !== null ? `(${indicator.unit})` : ''}`,
      group: 'indicators',
      noSelfCancel: false
    }));
    this.selectorIndicators.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this._setSelectorEvents(this.selectorIndicators);
  }

  _downloadFile() {
    window.open(this._getDownloadURL());
  }

  _getDownloadURL() {
    const contextId = this.selectorCommodities.querySelector('.c-radio-btn.-enabled').getAttribute('value');
    const fileRadio = this.selectorFile.querySelector('.c-radio-btn.-enabled');
    const file = fileRadio.getAttribute('value');
    const outputType = this.selectorOutputType.querySelector('.c-radio-btn.-enabled').getAttribute('value');
    let params = {
      context_id: contextId
    };

    const years = Array.prototype.slice.call(this.selectorYears.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn.-enabled'), 0);
    if (years.length > 0) {
      params.years = years.map(item => item.getAttribute('value'));
    }
    const exporters = Array.prototype.slice.call(this.selectorCompanies.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn.-enabled'), 0);
    if (exporters.length > 0) {
      params.exporters_ids = exporters.map(item => item.getAttribute('value'));
    }
    const consumptionCountries = Array.prototype.slice.call(this.selectorConsumptionCountries.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn.-enabled'), 0);
    if (consumptionCountries.length > 0) {
      params.countries_ids = consumptionCountries.map(item => item.getAttribute('value'));
    }
    const indicators = Array.prototype.slice.call(this.selectorIndicators.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn.-enabled'), 0);
    if (indicators.length > 0) {
      params.indicators = indicators.map(item => item.getAttribute('value'));
    }
    if (file === '.csv') {
      params.separator = fileRadio.getAttribute('data-separator-type');
    }
    params[outputType] = 1;

    return getURLFromParams(GET_DATA_DOWNLOAD_FILE, params).replace('?', `${file}?`);
  }

  _setSelectorEvents(selector) {
    const radios = Array.prototype.slice.call(selector.querySelectorAll('.c-radio-btn'), 0);
    radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });
  }

  _onToggleRadio(e) {
    const selectedRadio = e && e.currentTarget;
    if (!selectedRadio) return;
    const container = selectedRadio.closest('li');
    const value = selectedRadio.getAttribute('value');
    const group = selectedRadio.getAttribute('data-group');
    const allClosest = this.el.querySelector(`.c-radio-btn[data-group="${group}-all"]`);
    const isEnabled = selectedRadio.classList.contains('-enabled');

    switch (group) {
      case 'countries':
        this._cleanRadios(this.selectorCountries);
        this._updateSelectorCommodities(value);
        break;
      case 'commodities':
        this.callbacks.onContextSelected(value);
        break;
      case 'years':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'years-all':
        if (this.selectorYears.classList.contains('-disabled')) return;
        if (isEnabled) {
          this._cleanRadios(this.selectorYears);
        } else {
          this._selectAllRadios(this.selectorYears);
        }
        break;
      case 'companies':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'companies-all':
        if (this.selectorCompanies.classList.contains('-disabled')) return;
        if (isEnabled) {
          this._cleanRadios(this.selectorCompanies);
        } else {
          this._selectAllRadios(this.selectorCompanies);
        }
        break;
      case 'consumption-countries':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'consumption-countries-all':
        if (this.selectorConsumptionCountries.classList.contains('-disabled')) return;
        if (isEnabled) {
          this._cleanRadios(this.selectorConsumptionCountries);
        } else {
          this._selectAllRadios(this.selectorConsumptionCountries);
        }
        break;
      case 'indicators':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'indicators-all':
        if (this.selectorIndicators.classList.contains('-disabled')) return;
        if (isEnabled) {
          this._cleanRadios(this.selectorIndicators);
        } else {
          this._selectAllRadios(this.selectorIndicators);
        }
        break;
      case 'output-type':
        this._cleanRadios(this.selectorOutputType);
        break;
      case 'formatting':
        this._cleanRadios(this.selectorFormatting);
        break;
      case 'file':
        this._cleanRadios(this.selectorFile);
        break;
    }
    selectedRadio.classList.toggle('-enabled');
    container.classList.toggle('-selected');
    this._checkDependentSelectors();
  }

  _cleanRadios(selector) {
    const radios = Array.prototype.slice.call(selector.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn'), 0);
    radios.forEach((radio) => {
      radio.classList.remove('-enabled');
      radio.closest('li').classList.remove('-selected');
    });
  }

  _checkDependentSelectors() {
    const countryRadio = this.selectorCountries.querySelector('.c-radio-btn.-enabled');
    const commodityRadio = this.selectorCommodities.querySelector('.c-radio-btn.-enabled');
    if (countryRadio !== null && commodityRadio !== null) {
      this._showDependentSelectors();
    } else {
      this._hideDependentSelectors();
    }
  }

  _showDependentSelectors() {
    this.selectorYears.classList.remove('-disabled');
    this.selectorCompanies.classList.remove('-disabled');
    this.selectorConsumptionCountries.classList.remove('-disabled');
    this.selectorIndicators.classList.remove('-disabled');
  }

  _hideDependentSelectors() {
    this.selectorYears.classList.add('-disabled');
    this.selectorCompanies.classList.add('-disabled');
    this.selectorConsumptionCountries.classList.add('-disabled');
    this.selectorIndicators.classList.add('-disabled');
  }

  _selectAllRadios(selector) {
    const radios = Array.prototype.slice.call(selector.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn:not(.-disabled)'), 0);
    radios.forEach((radio) => {
      radio.classList.add('-enabled');
      radio.closest('li').classList.add('-selected');
    });
  }

  _updateSelectorCommodities(country) {
    const items = this.contexts
      .filter(context => context.id === parseInt(country))
      .map(context => ({
        id: context.id,
        name: context.commodityName.toLowerCase(),
        group: 'commodities',
        noSelfCancel: false
      }));
    this.selectorCommodities.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorItemsTemplate({
      items
    });
    this.selectorCommodities.classList.remove('-disabled');
    this._setSelectorEvents(this.selectorCommodities);
  }
}
