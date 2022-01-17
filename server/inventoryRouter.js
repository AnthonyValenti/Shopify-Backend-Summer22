const router = require("express").Router();
let Inventory = require("./inventory.model");

router.route('/').get((req, res) => {
  Inventory.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/add').post((req, res) => {
  const serial = req.body.serial;
  const name = req.body.name;
  const price = Number(req.body.price).toFixed(2);
  const stock = Number(req.body.stock);

  const newItem = new Inventory({
    serial,
    name,
    price,
    stock,
  });

  newItem.save()
    .then(() => res.json("Item added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:serial").get((req, res) => {
  Inventory.findOne({serial: req.params.serial})
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:serial").delete((req, res) => {
  Inventory.findOneAndDelete(req.params.serial)
    .then(() => res.json("Item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:serial").post((req, res) => {
  Inventory.findOne({serial: req.params.serial})
    .then((item) => {
      item.serial = req.body.serial;
      item.name = req.body.name;
      item.price = Number(req.body.price).toFixed(2);
      item.stock = Number(req.body.stock);

      item.save()
        .then(() => res.json("Item updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});





module.exports= router;
