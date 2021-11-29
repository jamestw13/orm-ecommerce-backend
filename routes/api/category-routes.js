const router = require('express').Router();
const {Category, Product} = require('../../models');

// The `/api/categories` endpoint

// get all categories
router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    attributes: ['id', 'category_name'],
    // be sure to include its associated Products
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    ],
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({message: 'No category data found'});
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one category
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'category_name'],
    // be sure to include its associated Products
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    ],
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({message: 'No category data found for that ID'});
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a new category
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      category_name: "Tools"
    }
  */
  Category.create(req.body, {
    category_name: req.body.category_name,
  })
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update category
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    req.body,
    {
      where: {
        id: req.params.id,
      },
    },
    {
      category_name: req.body.category_name,
    }
  )
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a category
router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({message: 'No category data found for that ID'});
        return;
      }
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
