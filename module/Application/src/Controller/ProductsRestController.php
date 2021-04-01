<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;
use Application\Model\Product;

class ProductsRestController extends AbstractRestfulController
{
    /**
     * @var \Application\Model\ProductTable
     */
    protected $productsTable;

    public function __construct(array $config, \Application\Model\ProductTable $productTable)
    {
        $this->config        = $config;
        $this->productTable = $productTable;
    }

    /**
     * The handler for the GET /products[?limit=25][&page=0][&sort=id] endpoint
     * 
     * Returns a list of filtered and sorted products
     * 
     * @return JsonModel An array of product objects
     */
    public function getList()
    {
        $params = $this->params()->fromQuery();

        $limit = isset($params['limit']) ? $params['limit'] : 25;
        $page = isset($params['page']) ? ($params['page'] * $limit) : 0;
        $sort = isset($params['sort']) ? $params['sort'] : 'id';

        $sortDirection = strpos($sort, '-') === 0 ? 'DESC' : 'ASC';
        $sort = preg_replace('/^-/', '', $sort);

        $products = $this->productTable->getProducts(
            $limit,
            $page,
            $sort,
            $sortDirection
        );

        return new JsonModel(['data' => $products]);
    }

    /**
     * The handler for the GET /products/{id} endpoint
     * 
     * @param int The unique identifier for a product 
     * 
     * @return JsonModel A product object
     */
    public function get($id)
    {
        $product = $this->productTable->getProduct((int) $id);

        return new JsonModel($product);
    }

    /**
     * The handler for the POST /products endpoint
     * 
     * @param array contains a name, description, and price for
     *              a new product.
     *                     
     * @return JsonModel A product object
     */
    public function create($data)
    {
        $response = [];

        $validatedProduct = $this->productTable->validateProductArray($data, true);
        
        if (!$validatedProduct['valid']) {
            $response['error'] = $validatedProduct['errors'];
        } else {
            $product = new Product();
            $product->exchangeArray($data);
            
            try {
                $response = $this->productTable->createProduct($product);
            } catch (\Exception $e) {
                $response['error'] = 'There was an issue creating the product.';
            }
        }
        
        return new JsonModel($response);
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