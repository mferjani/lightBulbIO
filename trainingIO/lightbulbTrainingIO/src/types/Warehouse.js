function getAggregatedValues(fields) {

	var myMap = [];
	
	/*
	fileds.each(function(field)){
		myMap.set(field,0);
	}
	*/
	
	myMap['pendingArrivals'] = 0;
	myMap['lightBulbsInUse'] = 0;
	myMap['currentInventory'] = 0;
	myMap['holdingCostPerDay'] = 0;
	
	var warehouses = Warehouse.fetch({include:'pendingArrivals, lightBulbsInUse, currentInventory, holdingCostPerDay', limit:-1}).objs;
	
    for (var k = 0; k < warehouses.length; k++) {
    	myMap['pendingArrivals'] = myMap['pendingArrivals'] + warehouses[k]['pendingArrivals'];
    	myMap['lightBulbsInUse'] = myMap['lightBulbsInUse'] + warehouses[k]['lightBulbsInUse'];
    	myMap['currentInventory'] = myMap['currentInventory'] + warehouses[k]['currentInventory'];
    	myMap['holdingCostPerDay'] = myMap['holdingCostPerDay'] + warehouses[k]['holdingCostPerDay'];
    }
    
    return myMap;
	  
}
