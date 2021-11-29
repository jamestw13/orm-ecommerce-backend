// import important parts of sequelize library
const {Model, DataTypes} = require('sequelize');
// import our database connection from connection.js
const sequelize = require('../config/connection.js');

// Initialize Category model (table) by extending the Model class
class Category extends Model {}

// Setup up fields and rules for Category model
Category.init(
  {
    id: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
