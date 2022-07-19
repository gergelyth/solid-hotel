<div align="center"> <h1>Admin documentation</h1> </div>

<div align="center"> <h2><ins>Launching the applications</h2></ins> </div>

We provide two options to start the applications: manual and Docker.

### <ins>Manual</ins>

1. Clone the repository
```console
> git clone https://github.com/gergelyth/solid-hotel
```
2. Navigate to the common folder and install all dependencies
```console
> cd common
> npm install --force
```
3. Move the created `node_modules` directory one level higher so every subproject can use it
```console
> mv node_modules ..
```
4. (Change environment variables in the `.env` file in the core directory if deviating from default - the changes are synchronized to all subprojects via symbolic linking)
5. Launch the applications - **TODO** verify `run start` work as expected
```console
> cd common & npm run start
> cd gpa & npm run start
> cd pms & npm run start
> cd spe & npm run start
```
6. By default: **TODO** is SPE independent?
    - GPA lives on port **3000** (requires setup project for mock API)
    - SPE lives on port **3001** (independent) 
    - PMS lives on port **3002** (requires setup project for mock API)
    - setup project and mock API lives on port **3003** (independent)

### <ins>Docker</ins>

**TODO** need to fix docker duplication

<div align="center"> <h2><ins>Solid Pod setup</h2></ins> </div>

1. Navigate to the index page of the setup project (https://localhost:3003 by default)
2. Log in to one of the test accounts set up for this project:
    - Hotel: https://solidhotel.inrupt.net/
    - Guest: https://solidguest.inrupt.net/

**TODO** should we share passwords here?

3. Set up the appropriate Pod as you wish:
    - Create an empty setup where only containers are created
    - Load the test data prepared for this project