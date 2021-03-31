<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class ProductsRestController extends AbstractRestfulController
{
    /**
     * @var \Application\Model\ProductsTable
     */
    protected $productsTable;

    public function __construct(array $config, \Application\Model\ProductsTable $productsTable)
    {
        $this->config        = $config;
        $this->productsTable = $productsTable;
    }

    public function getList()
    {
        $products = $this->productsTable->getProducts();

        return new JsonModel(['data' => $products]);
    }

    public function get($id)
    {
        return new JsonModel([
            'success' => true
        ]);
    }

    public function create($data)
    {
        return new JsonModel([
            'success' => true
        ]);
    }

    public function update($id, $data)
    {
        return new JsonModel([
            'success' => true
        ]);
    }

    public function delete($id)
    {
        return new JsonModel([
            'success' => true
        ]);
    }
}