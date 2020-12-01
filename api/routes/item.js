var express = require("express");
const { Item, updateItem, getItemList } = require("../db/models/item");
var router = express.Router();
const { addItem, generateItemJSON } = require("../db/models/item");
const { getTrip, addTrip, updateTrip } = require("../db/models/trip");

// Shouldn't need to specify Personal and Group Items,
// the database doesn't care, the boolean only determines whether or not
// the data is shown.

router.post("/getItem", function (req, res, next) {
  res.send("Not Implemented!");
});

router.post("/getItems", function (req, res, next) {
  res.send("Not Implemented!");
});

router.post("/getItemsList", function (req, res, next) {
  handleGetItems = (items) => {
    let personalItems = [];
    let groupItems = [];
    let itemsLength = Object.keys(items).length;
    for (let i = 0; i < itemsLength; i++) {
      if (!items[i].isPublic && items[i].assignee === req.body.travelerId) {
        personalItems.push(items[i]);
      }
      else if (items[i].isPublic) {
        groupItems.push(items[i]);
      }
    }
    res.json({ personalItems, groupItems });
  };
  getItemList(req.body.itemIds, handleGetItems);
});

router.put("/addItem", function (req, res, next) {
  console.log(req.body);
  // Generates random ID
  function generateId(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
  // Generate item ID
  const id = "item_".concat(
    generateId(
      16,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
  );
  console.log(id);
  // Generate item JSON
  const data = generateItemJSON(
    id,
    req.body.tripId,
    req.body.travelerId,
    req.body.itemName,
    req.body.assignedTraveler,
    req.body.itemDescription,
    req.body.isPublic,
    req.body.isComplete,
  );
  // Add item to database
  handleAddItem = (error) => {};
  addItem(data, handleAddItem);
  // Add item to Trip Object
  handleUpdateTrip = (error) => {
    if (error) res.sendStatus(401);
    else res.sendStatus(200);
  };
  handleGetTrip = (trip) => {
    if (trip) {
      let newItemIds = [];
      if (trip.itemIds) newItemIds = trip.itemIds;
      newItemIds.push(id);
      trip.itemIds = newItemIds;
      updateTrip(trip, handleUpdateTrip);
    }
  };
  getTrip(req.body.tripId, handleGetTrip);
});

router.post("/editItem", function (req, res, next) {
  res.send("Not Implemented!");
});

router.delete("/deleteItem", function (req, res, next) {
  res.send("Not Implemented!");
});

router.post("/checkoffItem", function (req, res, next) {
  res.send("Not Implemented!");
});

router.post("/sendReminder", function (req, res, next) {
  res.send("Not Implemented!");
});

module.exports = router;
