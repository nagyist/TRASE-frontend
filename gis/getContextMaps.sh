#!/usr/bin/env bash

echo -e '// this file is generated by bin/getContextMaps.sh\nexport default' `./bin/cartodb/getContextMaps.js` > scripts/actions/map/context_layers.js