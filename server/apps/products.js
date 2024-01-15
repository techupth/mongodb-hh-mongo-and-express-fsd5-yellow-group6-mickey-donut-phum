import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const collection = db.collection("Products");
    const newCategory = req.query.category;
    const productName = req.query.keywords;

    const query = {};

    if (newCategory) {
      query.category = newCategory;
    }

    if (productName) {
      query.name = new RegExp(productName , "i");
    }

    try {
      const products = await collection
        .find(query)
        .sort({ created_at: -1 })
        .toArray();
      return res.json({
        data: products,
      });
    } catch (error) {
      return res.json({
        message: "fail : " + error,
      });
    }

});

productRouter.get("/:id", async (req, res) => {
    const collection = db.collection("Products");
    try {
        const productId = new ObjectId(req.params.id);
        const products = await collection.find({ _id: productId }).toArray();
        return res.json({
            data: products,
        });       
    } catch (error) {
        return res.json({
          message: "fail : " + error,
        });           
    }

});

productRouter.post("/", async (req, res) => {
    const collection = db.collection("Products");

    try {
        await collection.insertOne({
          ...req.body,
          created_at: new Date(),
        });
        return res.json({
          message: "Product has been created successfully",
        });
    } catch (error) {
        return res.json({
          message: "fail : " + error,
        });
    }
});

productRouter.put("/:id", async(req, res) => {

    const collection = db.collection("Products");
    const productId = new ObjectId(req.params.id);
    const newProductData = { ...req.body };

    try {
        await collection.updateOne({ _id: productId }, { $set: newProductData });        
        return res.json({
        message: "Product has been updated successfully",
        });
  } catch (error) {
        return res.json({
          message: "fail : " + error,
        });   
  }
});

productRouter.delete("/:id", async (req, res) => {
    const collection = db.collection("Products");
    try {
        const productId = new ObjectId(req.params.id);
        await collection.deleteOne({ _id: productId });
        return res.json({
        message: "Product has been deleted successfully",
        });    
    } catch (error) {
        return res.json({
          message: "fail : " + error,
        });           
    }
});

export default productRouter;
