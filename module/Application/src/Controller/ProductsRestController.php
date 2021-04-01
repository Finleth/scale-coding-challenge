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

    /**
     * GET /products[?limit=25][&page=0][&sort=id]
     * 
     * Returns a list of filtered and sorted products
     * 
     * @return JsonModel
     */
    public function getList()
    {
        $params = $this->params()->fromQuery();

        $limit = isset($params['limit']) ? $params['limit'] : 25;
        $page = isset($params['page']) ? ($params['page'] * $limit) : 0;
        $sort = isset($params['sort']) ? $params['sort'] : 'id';

        $sortDirection = strpos($sort, '-') === 0 ? 'DESC' : 'ASC';
        $sort = preg_replace('/^-/', '', $sort);

        $products = $this->productsTable->getProducts(
            $limit,
            $page,
            $sort,
            $sortDirection
        );

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