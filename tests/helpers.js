//FIXME this might not be needed in this test
const unwrapResponse = data => {
  if(data['@context']) {
    return data;
  }
  // if the response.data is not directly jsonld unwrap it
  for(const key of Object.keys(data)) {
    const prop = data[key];
    // recurse through each key looking for jsonld
    const jsonld = unwrapResponse(prop);
    // when we find the first context that should be the VC
    if(jsonld) {
      return jsonld;
    }
  }
  return false;
};

/**
 * Takes in a Map and a predicate and returns a new Map
 * only returning key value pairs that are true.
 *
 * @param {object} options - Options to use.
 * @param {Map} options.map - A Map.
 * @param {Function<boolean>} options.predicate - A function to
 * filter the map's entries on.
 *
 * @returns {Map} Returns a map.
 */
const filterMap = ({map, predicate}) => {
  const filtered = new Map();
  for(const [key, value] of map) {
    const result = predicate({key, value});
    if(result === true) {
      filtered.set(key, value);
    }
  }
  return filtered;
};

const deepClone = json => JSON.parse(JSON.stringify(json));

module.exports = {
  deepClone,
  unwrapResponse,
  filterMap
};
