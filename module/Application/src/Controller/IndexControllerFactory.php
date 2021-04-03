<?php
namespace Application\Controller;

use Zend\ServiceManager\Factory\FactoryInterface;
use Interop\Container\ContainerInterface;

class IndexControllerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $productTable = $container->get('Application\Model\ProductTable');

        return new IndexController($productTable);
    }
}