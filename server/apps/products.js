import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const products = await collection.find({}).toArray();
  return res.json({
    data: products,
  });
});

productRouter.get("/:Id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.Id);
  const products = await collection.find({ _id: productId }).toArray();
  return res.json({
    data: products,
  });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body };
  const products = await collection.insertOne(productData);
  return res.json({
    message: "Product has been created successfully",
  });
});

productRouter.put("/:Id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.Id);
    const newProductData = { ...req.body };
    await collection.updateOne({ _id: productId }, { $set: newProductData });
    return res.json({
      message: "Product has been updated successfully",
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

productRouter.delete("/:Id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.Id);
    await collection.deleteOne({ _id: productId });
    return res.json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default productRouter;
