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

module.exports = {
  unwrapResponse
};
