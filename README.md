# Scale Fullstack Developer Assessment

Product CRUD application built for the Scale Media technical coding challenge. Used Zend Framework for the application with a MySQL database run locally using MAMP.

## Notes

This application made use of the Zend RESTful abstract controller interface to create the API portion per the project specifications. The other option would have been to use the action controller to handle the product page(s) which would have been more centered around a single page per action (create, read, delete, etc.) and wouldn't have followed the backend requirements.

For the frontend I still used Zend, making use of the default index.phtml page which is served via the index action controller. It's a single page with JavaScript/jQuery handling the dynamic updating of the DOM.

For a list of to-dos and things I'd like to update/enhance in the future, see the [Future Tasks](#future-tasks) section.

## Getting Started

These instructions assume you've already downloaded/forked this repository and have it on your local machine.

### Install Dependencies

Within the project root directory, run the following command:

```
composer install
```

If you don't have composer installed or are using version ^2, you can run this instead:

```
php composer.phar install
```

### Set Up Database

Once the dependencies have been installed, next we will need to set up the database. As mentioned earlier, I used the MySQL database that comes with MAMP. Use whatever you have/you're comfortable setting up (as long as it's MySQL). Once you have a database available for use, run the `migration.sql` script found in the project root directory.

### Add Configurations

Now that we've got the database set up with our table, it's time to add our database configuration file. In the `config/autoload` folder, create a new file called `database.local.php` based off of the `database.local.dist.php`. Add your MySQL username, password, host, database, and port (if required).

### Start Server

This last step is up to you on how you want to run this application. If you use MAMP, then just set the web server folder to the `public` folder of this repository and start the server. If you use Vagrant or Docker then you may have to make updates to the DockerFile/VagrantFile to get it to start up.

Now that you have your server running, go to your localhost (on whichever port it your server is running) and play around!

## Future Tasks

My focus while coding this project was to get the main aspects up and running with a semi-usable interface. As such, I'm aware there are plenty of areas for improvement.

Here are some of the areas I've personally noted that I'd like to add and enhance:

- Backend error handling: There currently is a lack of handling and logging of errors in the API endpoints
- Backend response statuses: I have responses being returned as 200 but with an error message. In the future I'd set up the Zend so I could properly send status codes for the correct successes/errors
- Unit tests: I would like to get at least the API endpoints covered under unit tests
- Frontend actions: The actions (especially delete) don't have any tooltip or warning. I would add some plugins to handle that (and add a confirmation to the delete)
- Frontend table loading: At the moment, on create or delete, I reload the entire table (with the filters). The reason is so the fitlering and sorting is handled when updating the rows. For efficiency, it would be best to update the table entirely on the frontend on create/delete and calculate where the row should be inserted or which row should be added after a delete.
- Create a more fluid filtering/sorting system with proper pagination.