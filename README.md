# Mini Event Management System API

A robust, containerized RESTful API for browsing events, booking tickets, and verifying event attendance. Built with Node.js, Express, and MySQL.

## Features
* **Concurrency Handling:** Implements database transactions and row-level locking (`SELECT ... FOR UPDATE`) to prevent race conditions during ticket booking.
* **Dockerized:** Features a one-click deployment using Docker Compose, which automatically provisions the Node server and seeds the MySQL database.
* **OpenAPI Documentation:** Fully documented API endpoints using Swagger.

## Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed on your machine.
* (Alternatively, Node.js v20+ and a local MySQL server if running natively).

## Quick Start (One-Click Deployment)

The easiest way to run this application is via Docker. 

1. Clone the repository:
   ```bash
   git clone https://github.com/sanyog2005/Lattice.git
   cd test
