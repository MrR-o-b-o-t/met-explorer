# Met Explorer

A web app for searching the Metropolitan Museum of Art's collection.

![Met Explorer Screenshot](public/images/Screenshot%202025-03-28%20122503.png)

## Features

- Browse the Met Museum's items
- Filter items by department
- Search for items by title or object id
- View detailed information about individual items

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository or download the source code:

```bash
git clone https://github.com/yourusername/met-explorer.git
cd met-explorer
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using Yarn
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_BASE_URL=https://collectionapi.metmuseum.org/public/collection/v1
```

### Running the Application

#### Development Mode

To run the application in development mode:

```bash
# Using npm
npm run dev

# Using Yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

#### Production Build

To create a production build:

```bash
# Using npm
npm run build
npm start

# Using Yarn
yarn build
yarn start
```

## Usage Guide

- **Home Page**: Displays a selection of items from the Met's collection
- **Browse**: Filter items by department using the dropdown menu
- **Search**: Search for items by title or object ID
- **Quick Search**: Use the search bar in the header for quick title searches
- **Item Details**: Click on any item to view detailed information

## API Information

This application uses the Metropolitan Museum of Art Collection API. The API is free to use and does not require authentication. However, there are rate limits in place.

For more information about the API, visit [Met Museum GitHub page](https://metmuseum.github.io/).
# met-explorer
# met-explorer
