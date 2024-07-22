'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User);
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Product Name is Required`,
        },
        notEmpty: {
          msg: `Product Name is Required`
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Product Description is Required`,
        },
        notEmpty: {
          msg: `Product Description is Required`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Product Price is Required`
        },
        notEmpty: {
          msg: `Product Price is Required`
        },
        min: {
          args: 5000,
          msg: `Minimum Product Price is Rp. 5.000,00`
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER
    },
    imgUrl: {
      type: DataTypes.STRING
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Product Category is Required`
        },
        notEmpty: {
          msg: `Product Category is Required`
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Product Author is Required`
        },
        notEmpty: {
          msg: `Product Author is Required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};