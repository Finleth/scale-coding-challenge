<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    /**
     * @var \Application\Model\ProductTable
     */
    protected $productsTable;

    public function __construct(\Application\Model\ProductTable $productTable)
    {
        $this->productTable = $productTable;
    }

    public function indexAction()
    {
        $products = $this->productTable->getProducts();

        return new ViewModel(['products' => $products]);
    }
}
