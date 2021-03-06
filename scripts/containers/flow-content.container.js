import connect from 'connect';
import flowContent from 'components/flow-content.component';

const mapMethodsToState = (state) => ({
  toggleMapVisibility: state.app.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible
});

export default connect(flowContent, mapMethodsToState);
