const router = require('express').Router();
const {Tag, Product, ProductTag} = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: ['id', 'tag_name'],
    // be sure to include its associated Product data
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
        as: 'product_tags',
      },
    ],
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({message: 'No tag data found'});
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one tag
router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    // be sure to include its associated Product data
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
        as: 'product_tags',
      },
    ],
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({message: 'No tag data found for that ID'});
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new tag
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      tag_name: "Vintage"
      productIds: [1, 2, 3, 4]
    }
  */
  Tag.create(req.body)
    .then(tagData => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map(product_id => {
          return {
            tag_id: tagData.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status.json(tagData);
    })
    .then(productTagIds => res.status(200).json(productTagIds))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update tag
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(tag => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({where: {tag_id: req.params.id}});
    })
    .then(productTags => {
      // get list of current product_ids
      const productTagIds = productTags.map(({product_id}) => product_id);
      // create filtered list of new product_ids
      const newProductTags = req.body.productIds
        .filter(product_id => !productTagIds.includes(product_id))
        .map(product_id => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({product_id}) => !req.body.productIds.includes(product_id))
        .map(({id}) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({where: {id: productTagsToRemove}}),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then(updatedProductTags => res.json(updatedProductTags))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({message: 'No tag data found for that ID'});
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
