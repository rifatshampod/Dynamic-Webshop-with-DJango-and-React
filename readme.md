# WebShop

## Author

- **Name**: Rashedul Alam
- **Email**: rashedul.alam@abo.fi

## Implemented Features

This project has all the implementation of mandatory and optional requirements.

### Core Features:

- User authentication (login, registration)
- Product listing and filtering
- Shopping cart functionality
- Payment processing
- Inventory

### Optional Requirements Implemented:

- **RQ-6**: Search
- **RQ-11**: Remove from the cart
- **RQ-12**: Pay
- **RQ-13**: Routing
- **RQ-14**: Edit Account
- **RQ-15**: Display inventory
- **RQ-16**: Edit item
- **Non Functional**: The web pages should look nice and easy to use on regular desktop screens

## How to Run the Project

### Prerequisites

Make sure you have the following installed on your system(these version has been used while local development however older version may work):

- **Python 3.12.0 or later**
- **Node v20.10.0 or later**

### Step-by-Step Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/AA-IT-WebTechCourse/webshopproject2023-RashedulAlam
cd webshopproject2023-RashedulAlam
```

#### 2. Set up a Virtual Environment

```bash
python -m venv env
source env/Scripts/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Apply Migrations

```bash
python manage.py migrate
```

#### 5. Run the Development Backend Server

```bash
python manage.py runserver
```

Or

```bash
 python manage.py runserver 127.0.0.1:8000
```

Or

```bash
 python manage.py runserver 127.0.0.1:8000 --noreload
```

**note**: Make sure that backend server runs 8000 port and port is available locally. Incase the server is run on different port then .env file on frontend directory should be updated accordingly so that frontend can connect proper backend.

#### 6. Run the Development frontend server or locally in production mode

Production Mode (Faster Browsing)

```bash
cd frontend
npm install
# npm run build
# The command should re-generate the build files from your machine
npm run start
```

Dev Mode (Slow Browsing)

```bash
cd frontend
npm install
npm run dev
```

**note:** sometimes during running application on development mode requires browser refresh only for the first time incase any error due to bug on nextjs or webpack however on production running there were no error. It was observed sporadically.

#### 7. Validate the successful running servers

- http://localhost:3000 on browser will show the UI of webshop
- http://localhost:8000/swagger will show the Open API documentation for backend

If both backend and frontend server runs properly then start browsing the application. There is optional to populate the database. Make sure to popuate to start the testing.

## Samples of Webshop

Here is a series of images to demonstrate:

![Image 1 Description](./demos/landing-page.png)
![Image 2 Description](./demos/swagger.png)
![Image 3 Description](./demos/account.png)
![Image 4 Description](./demos/database-seed.png)
![Image 5 Description](./demos/inventory-1.png)
![Image 6 Description](./demos/inventory-2.png)
![Image 7 Description](./demos/inventory-3.png)
![Image 8 Description](./demos/purchase-summary.png)
![Image 9 Description](./demos/validation-error.png)

## Conclusion

**Incase of any issue while running and testing the application please reach out to me using the given email**
