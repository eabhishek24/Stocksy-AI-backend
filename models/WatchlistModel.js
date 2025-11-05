const { model } = require("mongoose");

const { OrderSchema } = require("../schema/OrderSchema");

const OrderModel = new model("order", OrderSchemaSchema);

model.exports = { OrderModel };