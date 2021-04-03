<?php

namespace Application\Model;

use Zend\Db\TableGateway\TableGateway;
use Zend\Db\Sql\Select;

class ProductTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    /**
     * Select, filter, and sort a list of products
     * 
     * @param integer $limit
     * @param integer $page
     * @param string  $sort
     * @param string  $sortDirection
     * 
     * @return array  $rows
     */
    public function getProducts(
        int    $limit = 25,
        int    $page = 0,
        string $sort = 'id',
        string $sortDirection = 'ASC'
    ) {
        switch ($sort) {
            case 'id':
            case 'name':
            case 'description':
            case 'price':
                $sortDirection = in_array($sortDirection, ['ASC', 'DESC']) ? $sortDirection : 'ASC';
                $order = $sort . ' ' . $sortDirection;
                break;
            default:
                return false;
        }

        $select = $this->tableGateway->getSql()->select();

        // allow for a fetch all when limit = 0
        if ($limit !== 0) {
            $select->order($order);
            $select->limit($limit);
            $select->offset($page);
        }

        $rowset = $this->tableGateway->selectWith($select);

        $rows = [];
        foreach ($rowset as $row) {
            $rows[] = $row->toArray();
        }

        return $rows;
    }

    /**
     * Gets a single product by ID
     * 
     * @param integer The unique identifier for a product
     * 
     * @return array
     */
    public function getProduct(int $id)
    {
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row = $rowset->current();

        $product = $row ? $row->toArray() : null;

        return $product;
    }

    /**
     * Takes an instance of a Product model and inserts it
     * into the products table.
     * 
     * @param Product a Product class with the data for 
     *                 the product to be created.
     * 
     * @return array
     */
    public function createProduct(Product $product)
    {
        $data = $product->toArray();

        $this->tableGateway->insert($data);

        $data['id'] = (int) $this->tableGateway->lastInsertValue;

        return $data;
    }

    /**
     * Takes a product ID and at least one field/value to update
     * 
     * @param integer
     * @param array
     * 
     * @return array
     */
    public function updateProduct(int $id, array $data)
    {
        $set = [];

        if (isset($data['name'])) {
            $set['name'] = $data['name'];
        }
        if (isset($data['description'])) {
            $set['description'] = $data['description'];
        }
        if (isset($data['price'])) {
            $set['price'] = $data['price'];
        }

        $success = $this->tableGateway->update($set, ['id' => $id]);

        return $success ? $set : $success;
    }

    /**
     * Deletes a product by ID from the database
     * 
     * @param integer The unique identifier for a product
     * 
     * @return boolean
     */
    public function deleteProduct(int $id)
    {
        $success =$this->tableGateway->delete(['id' => $id]);

        return $success;
    }

    /**
     * Takes an array of product values and returns true/false
     * if the values are valid and meet the "required" criteria.
     * 
     * Returns a list of errors if the validation doesn't pass.
     * 
     * @param array
     * @param boolean
     * 
     * @return array
     */
    public function validateProductArray(array $product, $requireAllFields = false)
    {
        $response = [
            'valid' => true,
            'errors' => []
        ];

        // we require at least one field for updates
        if (!$requireAllFields
            && !isset($product['name'])
            && !isset($product['description'])
            && !isset($product['price'])
        ) {
            $response['valid'] = false;
            $response['errors'][] = 'At least one of the "name", "description" or "price" fields is required.';
        }

        if (isset($product['name']) && $product['name'] !== '') {
            if (strlen($product['name']) > 255) {
                $response['valid'] = false;
                $response['errors'][] = 'Please keep the "name" under 255 characters long.';
            }
        } elseif ($requireAllFields) {
            $response['valid'] = false;
            $response['errors'][] = 'The "name" field is required.';
        }

        if (isset($product['description']) && $product['description'] !== '') {
            if (strlen($product['description']) > 400) {
                $response['valid'] = false;
                $response['errors'][] = 'Please keep the "description" under 400 characters long.';
            }
        } elseif ($requireAllFields) {
            $response['valid'] = false;
            $response['errors'][] = 'The "description" field is required.';
        }

        if (isset($product['price']) && $product['price'] !== '') {
            if ($product['price'] < 0) {
                $response['valid'] = false;
                $response['errors'][] = 'The price cannot be negative.';
            }
        } elseif ($requireAllFields) {
            $response['valid'] = false;
            $response['errors'][] = 'The "price" field is required.';
        }
        
        return $response;
    }
}