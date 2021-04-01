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

        $select->order($order);
        $select->limit($limit);
        $select->offset($page);

        $rowset = $this->tableGateway->selectWith($select);

        $rows = [];
        foreach ($rowset as $row) {
            $rows[] = $row->toArray();
        }

        return $rows;
    }

    /**
     * Takes an instance of a Product model and inserts
     * it into the products table.
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

        if (isset($product['name'])) {
            if (strlen($product['name']) > 255) {
                $response['valid'] = false;
                $response['errors'][] = 'Please keep the "name" under 255 characters long.';
            }
        } elseif ($requireAllFields) {
            $response['valid'] = false;
            $response['errors'][] = 'The "name" field is required.';
        }

        if (isset($product['description'])) {
            if (strlen($product['description']) > 400) {
                $response['valid'] = false;
                $response['errors'][] = 'Please keep the "description" under 400 characters long.';
            }
        } elseif ($requireAllFields) {
            $response['valid'] = false;
            $response['errors'][] = 'The "description" field is required.';
        }

        if (isset($product['price'])) {
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