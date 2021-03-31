<?php
namespace Application\Controller;

use Zend\ServiceManager\Factory\FactoryInterface;
use Interop\Container\ContainerInterface;

class ProductsRestControllerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $config = $container->get('config');
        $productsTable = $container->get('Application\Model\ProductsTable');

        return new ProductsRestController($config, $productsTable);
    }
}