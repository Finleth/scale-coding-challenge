<?php

return [
    'db' => array(
        'username'       => '',
        'password'       => '',
        'driver'         => 'Pdo',
        'dsn'            => 'mysql:dbname=<database name>;host=<database host>;port=3306',
        'driver_options' => array(
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
        ),
    ),
];