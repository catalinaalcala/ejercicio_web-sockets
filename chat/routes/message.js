var express = require("express");
var router = express.Router();

const Joi = require("joi");
const Message = require("../models/message");

router.get("/", function (req, res, next) {
  Message.findAll().then((result) => {
    res.send(result);
  });
});

router.post("/", function (req, res, next) {
  const { error } = validateMessage(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Message.create({ message: req.body.message, author: req.body.author, ts: req.body.ts }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.get("/:ts", (req, res) => {
  Message.findByPk(req.params.ts).then((response) => {
    if (response === null)
      return res
        .status(404)
        .send("The message with the given ts was not found.");
    res.send(response);
  });
});

router.post("/", (req, res) => {
  const { error } = validateMessage(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Message.create({ message: req.body.message, author: req.body.author, ts: req.body.ts }).then(
    (result) => {
      res.send(result);
    }
  );
});

router.put("/", (req, res) => {
  const { error } = validateMessage(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  Message.update(req.body, { where: { ts: req.body.ts } }).then((response) => {
    if (response[0] !== 0) res.send({ message: "Message updated" });
    else res.status(404).send({ message: "Message was not found" });
  });
});

router.delete("/:ts", (req, res) => {
  Message.destroy({
    where: {
      ts: req.params.ts,
    },
  }).then((response) => {
    if (response === 1) res.status(204).send();
    else res.status(404).send({ message: "Message was not found" });
  });
});

const validateMessage = (message) => {
  const schema = Joi.object({
    message: Joi.string().min(1).required(),
    author: Joi.string().email().required(),
    ts: Joi.string().min(1).required()
  });

  return schema.validate(message);
};

module.exports = router;