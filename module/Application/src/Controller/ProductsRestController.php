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
        $response = [];

        $product = $this->productTable->getProduct((int) $id);

        if ($product) {
            $response = $product;
        } else {
            $response['error'] = 'Could not find product ID ' . $id;
        }

        return new JsonModel($response);
    }

    /**
     * The handler for the POST /products endpoint
     * 
     * @param array Contains a name, description, and price for
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

    /**
     * The handler for the PUT /products/{id} endpoint
     * 
     * @param integer The unique identifier for a product
     * @param array   Contains a name, description, and/or price to
     *                update on a product.
     * 
     * @return JsonModel
     */
    public function update($id, $data)
    {
        $response = [];

        $validatedProduct = $this->productTable->validateProductArray($data);
        
        if (!$validatedProduct['valid']) {
            $response['error'] = $validatedProduct['errors'];
        } else {
            $product = $this->productTable->getProduct((int) $id);
            
            if ($product) {
                try {
                    $updated = $this->productTable->updateProduct($id, $data);

                    if ($updated) {
                        // updating values from original $product isntead of running
                        // a select on the database to get the updated record
                        foreach ($updated as $field => $value) {
                            $product[$field] = $value;
                        }
                    }

                    $response = $product;
                } catch (\Exception $e) {
                    $response['error'] = 'There was an issue updating the product.';
                }
            } else {
                $response['error'] = 'Product not found.';
            }
        }
        
        return new JsonModel($response);
    }

    /**
     * The handler for the DELETE /products/{id} endpoint
     * 
     * @param integer The unique identifier for a product
     * 
     * @return JsonModel
     */
    public function delete($id)
    {
        $response = [];

        $deleted = $this->productTable->deleteProduct((int) $id);

        if (!$deleted) {
            $response['error'] = 'Product not found.';
        }

        return new JsonModel($response);
    }
}