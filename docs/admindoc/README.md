<div align="center"> <h1>Admin documentation</h1> </div>

<div align="center"> <h2><ins>Launching the applications</h2></ins> </div>

We provide two options to start the applications: Docker and manual.

Whichever option you choose, note that:
1. because of the required `node_modules` folder, the container size can be quite substantial, so make sure you have enough space
2. you can safely disregard the warnings thrown from `npm install`

### <ins>Docker</ins>

We provide a `Dockerfile` to automatize the installation. Note, however, that by using this option you don't have the option to modify the ENV config and therefore override defaults. 

The script is standalone as it fetches the source code from the GitHub repository, so feel free to download the single file and run it. Note that the image build can take up to ~10-15 minutes because of the dependency installations.

```console
> docker build -t solidhotelimg .
> docker run -it -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 --name=solidhotel solidhotelimg
```

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
4. Make sure you use the latest LTS node version (at this moment this is version 16.16.0) as the newest (18.6.0) has a bug which blocks the builds (you can also use [nvm](https://github.com/nvm-sh/nvm) to switch versions with `nvm use --lts`)
5. (Change environment variables in the `.env` file in the core directory if deviating from default - the changes are synchronized to all subprojects via symbolic linking)
6. Build the applications (executed from the core folder)
```console
> cd common && npm run build
> cd gpa && npm run build
> cd pms && npm run build
> cd spe && npm run build
```
7. Launch the applications (executed from the core folder) 
```console
> cd common & npm start
> cd gpa & npm start
> cd pms & npm start
> cd spe & npm start
```
7. By default:
    - GPA lives on port **3000** (requires setup project for mock API)
    - SPE lives on port **3001** (independent) 
    - PMS lives on port **3002** (requires setup project for mock API)
    - setup project and mock API lives on port **3003** (independent)

<div align="center"> <h2><ins>Solid Pod setup</h2></ins> </div>

1. Navigate to the index page of the setup project (https://localhost:3003 by default)
2. Log in to one of the test accounts set up for this project: (to avoid storing credentials on GitHub, please message me for the login information)
    - Hotel: https://testsolidhotel.inrupt.net/
    - Guest: https://testhotelguest.inrupt.net/
    - *In order to be able to manage and test two sessions in parallel, the usage of a multi account container extension is heavily recommended (e.g. [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)) - while this is useful for demonstrating application functionalities, in real life it wouldn't be necessary as an end user would only need access to their own account*

3. Set up the appropriate Pod as you wish:
    - Create an empty setup where only containers are created
    - Load the test data prepared for this project