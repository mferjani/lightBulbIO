function getAggregatedValues(fields) {
  var res = c3Make('map<string, int>');

  fields.each(function (field) {
    res.set(field, 0);
  });

  Warehouse.fetchObjStream({include: fields.join(',')}).forEach(function (obj) {
    fields.each(function (field) {
      res.set(field, res.get(field) + (obj[field] || 0));
    });
  });

  return res;
}
