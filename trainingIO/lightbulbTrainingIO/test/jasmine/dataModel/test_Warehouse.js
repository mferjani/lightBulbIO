/*
 * Copyright 2009-2018 C3 IoT, Inc. All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret
 * and proprietary information of C3 IoT and its licensors. Reproduction, use and/or distribution
 * of this material in any form is strictly prohibited except as set forth in a written
 * license agreement with C3 IoT and/or its authorized distributors.
 * This product may be covered by one or more U.S. patents or pending patent applications.
 */

var filename = 'test_Warehouse';

describe(filename, function () {
  beforeAll(function () {
    var now = DateTime.now();
    this.ctx = TestApi.createContext(filename);

    this.warehouses = TestApi.createBatchEntity(this.ctx, 'Warehouse', [{
      holdingCostPerBulbPerDay: 5,
    },
    {}]);

    this.building = TestApi.createEntity(this.ctx, 'Building', {
      warehouse: this.warehouses[0],
    });

    this.apartments = TestApi.createBatchEntity(this.ctx, 'Apartment', [{
      building: this.building
    },
    {
      building: this.building
    }]);
    this.fixtures = TestApi.createBatchEntity(this.ctx, 'Fixture', [{
      apartment: this.apartments[0],
    },
    {
      apartment: this.apartments[1],
    }]);

    this.smartBulb = TestApi.createEntity(this.ctx, 'SmartBulb');

    this.smartBulbToFixtureRelation = TestApi.createEntity(this.ctx, 'SmartBulbToFixtureRelation', {
      from: this.smartBulb,
      to: this.fixtures[0],
    });

    TestApi.createBatchEntity(this.ctx, 'Order', [{
      parent: this.warehouses[0],
      timestamp: now.plusDays(-1),
      promisedDeliveryDate: now.plusDays(5),
      quantity: 5,
    },
    {
      parent: this.warehouses[0],
      timestamp: now.plusDays(-6),
      promisedDeliveryDate: now.plusDays(-3),
      quantity: 7,
    },
    {
      parent: this.warehouses[0],
      timestamp: now.plusDays(-2),
      promisedDeliveryDate: now.plusDays(7),
      quantity: 2,
    },
    {
      parent: this.warehouses[0],
      timestamp: now.plusDays(-10),
      promisedDeliveryDate: now.plusDays(-4),
      quantity: 1,
    }]);

    this.warehouseMovementSerieses = TestApi.createBatchEntity(this.ctx, 'WarehouseMovementSeries', [{
      warehouse: this.warehouses[0],
      movementCategory: WarehouseMovementCategory.DEPARTURE,
    },
    {
      warehouse: this.warehouses[0],
      movementCategory: WarehouseMovementCategory.ARRIVAL,
    }]);

    TestApi.createBatchEntity(this.ctx, 'WarehouseMovement', [{
      parent: this.warehouseMovementSerieses[1],
      quantity: 10,
      start: '2018-01-02',
    },
    {
      parent: this.warehouseMovementSerieses[0],
      quantity: -5,
      start: '2018-01-03',
    },
    {
      parent: this.warehouseMovementSerieses[1],
      quantity: 20,
      start: '2018-01-04',
    },
    {
      parent: this.warehouseMovementSerieses[1],
      quantity: 5,
      start: '2018-01-05',
    }]);

    TestApi.waitForSetup(this.ctx, null, 1, 30);
  });

  afterAll(function () {
    TestApi.teardown(this.ctx);
  });

  it('verify Warehouse.currentInventory', function () {
    var warehouse = Warehouse.get(this.warehouses[0], 'currentInventory, holdingCostPerDay, pendingArrivals, lightBulbsInUse');
    expect(warehouse.currentInventory).toEqual(30);
    expect(warehouse.holdingCostPerDay).toEqual(150);
    expect(warehouse.pendingArrivals).toEqual(7);
    expect(warehouse.lightBulbsInUse).toEqual(1);
  });

  it('verify Warehouse.getAggregatedValues', function () {
    var result = Warehouse.getAggregatedValues(['currentInventory', 'holdingCostPerDay', 'lightBulbsInUse']);

    expect(result['currentInventory']).toEqual(30);
    expect(result['holdingCostPerDay']).toEqual(150);
    expect(result['lightBulbsInUse']).toEqual(1);
  });
});
